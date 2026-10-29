// BodyWise optional tutor backend.
// Zero dependencies (Node 18+). Keeps API keys on the server, never in the browser.
//
// Free option (default): a local open-source model through Ollama (https://ollama.com)
//   ollama pull llama3.2      # or any chat model you prefer
//   node server/tutor-proxy.mjs
// Paid option: set PROVIDER=anthropic and ANTHROPIC_API_KEY=... (billed per use by Anthropic).
//
// Then in BodyWise → Preferences → Tutor backend, enter http://localhost:8787/ask
//
// Environment variables:
//   PORT (8787) · ALLOW_ORIGIN (http://localhost:8765, comma-separated) · PROVIDER (ollama | anthropic)
//   OLLAMA_URL (http://localhost:11434) · OLLAMA_MODEL (llama3.2)
//   ANTHROPIC_API_KEY · ANTHROPIC_MODEL (claude-haiku-4-5)
import http from 'node:http';

const PORT = Number(process.env.PORT || 8787);
const ORIGINS = (process.env.ALLOW_ORIGIN || 'http://localhost:8765').split(',').map((s) => s.trim());
const PROVIDER = process.env.PROVIDER || 'ollama';
const MAX_BODY = 20_000;

const SYSTEM = `You are BodyWise, a warm, patient and lightly funny human physiology educator, not a generic chatbot.
For each question: identify the main concept; give a short, plain-language answer first; explain the mechanism
step by step; introduce the key terms; give one everyday analogy and say where it stops being accurate;
connect the concept to at least one other body system by explaining how one event leads to another
(include recovery or feedback where relevant); end with one short question that checks understanding.
If the learner answers a check wrongly: do not shame them, name the specific misconception, explain the missing step,
try a different analogy, ask a simpler follow-up, then return to the original question.
Respect the requested mode: simple (new to the subject), detailed (anatomy, mechanism, sequence, regulation),
exam (formal terminology, then a question), visual (describe a flowchart as numbered arrows), interactive
(one step at a time, ask before continuing), analogy (comparisons and their limits). Keep it short unless asked for depth.
Jokes must never introduce a false explanation; give the real mechanism after any joke.
Distinguish established facts from simplifications, say when you are unsure, never invent sources or statistics.
You are not a doctor: never diagnose, interpret a person's symptoms, or recommend treatment or doses.
For personal health worries, advise speaking to a health worker; in a Kenyan emergency, call 999 or 112.`;

function send(res, status, obj, origin) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  });
  res.end(JSON.stringify(obj));
}

function validate(body) {
  if (!body || typeof body.question !== 'string') return 'Missing question.';
  const q = body.question.trim();
  if (!q || q.length > 2000) return 'Question must be 1–2000 characters.';
  if (body.history && !Array.isArray(body.history)) return 'History must be a list.';
  return null;
}

function messages(body) {
  const history = (body.history || []).slice(-6)
    .filter((h) => h && (h.role === 'user' || h.role === 'assistant') && typeof h.text === 'string' && h.text.trim())
    .map((h) => ({ role: h.role, content: h.text.slice(0, 1500) }));
  const context = body.lesson && body.lesson.title ? `\n(The learner is currently studying: ${String(body.lesson.title).slice(0, 200)}.)` : '';
  const mode = ['auto', 'simple', 'detailed', 'exam', 'visual', 'interactive', 'analogy'].includes(body.mode) ? body.mode : 'auto';
  const done = Array.isArray(body.completed) && body.completed.length ? `\n(Lessons the learner has completed: ${body.completed.slice(0, 20).map((t) => String(t).slice(0, 80)).join('; ')}.)` : '';
  return [...history, { role: 'user', content: `${body.question.trim()}\n\nTeaching mode: ${mode}.${context}${done}` }];
}

async function askOllama(msgs) {
  const r = await fetch((process.env.OLLAMA_URL || 'http://localhost:11434') + '/api/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: process.env.OLLAMA_MODEL || 'llama3.2', stream: false, messages: [{ role: 'system', content: SYSTEM }, ...msgs] })
  });
  if (!r.ok) throw new Error('Ollama error ' + r.status);
  const j = await r.json();
  return j.message && j.message.content;
}

async function askAnthropic(msgs) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY is not set on the server.');
  // Merge consecutive same-role turns, as the Messages API expects alternating roles starting with user.
  const merged = [];
  for (const m of msgs) { const last = merged[merged.length - 1]; if (last && last.role === m.role) last.content += '\n\n' + m.content; else merged.push({ ...m }); }
  while (merged.length && merged[0].role !== 'user') merged.shift();
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5', max_tokens: 700, system: SYSTEM, messages: merged })
  });
  if (!r.ok) throw new Error('Anthropic API error ' + r.status);
  const j = await r.json();
  return (j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
}

http.createServer((req, res) => {
  const origin = ORIGINS.includes(req.headers.origin) ? req.headers.origin : ORIGINS[0];
  if (req.method === 'OPTIONS') return send(res, 204, {}, origin);
  if (req.method !== 'POST' || req.url !== '/ask') return send(res, 404, { error: 'Not found' }, origin);
  if (req.headers.origin && !ORIGINS.includes(req.headers.origin)) return send(res, 403, { error: 'Origin not allowed' }, origin);
  let raw = '';
  req.on('data', (c) => { raw += c; if (raw.length > MAX_BODY) { req.destroy(); } });
  req.on('end', async () => {
    let body;
    try { body = JSON.parse(raw); } catch { return send(res, 400, { error: 'Invalid JSON' }, origin); }
    const bad = validate(body);
    if (bad) return send(res, 400, { error: bad }, origin);
    try {
      const answer = PROVIDER === 'anthropic' ? await askAnthropic(messages(body)) : await askOllama(messages(body));
      if (!answer) throw new Error('Empty answer from model');
      send(res, 200, { answer: answer.trim() }, origin);
    } catch (e) {
      // Log only the error type, never the learner's question.
      console.error('[tutor-proxy] request failed:', e.message);
      send(res, 502, { error: 'The model could not answer right now.' }, origin);
    }
  });
}).listen(PORT, () => console.log(`BodyWise tutor backend on http://localhost:${PORT}/ask (provider: ${PROVIDER}; allowed origins: ${ORIGINS.join(', ')})`));
