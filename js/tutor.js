/* BodyWise — tutor engine.
   The built-in tutor is a DEMO teaching engine. It does not generate new text:
   it identifies the concept in a question, picks a teaching mode, and assembles
   an explanation from BodyWise's written lessons, connections and scenarios.
   It then checks understanding and, after a wrong answer, names the
   misconception, explains the missing step, offers a new analogy, asks a simpler
   question and returns to the original one.
   An optional backend (your own server) can provide live AI answers instead. */
(function (BW) {
  'use strict';

  var MODES = [
    { id: 'auto', label: 'Auto', blurb: 'BodyWise picks a level from your progress.' },
    { id: 'simple', label: 'Simple', blurb: 'As if you are completely new to the subject.' },
    { id: 'detailed', label: 'Detailed', blurb: 'Anatomy, mechanism, sequence and regulation.' },
    { id: 'exam', label: 'Exam', blurb: 'Formal terminology, then a question to answer in your own words.' },
    { id: 'visual', label: 'Visual', blurb: 'Diagrams, flowcharts and process maps.' },
    { id: 'interactive', label: 'Step by step', blurb: 'One step at a time, with a question at each step.' },
    { id: 'analogy', label: 'Analogy', blurb: 'Everyday comparisons, and where each one stops being accurate.' }
  ];
  var MODE_NAME = {}; MODES.forEach(function (m) { MODE_NAME[m.id] = m.label; });

  var ALIASES = {
    cv: ['heart', 'cardiac', 'blood pressure', 'circulation', 'cardiovascular', 'blood vessel', 'artery', 'arteries', 'vein', 'blood'],
    rs: ['lung', 'breathing', 'breathe', 'respiratory', 'airway', 'alveol'],
    ns: ['brain', 'nerve', 'nervous system', 'neuron', 'autonomic', 'spinal cord'],
    en: ['hormone', 'endocrine', 'gland', 'thyroid', 'pituitary'],
    di: ['gut', 'stomach', 'digest', 'intestin', 'food'],
    re: ['kidney', 'renal', 'urine', 'nephron'],
    ms: ['muscle', 'bone', 'skeleton', 'joint', 'musculoskeletal'],
    im: ['immune', 'immunity', 'infection', 'antibod', 'white blood', 'lymph'],
    rp: ['pregnan', 'reproduct', 'uterus', 'ovar', 'menstrua', 'placenta']
  };
  var PATH_HINTS = [
    { id: 'breath-to-muscle', all: [['oxygen'], ['breathe', 'breath', 'inhale', 'lungs']] },
    { id: 'meal-to-energy', all: [['meal', 'eat', 'food', 'ugali', 'lunch'], ['energy', 'glucose', 'insulin', 'atp', 'cell']] },
    { id: 'sweat-to-thirst', all: [['sweat'], ['thirst', 'kidney', 'water', 'drink']] },
    { id: 'bleed-to-rbc', all: [['blood loss', 'lose blood', 'bleed', 'losing blood']] }
  ];

  /* ---------- small helpers ---------- */
  function norm(t) { return String(t || '').toLowerCase().replace(/[’']/g, '').replace(/\s+/g, ' ').trim(); }
  function has(t, words) { return words.some(function (w) { return t.indexOf(w) !== -1; }); }
  function sentences(t, n) { var s = String(t).match(/[^.!?]+[.!?]+(\s|$)/g) || [t]; return s.slice(0, n).join('').trim(); }
  function L(id) { return BW.lessonIndex[id]; }
  function sysName(id) { return BW.sysById[id] ? BW.sysById[id].short : id; }
  function link(id) { var l = L(id); return l ? { href: '#lesson-' + id, label: (l.status === 'full' ? 'Lesson ' : 'Outline ') + l.moduleN + '.' + l.index + ': ' + l.title } : null; }
  function words(t) { return norm(t).split(/[^a-z0-9]+/).filter(function (w) { return w.length > 4; }); }
  function rotate(arr, k) { k = k % arr.length; return arr.slice(k).concat(arr.slice(0, k)); }
  /* Put the correct option at a varied position, return {options, answer}. */
  function place(correct, others, seed) {
    var opts = [correct].concat(others), pos = seed % opts.length;
    var out = opts.slice(1); out.splice(pos, 0, correct);
    return { options: out, answer: pos };
  }
  function seedOf(s) { var h = 0; String(s).split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) % 9973; }); return h; }
  function parseRef(ref) {
    if (!ref) return null;
    if (ref.indexOf(':') === -1) return L(ref) ? { kind: 'lesson', id: ref } : null;
    var p = ref.split(':'); return { kind: p[0], id: p.slice(1).join(':') };
  }
  function refStr(r) { return r ? r.kind + ':' + r.id : null; }

  function systemsIn(t) {
    var found = [];
    Object.keys(ALIASES).forEach(function (id) {
      var best = -1;
      ALIASES[id].forEach(function (w) { var k = t.indexOf(w); if (k !== -1 && (best === -1 || k < best)) best = k; });
      if (id === 'cv' && t.indexOf('white blood') !== -1 && t.replace('white blood', '').indexOf('blood') === -1 && !has(t, ['heart', 'circulation', 'artery', 'vein', 'pressure', 'cardi'])) best = -1;
      if (best !== -1) found.push({ id: id, at: best });
    });
    return found.sort(function (a, b) { return a.at - b.at; }).map(function (f) { return f.id; });
  }
  function scoreLessons(t) {
    var ws = t.split(/[^a-z0-9]+/).filter(function (w) { return w.length > 3; });
    return BW.allLessons.map(function (l) {
      var s = 0;
      if (l.status === 'full') {
        (l.keywords || []).forEach(function (k) { if (t.indexOf(k) !== -1) s += k.indexOf(' ') !== -1 ? 4 : 3; });
        (l.terms || []).forEach(function (tm) { if (t.indexOf(tm.t.toLowerCase().replace(/\s*\(.*?\)/, '')) !== -1) s += 2; });
      }
      norm(l.title).split(/[^a-z0-9]+/).filter(function (w) { return w.length > 4; }).forEach(function (w) { if (ws.indexOf(w) !== -1) s += 2; });
      return { l: l, s: s };
    }).filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s; });
  }
  function scenarioFor(t) {
    var best = null, bestN = 0;
    Object.keys(BW.scenarioHints || {}).forEach(function (id) {
      var n = BW.scenarioHints[id].filter(function (w) { return t.indexOf(w) !== -1; }).length;
      if (n > bestN) { best = id; bestN = n; }
    });
    return best;
  }
  function glossaryLookup(t) {
    var m = t.match(/^(what is|what are|whats|define|definition of|meaning of|what does)\s+(an?\s+|the\s+)?(.+?)( mean)?\??$/);
    if (!m) return null;
    var q = m[3].trim(), hit = null;
    BW.allLessons.forEach(function (l) {
      (l.terms || []).forEach(function (tm) { var k = norm(tm.t.replace(/\s*\(.*?\)/, '')); if (!hit && (k === q || k === q.replace(/s$/, ''))) hit = { term: tm, lesson: l }; });
    });
    return hit;
  }

  /* ---------- context: what BodyWise has saved on this device ---------- */
  function contextNotes(l, ctx, modeWasAuto, mode) {
    var out = [];
    if (modeWasAuto) out.push(ctx.completed && ctx.completed.indexOf(l.id) !== -1 ? 'You have completed this lesson, so I have pitched this as a fuller refresher. Switch mode any time.' : 'You have not completed this lesson yet, so I am starting simply. Switch mode any time.');
    var miss = (ctx.mistakes && ctx.mistakes[l.id]) || [];
    if (miss.length) out.push('Your saved quiz answers on this device include ' + miss.length + ' incorrect answer' + (miss.length > 1 ? 's' : '') + ' on this topic, so the check question below targets that.');
    var note = ctx.notes && ctx.notes[l.id];
    if (note) out.push('Your note on this lesson: “' + String(note).slice(0, 140) + (note.length > 140 ? '…' : '') + '”');
    if (ctx.currentModule && ctx.currentModule !== l.module && mode !== 'interactive') {
      var m = BW.modules.filter(function (x) { return x.id === l.module; })[0];
      out.push('This topic is in Module ' + m.n + ' (' + m.title + '), not the module you are studying now.');
    }
    return out.length ? [{ t: 'note', text: out.join(' ') }] : [];
  }

  /* ---------- check questions ---------- */
  function pickCheck(l, ctx, mode) {
    var pool = (l.check || []).filter(function (q) { return q.type !== 'label'; });
    var miss = (ctx.mistakes && ctx.mistakes[l.id]) || [];
    var missed = pool.filter(function (q) { return miss.indexOf(q.id) !== -1 && q.type !== 'short'; })[0];
    if (missed && mode !== 'exam') return missed;
    var pref = mode === 'exam' ? ['short', 'scenario', 'mcq'] : mode === 'simple' || mode === 'analogy' ? ['tf', 'mcq', 'scenario'] : ['scenario', 'mcq', 'tf'];
    for (var i = 0; i < pref.length; i++) { var q = pool.filter(function (x) { return x.type === pref[i]; })[(ctx.turn || 0) % 2] || pool.filter(function (x) { return x.type === pref[i]; })[0]; if (q) return q; }
    return pool[0];
  }
  function checkPart(q, intro) {
    var opts = q.type === 'tf' ? ['True', 'False'] : q.options;
    return { t: 'check', intro: intro || 'Quick check:', prompt: q.prompt, scenario: q.scenario || null, options: q.type === 'short' ? null : opts, typed: q.type === 'short' };
  }
  function pendingCheck(q, topic, extra) { return Object.assign({ kind: 'check', q: q, topic: topic, stage: 'original', original: q }, extra || {}); }

  function modeChips(current) {
    return { t: 'modes', current: current };
  }

  /* ---------- teaching a lesson in each mode ---------- */
  function mainSys(l) { var m = BW.modules.filter(function (x) { return x.id === l.module; })[0]; return m.systems[0]; }
  function connectionWithMechanism(l) {
    var main = mainSys(l);
    for (var i = 0; i < l.connections.length; i++) {
      var c = l.connections[i], r = c.sys !== main && BW.relationBetween(main, c.sys);
      if (r && r.mechanism) return { c: c, r: r, main: main };
    }
    return null;
  }

  function teachLesson(l, ctx, mode, opts) {
    opts = opts || {};
    var wasAuto = mode === 'auto';
    if (wasAuto) mode = ctx.completed && ctx.completed.indexOf(l.id) !== -1 ? 'detailed' : 'simple';
    if (mode === 'interactive') return startWalk({ type: 'lesson', id: l.id }, ctx);
    var parts = [], speak = [], q = pickCheck(l, ctx, mode), topic = 'lesson:' + l.id;
    var jokes = !ctx.prefs || ctx.prefs.jokes !== false;
    if (opts.opener) parts.push({ t: 'p', text: opts.opener, cls: 'tutor-line' });
    parts = parts.concat(contextNotes(l, ctx, wasAuto, mode));

    if (mode === 'simple') {
      var sa = sentences(l.intro, 2);
      parts.push({ t: 'h', text: 'Short answer' }, { t: 'p', text: sa });
      parts.push({ t: 'h', text: 'How it works' }, { t: 'steps', items: l.steps.slice(0, 3), more: l.steps.length > 3 ? (l.steps.length - 3) + ' more steps in the full explanation' : null });
      parts.push({ t: 'analogy', text: l.analogy, limit: BW.analogyLimits && BW.analogyLimits[l.id] });
      if (l.connections[0]) parts.push({ t: 'h', text: 'How it links to the rest of the body' }, { t: 'rel', items: [l.connections[0]] });
      if (jokes) parts.push({ t: 'p', text: l.joke, cls: 'joke' });
      speak.push(sa, l.steps.slice(0, 3).join('. '));
    } else if (mode === 'detailed') {
      parts.push({ t: 'h', text: 'Short answer' }, { t: 'p', text: l.summary });
      parts.push({ t: 'h', text: 'How it works' }, { t: 'steps', items: l.steps });
      l.detail.slice(1, 3).forEach(function (d) { parts.push({ t: 'p', text: d }); });
      parts.push({ t: 'h', text: 'Why it matters' }, { t: 'p', text: l.why });
      var cm = connectionWithMechanism(l);
      parts.push({ t: 'h', text: 'Connections to other systems' }, { t: 'rel', items: l.connections.slice(0, 3) });
      if (cm) parts.push({ t: 'p', text: 'How one leads to another (' + sysName(cm.main) + ' and ' + sysName(cm.c.sys) + '): ' + cm.r.mechanism });
      parts.push({ t: 'terms', items: l.terms.slice(0, 4) });
      speak.push(l.summary, l.steps.join('. '));
    } else if (mode === 'exam') {
      parts.push({ t: 'note', text: 'Exam mode: formal terminology first, then a question to answer in your own words.' });
      parts.push({ t: 'h', text: 'Key terms to use in your answer' }, { t: 'terms', items: l.terms });
      parts.push({ t: 'h', text: 'Mechanism' }, { t: 'steps', items: l.steps });
      l.detail.forEach(function (d) { parts.push({ t: 'p', text: d }); });
      if (l.advanced) parts.push({ t: 'h', text: 'Beyond the basics' }, { t: 'p', text: l.advanced });
      speak.push(l.detail.join(' '));
    } else if (mode === 'visual') {
      parts.push({ t: 'p', text: sentences(l.summary, 1) });
      parts.push({ t: 'diagram', key: l.diagram });
      parts.push({ t: 'h', text: 'Process map' }, { t: 'flow', items: l.steps, sys: mainSys(l) });
      var ps = BW.paths.filter(function (p) { return p.steps.some(function (s) { return s.lesson === l.id; }); });
      if (ps[0]) parts.push({ t: 'h', text: 'Where this fits in the body' }, { t: 'path', id: ps[0].id, lesson: l.id });
      speak.push(sentences(l.summary, 1), l.steps.join('. '));
      q = predictQ(l.steps, Math.max(1, Math.floor(l.steps.length / 2)), l.id);
    } else if (mode === 'analogy') {
      parts.push({ t: 'analogy', text: l.analogy, limit: BW.analogyLimits && BW.analogyLimits[l.id], label: 'Analogy' });
      parts.push({ t: 'h', text: 'What really happens' }, { t: 'steps', items: l.steps.slice(0, 4) });
      parts.push({ t: 'analogy', text: l.altAnalogy, label: 'A second way to picture it' });
      parts.push({ t: 'p', text: 'Analogies are models: use them to remember the idea, then rely on the mechanism above for the details.' });
      if (jokes) parts.push({ t: 'p', text: l.joke, cls: 'joke' });
      speak.push(l.analogy, l.steps.slice(0, 4).join('. '));
    }
    if (q) parts.push(checkPart(q, mode === 'exam' ? 'Exam question:' : 'Quick check:'));
    var nx = L(l.next);
    parts.push({ t: 'links', items: [link(l.id), nx && nx.status === 'full' && nx.id !== l.id ? { href: '#lesson-' + nx.id, label: 'Next: ' + nx.title } : null].filter(Boolean), diagram: mode === 'visual' ? null : l.diagram });
    parts.push(modeChips(mode));
    return { source: 'demo', topic: topic, mode: mode, parts: parts, speak: speak.join(' '), pending: q ? pendingCheck(Object.assign({ _lesson: l.id, _module: l.module }, q), topic) : null };
  }

  function predictQ(steps, k, lessonId) {
    var later = steps.slice(k + 1, k + 3);
    if (later.length < 2) later = later.concat(steps.slice(0, k).slice(-(2 - later.length)));
    var pl = place(steps[k], later, k + seedOf(lessonId || ''));
    return { id: (lessonId || 'seq') + '-predict-' + k, type: 'mcq', prompt: 'What happens next, after “' + steps[k - 1] + '”?', options: pl.options, answer: pl.answer,
      explain: 'Next comes: “' + steps[k] + '” Each step causes the one after it.', _seqNext: steps[k], _seqPrev: steps[k - 1] };
  }

  /* ---------- step-by-step (interactive) mode ---------- */
  function walkSteps(src) {
    if (src.type === 'lesson') return L(src.id).steps;
    var sc = BW.scenarioById[src.id]; return sc.stages.map(function (s) { return s.title + ': ' + s.text; });
  }
  function walkTitle(src) { return src.type === 'lesson' ? L(src.id).title : BW.scenarioById[src.id].title; }
  function startWalk(src, ctx, opener) {
    var steps = walkSteps(src);
    var parts = [{ t: 'p', text: opener || 'Let’s go one step at a time. I will explain a step, then you predict the next one. No rush.', cls: 'tutor-line' },
      { t: 'progress', at: 1, of: steps.length, title: walkTitle(src) },
      { t: 'p', text: 'Step 1: ' + steps[0] }];
    var q = predictQ(steps, 1, src.id);
    parts.push(checkPart(q, 'Your turn:'));
    return { source: 'demo', topic: src.type + ':' + src.id, mode: 'interactive', parts: parts, speak: steps[0],
      pending: { kind: 'walk', src: src, step: 1, q: q, stage: 'original', original: q } };
  }

  /* ---------- scenarios, relationships, systems ---------- */
  function teachScenario(sc, ctx, mode, opener) {
    if (mode === 'auto') mode = 'detailed';
    if (mode === 'interactive') return startWalk({ type: 'scenario', id: sc.id }, ctx, opener);
    var parts = [];
    if (opener) parts.push({ t: 'p', text: opener, cls: 'tutor-line' });
    parts.push({ t: 'h', text: 'Short answer' }, { t: 'p', text: sc.summary });
    if (mode === 'visual') parts.push({ t: 'scenario', id: sc.id });
    parts.push({ t: 'h', text: 'How one event leads to the next' });
    parts.push({ t: 'chain', items: sc.stages.map(function (s) { return { systems: s.systems, title: s.title, text: mode === 'simple' || mode === 'visual' ? sentences(s.text, 1) : s.text, lesson: s.lesson }; }) });
    if (sc.loops && sc.loops.length) parts.push({ t: 'loops', items: sc.loops.map(function (lp) { return lp.label; }) });
    parts.push({ t: 'note', text: 'Simplified sequence: several of these steps overlap in time, and there are more feedback loops than one list can show.' });
    if (sc.note) parts.push({ t: 'p', text: sc.note });
    var nx = sc.next && BW.scenarioById[sc.next];
    if (nx) parts.push({ t: 'h', text: 'And afterwards' }, { t: 'p', text: nx.summary });
    var q = { id: 'scenario-' + sc.id, type: 'mcq', prompt: sc.check.prompt, options: sc.check.options, answer: sc.check.answer, explain: sc.check.explain };
    parts.push(checkPart(q));
    parts.push({ t: 'links', items: [{ href: '#scenario-' + sc.id, label: 'Follow this scenario on the Connection Map' }].concat(nx ? [{ href: '#scenario-' + nx.id, label: nx.title }] : []).concat([link(sc.stages[0].lesson)]).filter(Boolean) });
    parts.push(modeChips(mode));
    return { source: 'demo', topic: 'scenario:' + sc.id, mode: mode, parts: parts, speak: sc.summary + ' ' + sc.stages.map(function (s) { return s.title + '. ' + sentences(s.text, 1); }).join(' '),
      pending: pendingCheck(q, 'scenario:' + sc.id) };
  }

  function relationQuestion(a, b) {
    var r = BW.relationBetween(a, b), view = BW.relationView(a, r);
    var others = BW.relationsFor(a).map(function (x) { return BW.relationView(a, BW.relationBetween(a, x.other)); }).filter(function (v) { return v.other !== b; }).map(function (v) { return v.gives; });
    var pl = place(view.gives, rotate(others, seedOf(a + b)).slice(0, 3), seedOf(b + a));
    return { id: 'rel-' + r.a + '-' + r.b + '-' + a, type: 'mcq', prompt: 'What does the ' + sysName(a).toLowerCase() + ' system contribute to the ' + sysName(b).toLowerCase() + ' system?', options: pl.options, answer: pl.answer,
      explain: view.gives + ' ' + r.mechanism.split('. ')[0] + '.', _rel: [a, b] };
  }
  function teachRelation(a, b, ctx, mode) {
    var r = BW.relationBetween(a, b);
    var parts = [{ t: 'p', text: BW.voiceLines ? BW.voiceLines.twoSystems : 'Good question.', cls: 'tutor-line' },
      { t: 'h', text: 'Short answer' }, { t: 'p', text: r.text },
      { t: 'h', text: 'What each system gives the other' },
      { t: 'gives', a: a, b: b, ab: BW.relationView(a, r).gives, ba: BW.relationView(b, r).gives, loop: r.loop }];
    if (mode !== 'simple') parts.push({ t: 'h', text: 'How it works' }, { t: 'p', text: r.mechanism });
    else parts.push({ t: 'p', text: sentences(r.mechanism, 2) });
    if (r.loop) parts.push({ t: 'note', text: 'This is a two-way regulatory loop: each system’s response changes the signal the other one receives.' });
    var q = relationQuestion(a, b);
    parts.push(checkPart(q));
    parts.push({ t: 'links', items: [link(r.lesson), { href: '#connections-' + a, label: 'See all ' + sysName(a) + ' connections on the map' }].filter(Boolean) });
    parts.push(modeChips(mode === 'auto' ? 'detailed' : mode));
    return { source: 'demo', topic: 'relation:' + a + '-' + b, mode: mode, parts: parts, speak: r.text + ' ' + r.mechanism, pending: pendingCheck(q, 'relation:' + a + '-' + b) };
  }
  function teachSystem(id, ctx) {
    var S = BW.sysById[id], rels = BW.relationsFor(id).slice(0, 4).map(function (x) { return BW.relationView(id, BW.relationBetween(id, x.other)); });
    var q = Object.assign({}, S.quiz[0]);
    return { source: 'demo', topic: 'system:' + id, parts: [
      { t: 'h', text: 'Short answer' }, { t: 'p', text: S.name + ': ' + S.fn },
      { t: 'h', text: 'Key processes' }, { t: 'list', items: S.processes },
      { t: 'h', text: 'Who it works with' }, { t: 'list', items: rels.map(function (v) { return sysName(v.other) + ': it gives “' + v.gives + '” and receives “' + v.receives + '”'; }) },
      checkPart(q),
      { t: 'links', items: S.lessons.map(link).filter(Boolean).concat([{ href: '#connections-' + id, label: 'Open ' + S.short + ' on the Connection Map' }]) }
    ], speak: S.fn, pending: pendingCheck(q, 'system:' + id) };
  }

  /* Re-explain whatever the current topic is, in a given mode. */
  function explainTopic(ref, mode, ctx, opener) {
    var r = parseRef(ref); if (!r) return null;
    if (r.kind === 'lesson' && L(r.id) && L(r.id).status === 'full') return teachLesson(L(r.id), ctx, mode, { opener: opener });
    if (r.kind === 'scenario' && BW.scenarioById[r.id]) return teachScenario(BW.scenarioById[r.id], ctx, mode, opener);
    if (r.kind === 'relation') { var ab = r.id.split('-'); var res = teachRelation(ab[0], ab[1], ctx, mode); if (opener) res.parts.unshift({ t: 'p', text: opener, cls: 'tutor-line' }); return res; }
    if (r.kind === 'system') return teachSystem(r.id, ctx);
    return null;
  }

  /* ---------- answering a check ---------- */
  function isAnswerLike(text, pending) {
    var t = norm(text);
    if (!pending) return false;
    if (/\?$/.test(t) || /^(what|why|how|when|where|explain|tell me|teach|show|can you|quiz|define)\b/.test(t)) return false;
    if (pending.q && pending.q.type === 'short') return t.split(' ').length >= 2;
    return true;
  }
  function choiceIndex(text, q) {
    var t = norm(text);
    if (q.type === 'tf') { if (/^(true|t|yes|correct)\b/.test(t)) return 0; if (/^(false|f|no|wrong)\b/.test(t)) return 1; return -1; }
    var letter = t.match(/^\(?([a-d])\)?(\s|\.|$)/); if (letter) return 'abcd'.indexOf(letter[1]);
    var num = t.match(/^([1-4])(\s|\.|$)/); if (num) return Number(num[1]) - 1;
    var best = -1, bestN = 0;
    q.options.forEach(function (o, i) { var ow = words(o), n = ow.filter(function (w) { return t.indexOf(w) !== -1; }).length; if (n > bestN) { best = i; bestN = n; } });
    return bestN >= 1 ? best : -1;
  }
  function gradeChoice(q, choice) {
    if (q.type === 'short') return BW.quiz.grade(q, choice);
    if (q.type === 'tf') return BW.quiz.grade(q, choice === 0);
    return BW.quiz.grade(q, choice);
  }
  function chosenText(q, choice) { return q.type === 'tf' ? (choice === 0 ? 'True' : 'False') : q.type === 'short' ? choice : q.options[choice]; }
  function findMyth(l, text) {
    if (!l || !l.misconceptions) return null;
    var tw = words(text), best = null, bestN = 1;
    l.misconceptions.forEach(function (m) { var n = words(m.myth).filter(function (w) { return tw.indexOf(w) !== -1; }).length; if (n > bestN) { best = m; bestN = n; } });
    return best;
  }
  function topicLesson(p) {
    if (p.q && p.q._lesson) return L(p.q._lesson);
    var r = parseRef(p.topic); if (r && r.kind === 'lesson') return L(r.id);
    if (p.src && p.src.type === 'lesson') return L(p.src.id);
    if (r && r.kind === 'scenario') return L(BW.scenarioById[r.id].stages[0].lesson);
    if (r && r.kind === 'relation') { var rel = BW.relationBetween.apply(null, r.id.split('-')); return rel && L(rel.lesson); }
    return null;
  }
  /* A simpler question about the same idea. */
  function simplerQuestion(p, chosen) {
    var l = topicLesson(p), q = p.q;
    if (q._seqNext) return { id: q.id + '-simpler', type: 'tf', prompt: '“' + q._seqNext + '” comes straight after “' + q._seqPrev + '”.', answer: true, explain: 'True. That is the next link in the chain.' };
    if (q._rel) { var v = BW.relationView(q._rel[0], BW.relationBetween(q._rel[0], q._rel[1])); return { id: q.id + '-simpler', type: 'tf', prompt: 'The ' + sysName(q._rel[0]).toLowerCase() + ' system ' + v.gives.charAt(0).toLowerCase() + v.gives.slice(1), answer: true, explain: 'True. ' + v.gives }; }
    var myth = l && (findMyth(l, chosen) || l.misconceptions.filter(function (m) { return m.myth !== q.prompt; })[0]);
    if (myth) return { id: (l.id) + '-simpler-' + l.misconceptions.indexOf(myth), type: 'tf', prompt: myth.myth, answer: false, explain: 'False. ' + myth.fact, _lesson: l.id, _module: l.module };
    return null;
  }

  function answer(p, raw, ctx) {
    ctx = ctx || {};
    var q = p.q, choice = typeof raw === 'number' ? raw : q.type === 'short' ? String(raw) : choiceIndex(raw, q);
    if (choice === -1) return { source: 'demo', parts: [{ t: 'p', text: 'I could not match that to one of the options. Tap an option, or reply with its letter (A, B, C…) or “true”/“false”.' }], pending: p, keepPending: true };
    var g = gradeChoice(q, choice), picked = chosenText(q, choice), l = topicLesson(p);
    var parts = [], record = q._lesson || (l && l.id) ? { qid: q.id, lesson: q._lesson || (l && l.id), module: q._module || (l && l.module), correct: g.correct } : null;
    parts.push({ t: 'answer', text: picked, correct: g.correct });

    // Interactive walk
    if (p.kind === 'walk') {
      var steps = walkSteps(p.src);
      if (p.stage === 'simpler') {
        parts.push({ t: 'p', text: g.correct ? 'Yes. Now let’s go back to the sequence.' : 'Not quite: ' + q.explain + ' Let’s go back to the sequence.' });
        parts.push(checkPart(p.original, 'Back to the original question:'));
        return { source: 'demo', topic: p.src.type + ':' + p.src.id, mode: 'interactive', parts: parts, pending: Object.assign({}, p, { q: p.original, stage: 'revisit' }), record: record };
      }
      if (g.correct || p.stage === 'revisit') {
        if (!g.correct) parts.push({ t: 'p', text: 'Not this time. The next step is: ' + steps[p.step] + ' Keep going; it gets easier as the chain fills in.' });
        else parts.push({ t: 'p', text: p.stage === 'revisit' ? 'Now it fits together.' : ['Exactly.', 'Yes, that follows.', 'Spot on.'][p.step % 3] });
        var next = p.step + 1;
        parts.push({ t: 'progress', at: next, of: steps.length, title: walkTitle(p.src) });
        parts.push({ t: 'p', text: 'Step ' + next + ': ' + steps[p.step] });
        if (next >= steps.length) {
          parts.push({ t: 'p', text: 'That completes the sequence. ' + (BW.voiceLines ? BW.voiceLines.groupChat : '') });
          if (p.src.type === 'lesson') { var fl = L(p.src.id); parts.push({ t: 'h', text: 'Summary' }, { t: 'p', text: fl.summary }); var fq = pickCheck(fl, ctx, 'detailed'); parts.push(checkPart(fq, 'One last check:')); parts.push(modeChips('interactive')); return { source: 'demo', topic: 'lesson:' + fl.id, mode: 'interactive', parts: parts, pending: pendingCheck(Object.assign({ _lesson: fl.id, _module: fl.module }, fq), 'lesson:' + fl.id), record: record }; }
          parts.push(modeChips('interactive'));
          return { source: 'demo', topic: 'scenario:' + p.src.id, mode: 'interactive', parts: parts, pending: null, record: record };
        }
        var nq = predictQ(steps, next, p.src.id);
        parts.push(checkPart(nq, 'Your turn:'));
        return { source: 'demo', topic: p.src.type + ':' + p.src.id, mode: 'interactive', parts: parts, pending: { kind: 'walk', src: p.src, step: next, q: nq, stage: 'original', original: nq }, record: record };
      }
      // wrong on a walk step
      parts.push({ t: 'p', text: 'Not quite, and that is a useful mistake. “' + picked + '” does happen, but later in the chain. The missing step is: ' + steps[p.step] });
      if (l && p.src.type === 'lesson') parts.push({ t: 'analogy', text: l.altAnalogy, label: 'Another way to picture it' });
      var sq = { id: q.id + '-simpler', type: 'tf', prompt: '“' + steps[p.step] + '” comes straight after “' + steps[p.step - 1] + '”.', answer: true, explain: 'True: that is the next link in the chain.' };
      parts.push(checkPart(sq, 'A simpler question first:'));
      return { source: 'demo', topic: p.src.type + ':' + p.src.id, mode: 'interactive', parts: parts, pending: Object.assign({}, p, { q: sq, stage: 'simpler' }), record: record };
    }

    // Ordinary checks
    if (g.correct) {
      if (p.stage === 'simpler') {
        parts.push({ t: 'p', text: 'Yes, exactly. ' + q.explain });
        parts.push({ t: 'p', text: 'Now let’s revisit the original question with that in mind.' });
        parts.push(checkPart(p.original, 'Original question:'));
        return { source: 'demo', topic: p.topic, parts: parts, pending: Object.assign({}, p, { q: p.original, stage: 'revisit' }), record: record };
      }
      parts.push({ t: 'p', text: (p.stage === 'revisit' ? 'There it is. Now the original question makes sense. ' : ['That’s right. ', 'Exactly right. ', 'Yes, nicely reasoned. '][seedOf(q.id) % 3]) + q.explain });
      if (q.type === 'short') parts.push({ t: 'p', text: 'Model answer: ' + q.model });
      var nl = l && L(l.next);
      parts.push({ t: 'chips', items: ['Explain it in exam mode', 'Show me the visual version', 'Quiz me on this'] });
      if (nl) parts.push({ t: 'links', items: [{ href: '#lesson-' + nl.id, label: 'Suggested next: ' + nl.title }] });
      return { source: 'demo', topic: p.topic, parts: parts, pending: null, record: record };
    }
    if (p.stage === 'original') {
      parts.push({ t: 'p', text: q.type === 'short' && g.hits && g.hits.some(Boolean) ? (BW.voiceLines ? BW.voiceLines.almost : 'Almost.') : 'Not quite, but this is a useful mistake.', cls: 'tutor-line' });
      if (q.type === 'short') {
        var missingIdx = (g.hits || []).map(function (h, i) { return h ? -1 : i; }).filter(function (i) { return i !== -1; });
        if (missingIdx.length) parts.push({ t: 'p', text: 'The idea your answer is missing involves: ' + missingIdx.map(function (i) { return '“' + q.keywords[i][0] + '”'; }).join(' and ') + '.' });
        parts.push({ t: 'p', text: 'Model answer: ' + q.model });
      } else {
        var myth = findMyth(l, picked + ' ' + (q.type === 'tf' ? q.prompt : ''));
        if (myth) parts.push({ t: 'p', text: 'This is a common misconception: “' + myth.myth + '” In fact, ' + myth.fact.charAt(0).toLowerCase() + myth.fact.slice(1) });
        else parts.push({ t: 'p', text: 'You chose “' + picked + '”. That is not what happens here.' });
      }
      parts.push({ t: 'h', text: 'The missing step' }, { t: 'p', text: q.explain });
      if (l && l.altAnalogy) parts.push({ t: 'analogy', text: l.altAnalogy, label: 'Another way to picture it', limit: BW.analogyLimits && BW.analogyLimits[l.id] });
      var sq2 = simplerQuestion(p, picked);
      if (sq2) { parts.push(checkPart(sq2, 'Let’s check one smaller piece first:')); return { source: 'demo', topic: p.topic, parts: parts, pending: Object.assign({}, p, { q: sq2, stage: 'simpler' }), record: record }; }
      parts.push(checkPart(p.original, 'Try the original question again:'));
      return { source: 'demo', topic: p.topic, parts: parts, pending: Object.assign({}, p, { stage: 'revisit' }), record: record };
    }
    if (p.stage === 'simpler') {
      parts.push({ t: 'p', text: 'Not quite. ' + q.explain + ' That is the key piece.' });
      parts.push(checkPart(p.original, 'With that in mind, try the original question again:'));
      return { source: 'demo', topic: p.topic, parts: parts, pending: Object.assign({}, p, { q: p.original, stage: 'revisit' }), record: record };
    }
    // wrong on revisit
    var correctText = q.type === 'short' ? q.model : chosenText(q, q.type === 'tf' ? (q.answer ? 0 : 1) : q.answer);
    parts.push({ t: 'p', text: 'This one is tricky, so let me just give you the answer: “' + correctText + '”. ' + q.explain });
    parts.push({ t: 'p', text: 'Try a different mode below; often a diagram or the step-by-step version makes it click. You can come back to this question later from the Practice page.' });
    parts.push(modeChips(null));
    if (l) parts.push({ t: 'links', items: [link(l.id)] });
    return { source: 'demo', topic: p.topic, parts: parts, pending: null, record: record };
  }

  /* ---------- main entry ---------- */
  var MODE_WORDS = [
    ['interactive', ['step by step', 'one step at a time', 'interactive', 'teach me interactively', 'walk me through']],
    ['exam', ['exam mode', 'exam style', 'exam', 'formal terminology', 'formally', 'test my understanding']],
    ['visual', ['visual', 'diagram', 'flowchart', 'flow chart', 'process map', 'draw', 'show me the visual']],
    ['analogy', ['analogy', 'analogies', 'compare it to', 'everyday comparison']],
    ['detailed', ['more detail', 'detailed', 'in depth', 'full detail', 'go deeper', 'advanced']],
    ['simple', ['simpler', 'simple', 'simply', 'beginner', 'new to this', 'eli5', 'easier', 'basics']]
  ];
  function requestedMode(t) {
    for (var i = 0; i < MODE_WORDS.length; i++) if (MODE_WORDS[i][1].some(function (w) { return new RegExp('\\b' + w + '\\b').test(t); })) return MODE_WORDS[i][0];
    return null;
  }

  function respond(raw, ctx) {
    ctx = ctx || {}; ctx.turn = ctx.turn || 0;
    var t = norm(raw);
    if (!t) return { source: 'system', parts: [{ t: 'p', text: 'Type or say a question first.' }] };

    if (ctx.pending && isAnswerLike(raw, ctx.pending) && (ctx.pending.q.type === 'short' || choiceIndex(raw, ctx.pending.q) !== -1)) return answer(ctx.pending, raw, ctx);

    var medical = BW.medicalWords.some(function (w) { return t.indexOf(w) !== -1; }) && /\b(i|my|me|im|mine|we|our)\b/.test(t);
    if (medical) {
      var safe = { source: 'system', parts: [
        { t: 'p', text: 'I am a learning tool, not a doctor, so I cannot advise on symptoms, medicines or what to do about your own health or someone else’s.' },
        { t: 'p', text: 'If you are worried about a symptom, please speak to a health worker or pharmacist. In an emergency in Kenya, call 999 or 112, or go to the nearest health facility.' },
        { t: 'p', text: 'I am happy to explain the normal physiology behind your question so you understand it better when you talk to them.' }
      ] };
      var hit = scoreLessons(t).filter(function (x) { return x.l.status === 'full'; })[0];
      if (hit) safe.parts.push({ t: 'links', items: [link(hit.l.id)] });
      return safe;
    }
    if (/^(hi|hello|hey|habari|jambo|good (morning|afternoon|evening))\b/.test(t) && t.length < 30)
      return { source: 'demo', parts: [{ t: 'p', text: 'Hello! Ask me how any part of the body works. Choose a teaching mode above, or let me pick one from your progress. I teach from BodyWise lessons and will tell you when I do not have an answer.' }], speak: 'Hello! Ask me how any part of the body works.' };
    if (/^(thanks|thank you|asante)/.test(t)) return { source: 'demo', parts: [{ t: 'p', text: 'You are welcome. Your neurons did the hard work; I just pointed at the diagrams.' }] };

    var lessonHit = scoreLessons(t).filter(function (x) { return x.l.status === 'full' && x.s >= 3; })[0];
    var scenId = scenarioFor(t);
    var syss = systemsIn(t);
    var wantMode = requestedMode(t);
    var mode = wantMode || ctx.mode || 'auto';
    var current = ctx.lastTopic || (ctx.currentLesson ? 'lesson:' + ctx.currentLesson : null);

    // "I don't understand" → re-explain the current topic a different way
    if (has(t, ['dont understand', 'do not understand', 'confused', 'still lost', 'lost me', 'another way', 'different way', 'different analogy']) && current) {
      var alt = wantMode || (ctx.lastMode === 'simple' ? 'analogy' : ctx.lastMode === 'analogy' ? 'visual' : 'simple');
      var re = explainTopic(current, alt, ctx, BW.voiceLines ? BW.voiceLines.slowDown : null);
      if (re) return re;
    }
    // A mode request with no new topic re-explains the current topic
    if (wantMode && !lessonHit && !scenId && syss.length < 2 && !has(t, ['quiz']) ) {
      if (!current) return { source: 'demo', parts: [{ t: 'p', text: 'Happy to use ' + MODE_NAME[wantMode].toLowerCase() + ' mode. Which topic would you like? For example: homeostasis, the heart, the kidneys or muscle contraction.' }], setMode: wantMode };
      var ex = explainTopic(current, wantMode, ctx); if (ex) { ex.setMode = wantMode; return ex; }
    }

    if (has(t, ['quiz me', 'test me', 'quiz on', 'ask me questions', 'quiz'])) {
      var pool = [], ids = (ctx.completed || []).slice();
      if (has(t, ['mistake', 'wrong', 'got wrong'])) ids = Object.keys(ctx.mistakes || {});
      else if (has(t, ['today']) && BW.store) {
        var today = BW.store._today();
        var todayIds = Object.keys(BW.store.state.lessons).filter(function (id) { var s = BW.store.state.lessons[id]; return BW.store._today(s.completed || s.started) === today; });
        if (todayIds.length) ids = todayIds;
      }
      var cr = parseRef(current);
      if (has(t, ['this', 'that']) && cr && cr.kind === 'lesson') ids = [cr.id];
      if (!ids.length && cr && cr.kind === 'lesson') ids = [cr.id];
      ids.forEach(function (id) { var l = L(id); if (l && l.check) l.check.forEach(function (q) { if (q.type !== 'label') pool.push(Object.assign({ _lesson: id, _module: l.module }, q)); }); });
      if (!pool.length) return { source: 'demo', parts: [{ t: 'p', text: 'I do not have saved progress to quiz you on yet. Start a lesson, or try the Practice page for questions on every topic.' }, { t: 'links', items: [{ href: '#learn', label: 'Browse lessons' }, { href: '#practice', label: 'Open Practice' }] }] };
      var picked = BW.quiz.shuffle(pool).slice(0, 3);
      return { source: 'demo', parts: [{ t: 'p', text: 'Here are ' + picked.length + ' questions from ' + (ids.length === 1 ? L(ids[0]).title : has(t, ['mistake', 'wrong']) ? 'topics where you have made mistakes' : 'what you have studied') + '. Each one explains itself after you answer.' }, { t: 'quiz', questions: picked }] };
    }

    if (has(t, ['connect this', 'something i have learned', 'something ive learned', 'already learned', 'link this', 'related to what'])) {
      var cref = parseRef(current), cl = cref && cref.kind === 'lesson' ? L(cref.id) : null;
      if (!cl) return { source: 'demo', parts: [{ t: 'p', text: 'Open a lesson or ask about a topic first, then I can connect it to what you have already studied.' }] };
      var done = ctx.completed || [], conns = cl.connections, studied = conns.filter(function (c) { return done.indexOf(c.lesson) !== -1 && c.lesson !== cl.id; });
      var cp = [{ t: 'p', text: cl.title + ' connects to other systems like this:' }, { t: 'rel', items: conns }];
      if (studied.length) cp.push({ t: 'p', text: 'From your saved progress, you have already completed ' + studied.map(function (c) { return L(c.lesson).title; }).join(' and ') + '. Here is the bridge: ' + studied[0].text });
      else cp.push({ t: 'p', text: 'You have not completed the linked lessons yet on this device. A good next step is ' + (L(conns[0].lesson) ? L(conns[0].lesson).title : 'the next lesson') + '.' });
      var cm = connectionWithMechanism(cl); if (cm) cp.push({ t: 'p', text: 'How one leads to another: ' + cm.r.mechanism });
      cp.push({ t: 'links', items: conns.map(function (c) { return link(c.lesson); }).filter(Boolean).slice(0, 3) });
      return { source: 'demo', topic: 'lesson:' + cl.id, parts: cp };
    }

    var processQ = /\b(why|how|what happens|when|during|after|respond|response)\b/.test(t);
    if (scenId && (processQ || !lessonHit)) return teachScenario(BW.scenarioById[scenId], ctx, mode === 'auto' ? 'detailed' : mode, null);

    if (syss.length >= 2 && BW.relationBetween(syss[0], syss[1]) && (has(t, ['relationship', 'relate', 'connect', 'link', 'between', 'affect', 'work together', 'and the', ' and ']) || !lessonHit))
      return teachRelation(syss[0], syss[1], ctx, mode);
    if (syss.length >= 2 && has(t, ['relationship', 'relate', 'connect', 'between'])) {
      var a = syss[0], b = syss[1], via = BW.systems.map(function (s) { return s.id; }).filter(function (m) { return BW.relationBetween(a, m) && BW.relationBetween(m, b); })[0];
      if (via) return { source: 'demo', parts: [
        { t: 'p', text: 'There is no single direct link I have written up between ' + sysName(a) + ' and ' + sysName(b) + ', but they connect through the ' + sysName(via) + ' system:' },
        { t: 'list', items: [sysName(a) + ' ↔ ' + sysName(via) + ': ' + BW.relationBetween(a, via).text, sysName(via) + ' ↔ ' + sysName(b) + ': ' + BW.relationBetween(via, b).text] },
        { t: 'links', items: [{ href: '#connections-' + a, label: 'Open the Connection Map' }] }] };
    }

    var path = PATH_HINTS.filter(function (p) { return p.all.every(function (g) { return has(t, g); }); })[0];
    if (path) {
      var P = BW.paths.filter(function (p) { return p.id === path.id; })[0];
      return { source: 'demo', topic: 'lesson:' + P.steps[0].lesson, parts: [
        { t: 'h', text: 'Short answer' }, { t: 'p', text: P.blurb },
        { t: 'h', text: 'How one event leads to the next' },
        { t: 'chain', items: P.steps.map(function (s) { return { systems: [s.sys], title: s.title, text: s.text, lesson: s.lesson }; }) },
        { t: 'note', text: 'Simplified pathway. ' + (P.caveats && P.caveats[0] ? 'For example: ' + P.caveats[0] : '') },
        { t: 'links', items: [{ href: '#path-' + P.id, label: 'Open this learning path' }].concat(P.steps.slice(0, 2).map(function (s) { return link(s.lesson); })).filter(Boolean) },
        { t: 'p', text: 'Check yourself: ' + P.check.q },
        modeChips(null)
      ], speak: P.steps.map(function (s) { return s.title + '. ' + s.text; }).join(' ') };
    }

    if (has(t, ['what should i learn', 'what next', 'learn next', 'where should i start', 'recommend'])) {
      var nl = BW.store ? BW.store.nextLesson() : BW.allLessons[0];
      var rv = BW.store ? BW.store.needsRevision() : [];
      var p2 = [{ t: 'p', text: nl ? 'Next up: ' + nl.title + '. ' + (nl.why || nl.blurb) : 'You have completed every written lesson. Try mixed practice to keep it fresh.' }];
      if (rv.length) p2.push({ t: 'p', text: 'From your saved answers, you could also revisit ' + L(rv[0].id).title + ', where recent answers were ' + Math.round(rv[0].acc * 100) + '% correct.' });
      p2.push({ t: 'links', items: [nl ? link(nl.id) : { href: '#practice', label: 'Open Practice' }] });
      return { source: 'demo', parts: p2 };
    }

    var g = glossaryLookup(t);
    if (g && (!lessonHit || g.lesson.id === lessonHit.l.id)) {
      return { source: 'demo', topic: 'lesson:' + g.lesson.id, parts: [
        { t: 'h', text: g.term.t }, { t: 'p', text: g.term.d },
        { t: 'p', text: 'It is a key term in “' + g.lesson.title + '”. Want the whole idea explained?' },
        { t: 'chips', items: ['Explain it simply', 'Explain it step by step', 'Show me the visual version'] },
        { t: 'links', items: [link(g.lesson.id)] }] };
    }

    var ranked = scoreLessons(t);
    var best = ranked.filter(function (x) { return x.l.status === 'full'; })[0];
    var outline = ranked.filter(function (x) { return x.l.status === 'outline' && x.s >= 4; })[0];
    if (outline && (!best || outline.s > best.s + 2)) {
      var near = BW.allLessons.filter(function (l) { return l.module === outline.l.module && l.status === 'full'; })[0];
      return { source: 'demo', parts: [
        { t: 'p', text: '“' + outline.l.title + '” is in the syllabus, but that lesson is still an outline, so I do not have a full explanation ready. I would rather say so than make something up.' },
        near ? { t: 'p', text: 'The closest written lesson is ' + near.title + '.' } : { t: 'p', text: 'The Sources page lists the open textbook chapters on this topic.' },
        { t: 'links', items: [near ? link(near.id) : null, { href: '#sources', label: 'Open sources' }].filter(Boolean) }] };
    }
    if (best && best.s >= 3) {
      var out = teachLesson(best.l, ctx, mode);
      if (has(t, ['everyday', 'example', 'real life', 'daily']) && best.l.scenario) out.parts.splice(1, 0, { t: 'h', text: 'An everyday example' }, { t: 'p', text: best.l.scenario.title + '. ' + best.l.scenario.text });
      return out;
    }
    if (syss.length === 1) return teachSystem(syss[0], ctx);

    return { source: 'demo', unknown: true, parts: [
      { t: 'p', text: 'I do not have a prepared explanation for that yet. The built-in tutor can only teach from what is written in BodyWise, and I would rather say so than guess.' },
      { t: 'p', text: 'Try rephrasing with a body system or process (for example “kidney”, “blood pressure”, “insulin” or “action potential”), or pick a suggestion below.' },
      { t: 'chips', items: ['Why does heart rate increase during exercise?', 'Explain homeostasis using everyday examples.', 'Explain the relationship between the heart and kidneys.'] }
    ] };
  }

  /* ---------- optional live backend ---------- */
  function validEndpoint(u) {
    try {
      var x = new URL(u);
      if (x.protocol === 'https:') return true;
      return x.protocol === 'http:' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(x.hostname);
    } catch (e) { return false; }
  }
  function live(question, ctx) {
    var url = BW.store.state.prefs.tutorEndpoint;
    if (!validEndpoint(url)) return Promise.reject(new Error('The tutor backend address must start with https:// (or http://localhost for a server on this computer).'));
    var r = parseRef(ctx.lastTopic), lesson = r && r.kind === 'lesson' ? L(r.id) : null;
    var body = {
      question: String(question).slice(0, 2000),
      mode: ctx.mode || 'auto',
      level: ctx.mode || 'auto',
      lesson: lesson ? { title: lesson.title, summary: lesson.summary || lesson.blurb } : null,
      completed: (ctx.completed || []).map(function (id) { return L(id) ? L(id).title : id; }).slice(0, 20),
      history: (ctx.history || []).slice(-6).map(function (h) { return { role: h.role, text: String(h.text || '').slice(0, 1500) }; })
    };
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 45000);
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl ? ctrl.signal : undefined })
      .then(function (res) { clearTimeout(timer); if (!res.ok) throw new Error('The tutor backend replied with an error (' + res.status + ').'); return res.json(); })
      .then(function (j) { if (!j || typeof j.answer !== 'string' || !j.answer.trim()) throw new Error('The tutor backend sent an empty answer.'); return j; })
      .catch(function (e) { clearTimeout(timer); if (e.name === 'AbortError') throw new Error('The tutor backend took too long to answer.'); if (e instanceof TypeError) throw new Error('Could not reach the tutor backend. Check that it is running and the address is right. (Live calls are blocked inside the Claude preview.)'); throw e; });
  }

  BW.tutor = { respond: respond, answer: answer, explainTopic: explainTopic, live: live, validEndpoint: validEndpoint, systemsIn: systemsIn, scoreLessons: scoreLessons,
    modes: MODES, isAnswerLike: isAnswerLike, parseRef: parseRef, relationQuestion: relationQuestion,
    suggestions: ['Why does heart rate increase during exercise?', 'Explain homeostasis using everyday examples.', 'What happens to oxygen after I breathe it in?', 'Explain the relationship between the heart and kidneys.', 'Teach me this as if I am a beginner.', 'Quiz me on what I learned today.', 'I don’t understand. Try a different analogy.', 'Connect this topic to something I have already learned.'] };
})(window.BW = window.BW || {});
