/* BodyWise — learner state. Everything is stored in this browser only
   (localStorage). If storage is blocked, the app still works for the session. */
(function (BW) {
  'use strict';
  var KEY = 'bodywise.v1';
  var DAY = 86400000;
  var INTERVALS = [0, 1, 3, 7, 14, 30]; // Leitner box → days until next review

  function today(d) {
    d = d ? new Date(d) : new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function fresh() {
    return {
      v: 1, created: Date.now(),
      lessons: {}, attempts: [], quizzes: [], cards: {},
      saved: { lessons: [], terms: [] },
      notes: { lessons: {}, free: [] },
      prefs: { name: '', level: 'simple', theme: 'system', textSize: 'm', motion: 'system', jokes: true, voiceRate: 1, voiceName: '', tutorEndpoint: '', readingFont: false },
      activity: [], explored: {}, tutor: { history: [], lastTopic: null }
    };
  }

  var S = { state: fresh(), available: false, lastError: null, now: function () { return Date.now(); } };

  function probe() {
    try { var k = KEY + '.probe'; window.localStorage.setItem(k, '1'); window.localStorage.removeItem(k); return true; } catch (e) { return false; }
  }

  S.load = function () {
    S.available = probe();
    if (!S.available) return S.state;
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) S.state = merge(fresh(), JSON.parse(raw));
    } catch (e) { S.lastError = 'Saved progress could not be read, so BodyWise started fresh.'; S.state = fresh(); }
    return S.state;
  };
  function merge(base, saved) {
    if (!saved || typeof saved !== 'object') return base;
    function plainObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }
    Object.keys(saved).forEach(function (k) {
      if (saved[k] === undefined) return;
      if (plainObj(base[k]) && plainObj(saved[k])) base[k] = merge(base[k], saved[k]);
      else if (base[k] === undefined || Array.isArray(base[k]) === Array.isArray(saved[k])) base[k] = saved[k];
    });
    return base;
  }
  S.save = function () {
    if (!S.available) return false;
    try { window.localStorage.setItem(KEY, JSON.stringify(S.state)); return true; }
    catch (e) { S.lastError = 'Progress could not be saved (storage may be full or blocked).'; return false; }
  };
  S.reset = function () { S.state = fresh(); S.save(); };

  S.logActivity = function () {
    var t = today(S.now());
    if (S.state.activity.indexOf(t) === -1) { S.state.activity.push(t); if (S.state.activity.length > 400) S.state.activity.shift(); }
  };
  S.streak = function () {
    var set = {}; S.state.activity.forEach(function (d) { set[d] = 1; });
    var n = 0, cursor = S.now();
    if (!set[today(cursor)]) { cursor -= DAY; if (!set[today(cursor)]) return 0; }
    while (set[today(cursor)]) { n++; cursor -= DAY; }
    return n;
  };

  /* Lessons */
  S.markStarted = function (id) {
    var l = S.state.lessons[id] = S.state.lessons[id] || {};
    if (!l.started) { l.started = S.now(); S.logActivity(); S.save(); }
  };
  S.markComplete = function (id) {
    var l = S.state.lessons[id] = S.state.lessons[id] || {};
    var first = !l.completed;
    if (!l.started) l.started = S.now();
    l.completed = S.now(); S.logActivity();
    var lesson = BW.lessonIndex[id];
    if (lesson && lesson.flashcards) lesson.flashcards.forEach(function (c, i) {
      var cid = id + '#' + i;
      if (!S.state.cards[cid]) S.state.cards[cid] = { box: 1, due: S.now() + DAY };
    });
    S.save(); return first;
  };
  S.unmarkComplete = function (id) { if (S.state.lessons[id]) { delete S.state.lessons[id].completed; S.save(); } };
  S.isComplete = function (id) { return !!(S.state.lessons[id] && S.state.lessons[id].completed); };
  S.isStarted = function (id) { return !!(S.state.lessons[id] && S.state.lessons[id].started); };

  /* Questions */
  S.recordAttempt = function (qid, lessonId, moduleId, correct) {
    S.state.attempts.push({ qid: qid, lesson: lessonId || null, module: moduleId || null, correct: !!correct, ts: S.now() });
    if (S.state.attempts.length > 600) S.state.attempts.splice(0, S.state.attempts.length - 600);
    S.logActivity(); S.save();
  };
  S.recordQuiz = function (label, score, total, ref) {
    S.state.quizzes.push({ label: label, score: score, total: total, ref: ref || null, ts: S.now() });
    if (S.state.quizzes.length > 100) S.state.quizzes.shift();
    S.save();
  };
  S.lessonStats = function (id) {
    var recent = S.state.attempts.filter(function (a) { return a.lesson === id; }).slice(-10);
    var c = recent.filter(function (a) { return a.correct; }).length;
    return { attempts: recent.length, correct: c, acc: recent.length ? c / recent.length : null };
  };
  S.moduleStats = function (mid) {
    var recent = S.state.attempts.filter(function (a) { return a.module === mid; }).slice(-30);
    var c = recent.filter(function (a) { return a.correct; }).length;
    return { attempts: recent.length, correct: c, acc: recent.length ? c / recent.length : null };
  };
  /* A topic needs revision when recent accuracy is below 70% over at least 2 answers. */
  S.needsRevision = function () {
    var seen = {};
    S.state.attempts.forEach(function (a) { if (a.lesson) seen[a.lesson] = 1; });
    return Object.keys(seen).map(function (id) { var st = S.lessonStats(id); return { id: id, acc: st.acc, attempts: st.attempts }; })
      .filter(function (r) { return r.attempts >= 2 && r.acc < 0.7; })
      .sort(function (a, b) { return a.acc - b.acc; });
  };

  /* Flashcards: simple Leitner boxes (1, 3, 7, 14, 30 days). Not an optimised algorithm. */
  S.dueCards = function () {
    var now = S.now();
    return Object.keys(S.state.cards).filter(function (id) { return S.state.cards[id].due <= now; });
  };
  S.reviewCard = function (id, knew) {
    var c = S.state.cards[id] || { box: 1 };
    c.box = knew ? Math.min(5, c.box + 1) : 1;
    c.due = S.now() + (knew ? INTERVALS[c.box] * DAY : 10 * 60000);
    c.last = S.now();
    S.state.cards[id] = c; S.logActivity(); S.save();
  };
  S.addTermCard = function (term) {
    var id = 'term:' + term;
    if (!S.state.cards[id]) { S.state.cards[id] = { box: 1, due: S.now() }; S.save(); }
  };
  S.nextDue = function () {
    var ids = Object.keys(S.state.cards); if (!ids.length) return null;
    return ids.map(function (i) { return S.state.cards[i].due; }).sort(function (a, b) { return a - b; })[0];
  };

  /* Saved items and notes */
  S.toggleSavedLesson = function (id) {
    var a = S.state.saved.lessons, i = a.indexOf(id);
    if (i === -1) a.push(id); else a.splice(i, 1);
    S.save(); return i === -1;
  };
  S.isSavedLesson = function (id) { return S.state.saved.lessons.indexOf(id) !== -1; };
  S.toggleSavedTerm = function (term) {
    var a = S.state.saved.terms, i = a.indexOf(term);
    if (i === -1) { a.push(term); S.addTermCard(term); } else { a.splice(i, 1); delete S.state.cards['term:' + term]; }
    S.save(); return i === -1;
  };
  S.isSavedTerm = function (t) { return S.state.saved.terms.indexOf(t) !== -1; };
  S.setLessonNote = function (id, text) {
    text = String(text || '').slice(0, 5000);
    if (text.trim()) S.state.notes.lessons[id] = { text: text, ts: S.now() }; else delete S.state.notes.lessons[id];
    S.save();
  };
  S.addFreeNote = function (text) {
    text = String(text || '').trim().slice(0, 5000);
    if (!text) return null;
    var n = { id: 'n' + S.now().toString(36) + Math.random().toString(36).slice(2, 6), text: text, ts: S.now() };
    S.state.notes.free.unshift(n); S.save(); return n;
  };
  S.deleteFreeNote = function (id) { S.state.notes.free = S.state.notes.free.filter(function (n) { return n.id !== id; }); S.save(); };

  /* A system counts as explored once you open it in the explorer or start one of its lessons. */
  S.markExplored = function (sys) { if (!S.state.explored[sys]) { S.state.explored[sys] = S.now(); S.save(); } };
  S.exploredSystems = function () {
    var out = {};
    Object.keys(S.state.explored).forEach(function (k) { out[k] = true; });
    BW.systems.forEach(function (s) { s.lessons.forEach(function (id) { if (S.isStarted(id)) out[s.id] = true; }); });
    return out;
  };
  S.setPref = function (k, v) { S.state.prefs[k] = v; S.save(); };

  /* Completion counts only lessons that are fully written. */
  S.completion = function () {
    var full = BW.allLessons.filter(function (l) { return l.status === 'full'; });
    var done = full.filter(function (l) { return S.isComplete(l.id); });
    return { done: done.length, total: full.length, syllabus: BW.allLessons.length, pct: full.length ? Math.round(done.length / full.length * 100) : 0 };
  };
  S.nextLesson = function () {
    var full = BW.allLessons.filter(function (l) { return l.status === 'full'; });
    for (var i = 0; i < full.length; i++) if (S.isStarted(full[i].id) && !S.isComplete(full[i].id)) return full[i];
    for (var j = 0; j < full.length; j++) if (!S.isComplete(full[j].id)) return full[j];
    return null;
  };

  /* Backup: a text code the learner can copy and paste elsewhere. */
  S.exportCode = function () {
    var json = JSON.stringify(S.state);
    return 'BW1.' + btoa(unescape(encodeURIComponent(json)));
  };
  S.importCode = function (code) {
    code = String(code || '').trim();
    if (code.indexOf('BW1.') !== 0) throw new Error('This does not look like a BodyWise backup code. It should start with BW1.');
    var json;
    try { json = decodeURIComponent(escape(atob(code.slice(4)))); } catch (e) { throw new Error('The backup code is incomplete or damaged. Copy the whole code and try again.'); }
    var data; try { data = JSON.parse(json); } catch (e2) { throw new Error('The backup code could not be read.'); }
    if (!data || data.v !== 1) throw new Error('This backup is from an unsupported version.');
    S.state = merge(fresh(), data); S.save();
  };

  S._today = today;
  BW.store = S;
})(window.BW = window.BW || {});
