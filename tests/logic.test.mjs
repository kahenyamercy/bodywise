// BodyWise logic tests. Run: node tests/logic.test.mjs
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mem = {};
const ctx = {
  console, URL, Date, Math, JSON,
  localStorage: { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: (k) => { delete mem[k]; } },
  btoa: (s) => Buffer.from(s, 'binary').toString('base64'), atob: (s) => Buffer.from(s, 'base64').toString('binary'),
  unescape, escape, encodeURIComponent, decodeURIComponent,
  document: { addEventListener: () => {} }
};
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ['js/data/references.js', 'js/data/systems.js', 'js/data/curriculum.js', 'js/data/lessons-1.js', 'js/data/lessons-2.js', 'js/data/lessons-3.js', 'js/data/extras.js', 'js/data/connections.js', 'js/diagrams.js', 'js/store.js', 'js/quiz.js', 'js/tutor.js', 'js/interactive.js']) {
  vm.runInContext(readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
}
const BW = ctx.BW;
BW.indexCurriculum();
BW.store.load();

let passed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ✓ ' + name); } catch (e) { console.error('  ✗ ' + name + '\n    ' + e.message); process.exitCode = 1; } }

console.log('Content integrity');
const full = BW.allLessons.filter((l) => l.status === 'full');
test('13 modules, 17 full lessons', () => { assert.equal(BW.modules.length, 13); assert.equal(full.length, 17); });
test('every full lesson has all 18 template parts', () => {
  const need = ['title', 'why', 'objectives', 'intro', 'detail', 'steps', 'diagram', 'analogy', 'altAnalogy', 'joke', 'connections', 'scenario', 'misconceptions', 'check', 'summary', 'terms', 'flashcards', 'refs', 'next'];
  for (const l of full) for (const k of need) assert.ok(l[k] && (!Array.isArray(l[k]) || l[k].length), l.id + ' missing ' + k);
});
test('every lesson connects to at least two systems or concepts', () => { for (const l of full) assert.ok(l.connections.length >= 2, l.id); });
test('every reference id resolves and uses https', () => { for (const l of full) for (const r of l.refs) { assert.ok(BW.refById[r], l.id + ' → ' + r); assert.match(BW.refById[r].url, /^https:\/\//); } });
test('every lesson/system/path link points to a real lesson', () => {
  for (const l of full) { assert.ok(BW.lessonIndex[l.next], l.id + ' next'); for (const c of l.connections) { assert.ok(BW.lessonIndex[c.lesson], l.id + ' conn ' + c.lesson); assert.ok(BW.sysById[c.sys]); } }
  for (const s of BW.systems) for (const id of s.lessons) assert.ok(BW.lessonIndex[id], s.id + ' ' + id);
  for (const r of BW.relations) { assert.ok(BW.lessonIndex[r.lesson], r.a + r.b); assert.ok(BW.sysById[r.a] && BW.sysById[r.b]); }
  for (const p of BW.paths) for (const s of p.steps) assert.ok(BW.lessonIndex[s.lesson], p.id + ' ' + s.lesson);
});
test('every diagram renders and label numbers match label questions', () => {
  for (const k of BW.diagramKeys) { const svg = BW.diagram(k); assert.match(svg, /^<svg/); assert.ok(svg.endsWith('</svg>')); }
  for (const l of full) for (const q of l.check) if (q.type === 'label') {
    const svg = BW.diagram(q.diagram, { hide: true });
    for (const n of Object.keys(q.answers)) { assert.ok(svg.includes('>' + n + '</text>'), l.id + ' label ' + n); assert.ok(q.options.includes(q.answers[n]), l.id + ' option ' + n); }
    const shown = BW.diagram(q.diagram);
    for (const ans of Object.values(q.answers)) assert.ok(shown.includes(ans.replace(/&/g, '&amp;')), l.id + ' diagram shows ' + ans);
  }
});
test('question ids are unique and answers are valid', () => {
  const ids = new Set();
  for (const q of BW.quiz.allQuestions()) {
    assert.ok(!ids.has(q.id), 'duplicate ' + q.id); ids.add(q.id);
    assert.ok(q.explain && q.explain.length > 20, q.id + ' explanation');
    if (q.type === 'mcq' || q.type === 'scenario') assert.ok(q.answer >= 0 && q.answer < q.options.length, q.id);
    if (q.type === 'tf') assert.equal(typeof q.answer, 'boolean');
    if (q.type === 'short') assert.ok(q.keywords.length && q.model);
  }
});

test('mysteries, jokes, memory tricks and paths are complete', () => {
  for (const m of BW.mysteries) { assert.ok(BW.lessonIndex[m.lesson] && BW.sysById[m.sys], m.q); assert.ok(m.a.length > 60); }
  for (const j of BW.jokes) { assert.ok(BW.lessonIndex[j.lesson], j.joke); assert.ok(j.science.length > 40, 'joke leads to science'); }
  for (const l of full) assert.ok(BW.memoryTricks[l.id], 'memory trick ' + l.id);
  for (const p of BW.paths) { assert.ok(p.caveats.length >= 2, p.id); assert.ok(p.check); }
  assert.equal(BW.paths.find((p) => p.id === 'meal-to-energy').steps.map((s) => s.sys).join(), 'di,di,cv,en,ms,ms');
  assert.equal(BW.cardiacStages.length, 5);
  assert.equal(BW.cardiacStages.map((s) => s.sound).join(), ',,lub,,dub');
});
console.log('Quiz grading');
const G = BW.quiz.grade;
test('mcq', () => { assert.equal(G({ type: 'mcq', answer: 2 }, 2).correct, true); assert.equal(G({ type: 'mcq', answer: 2 }, '1').correct, false); });
test('true/false accepts booleans and strings', () => { assert.equal(G({ type: 'tf', answer: false }, false).correct, true); assert.equal(G({ type: 'tf', answer: true }, 'true').correct, true); assert.equal(G({ type: 'tf', answer: false }, null).correct, false); });
test('short answer needs every key idea', () => {
  const q = BW.lessonIndex['m8-l2'].check.find((x) => x.type === 'short');
  assert.equal(G(q, 'Excretion = filtration − reabsorption + secretion').correct, true);
  assert.equal(G(q, 'filtration minus reabsorption').correct, false);
  assert.equal(G(q, 'secretion').correct, false);
});
test('label needs every label right', () => {
  const q = BW.lessonIndex['m3-l4'].check[0];
  assert.equal(G(q, { ...q.answers }).correct, true);
  assert.equal(G(q, { ...q.answers, 1: 'Left atrium' }).correct, false);
});

console.log('Generated lesson questions');
test('predict, myth and connection questions are valid for every lesson', () => {
  for (const l of full) {
    const p = BW.ui.predictQuestion(l), m = BW.ui.mythQuestion(l), r = BW.ui.relationQuestion(l);
    assert.equal(p.options[p.answer], l.steps[p.shown.length], l.id);
    assert.equal(new Set(p.options).size, p.options.length, l.id + ' distinct options');
    assert.equal(m.answer, false);
    assert.equal(new Set(r.options).size, 4, l.id);
    assert.equal(BW.quiz.grade(p, 0).correct, true);
  }
});
test('terms become buttons once per lesson, without breaking text', () => {
  const l = BW.lessonIndex['m1-l3'], used = {};
  const a = BW.ui.linkTerms(l.intro, l.terms, used), b = BW.ui.linkTerms(l.intro, l.terms, used);
  assert.match(a, /class="term-btn"[^>]*>internal environment</i);
  assert.ok(!/term-btn/.test(b), 'second pass links nothing new');
  assert.ok(!a.includes('\u0001'));
});

console.log('Store');
const S = BW.store;
test('lesson completion and flashcards', () => {
  assert.equal(S.completion().done, 0);
  assert.equal(S.markComplete('m1-l3'), true);
  assert.equal(S.markComplete('m1-l3'), false);
  assert.equal(S.completion().done, 1);
  assert.equal(Object.keys(S.state.cards).length, BW.lessonIndex['m1-l3'].flashcards.length);
});
test('progress persists through storage', () => { const copy = JSON.parse(mem['bodywise.v1']); assert.ok(copy.lessons['m1-l3'].completed); });
test('revision flags topics under 70%', () => {
  S.recordAttempt('a', 'm8-l2', 'm8', false); S.recordAttempt('b', 'm8-l2', 'm8', true); S.recordAttempt('c', 'm8-l2', 'm8', false);
  S.recordAttempt('d', 'm1-l4', 'm1', true); S.recordAttempt('e', 'm1-l4', 'm1', true);
  const r = S.needsRevision(); assert.equal(r.length, 1); assert.equal(r[0].id, 'm8-l2');
});
test('Leitner schedule', () => {
  const id = 'm1-l3#0'; const now = Date.now();
  S.reviewCard(id, true); assert.equal(S.state.cards[id].box, 2); assert.ok(S.state.cards[id].due > now + 2.9 * 86400000);
  S.reviewCard(id, false); assert.equal(S.state.cards[id].box, 1);
});
test('streak counts consecutive days, not invented', () => {
  const real = S.now; const d = 86400000, base = Date.UTC(2026, 9, 28, 9);
  S.state.activity = [S._today(base - 2 * d), S._today(base - d), S._today(base)];
  S.now = () => base; assert.equal(S.streak(), 3);
  S.now = () => base + d; assert.equal(S.streak(), 3, 'yesterday still counts');
  S.now = () => base + 2 * d; assert.equal(S.streak(), 0);
  S.now = real;
});
test('backup round trip and bad code', () => {
  const code = S.exportCode(); S.reset(); assert.equal(S.completion().done, 0);
  S.importCode(code); assert.equal(S.completion().done, 1);
  assert.throws(() => S.importCode('hello'), /BW1/);
  assert.throws(() => S.importCode('BW1.@@@'));
});

console.log('Tutor (demo engine)');
const T = (q, extra = {}) => BW.tutor.respond(q, { completed: ['m1-l3'], level: 'simple', turn: 0, ...extra });
const text = (r) => r.parts.map((p) => p.text || (p.items || []).map((i) => i.label || i.text || i).join(' ')).join(' ');
test('every suggested prompt gets a useful answer', () => {
  for (const s of BW.tutor.suggestions) { const r = T(s, { lastTopic: 'm1-l3' }); assert.ok(!r.unknown, s); assert.ok(r.parts.length, s); }
});
test('homeostasis question finds the homeostasis lesson (not exam mode)', () => { const r = T('Explain homeostasis using everyday examples.'); assert.equal(r.topic, 'lesson:m1-l3'); assert.notEqual(r.mode, 'exam'); });
test('heart and kidneys use the relationship map', () => { assert.match(text(T('Explain the relationship between the heart and kidneys.')), /fifth of the heart/); });
test('oxygen after breathing follows the learning path', () => { assert.match(text(T('What happens to oxygen after I breathe it in?')), /Haemoglobin|haemoglobin/); });
test('different analogy re-explains with analogies and their limits', () => { const r = T('I don’t understand. Try a different analogy.', { lastTopic: 'lesson:m8-l2' }); assert.equal(r.mode, 'analogy'); assert.ok(text(r).includes(BW.lessonIndex['m8-l2'].altAnalogy)); });
test('personal medical questions get a safety reply', () => { const r = T('What dose of paracetamol should I take for my fever?'); assert.equal(r.source, 'system'); assert.match(text(r), /not a doctor/); });
test('unknown topics are admitted, not invented', () => { const r = T('Explain quantum chromodynamics'); assert.equal(r.unknown, true); assert.match(text(r), /do not have a prepared explanation/); });
test('mode change keeps the topic', () => { const r = T('Explain it in exam mode', { lastTopic: 'lesson:m9-l2' }); assert.equal(r.topic, 'lesson:m9-l2'); assert.equal(r.mode, 'exam'); });
const kinds = (r) => r.parts.map((p) => p.t);
test('each teaching mode produces a different, appropriate structure', () => {
  const l = BW.lessonIndex['m8-l6'], ctx = { completed: [], turn: 0 };
  const simple = BW.tutor.explainTopic('lesson:m8-l6', 'simple', ctx);
  assert.ok(kinds(simple).includes('analogy') && simple.parts.find((p) => p.t === 'analogy').limit, 'simple has analogy with its limit');
  const exam = BW.tutor.explainTopic('lesson:m8-l6', 'exam', ctx);
  assert.ok(kinds(exam).includes('terms')); assert.equal(exam.pending.q.type, 'short');
  const vis = BW.tutor.explainTopic('lesson:m8-l6', 'visual', ctx);
  assert.ok(kinds(vis).includes('diagram') && kinds(vis).includes('flow'));
  const walk = BW.tutor.explainTopic('lesson:m8-l6', 'interactive', ctx);
  assert.equal(walk.pending.kind, 'walk');
  const an = BW.tutor.explainTopic('lesson:m8-l6', 'analogy', ctx);
  assert.equal(an.parts.filter((p) => p.t === 'analogy').length, 2);
  const det = BW.tutor.explainTopic('lesson:m8-l6', 'detailed', ctx);
  assert.ok(text(det).includes(l.why));
  for (const r of [simple, det, exam, vis, an]) assert.ok(kinds(r).includes('check'), 'every mode checks understanding');
});
test('auto mode starts simply for unstudied lessons and says why', () => {
  const r = BW.tutor.explainTopic('lesson:m4-l2', 'auto', { completed: [] });
  assert.equal(r.mode, 'simple'); assert.match(text(r), /not completed this lesson/);
  const r2 = BW.tutor.explainTopic('lesson:m4-l2', 'auto', { completed: ['m4-l2'] });
  assert.equal(r2.mode, 'detailed');
});
test('heart rate during exercise is explained as a causal chain with recovery', () => {
  const r = T('Why does heart rate increase during exercise?');
  assert.equal(r.topic, 'scenario:running');
  const chain = r.parts.find((p) => p.t === 'chain'); assert.equal(chain.items.length, 7);
  assert.match(text(r), /central command|vagal/i); assert.ok(r.parts.some((p) => p.t === 'h' && /afterwards/i.test(p.text)), 'covers recovery');
  assert.ok(r.parts.some((p) => p.t === 'loops'));
});
test('wrong answer: misconception, missing step, new analogy, simpler question, then the original', () => {
  const ctx = { completed: [] };
  const first = BW.tutor.explainTopic('lesson:m8-l6', 'detailed', ctx), q = first.pending.q;
  const wrong = q.type === 'tf' ? (q.answer ? 1 : 0) : (q.answer + 1) % q.options.length;
  const r1 = BW.tutor.answer(first.pending, wrong, ctx);
  assert.equal(r1.record.correct, false); assert.match(text(r1), /Not quite|Almost/);
  assert.ok(r1.parts.some((p) => p.t === 'h' && p.text === 'The missing step'));
  assert.ok(kinds(r1).includes('analogy')); assert.equal(r1.pending.stage, 'simpler');
  const sq = r1.pending.q, right = sq.type === 'tf' ? (sq.answer ? 0 : 1) : sq.answer;
  const r2 = BW.tutor.answer(r1.pending, right, ctx);
  assert.equal(r2.pending.stage, 'revisit'); assert.equal(r2.pending.q.id, q.id, 'returns to the original question');
  const ok = q.type === 'tf' ? (q.answer ? 0 : 1) : q.answer;
  const r3 = BW.tutor.answer(r2.pending, ok, ctx);
  assert.equal(r3.pending, null); assert.equal(r3.record.correct, true);
});
test('step-by-step mode advances on correct predictions and recovers from wrong ones', () => {
  let r = BW.tutor.explainTopic('lesson:m1-l3', 'interactive', {});
  const q = r.pending.q;
  const bad = BW.tutor.answer(r.pending, (q.answer + 1) % q.options.length, {});
  assert.equal(bad.pending.stage, 'simpler'); assert.match(text(bad), /missing step/);
  const back = BW.tutor.answer(bad.pending, 0, {}); assert.equal(back.pending.stage, 'revisit');
  const on = BW.tutor.answer(back.pending, back.pending.q.answer, {}); assert.equal(on.pending.step, 2);
});
test('typed exam answers are graded for key ideas', () => {
  const exam = BW.tutor.explainTopic('lesson:m8-l2', 'exam', {});
  const r = BW.tutor.respond('excretion is filtration minus reabsorption plus secretion', { pending: exam.pending });
  assert.equal(r.record.correct, true);
});
test('context from saved progress is used and stated honestly', () => {
  const r = BW.tutor.explainTopic('lesson:m1-l3', 'simple', { mistakes: { 'm1-l3': ['m1l3-q1'] }, notes: { 'm1-l3': 'set point = target' } });
  assert.match(text(r), /saved quiz answers on this device/); assert.match(text(r), /set point = target/);
});
test('connection map data: every relationship explains both directions and its mechanism', () => {
  for (const r of BW.relations) { assert.ok(r.aGives && r.bGives && r.mechanism && r.mechanism.length > 80, r.a + r.b); assert.ok(BW.lessonIndex[r.lesson]); }
  for (const sc of BW.scenarios) {
    assert.ok(sc.stages.length >= 5, sc.id);
    for (const st of sc.stages) { assert.ok(BW.lessonIndex[st.lesson], sc.id + ' ' + st.title); st.systems.forEach((x) => assert.ok(BW.sysById[x])); }
    for (const lp of sc.loops) assert.ok(lp.a < sc.stages.length && lp.b < sc.stages.length && lp.a !== lp.b);
    assert.ok(sc.check.options[sc.check.answer]);
  }
  for (const l of full) assert.ok(BW.analogyLimits[l.id], 'analogy limit ' + l.id);
  const q = BW.tutor.relationQuestion('re', 'cv'); assert.equal(new Set(q.options).size, q.options.length); assert.equal(q.options[q.answer], BW.relationView('re', BW.relationBetween('re', 'cv')).gives);
});
test('backend address validation', () => {
  assert.equal(BW.tutor.validEndpoint('https://example.org/ask'), true);
  assert.equal(BW.tutor.validEndpoint('http://localhost:8787/ask'), true);
  assert.equal(BW.tutor.validEndpoint('http://example.org/ask'), false);
  assert.equal(BW.tutor.validEndpoint('javascript:alert(1)'), false);
});

console.log(`\n${passed} tests passed${process.exitCode ? ', some failed' : ''}.`);
