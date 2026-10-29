/* BodyWise — application shell, router and views. */
(function (BW) {
  'use strict';
  var S = BW.store, V = BW.voice;
  BW.indexCurriculum();
  S.load();

  var root = document.documentElement;
  var hostTheme = root.getAttribute('data-theme');
  var shell = document.getElementById('shell');
  var main, current = { view: null, param: null }, firstRoute = true;
  var ui = { level: {}, analogyAlt: {}, walk: {}, jokeIdx: Math.floor(Math.random() * BW.jokes.length), explore: 'cv', map: null, pendingPrompt: null, practice: null, notesFilter: '', confirmReset: false, confirmDel: null, sheet: false, listening: false };

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var ICON = {
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    book: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 5v16"/><path d="M8 7h7"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    chart: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/>',
    note: '<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4"/><path d="M8 12h8M8 16h6"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    library: '<path d="M5 4v16M9 4v16"/><path d="M13 5l4 15"/><path d="M3 20h18"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    check: '<path d="M5 12l4 4 10-10"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
    speaker: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a7.5 7.5 0 010 11"/>',
    send: '<path d="M4 12l16-8-6 16-2-7z"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    warn: '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
    map: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="8" r="2.5"/><circle cx="9" cy="18" r="2.5"/><path d="M8 7l8 1M7 8l2 8M16 10l-5 6"/>'
  };
  function icon(n, extra) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + (ICON[n] || '') + '</svg>'; }
  function sysChip(id, href) {
    var s = BW.sysById[id]; if (!s) return '';
    var inner = '<b>' + s.code + '</b>' + esc(s.short);
    return href ? '<a class="sys sys-' + id + '" href="' + href + '">' + inner + '</a>' : '<span class="sys sys-' + id + '">' + inner + '</span>';
  }
  function L(id) { return BW.lessonIndex[id]; }
  function lessonNo(l) { return l.moduleN + '.' + l.index; }
  function modOf(id) { return BW.modules.filter(function (m) { return m.id === id; })[0]; }
  function fmtDate(ts) { return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
  function reduced() { return S.state.prefs.motion === 'reduce' || (S.state.prefs.motion !== 'full' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function plain(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent; }
  function statusDot(id) {
    return S.isComplete(id) ? '<span class="status-dot done" title="Completed">' + icon('check') + '</span>' : S.isStarted(id) ? '<span class="status-dot started" title="Started"></span>' : '<span class="status-dot" title="Not started"></span>';
  }

  /* ---------- toasts, celebration, read-aloud ---------- */
  function toast(msg, kind) {
    var box = document.getElementById('toasts'); if (!box) return;
    var t = document.createElement('div'); t.className = 'toast' + (kind ? ' ' + kind : ''); t.textContent = msg; box.appendChild(t);
    setTimeout(function () { t.remove(); }, 3600);
  }
  function burst() {
    if (reduced()) return;
    var b = document.createElement('div'); b.className = 'burst'; b.setAttribute('aria-hidden', 'true');
    var cols = ['cv', 'rs', 'ns', 'en', 'di', 're', 'ms', 'im', 'rp'];
    for (var k = 0; k < 36; k++) {
      var i = document.createElement('i');
      i.style.background = 'var(--sys-' + cols[k % cols.length] + ')';
      i.style.setProperty('--x', (Math.random() * 520 - 260) + 'px');
      i.style.setProperty('--y', (Math.random() * 420 - 80) + 'px');
      i.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
      b.appendChild(i);
    }
    document.body.appendChild(b); setTimeout(function () { b.remove(); }, 1300);
  }
  function speak(text, title) {
    if (!V.ttsSupported) { toast('Read-aloud is not available in this browser.'); return; }
    V.speak(text, title);
  }
  function renderReadbar() {
    var el = document.getElementById('readbar'); if (!el) return;
    var st = V.state;
    if (!st.speaking) { el.hidden = true; el.innerHTML = ''; if (st.error) toast(st.error); st.error = null; return; }
    el.hidden = false;
    el.innerHTML = '<span class="t" aria-live="polite">' + (st.paused ? 'Paused: ' : 'Reading: ') + esc(st.title) + '</span>' +
      (st.paused ? '<button data-act="tts-resume">Resume</button>' : '<button data-act="tts-pause">Pause</button>') + '<button data-act="tts-stop">Stop</button>';
  }
  V.onChange(renderReadbar);

  /* ---------- preferences ---------- */
  function applyPrefs() {
    var p = S.state.prefs;
    if (p.theme === 'light' || p.theme === 'dark') root.setAttribute('data-theme', p.theme);
    else if (hostTheme) root.setAttribute('data-theme', hostTheme); else root.removeAttribute('data-theme');
    root.setAttribute('data-size', p.textSize || 'm');
    if (p.motion === 'reduce') root.setAttribute('data-motion', 'reduce'); else root.removeAttribute('data-motion');
    if (p.readingFont) root.setAttribute('data-spacing', 'wide'); else root.removeAttribute('data-spacing');
  }

  /* ---------- shell ---------- */
  var NAV = [
    { id: 'home', label: 'Home', icon: 'home' }, { id: 'learn', label: 'Learn', icon: 'book' }, { id: 'explore', label: 'Explore', icon: 'compass' },
    { id: 'tutor', label: 'Tutor', icon: 'chat' }, { id: 'practice', label: 'Practice', icon: 'target' }, { id: 'progress', label: 'Progress', icon: 'chart' },
    { id: 'notes', label: 'Notes', icon: 'note' }, { id: 'preferences', label: 'Preferences', icon: 'sliders' }, { id: 'sources', label: 'Sources', icon: 'library' }
  ];
  var LOGO = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="var(--accent)"/><path d="M6 17h5l2-6 3 12 3-9 2 3h5" fill="none" stroke="var(--accent-ink)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function navList(cls) {
    return '<ul class="navlist ' + (cls || '') + '">' + NAV.map(function (n) { return '<li><a href="#' + n.id + '" data-nav="' + n.id + '">' + icon(n.icon) + n.label + '</a></li>'; }).join('') + '</ul>';
  }
  function renderShell() {
    shell.innerHTML =
      '<aside class="sidebar" aria-label="Main"><a class="brand" href="#home">' + LOGO + 'BodyWise</a><nav aria-label="Main navigation">' + navList() + '</nav>' +
      '<p class="side-foot">Free and offline-friendly. Your progress stays in this browser. Educational only, not medical advice.</p></aside>' +
      '<header class="topbar"><a class="brand" href="#home">' + LOGO + 'BodyWise</a><span class="spacer"></span><a class="iconbtn" href="#tutor" aria-label="Ask the tutor">' + icon('chat') + '</a></header>' +
      '<main id="main" tabindex="-1"></main>' +
      '<nav class="tabbar" aria-label="Main navigation (mobile)">' +
      ['home', 'learn', 'explore', 'tutor'].map(function (id) { var n = NAV.filter(function (x) { return x.id === id; })[0]; return '<a href="#' + id + '" data-nav="' + id + '">' + icon(n.icon) + n.label + '</a>'; }).join('') +
      '<button type="button" data-act="sheet" data-nav="more" aria-haspopup="dialog">' + icon('more') + 'More</button></nav>' +
      '<div id="sheet"></div><div id="readbar" class="readbar" hidden></div><div id="toasts" class="toasts" aria-live="polite"></div>';
    main = document.getElementById('main');
  }
  function setNav(section) {
    var moreIds = ['practice', 'progress', 'notes', 'preferences', 'sources'];
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      var id = a.getAttribute('data-nav');
      var on = id === section || (id === 'more' && moreIds.indexOf(section) !== -1);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function openSheet(open) {
    var el = document.getElementById('sheet'); ui.sheet = open;
    if (!open) { el.innerHTML = ''; return; }
    el.innerHTML = '<div class="sheet-backdrop" data-act="sheet-close"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="More pages"><div class="grab"></div>' +
      '<ul class="navlist">' + NAV.slice(4).map(function (n) { return '<li><a href="#' + n.id + '" data-act="sheet-close">' + icon(n.icon) + n.label + '</a></li>'; }).join('') + '</ul>' +
      '<button class="btn" data-act="sheet-close">Close</button></div>';
    var f = el.querySelector('.sheet a'); if (f) f.focus();
  }

  /* ---------- router ---------- */
  function parse() {
    var h = (location.hash || '').replace(/^#/, '');
    if (!h || h === 'main') return { view: 'home' };
    var m;
    if ((m = h.match(/^lesson-(m\d+-l\d+)$/))) return { view: 'lesson', param: m[1], section: 'learn' };
    if ((m = h.match(/^module-(\d+)$/))) return { view: 'module', param: 'm' + m[1], section: 'learn' };
    if ((m = h.match(/^explore-([a-z]{2})$/))) return { view: 'explore', param: m[1], section: 'explore' };
    if ((m = h.match(/^connections(?:-([a-z]{2}(?:-[a-z]{2})?))?$/))) return { view: 'connections', param: m[1] || null, section: 'explore' };
    if (h === 'scenarios') return { view: 'scenarios', section: 'explore' };
    if ((m = h.match(/^scenario-([a-z]+)$/))) return { view: 'scenarios', param: m[1], section: 'explore' };
    if ((m = h.match(/^path-([a-z0-9-]+)$/))) return { view: 'paths', param: m[1], section: 'explore' };
    if (h === 'paths') return { view: 'paths', section: 'explore' };
    if (h === 'practice-cards') return { view: 'practice', param: 'cards', section: 'practice' };
    if (VIEWS[h]) return { view: h, section: h };
    return { view: 'notfound' };
  }
  function route() {
    var r = parse();
    if (ui.listening) V.stopListening();
    if (BW.ui) { BW.ui.cardiacStop(); BW.ui.closeTerm(); BW.ui.closeDiagram(); }
    if (ui.sheet) openSheet(false);
    current = r;
    var out = VIEWS[r.view](r.param);
    main.innerHTML = out.html;
    setNav(r.section || r.view);
    if (out.after) out.after(main);
    if (!firstRoute) {
      window.scrollTo(0, 0);
      var h1 = main.querySelector('h1'); if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
    }
    firstRoute = false;
    if (S.lastError) { toast(S.lastError); S.lastError = null; }
  }
  function rerender() { var y = window.scrollY; route(); window.scrollTo(0, y); }

  /* ---------- views ---------- */
  var VIEWS = {};

  VIEWS.notfound = function () {
    return { html: '<div class="page narrow"><h1>Page not found</h1><p>That link does not match a BodyWise page.</p><p><a class="btn primary" href="#home">Go to Home</a></p></div>' };
  };

  /* Home */
  var T0 = Date.now(), beatTimer = null;
  function miniBody(explored) {
    var out = '<svg viewBox="0 0 240 440" class="minibody" role="group" aria-label="Body map of systems you have explored">' +
      '<circle cx="120" cy="46" r="30" class="body-sil"/><rect x="108" y="72" width="24" height="20" rx="6" class="body-sil"/>' +
      '<path d="M70,98 Q120,84 170,98 L178,252 Q120,280 62,252 Z" class="body-sil"/>' +
      '<path d="M70,102 L46,116 L30,236 L44,240 L60,142 L68,140 Z" class="body-sil"/><path d="M170,102 L194,116 L210,236 L196,240 L180,142 L172,140 Z" class="body-sil"/>' +
      '<path d="M74,258 L104,268 L106,424 L84,424 Z" class="body-sil"/><path d="M166,258 L136,268 L134,424 L156,424 Z" class="body-sil"/>';
    BW.systems.forEach(function (s) {
      var on = !!explored[s.id];
      out += '<a href="#explore-' + s.id + '" class="hot mini sys-' + s.id + (on ? ' done' : ' todo') + '" aria-label="' + esc(s.name) + ': ' + (on ? 'explored' : 'not explored yet') + '">' +
        '<circle class="ring2" cx="' + s.spot.x + '" cy="' + s.spot.y + '" r="14"/><circle class="core" cx="' + s.spot.x + '" cy="' + s.spot.y + '" r="10.5"/>' +
        '<text x="' + s.spot.x + '" y="' + (s.spot.y + 3.5) + '" text-anchor="middle">' + (on ? '✓' : s.code) + '</text></a>';
    });
    return out + '</svg>';
  }
  function ecg() {
    return '<svg viewBox="0 0 320 120" class="ecg" aria-hidden="true">' +
      '<path class="ecg-grid" d="M0,30 H320 M0,60 H320 M0,90 H320 M40,0 V120 M80,0 V120 M120,0 V120 M160,0 V120 M200,0 V120 M240,0 V120 M280,0 V120"/>' +
      '<path class="ecg-base" d="M0,70 H52 l8,-6 l8,6 h10 l6,10 l10,-62 l10,72 l7,-20 h18 q10,-14 20,0 H170 l8,-6 l8,6 h10 l6,10 l10,-62 l10,72 l7,-20 h18 q10,-14 20,0 H320"/><path class="ecg-line" pathLength="100" d="M0,70 H52 l8,-6 l8,6 h10 l6,10 l10,-62 l10,72 l7,-20 h18 q10,-14 20,0 H170 l8,-6 l8,6 h10 l6,10 l10,-62 l10,72 l7,-20 h18 q10,-14 20,0 H320"/></svg>';
  }
  VIEWS.home = function () {
    var p = S.state.prefs, comp = S.completion(), next = S.nextLesson(), due = S.dueCards(), rev = S.needsRevision(), streak = S.streak();
    var hr = new Date().getHours(), greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    var returning = S.state.activity.length > 0;
    var dayIdx = Math.floor(Date.now() / 86400000);
    var fact = BW.facts[dayIdx % BW.facts.length];
    var mystery = BW.mysteries[dayIdx % BW.mysteries.length];
    var joke = BW.jokes[(dayIdx + ui.jokeIdx) % BW.jokes.length];
    var lastQ = S.state.quizzes[S.state.quizzes.length - 1];
    var explored = S.exploredSystems(), nExplored = Object.keys(explored).length;
    var acc = S.state.attempts.length ? Math.round(S.state.attempts.filter(function (a) { return a.correct; }).length / S.state.attempts.length * 100) : null;

    var suggestion;
    if (due.length) suggestion = { t: 'Review ' + due.length + ' flashcard' + (due.length > 1 ? 's' : '') + ' due today', href: '#practice-cards' };
    else if (rev.length) suggestion = { t: 'Revisit ' + L(rev[0].id).title + ' (' + Math.round(rev[0].acc * 100) + '% recently)', href: '#lesson-' + rev[0].id };
    else if (S.state.attempts.length === 0) suggestion = { t: 'Take a quick quiz to see what you already know', href: '#practice' };
    else if (comp.done >= 1) { var pth = BW.paths[dayIdx % BW.paths.length]; suggestion = { t: 'Follow a path: ' + pth.title, href: '#path-' + pth.id }; }
    else suggestion = { t: 'Explore a body system before your next lesson', href: '#explore' };

    var steps = [];
    if (comp.done >= 1) steps.push('<li><a href="#paths">Follow a cross-system learning path</a></li>');
    if (rev.length) steps.push('<li><a href="#lesson-' + rev[0].id + '">Revise ' + esc(L(rev[0].id).title) + '</a></li>');
    if (nExplored < 9) { var notYet = BW.systems.filter(function (s) { return !explored[s.id]; })[0]; steps.push('<li><a href="#explore-' + notYet.id + '">Explore the ' + esc(notYet.short.toLowerCase()) + ' system</a></li>'); }

    var R = 22, C = 2 * Math.PI * R;
    var ring = '<svg class="ring sm" viewBox="0 0 52 52" aria-hidden="true"><circle class="bgc" cx="26" cy="26" r="' + R + '"/><circle class="fgc" cx="26" cy="26" r="' + R + '" stroke-dasharray="' + C + '" stroke-dashoffset="' + (C * (1 - comp.pct / 100)) + '" transform="rotate(-90 26 26)"/></svg>';
    var days = '';
    for (var k = 13; k >= 0; k--) { var d = S._today(Date.now() - k * 86400000); days += '<span class="' + (S.state.activity.indexOf(d) !== -1 ? 'on' : '') + (k === 0 ? ' today' : '') + '" title="' + d + '"></span>'; }

    // Systems connected: what completed lessons link to
    var doneL = Object.keys(S.state.lessons).filter(function (id) { return S.isComplete(id) && L(id) && L(id).status === 'full'; })
      .sort(function (a, b) { return S.state.lessons[b].completed - S.state.lessons[a].completed; });
    var touched = {}; doneL.forEach(function (id) { L(id).connections.forEach(function (c) { touched[c.sys] = 1; }); });
    var connected = doneL.length ? '<p class="muted">You have completed ' + doneL.length + ' lesson' + (doneL.length > 1 ? 's' : '') + ' that link to ' + Object.keys(touched).length + ' of 9 systems. Here is where they lead next.</p>' +
      '<ul class="links-list">' + doneL.slice(0, 3).map(function (id) {
        return '<li><a class="from" href="#lesson-' + id + '"><span class="ok" aria-hidden="true">✓</span>' + esc(L(id).title) + '</a><div class="to">' + L(id).connections.slice(0, 3).map(function (c) {
          var t = L(c.lesson), learnt = t && S.isComplete(t.id);
          return '<a class="sys sys-' + c.sys + (learnt ? '' : ' hollow') + '" href="#lesson-' + c.lesson + '" title="' + esc(t ? t.title : '') + '"><b>' + BW.sysById[c.sys].code + '</b>' + esc(t ? t.title : BW.sysById[c.sys].short) + '<span class="sr-only">' + (learnt ? ' (learned)' : ' (not yet)') + '</span></a>';
        }).join('') + '</div></li>';
      }).join('') + '</ul><p class="tiny muted">Filled chips are lessons you have completed; outlined chips are still to learn.</p>'
      : '<div class="empty"><strong>Nothing connected yet.</strong><span>Finish your first lesson and BodyWise will show which systems it links to, and what to learn next.</span>' + (next ? '<a class="btn small" href="#lesson-' + next.id + '">Start ' + esc(next.title) + '</a>' : '') + '</div>';

    var html = '<div class="page home">' +
      '<section class="hero">' +
      '<div class="hero-text"><p class="eyebrow">' + greet + (p.name ? ', ' + esc(p.name) : '') + '</p>' +
      '<h1>' + (returning ? 'Welcome back' + (p.name ? ', ' + esc(p.name) : '') + '. Ready to investigate the extraordinary machine you live in?' : 'Ready to investigate the extraordinary machine you live in?') + '</h1>' +
      '<p class="lede">No lab coat required. Learn how each system works, why it works that way, and how it depends on the others.</p>' +
      '<form class="askbar" data-form="ask" role="search" aria-label="Ask BodyWise"><label for="askq" class="sr-only">Ask BodyWise a question</label><input id="askq" type="text" maxlength="1000" placeholder="Ask BodyWise: why do I get hiccups?"><button class="btn primary">' + icon('chat') + 'Ask BodyWise</button></form>' +
      (!p.name ? '<form class="row namebar" data-form="name"><label class="sr-only" for="nm">Your first name (optional)</label><input id="nm" type="text" maxlength="40" placeholder="What should I call you? (optional)"><button class="btn small">Save</button></form>' : '') +
      '</div>' +
      '<div class="hero-art">' + ecg() + '<p class="beat">Since you opened BodyWise, your heart has beaten about <strong class="mono" data-beats>0</strong><span data-times> times.</span><span class="tiny muted"> Estimate at a typical 70 beats a minute.</span></p></div>' +
      '</section>' +

      '<div class="home-main">' +
      '<section class="card raised continue-card">' + (next ?
        '<span class="eyebrow">Continue learning</span><div class="row">' + sysChip(modOf(next.module).systems[0]) + '<span class="tiny muted">Lesson ' + lessonNo(next) + ' · Module ' + next.moduleN + '</span></div>' +
        '<h2 class="big">' + esc(next.title) + '</h2><p class="muted">' + esc(next.why) + '</p>' +
        '<div class="row"><a class="btn primary lg" href="#lesson-' + next.id + '">' + (S.isStarted(next.id) ? 'Continue lesson' : 'Start lesson') + icon('arrow') + '</a></div>'
        : '<span class="eyebrow">All written lessons done</span><h2 class="big">You have finished every written lesson</h2><p>New lessons appear as they are written. Mixed practice keeps it all fresh.</p><a class="btn primary" href="#practice">Keep practising</a>') +
      '<div class="suggest"><span class="eyebrow">Today’s suggestion</span><a href="' + suggestion.href + '">' + esc(suggestion.t) + '</a>' + (steps.length ? '<ul class="tiny">' + steps.slice(0, 2).join('') + '</ul>' : '') + '</div></section>' +

      '<section class="card mystery"><span class="eyebrow">Today’s body mystery</span><h2>' + esc(mystery.q) + '</h2>' +
      (ui.mystery ? '<div class="reveal" id="mys-a"><p>' + esc(mystery.a) + '</p><div class="row">' + sysChip(mystery.sys) + '<a class="btn small" href="#lesson-' + mystery.lesson + '">Learn the full story</a><button class="btn small ghost" data-act="ask" data-q="' + esc(mystery.q) + '">Ask BodyWise</button></div></div>'
        : '<p class="muted">Have a guess first. Then check your thinking.</p>') +
      '<div class="row"><button class="btn small' + (ui.mystery ? '' : ' primary') + '" data-act="mystery" aria-expanded="' + !!ui.mystery + '" aria-controls="mys-a">' + (ui.mystery ? 'Hide the answer' : 'Reveal the answer') + '</button></div></section>' +
      '</div>' +

      '<section class="card statstrip" aria-label="Progress summary">' +
      '<a class="stat" href="#progress">' + ring + '<span><strong class="mono">' + comp.done + '/' + comp.total + '</strong><span class="tiny muted">lessons done</span></span></a>' +
      '<a class="stat" href="#progress"><span class="statn mono">' + streak + '</span><span><strong>day streak</strong><span class="days mini" aria-hidden="true">' + days + '</span></span></a>' +
      '<a class="stat" href="#practice"><span class="statn mono">' + (lastQ ? lastQ.score + '/' + lastQ.total : '–') + '</span><span><strong>last quiz</strong><span class="tiny muted">' + (lastQ ? esc(lastQ.label).slice(0, 28) : 'none yet') + '</span></span></a>' +
      '<a class="stat" href="' + (rev.length ? '#lesson-' + rev[0].id : '#progress') + '"><span class="statn mono">' + rev.length + '</span><span><strong>to revise</strong><span class="tiny muted">' + (rev.length ? esc(L(rev[0].id).title).slice(0, 30) : (acc != null ? acc + '% correct overall' : 'nothing flagged')) + '</span></span></a>' +
      '<a class="stat" href="#practice-cards"><span class="statn mono">' + due.length + '</span><span><strong>cards due</strong><span class="tiny muted">' + Object.keys(S.state.cards).length + ' in deck</span></span></a>' +
      '</section>' +

      '<div class="grid two">' +
      '<section class="card"><div class="row between"><span class="eyebrow">Systems you have explored</span><span class="chip accent">' + nExplored + ' of 9</span></div>' +
      '<div class="explored">' + miniBody(explored) + '<div class="stack"><p>' + (nExplored ? 'Ticked systems are ones you have opened in the explorer or started a lesson on. Tap any system to explore it.' : 'Nothing explored yet. Tap a system on the body to start.') + '</p>' +
      '<ul class="sysstatus">' + BW.systems.map(function (s) { return '<li class="' + (explored[s.id] ? 'done' : '') + '">' + sysChip(s.id, '#explore-' + s.id) + '<span class="tiny">' + (explored[s.id] ? 'explored' : 'not yet') + '</span></li>'; }).join('') + '</ul></div></div></section>' +
      '<section class="card"><div class="row between"><span class="eyebrow">Systems connected</span><a class="tiny" href="#connections">Open the map</a></div>' + connected + '</section>' +
      '</div>' +

      '<div class="grid two">' +
      (p.jokes !== false ? '<section class="card jokecard"><span class="eyebrow">Daily physiology joke</span><p class="joke">' + esc(joke.joke) + '</p>' +
        (ui.jokeOpen ? '<div class="reveal" id="joke-a"><p><strong>The real science:</strong> ' + esc(joke.science) + '</p><a class="tiny" href="#lesson-' + joke.lesson + '">Lesson ' + lessonNo(L(joke.lesson)) + ': ' + esc(L(joke.lesson).title) + '</a></div>' : '') +
        '<div class="row"><button class="btn small" data-act="joke-science" aria-expanded="' + !!ui.jokeOpen + '" aria-controls="joke-a">' + (ui.jokeOpen ? 'Hide the science' : 'Now the real science') + '</button><button class="btn small ghost" data-act="joke">Another one</button></div></section>' : '') +
      '<section class="card"><span class="eyebrow">Did you know?</span><p class="fact">' + esc(fact) + '</p><div class="row"><a class="btn small" href="#connections">' + icon('map') + 'How systems connect</a><a class="btn small" href="#paths">Learning paths</a></div></section>' +
      '</div></div>';
    return { html: html, after: function () {
      var el = main.querySelector('[data-beats]');
      var tick = function () { if (!document.body.contains(el)) { clearInterval(beatTimer); return; } var n = Math.floor((Date.now() - T0) / 1000 * 70 / 60); el.textContent = n.toLocaleString('en-GB'); var u = main.querySelector('[data-times]'); if (u) u.textContent = n === 1 ? ' time.' : ' times.'; };
      clearInterval(beatTimer); tick(); beatTimer = setInterval(tick, 1000);
    } };
  };

  /* Learn */
  VIEWS.learn = function () {
    var comp = S.completion();
    var html = '<div class="page"><div class="stack"><p class="eyebrow">Curriculum</p><h1>Learn</h1><p class="muted" style="max-width:62ch">Thirteen modules from the basics to whole-body physiology. ' + comp.total + ' lessons are fully written; the others are outlines and are clearly labelled. Every lesson links to the systems it depends on.</p></div>' +
      '<div class="row"><a class="btn small" href="#paths">' + icon('map') + 'Cross-system learning paths</a><a class="btn small" href="#connections">Body-systems map</a></div>' +
      '<div class="modlist">' + BW.modules.map(function (m) {
        var full = m.lessons.filter(function (l) { return L(l.id).status === 'full'; });
        var done = full.filter(function (l) { return S.isComplete(l.id); }).length;
        var pct = full.length ? Math.round(done / full.length * 100) : 0;
        return '<a class="card mod" href="#module-' + m.n + '"><span class="num">' + m.n + '</span><div class="stack" style="gap:8px;min-width:0"><h2>' + esc(m.title) + '</h2><p class="muted">' + esc(m.summary) + '</p>' +
          '<div class="row">' + m.systems.map(function (s) { return sysChip(s); }).join('') + '</div>' +
          '<div class="row tiny muted"><span>' + m.lessons.length + ' lessons · ' + full.length + ' written · ' + done + ' completed</span></div>' +
          (full.length ? '<div class="bar" aria-hidden="true"><span style="width:' + pct + '%"></span></div>' : '') + '</div></a>';
      }).join('') + '</div></div>';
    return { html: html };
  };

  /* Module */
  VIEWS.module = function (mid) {
    var m = modOf(mid); if (!m) return VIEWS.notfound();
    var full = m.lessons.filter(function (l) { return L(l.id).status === 'full'; });
    var qs = []; full.forEach(function (l) { (L(l.id).check || []).forEach(function (q) { qs.push(Object.assign({ _lesson: l.id, _module: m.id }, q)); }); });
    var earlier = {};
    full.forEach(function (l) { (L(l.id).connections || []).forEach(function (c) { var t = L(c.lesson); if (t && t.moduleN < m.n) earlier[c.lesson] = c; }); });
    var earlierIds = Object.keys(earlier);
    var st = S.moduleStats(m.id);
    var html = '<div class="page narrow"><nav class="crumbs" aria-label="Breadcrumb"><a href="#learn">Learn</a><span>›</span><span>Module ' + m.n + '</span></nav>' +
      '<div class="stack"><p class="eyebrow">Module ' + m.n + '</p><h1>' + esc(m.title) + '</h1><p class="muted">' + esc(m.summary) + '</p><div class="row">' + m.systems.map(function (s) { return sysChip(s, '#explore-' + s); }).join('') + '</div></div>' +
      '<section class="stack"><h2>Lessons</h2><ul class="lessonlist">' + m.lessons.map(function (l, i) {
        var rec = L(l.id), out = rec.status !== 'full';
        return '<li><a class="lessonrow' + (out ? ' outline' : '') + '" href="#lesson-' + l.id + '"><span class="idx">' + m.n + '.' + (i + 1) + '</span><span><strong>' + esc(l.title) + '</strong><br><span class="muted tiny">' + esc(l.blurb) + '</span></span>' +
          (out ? '<span class="chip">Outline</span>' : statusDot(l.id)) + '</a></li>';
      }).join('') + '</ul></section>' +
      (earlierIds.length ? '<section class="card"><h2>Builds on earlier lessons</h2><ul class="lessonlist">' + earlierIds.map(function (id) { return '<li>' + sysChip(earlier[id].sys) + ' <a href="#lesson-' + id + '">' + esc(L(id).title) + '</a></li>'; }).join('') + '</ul></section>' : '') +
      '<section class="card"><h2>Module quiz</h2>' + (qs.length ? '<p class="muted">' + Math.min(qs.length, 8) + ' questions drawn from the written lessons in this module.' + (st.attempts ? ' Your recent accuracy here: ' + Math.round(st.acc * 100) + '%.' : '') + '</p><div data-mq><button class="btn primary" data-act="module-quiz" data-m="' + m.id + '">Start module quiz</button></div>' : '<p class="muted">The quiz appears once a lesson in this module is fully written.</p>') + '</section>' +
      '</div>';
    return { html: html };
  };

  /* Lesson */
  VIEWS.lesson = function (id) {
    var l = L(id); if (!l) return VIEWS.notfound();
    var m = modOf(l.module);
    if (l.status !== 'full') return outlineView(l, m);
    S.markStarted(id);
    if (S.state.tutor.currentLesson !== id) { S.state.tutor.currentLesson = id; S.state.tutor.lastTopic = id; S.save(); }
    var level = ui.level[id] || S.state.prefs.level || 'simple';
    var refs = (l.refs || []).map(function (r) { return BW.refById[r]; }).filter(Boolean);
    var note = S.state.notes.lessons[id];
    var done = S.isComplete(id);
    var nxt = L(l.next);
    var saved = S.isSavedLesson(id);
    var walk = ui.walk[id];
    var alt = ui.analogyAlt[id];
    var used = {}, LT = function (t) { return BW.ui.linkTerms(t, l.terms, used); };
    var paths = BW.ui.pathsFor(id);
    // Link terms where learners see them first: intro, steps, summary, example, then the expandable detail.
    var H = { intro: LT(l.intro), steps: l.steps.map(LT), summary: LT(l.summary), scenario: LT(l.scenario.text) };
    H.detail = l.detail.map(LT); H.advanced = l.advanced ? LT(l.advanced) : '';
    var secN = 0; function sn() { secN++; return '<span class="n">' + String(secN).padStart(2, '0') + '</span>'; }
    var sysList = (l.connections || []).map(function (c) { return c.sys; }).filter(function (v, i, a) { return a.indexOf(v) === i; });

    var html = '<article class="page narrow lesson">' +
      '<nav class="crumbs" aria-label="Breadcrumb"><a href="#learn">Learn</a><span>›</span><a href="#module-' + m.n + '">Module ' + m.n + '</a><span>›</span><span>Lesson ' + lessonNo(l) + '</span></nav>' +
      '<header class="lesson-head"><p class="eyebrow">Lesson ' + lessonNo(l) + ' · ' + esc(m.title) + '</p><h1>' + esc(l.title) + '</h1>' +
      '<div class="row">' + (done ? '<span class="chip good">' + icon('check', ' width="14" height="14"') + ' Completed</span>' : '<span class="chip accent">In progress</span>') + sysList.map(function (s) { return sysChip(s); }).join('') + '</div>' +
      '<div class="lesson-tools"><div class="seg" role="group" aria-label="Explanation level">' + ['simple', 'detailed', 'advanced'].map(function (lv) { return '<button data-act="level" data-lv="' + lv + '" aria-pressed="' + (level === lv) + '">' + lv.charAt(0).toUpperCase() + lv.slice(1) + '</button>'; }).join('') + '</div>' +
      '<button class="btn small" data-act="read-lesson">' + icon('speaker') + 'Read aloud</button>' +
      '<button class="btn small" data-act="save-lesson" aria-pressed="' + saved + '">' + icon('star') + (saved ? 'Saved' : 'Save') + '</button></div>' +
      '<nav class="jump" aria-label="Jump to section"><a class="chip" href="#" data-jump="s-mech">Mechanism</a><a class="chip" href="#" data-jump="s-predict">Predict</a><a class="chip" href="#" data-jump="s-diagram">Diagram</a>' + (id === 'm3-l4' ? '<a class="chip" href="#" data-jump="s-cardiac">Cardiac cycle</a>' : '') + '<a class="chip" href="#" data-jump="s-related">Related systems</a><a class="chip" href="#" data-jump="s-check">Knowledge check</a><a class="chip" href="#" data-jump="s-summary">Summary</a></nav>' +
      '<p class="tiny muted">Tip: underlined <span class="term-btn demo">key terms</span> open a short definition.</p></header>' +

      '<section class="section why"><h2>' + sn() + ' Why this matters</h2><p>' + esc(l.why) + '</p></section>' +
      '<section class="section"><h2>' + sn() + ' What you will be able to do</h2><ul class="objectives checks">' + l.objectives.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul></section>' +
      '<section class="section" id="s-intro"><h2>' + sn() + ' Explain it like I’m new to this</h2><div class="prose lead"><p>' + H.intro + '</p></div></section>' +
      '<section class="section"><h2>' + sn() + ' The science in more detail</h2>' +
      '<details class="more"' + (level !== 'simple' ? ' open' : '') + '><summary>' + (level === 'simple' ? 'Show the detailed explanation' : 'Detailed explanation') + '</summary><div class="inner prose">' + H.detail.map(function (d) { return '<p>' + d + '</p>'; }).join('') + '</div></details>' +
      (l.advanced ? '<details class="more deeper"' + (level === 'advanced' ? ' open' : '') + '><summary>Go deeper (advanced)</summary><div class="inner prose"><p>' + H.advanced + '</p></div></details>' : '') + '</section>' +
      '<aside class="interlude" aria-label="Quick check"><div data-mini="myth"></div></aside>' +

      '<section class="section" id="s-mech"><h2>' + sn() + ' Step-by-step mechanism</h2>' +
      (walk != null ? '<p class="tutor-line">' + esc(BW.voiceLines.slowDown) + '</p>' : '') +
      '<ol class="process' + (walk != null ? ' walk' : '') + '">' + l.steps.map(function (s, i) { var c = walk == null ? '' : i < walk ? 'seen' : i === walk ? 'now' : ''; return '<li class="pcard ' + c + '"' + (c === 'now' ? ' aria-current="step"' : '') + '><span class="pn" aria-hidden="true">' + (i + 1) + '</span><span>' + H.steps[i] + '</span></li>'; }).join('') + '</ol>' +
      '<div class="row">' + (walk == null ? '<button class="btn small" data-act="walk-start">Walk through one step at a time</button>' :
        '<button class="btn small" data-act="walk-prev"' + (walk === 0 ? ' disabled' : '') + '>Previous step</button><button class="btn small primary" data-act="walk-next">' + (walk >= l.steps.length - 1 ? 'Finish' : 'Next step') + '</button><span class="tiny muted" aria-live="polite">Step ' + (walk + 1) + ' of ' + l.steps.length + '</span>') + '</div></section>' +

      '<section class="section" id="s-predict"><h2><span class="n">??</span> Predict what happens next</h2><div class="card predict" data-mini="predict"></div></section>' +

      '<section class="section" id="s-diagram"><h2>' + sn() + ' Diagram</h2><figure class="fig"><div class="figscroll" tabindex="0" aria-label="Diagram; scroll sideways on small screens">' + BW.diagram(l.diagram) + '</div><figcaption>' + esc(BW.diagramMeta[l.diagram].desc) + ' Original BodyWise diagram; simplified for learning.</figcaption>' +
      '<div class="row"><button class="btn small" data-act="enlarge" data-d="' + l.diagram + '">Enlarge and zoom</button>' + labelDrill(l) + '</div></figure></section>' +
      (id === 'm3-l4' ? '<section class="section" id="s-cardiac"><h2><span class="n">▶</span> Interactive: the cardiac cycle</h2><p class="muted">Step through one heartbeat. Watch which chambers contract, which valves open or close, and where blood moves.</p>' + BW.ui.cardiacHtml() + '</section>' : '') +

      '<section class="section"><h2>' + sn() + ' Everyday analogy and memory trick</h2><div class="pair">' +
      '<div class="card analogy"><span class="eyebrow">Analogy</span><p class="quote">' + esc(alt ? l.altAnalogy : l.analogy) + '</p><p class="tiny muted">Analogies are models. They capture the main idea, not every biological detail.</p><div class="row"><button class="btn small" data-act="alt-analogy">Try a different analogy</button></div></div>' +
      '<div class="card memory"><span class="eyebrow">Memory trick</span><p class="quote">' + esc(BW.memoryTricks[id] || l.summary) + '</p>' + (S.state.prefs.jokes !== false ? '<p class="joke-line">' + esc(l.joke) + '</p>' : '') + '</div></div></section>' +

      '<section class="section" id="s-related"><h2>' + sn() + ' Related systems</h2><p class="muted tiny">Each card opens the lesson that explains that link.</p><div class="relgrid">' + l.connections.map(function (c) {
        var t = L(c.lesson), href = t && t.id !== id ? '#lesson-' + t.id : '#explore-' + c.sys;
        return '<a class="rel rel-link sys-' + c.sys + '" href="' + href + '">' + sysChip(c.sys) + '<p>' + esc(c.text) + '</p><span class="tiny go">' + (t && t.id !== id ? (t.status === 'full' ? 'Lesson ' : 'Outline ') + lessonNo(t) + ': ' + esc(t.title) : 'Open in the body explorer') + ' →</span></a>';
      }).join('') + '</div>' +
      (paths.length ? '<div class="stack"><h3>Where this fits in the body</h3>' + paths.map(function (P) { return BW.ui.pathStrip(P, id); }).join('') + '</div>' : '') +
      '<a class="tiny" href="#connections">See every connection on the body-systems map</a></section>' +
      '<aside class="interlude" aria-label="Quick check"><div data-mini="rel"></div></aside>' +

      '<section class="section"><h2>' + sn() + ' Worked example</h2><div class="card"><h3>' + esc(l.scenario.title) + '</h3><p>' + H.scenario + '</p></div></section>' +
      '<section class="section"><h2>' + sn() + ' Common misconceptions</h2><div class="stack">' + l.misconceptions.map(function (x) { return '<div class="myth"><span class="m"><span class="tag">Myth</span> ' + esc(x.myth) + '</span><span class="f"><span class="tag ok">Actually</span> ' + esc(x.fact) + '</span></div>'; }).join('') + '</div></section>' +
      '<section class="section" id="s-check"><h2>' + sn() + ' Knowledge check</h2><div class="card" data-check><p>' + l.check.length + ' questions. You get an explanation after each answer, right or wrong.</p><div class="row"><button class="btn primary" data-act="lesson-check">Start the check</button></div></div></section>' +
      '<section class="section" id="s-summary"><h2>' + sn() + ' Summary in plain language</h2><div class="card tint"><p>' + H.summary + '</p><div class="row"><button class="btn small" data-act="read-summary">' + icon('speaker') + 'Read summary</button></div></div></section>' +
      '<section class="section"><h2>' + sn() + ' Key terms</h2><div class="terms">' + l.terms.map(function (t) {
        var sv = S.isSavedTerm(t.t);
        return '<div class="term"><span class="t">' + esc(t.t) + '<button class="btn small ghost" data-act="save-term" data-term="' + esc(t.t) + '" aria-pressed="' + sv + '" aria-label="' + (sv ? 'Remove ' : 'Save ') + esc(t.t) + ' to revision">' + (sv ? 'Saved' : 'Save') + '</button></span><span class="muted">' + esc(t.d) + '</span></div>';
      }).join('') + '</div></section>' +
      '<section class="section"><h2>' + sn() + ' Flashcards</h2><p class="muted tiny">Tap a card to flip it. Completing the lesson adds these to your spaced revision deck.</p><div class="cards">' + l.flashcards.map(function (c, i) {
        return '<button class="flip" data-act="flip" data-i="' + i + '" aria-pressed="false"><span class="side">Question</span><span>' + esc(c.q) + '</span></button>';
      }).join('') + '</div></section>' +
      '<section class="section"><h2>' + sn() + ' References</h2><p class="tiny muted">This lesson is an educational summary written for BodyWise, based on the open sources below (links checked 28 Oct 2026). It describes normal physiology unless it says otherwise.</p><ul class="reflist">' + refs.map(function (r) {
        return '<li><a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.title) + '</a><br><span class="org">' + esc(r.org) + (r.licence ? ' · ' + esc(r.licence) : '') + '</span></li>';
      }).join('') + '</ul></section>' +
      '<section class="section"><h2>' + sn() + ' What should I learn next?</h2><div class="card raised nextcard">' +
      (done ? '<p><strong>Lesson complete.</strong> Nice work.</p>' : '<p>When you are happy with this lesson, mark it complete. Its flashcards join your revision deck.</p><div class="row"><button class="btn primary" data-act="complete">' + icon('check') + 'Mark lesson complete</button></div>') +
      (nxt ? '<p>Recommended next: <a href="#lesson-' + nxt.id + '"><strong>Lesson ' + lessonNo(nxt) + ': ' + esc(nxt.title) + '</strong></a>' + (nxt.status !== 'full' ? ' (outline)' : '') + '</p>' : '') +
      '<p class="tiny muted">Or ask the tutor to connect this lesson to something you have already studied.</p><div class="row"><button class="btn small" data-act="ask" data-q="Connect this topic to something I have already learned." data-topic="' + id + '">Connect it for me</button></div></div></section>' +
      '<section class="section"><h2>My notes on this lesson</h2><div class="field"><label for="ln" class="sr-only">Notes for this lesson</label><textarea id="ln" data-lesson-note="' + id + '" maxlength="5000" placeholder="Write it in your own words. Notes save automatically on this device.">' + esc(note ? note.text : '') + '</textarea><span class="hint" data-note-status>' + (note ? 'Saved ' + fmtDate(note.ts) : 'Not saved yet') + '</span></div></section>' +
      '</article>';
    return { html: html, after: function (el) {
      var ctx = function (q) { return Object.assign({ _lesson: l.id, _module: l.module }, q); };
      var slot = function (k) { return el.querySelector('[data-mini="' + k + '"]'); };
      BW.quiz.mount(slot('myth'), [ctx(BW.ui.mythQuestion(l))], { single: true, label: 'Pause and check · True or false?', focus: false, showSource: false });
      BW.quiz.mount(slot('predict'), [ctx(BW.ui.predictQuestion(l))], { single: true, label: 'Use the cause-and-effect chain', focus: false, showSource: false });
      BW.quiz.mount(slot('rel'), [ctx(BW.ui.relationQuestion(l))], { single: true, label: 'Quick check · Connections', focus: false, showSource: false });
      if (id === 'm3-l4') BW.ui.cardiacMount(el);
    } };
  };
  function labelDrill(l) {
    var has = (l.check || []).some(function (q) { return q.type === 'label'; });
    return has ? '<button class="btn small" data-act="label-drill">Test yourself: label it</button>' : '';
  }

  function outlineView(l, m) {
    var siblings = m.lessons.map(function (x) { return L(x.id); }).filter(function (x) { return x.status === 'full'; });
    var html = '<div class="page narrow"><nav class="crumbs" aria-label="Breadcrumb"><a href="#learn">Learn</a><span>›</span><a href="#module-' + m.n + '">Module ' + m.n + '</a><span>›</span><span>Lesson ' + lessonNo(l) + '</span></nav>' +
      '<div class="stack"><p class="eyebrow">Lesson ' + lessonNo(l) + ' · Outline</p><h1>' + esc(l.title) + '</h1><p class="muted">' + esc(l.blurb) + '</p></div>' +
      (l.id === 'm3-l5' ? '<div class="notice info">' + icon('info') + '<span>While this lesson is being written, you can step through one heartbeat in the <a href="#lesson-m3-l4">interactive cardiac cycle in Lesson 3.4</a>.</span></div>' : '') +
      '<div class="notice info">' + icon('info') + '<span>This lesson is in the syllabus but has not been written yet. BodyWise shows it as an outline rather than filling it with unchecked content.</span></div>' +
      (siblings.length ? '<section class="card"><h2>Written lessons in this module</h2><ul class="lessonlist">' + siblings.map(function (s) { return '<li><a href="#lesson-' + s.id + '">Lesson ' + lessonNo(s) + ': ' + esc(s.title) + '</a></li>'; }).join('') + '</ul></section>' : '') +
      '<section class="card"><h2>Meanwhile</h2><p>The open textbook covers this topic in depth. You can also ask the tutor; it will tell you honestly if it has no prepared answer.</p><div class="row"><a class="btn" href="https://openstax.org/books/anatomy-and-physiology-2e/pages/preface" target="_blank" rel="noopener">OpenStax Anatomy and Physiology 2e</a><button class="btn" data-act="ask" data-q="' + esc(l.title) + '">Ask the tutor</button></div></section>' +
      '<div class="row"><a class="btn" href="#module-' + m.n + '">Back to Module ' + m.n + '</a></div></div>';
    return { html: html };
  }

  /* Explore: body explorer */
  function exploreTabs(active) {
    var T = [['explore', 'Body explorer'], ['connections', 'Connection Map'], ['scenarios', 'Scenarios'], ['paths', 'Learning paths']];
    return '<nav class="tabs" aria-label="Explore views">' + T.map(function (t) { return '<a href="#' + t[0] + '"' + (active === t[0] ? ' aria-current="page"' : '') + '>' + t[1] + '</a>'; }).join('') + '</nav>';
  }

  function bodySvg(sel) {
    var out = '<svg viewBox="0 0 240 440" role="group" aria-label="Body diagram with selectable systems">' +
      '<circle cx="120" cy="46" r="30" class="body-sil"/><rect x="108" y="72" width="24" height="20" rx="6" class="body-sil"/>' +
      '<path d="M70,98 Q120,84 170,98 L178,252 Q120,280 62,252 Z" class="body-sil"/>' +
      '<path d="M70,102 L46,116 L30,236 L44,240 L60,142 L68,140 Z" class="body-sil"/><path d="M170,102 L194,116 L210,236 L196,240 L180,142 L172,140 Z" class="body-sil"/>' +
      '<path d="M74,258 L104,268 L106,424 L84,424 Z" class="body-sil"/><path d="M166,258 L136,268 L134,424 L156,424 Z" class="body-sil"/>';
    BW.systems.forEach(function (s) {
      var on = s.id === sel;
      out += '<g class="hot sys-' + s.id + (on ? ' sel' : '') + '" tabindex="0" role="button" aria-pressed="' + on + '" aria-label="' + esc(s.name) + '" data-act="pick-sys" data-sys="' + s.id + '">' +
        '<circle class="ring2" cx="' + s.spot.x + '" cy="' + s.spot.y + '" r="' + (on ? 17 : 14) + '"/><circle class="core" cx="' + s.spot.x + '" cy="' + s.spot.y + '" r="' + (on ? 13 : 10.5) + '"/><text x="' + s.spot.x + '" y="' + (s.spot.y + 3.5) + '" text-anchor="middle">' + s.code + '</text></g>';
    });
    return out + '</svg>';
  }
  VIEWS.explore = function (param) {
    if (param && BW.sysById[param]) ui.explore = param;
    var s = BW.sysById[ui.explore];
    S.markExplored(s.id);
    var rels = BW.relationsFor(s.id);
    var html = '<div class="page"><div class="stack"><p class="eyebrow">Explore</p><h1>Body explorer</h1><p class="muted">Select a system on the body or from the list to see what it does and how it depends on the others. Positions are schematic, not exact anatomy.</p></div>' + exploreTabs('explore') +
      '<div class="explorer"><div class="card bodyfig">' + bodySvg(s.id) + '<div class="syspick" role="group" aria-label="Choose a system">' + BW.systems.map(function (x) {
        return '<button class="sys sys-' + x.id + '" data-act="pick-sys" data-sys="' + x.id + '" aria-pressed="' + (x.id === s.id) + '"><b>' + x.code + '</b>' + esc(x.short) + '</button>';
      }).join('') + '</div><p class="tiny muted">Each system has a two-letter code as well as a colour, so the diagram does not rely on colour alone.</p></div>' +
      '<div class="stack lg" aria-live="polite">' +
      '<section class="card raised"><div class="row">' + sysChip(s.id) + '</div><h2>' + esc(s.name) + '</h2><p>' + esc(s.fn) + '</p>' +
      '<div class="grid two"><div><h3>Main organs and structures</h3><ul class="objectives">' + s.organs.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul></div>' +
      '<div><h3>Key processes</h3><ul class="objectives">' + s.processes.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul></div></div></section>' +
      '<section class="card"><h3>Works closely with</h3><div class="stack">' + rels.map(function (r) {
        return '<div class="rel sys-' + r.other + '"><div class="row">' + sysChip(s.id) + '<span aria-hidden="true">↔</span><button class="sys sys-' + r.other + '" data-act="pick-sys" data-sys="' + r.other + '"><b>' + BW.sysById[r.other].code + '</b>' + esc(BW.sysById[r.other].short) + '</button></div><p>' + esc(r.text) + '</p>' + (L(r.lesson) ? '<a class="tiny" href="#lesson-' + r.lesson + '">Lesson ' + lessonNo(L(r.lesson)) + ': ' + esc(L(r.lesson).title) + '</a>' : '') + '</div>';
      }).join('') + '</div><a class="tiny" href="#connections-' + s.id + '">Show these links on the connections map</a></section>' +
      '<section class="card spark"><span class="eyebrow">What happens if…</span><h3>' + esc(s.scenario.title) + '</h3><p>' + esc(s.scenario.text) + '</p><div class="row"><button class="btn small" data-act="read-scenario">' + icon('speaker') + 'Read aloud</button></div><p class="tiny muted">Describes normal physiology, not a medical condition.</p></section>' +
      '<section class="card"><h3>Relevant lessons</h3><ul class="lessonlist">' + s.lessons.map(function (id) { var t = L(id); return t ? '<li><a href="#lesson-' + id + '">Lesson ' + lessonNo(t) + ': ' + esc(t.title) + '</a> ' + statusDot(id) + '</li>' : ''; }).join('') + '</ul></section>' +
      '<section class="card"><h3>Quick quiz</h3><div data-sysquiz><button class="btn primary small" data-act="sys-quiz">Two quick questions on ' + esc(s.short.toLowerCase()) + '</button></div></section>' +
      '</div></div></div>';
    return { html: html };
  };

  /* Explore: the Body Connection Map */
  function mapSvg(sel, pair) {
    var W = 640, H = 540, cx = 320, cy = 270, R = 205, pos = {}, rN = 30;
    BW.systems.forEach(function (s, i) { var a = (-90 + i * 40) * Math.PI / 180; pos[s.id] = [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-labelledby="mapT mapD"><title id="mapT">Body Connection Map</title><desc id="mapD">Nine body systems arranged in a circle. Lines join systems that work together; lines with arrows at both ends are two-way regulatory feedback loops. ' + (sel ? BW.sysById[sel].name + ' is selected and its ' + BW.relationsFor(sel).length + ' connections are highlighted.' : 'No system is selected.') + '</desc>' +
      '<defs><marker id="mapA" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="map-ah"/></marker></defs>';
    BW.relations.forEach(function (r) {
      var on = sel && (r.a === sel || r.b === sel), isPair = pair && ((r.a === pair[0] && r.b === pair[1]) || (r.a === pair[1] && r.b === pair[0]));
      var p1 = pos[r.a], p2 = pos[r.b], dx = p2[0] - p1[0], dy = p2[1] - p1[1], d = Math.sqrt(dx * dx + dy * dy), ux = dx / d, uy = dy / d;
      var x1 = p1[0] + ux * (rN + 4), y1 = p1[1] + uy * (rN + 4), x2 = p2[0] - ux * (rN + 4), y2 = p2[1] - uy * (rN + 4);
      var cls = 'edge' + (r.loop ? ' loop' : ' supply') + (sel ? (on ? ' on' : ' off') : '') + (isPair ? ' pair' : '');
      svg += '<line class="' + cls + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"' + (r.loop && (!sel || on) ? ' marker-start="url(#mapA)" marker-end="url(#mapA)"' : '') + '/>';
    });
    var linked = sel ? BW.relationsFor(sel).map(function (r) { return r.other; }) : [];
    BW.systems.forEach(function (s) {
      var p = pos[s.id], on = s.id === sel, dim = sel && !on && linked.indexOf(s.id) === -1;
      var lx = p[0] + (p[0] > cx + 5 ? 38 : p[0] < cx - 5 ? -38 : 0), ly = p[1] + (Math.abs(p[0] - cx) < 5 ? (p[1] < cy ? -40 : 52) : 5);
      svg += '<g class="node sys-' + s.id + (on ? ' on' : '') + (dim ? ' dim' : '') + '" data-act="map-pick" data-sys="' + s.id + '">' +
        '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + rN + '"/><text class="code" x="' + p[0] + '" y="' + (p[1] + 5) + '" text-anchor="middle">' + s.code + '</text>' +
        '<text class="nm" x="' + lx + '" y="' + ly + '" text-anchor="' + (p[0] > cx + 5 ? 'start' : p[0] < cx - 5 ? 'end' : 'middle') + '">' + esc(s.short) + '</text></g>';
    });
    return svg + '</svg>';
  }
  function lessonLink(id) {
    var t = L(id); if (!t) return '';
    return '<a href="#lesson-' + id + '">' + (t.status === 'full' ? 'Lesson ' : 'Outline ') + lessonNo(t) + ': ' + esc(t.title) + '</a>' + (t.status === 'full' ? ' ' + statusDot(id) : '');
  }
  VIEWS.connections = function (param) {
    var parts = (param || '').split('-').filter(Boolean), sel = parts[0] && BW.sysById[parts[0]] ? parts[0] : (param === null ? ui.map : null);
    var pair = parts[1] && BW.sysById[parts[1]] ? [parts[0], parts[1]] : null;
    ui.map = sel;
    var S0 = sel && BW.sysById[sel];
    var rels = sel ? BW.relationsFor(sel).map(function (x) { return BW.relationView(sel, BW.relationBetween(sel, x.other)); }) : [];
    if (pair) rels.sort(function (a, b) { return (b.other === pair[1]) - (a.other === pair[1]); });
    var lessonIds = []; if (S0) S0.lessons.concat(rels.map(function (r) { return r.lesson; })).forEach(function (id) { if (lessonIds.indexOf(id) === -1 && L(id)) lessonIds.push(id); });
    var scen = sel ? BW.scenarios.filter(function (sc) { return sc.stages.some(function (st) { return st.systems.indexOf(sel) !== -1; }); }) : [];
    var starters = [['cv', 'rs'], ['cv', 're'], ['ns', 'en'], ['di', 'en'], ['re', 'rs'], ['ms', 'cv'], ['im', 'cv']];

    var panel = !sel ? '<div class="card"><h2>Pick a system</h2><p>Select any system on the map to see what it does, what it receives from the others, what it gives back and how each link works. Start with one of these connections:</p>' +
        '<ul class="pairlist">' + starters.map(function (pr) { var r = BW.relationBetween(pr[0], pr[1]); return '<li><a href="#connections-' + pr[0] + '-' + pr[1] + '">' + sysChip(pr[0]) + '<span aria-hidden="true">' + (r.loop ? '⇄' : '↔') + '</span>' + sysChip(pr[1]) + '</a></li>'; }).join('') + '</ul>' +
        '<p class="tiny muted">The map is a teaching summary of ' + BW.relations.length + ' important relationships, not every interaction in the body.</p></div>'
      : '<div class="card raised"><div class="row">' + sysChip(sel) + '<span class="chip">' + rels.length + ' connections</span></div><h2>' + esc(S0.name) + '</h2><p><strong>What it does:</strong> ' + esc(S0.fn) + '</p>' +
        '<div class="row"><button class="btn small primary" data-act="map-quiz" data-sys="' + sel + '">Quiz me on these connections</button><a class="btn small" href="#explore-' + sel + '">Open in the body explorer</a></div><div data-mapquiz></div></div>' +
        '<h3>Its connections</h3><div class="stack">' + rels.map(function (r) {
          var open = pair ? r.other === pair[1] : false;
          return '<details class="more conn sys-' + r.other + '"' + (open ? ' open' : '') + '><summary>' + sysChip(sel) + '<span class="arr" aria-label="' + (r.loop ? 'two-way feedback loop with' : 'works with') + '">' + (r.loop ? '⇄' : '↔') + '</span>' + sysChip(r.other) + (r.loop ? '<span class="chip accent">feedback loop</span>' : '') + '</summary><div class="inner">' +
            '<p>' + esc(r.text) + '</p>' +
            '<div class="gives"><div class="give"><span class="eyebrow">Receives from ' + esc(BW.sysById[r.other].short) + '</span><p>' + esc(r.receives) + '</p></div><div class="give"><span class="eyebrow">Contributes to ' + esc(BW.sysById[r.other].short) + '</span><p>' + esc(r.gives) + '</p></div></div>' +
            '<p><strong>How it works:</strong> ' + esc(r.mechanism) + '</p>' +
            '<p class="tiny">' + lessonLink(r.lesson) + '</p>' +
            '<div class="row"><button class="btn small" data-act="ask" data-q="Explain the relationship between the ' + esc(BW.sysById[sel].short.toLowerCase()) + ' and ' + esc(BW.sysById[r.other].short.toLowerCase()) + ' systems">Ask the tutor about this link</button><button class="btn small ghost" data-act="map-pick" data-sys="' + r.other + '">Switch to ' + esc(BW.sysById[r.other].short) + '</button></div></div></details>';
        }).join('') + '</div>' +
        '<div class="grid two"><section class="card"><h3>Relevant lessons</h3><ul class="lessonlist">' + lessonIds.map(function (id) { return '<li>' + lessonLink(id) + '</li>'; }).join('') + '</ul></section>' +
        '<section class="card"><h3>Scenarios involving this system</h3><ul class="lessonlist">' + scen.map(function (sc) { return '<li><a href="#scenario-' + sc.id + '">' + esc(sc.title) + '</a></li>'; }).join('') + '</ul></section></div>';

    var html = '<div class="page"><div class="stack"><p class="eyebrow">Explore</p><h1>The Body Connection Map</h1><p class="muted">Physiology is a network, not a list of chapters. Select a system to see what it receives, what it contributes and the mechanism behind each link, or follow a scenario across the body.</p></div>' + exploreTabs('connections') +
      '<div class="mapgrid"><div class="card map"><div class="figscroll">' + mapSvg(sel, pair) + '</div>' +
      '<div class="legend tiny"><span><svg width="34" height="10" aria-hidden="true"><line x1="2" y1="5" x2="32" y2="5" class="lg-loop"/></svg> two-way feedback loop (arrows both ends)</span><span><svg width="34" height="10" aria-hidden="true"><line x1="2" y1="5" x2="32" y2="5" class="lg-supply"/></svg> supply or exchange</span></div>' +
      '<div class="syspick" role="group" aria-label="Choose a system">' + BW.systems.map(function (x) {
        return '<button class="sys sys-' + x.id + '" data-act="map-pick" data-sys="' + x.id + '" aria-pressed="' + (x.id === sel) + '"><b>' + x.code + '</b>' + esc(x.short) + '</button>';
      }).join('') + (sel ? '<button class="btn small ghost" data-act="map-clear">Show all</button>' : '') + '</div></div>' +
      '<div class="stack" aria-live="polite">' + panel + '</div></div></div>';
    return { html: html };
  };

  /* Explore: scenarios */
  VIEWS.scenarios = function (id) {
    var sc = id && BW.scenarioById[id];
    var html = '<div class="page"><div class="stack"><p class="eyebrow">Explore · Scenarios</p><h1>' + (sc ? esc(sc.title) : 'Follow a situation across the body') + '</h1><p class="muted">' + (sc ? esc(sc.summary) : 'Pick a situation and follow the response stage by stage. Each stage shows which systems take part and links to the lesson that explains it.') + '</p></div>' + exploreTabs('scenarios');
    if (!sc) {
      html += '<div class="grid two">' + BW.scenarios.map(function (s) {
        var sys = []; s.stages.forEach(function (st) { st.systems.forEach(function (x) { if (sys.indexOf(x) === -1) sys.push(x); }); });
        return '<a class="card scncard" href="#scenario-' + s.id + '"><h2>' + esc(s.title) + '</h2><p class="muted">' + esc(s.summary) + '</p><div class="row">' + sys.map(function (x) { return sysChip(x); }).join('') + '</div><span class="tiny">' + s.stages.length + ' stages' + (s.loops.length ? ' · ' + s.loops.length + ' feedback loop' + (s.loops.length > 1 ? 's' : '') : '') + '</span></a>';
      }).join('') + '</div>';
      return { html: html + '</div>' };
    }
    var k = ui.scStage && ui.scStage.id === sc.id ? ui.scStage.i : 0;
    var st = sc.stages[k];
    html += '<div class="scngrid"><div class="card"><div class="figscroll" data-scnfig>' + BW.ui.scenarioSvg(sc, k) + '</div>' +
      '<ol class="scnlist" aria-label="Stages (text version)">' + sc.stages.map(function (s, i) { return '<li><button class="scnbtn" data-act="scn-stage" data-i="' + i + '" aria-pressed="' + (i === k) + '"><span class="n">' + (i + 1) + '</span>' + esc(s.title) + '</button></li>'; }).join('') + '</ol></div>' +
      '<div class="stack" aria-live="polite"><section class="card raised"><p class="eyebrow">Stage ' + (k + 1) + ' of ' + sc.stages.length + '</p><h2>' + esc(st.title) + '</h2>' +
      '<div class="row"><span class="tiny muted">Systems involved:</span>' + st.systems.map(function (x) { return sysChip(x, '#connections-' + x); }).join('') + '</div><p>' + esc(st.text) + '</p>' +
      '<p class="tiny">' + lessonLink(st.lesson) + '</p>' +
      '<div class="row"><button class="btn small" data-act="scn-stage" data-i="' + Math.max(0, k - 1) + '"' + (k === 0 ? ' disabled' : '') + '>Previous stage</button><button class="btn small primary" data-act="scn-stage" data-i="' + Math.min(sc.stages.length - 1, k + 1) + '"' + (k === sc.stages.length - 1 ? ' disabled' : '') + '>Next stage</button><button class="btn small ghost" data-act="ask" data-q="' + esc(sc.title.replace(/^I /, 'What happens when I ').replace(/^My /, 'What happens when my ')) + '">Ask the tutor</button></div></section>' +
      (sc.loops.length ? '<section class="card"><h3>Feedback loops</h3><ul class="loopslist">' + sc.loops.map(function (lp, i) { return '<li><span class="lp" aria-hidden="true">↺' + (i + 1) + '</span><span><strong>Stage ' + (Math.min(lp.a, lp.b) + 1) + ' ⇄ stage ' + (Math.max(lp.a, lp.b) + 1) + '.</strong> ' + esc(lp.label) + '</span></li>'; }).join('') + '</ul></section>' : '') +
      '<div class="notice info">' + icon('info') + '<span><strong>Simplified sequence.</strong> Several stages overlap in time and some intermediate steps are left out.' + (sc.note ? ' ' + esc(sc.note) : '') + '</span></div>' +
      '<section class="card"><h3>Check yourself</h3><div data-scnq></div></section>' +
      (sc.next ? '<a class="btn" href="#scenario-' + sc.next + '">Then: ' + esc(BW.scenarioById[sc.next].title) + '</a>' : '') +
      '</div></div><a class="tiny" href="#scenarios">All scenarios</a>';
    return { html: html + '</div>', after: function (el) {
      BW.quiz.mount(el.querySelector('[data-scnq]'), [{ id: 'scenario-' + sc.id, type: 'mcq', prompt: sc.check.prompt, options: sc.check.options, answer: sc.check.answer, explain: sc.check.explain, _lesson: sc.stages[0].lesson, _module: L(sc.stages[0].lesson).module }], { single: true, label: 'Scenario check', focus: false, showSource: false });
    } };
  };

  /* Explore: learning paths */
  VIEWS.paths = function (pid) {
    var P = pid && BW.paths.filter(function (p) { return p.id === pid; })[0];
    var html = '<div class="page"><div class="stack"><p class="eyebrow">Explore</p><h1>' + (P ? esc(P.title) : 'Cross-system learning paths') + '</h1><p class="muted">' + (P ? esc(P.blurb) : 'Follow one event through several systems, step by step. Each step links to the lesson that explains it.') + '</p></div>' + exploreTabs('paths');
    if (!P) {
      html += '<div class="grid two">' + BW.paths.map(function (p) {
        var sys = p.steps.map(function (s) { return s.sys; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
        return '<a class="card" href="#path-' + p.id + '" style="text-decoration:none;color:inherit"><h2>' + esc(p.title) + '</h2><p class="muted">' + esc(p.blurb) + '</p><div class="row">' + sys.map(function (s) { return sysChip(s); }).join('<span aria-hidden="true">→</span>') + '</div></a>';
      }).join('') + '</div>';
    } else {
      html += BW.ui.pathStrip(P, null, { title: false }) + '<section class="card"><ol class="pathsteps">' + P.steps.map(function (s, i) {
        var t = L(s.lesson);
        return '<li class="sys-' + s.sys + '"><span class="pin" aria-hidden="true">' + BW.sysById[s.sys].code + '</span><div class="stack" style="gap:4px"><span class="eyebrow">Step ' + (i + 1) + ' · ' + esc(BW.sysById[s.sys].short) + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p>' + (t ? '<a class="tiny" href="#lesson-' + t.id + '">' + (t.status === 'full' ? 'Lesson ' : 'Outline ') + lessonNo(t) + ': ' + esc(t.title) + '</a>' : '') + '</div></li>';
      }).join('') + '</ol></section>' +
        '<section class="card tint"><span class="eyebrow">Check yourself</span><h3>' + esc(P.check.q) + '</h3><details class="more"><summary>Show the answer</summary><div class="inner"><p>' + esc(P.check.a) + '</p></div></details></section>' +
        '<div class="row"><button class="btn small" data-act="read-path" data-path="' + P.id + '">' + icon('speaker') + 'Read the path aloud</button><a class="btn small" href="#paths">All paths</a></div>';
    }
    return { html: html + '</div>' };
  };

  /* Tutor */
  function mistakesMap() {
    var latest = {};
    S.state.attempts.slice(-80).forEach(function (a) { if (a.lesson) latest[a.qid] = a; });
    var m = {};
    Object.keys(latest).forEach(function (q) { var a = latest[q]; if (!a.correct) (m[a.lesson] = m[a.lesson] || []).push(q); });
    return m;
  }
  function tutorCtx() {
    var done = Object.keys(S.state.lessons).filter(function (id) { return S.isComplete(id); });
    var cur = S.state.tutor.currentLesson, notes = {};
    Object.keys(S.state.notes.lessons).forEach(function (id) { notes[id] = S.state.notes.lessons[id].text; });
    var lt = S.state.tutor.lastTopic; if (lt && lt.indexOf(':') === -1) lt = 'lesson:' + lt;
    return { lastTopic: lt, lastMode: S.state.tutor.lastMode, pending: S.state.tutor.pending || null, currentLesson: cur, currentModule: cur && L(cur) ? L(cur).module : null,
      completed: done, mode: S.state.prefs.teachMode || 'auto', prefs: S.state.prefs, mistakes: mistakesMap(), notes: notes,
      turn: S.state.tutor.history.length, history: S.state.tutor.history.map(function (h) { return { role: h.role === 'me' ? 'user' : 'assistant', text: h.text || (h.resp && h.resp.speak) || '' }; }) };
  }
  function relCards(items) {
    return '<div class="relgrid">' + items.map(function (r) { return '<div class="rel sys-' + r.sys + '">' + sysChip(r.sys) + '<p class="tiny">' + esc(r.text) + '</p></div>'; }).join('') + '</div>';
  }
  function renderParts(resp, live) {
    return resp.parts.map(function (p, i) {
      switch (p.t) {
        case 'p': return '<p' + (p.cls ? ' class="' + p.cls + '"' : '') + '>' + esc(p.text) + '</p>';
        case 'h': return '<h3 class="th">' + esc(p.text) + '</h3>';
        case 'note': return '<div class="notice info">' + icon('info') + '<span>' + esc(p.text) + '</span></div>';
        case 'steps': return '<ol class="tsteps">' + p.items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' + (p.more ? '<p class="tiny muted">' + esc(p.more) + '.</p>' : '');
        case 'list': return '<ul>' + p.items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
        case 'rel': return relCards(p.items);
        case 'terms': return '<dl class="tterms">' + p.items.map(function (x) { return '<dt>' + esc(x.t) + '</dt><dd>' + esc(x.d) + '</dd>'; }).join('') + '</dl>';
        case 'analogy': return '<div class="t-analogy"><span class="eyebrow">' + esc(p.label || 'Think of it like this') + '</span><p class="quote">' + esc(p.text) + '</p>' + (p.limit ? '<p class="tiny"><strong>Where this analogy stops being accurate:</strong> ' + esc(p.limit) + '</p>' : '') + '</div>';
        case 'diagram': return '<figure class="fig"><div class="figscroll" tabindex="0" aria-label="Diagram; scroll sideways on small screens">' + BW.diagram(p.key) + '</div><figcaption>' + esc(BW.diagramMeta[p.key].desc) + '</figcaption><div class="row"><button class="btn small" data-act="enlarge" data-d="' + p.key + '">Enlarge and zoom</button></div></figure>';
        case 'flow': return '<ol class="tflow sys-' + (p.sys || 'cv') + '" aria-label="Process map">' + p.items.map(function (x, k) { return '<li><span class="fn" aria-hidden="true">' + (k + 1) + '</span><span>' + esc(x) + '</span></li>'; }).join('') + '</ol>';
        case 'path': var P = BW.paths.filter(function (x) { return x.id === p.id; })[0]; return P ? BW.ui.pathStrip(P, p.lesson) : '';
        case 'scenario': var sc = BW.scenarioById[p.id]; return sc ? '<div class="figscroll scn-mini">' + BW.ui.scenarioSvg(sc, -1) + '</div>' : '';
        case 'chain': return '<ol class="chain">' + p.items.map(function (x, k) {
            return '<li><div class="row">' + x.systems.map(function (s) { return sysChip(s); }).join('') + '</div><strong>' + esc(x.title) + '</strong><span>' + esc(x.text) + '</span>' + (x.lesson && L(x.lesson) ? '<a class="tiny" href="#lesson-' + x.lesson + '">' + esc(L(x.lesson).title) + '</a>' : '') + (k < p.items.length - 1 ? '<span class="leads" aria-hidden="true">leads to ↓</span>' : '') + '</li>';
          }).join('') + '</ol>';
        case 'loops': return '<div class="loops"><span class="eyebrow">Feedback loops</span><ul>' + p.items.map(function (x) { return '<li><span aria-hidden="true">⇄</span> ' + esc(x) + '</li>'; }).join('') + '</ul></div>';
        case 'gives': return '<div class="gives"><div class="give">' + sysChip(p.a) + '<span class="arrow" aria-hidden="true">→</span>' + sysChip(p.b) + '<p>' + esc(p.ab) + '</p></div><div class="give">' + sysChip(p.b) + '<span class="arrow" aria-hidden="true">→</span>' + sysChip(p.a) + '<p>' + esc(p.ba) + '</p></div></div>';
        case 'progress': return '<div class="tprog"><span class="tiny muted">' + esc(p.title) + ' · step ' + p.at + ' of ' + p.of + '</span><div class="bar"><span style="width:' + Math.round(p.at / p.of * 100) + '%"></span></div></div>';
        case 'check': return '<div class="tcheck"><span class="eyebrow">' + esc(p.intro) + '</span>' + (p.scenario ? '<p class="scenario-stem">' + esc(p.scenario) + '</p>' : '') + '<p class="tq">' + esc(p.prompt) + '</p>' +
            (p.typed ? (live ? '<p class="tiny muted">Type your answer in the box below and press send.</p>' : '') :
              (live ? '<div class="topts">' + p.options.map(function (o, k) { return '<button class="btn topt" data-act="tutor-answer" data-i="' + k + '"><b>' + 'ABCD'[k] + '</b>' + esc(o) + '</button>'; }).join('') + '</div>'
                : '<ol class="tiny muted" type="A">' + p.options.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ol>')) + '</div>';
        case 'answer': return '';
        case 'modes': return '<div class="remode"><span class="tiny muted">Explain this again as:</span><div class="prompts">' + BW.tutor.modes.filter(function (m) { return m.id !== 'auto' && m.id !== p.current; }).map(function (m) { return '<button class="btn small" data-act="tutor-remode" data-mode="' + m.id + '">' + esc(m.label) + '</button>'; }).join('') + '</div></div>';
        case 'links': return '<div class="row">' + p.items.map(function (x) { return '<a class="btn small" href="' + esc(x.href) + '">' + esc(x.label) + '</a>'; }).join('') + (p.diagram ? '<button class="btn small" data-act="show-diagram" data-d="' + p.diagram + '">Show the diagram</button>' : '') + '</div><div data-diagram-slot></div>';
        case 'chips': return '<div class="prompts">' + p.items.map(function (x) { return '<button class="btn small" data-act="ask" data-q="' + esc(x) + '">' + esc(x) + '</button>'; }).join('') + '</div>';
        case 'quiz': return '<div class="card flat" data-tquiz="' + i + '"></div>';
        case 'live': return '<div class="prose">' + p.text.split(/\n{2,}/).map(function (para) { return '<p>' + esc(para) + '</p>'; }).join('') + '</div>';
      }
      return '';
    }).join('');
  }
  function msgHtml(h, idx, lastBot) {
    if (h.role === 'me') return '<div class="msg me"><span class="sr-only">You said: </span>' + esc(h.text) + '</div>';
    var r = h.resp, label = r.source === 'live' ? '<span class="chip good">Live AI · your backend</span>' : r.source === 'system' ? '<span class="chip warn">BodyWise safety note</span>' : '<span class="chip accent">Demo tutor · built from BodyWise lessons, not live AI</span>';
    var mode = r.mode && r.source === 'demo' ? '<span class="chip">' + esc((BW.tutor.modes.filter(function (m) { return m.id === r.mode; })[0] || {}).label || r.mode) + ' mode</span>' : '';
    var active = idx === lastBot && S.state.tutor.pending;
    return '<div class="msg bot" data-msg="' + idx + '"><div class="who">' + label + mode + (V.ttsSupported ? '<button class="btn small ghost" data-act="read-msg" data-i="' + idx + '">' + icon('speaker') + 'Read aloud</button>' : '') + '</div>' + renderParts(r, !!active) + '</div>';
  }
  VIEWS.tutor = function () {
    var p = S.state.prefs, hist = S.state.tutor.history, liveOn = p.tutorMode === 'live' && p.tutorEndpoint, tm = p.teachMode || 'auto';
    var lastBot = -1; hist.forEach(function (h, i) { if (h.role === 'bot') lastBot = i; });
    var sugg = BW.tutor.suggestions.map(function (x) { return '<button type="button" class="btn small" data-act="ask" data-q="' + esc(x) + '">' + esc(x) + '</button>'; }).join('');
    var modeInfo = BW.tutor.modes.filter(function (m) { return m.id === tm; })[0];
    var pend = S.state.tutor.pending;
    var html = '<div class="page narrow tutor"><div class="stack"><p class="eyebrow">Tutor room</p><h1>Ask your physiology tutor</h1>' +
      '<p class="muted">Ask in your own words. The tutor gives a short answer, explains the mechanism, connects it to other systems, then checks your understanding and adapts if you get stuck. It teaches from BodyWise lessons: it is a demo, not live AI, and it says when it does not know.</p>' +
      '<div class="field"><span class="label" id="tmode-l">Teaching mode</span><div class="seg modes" role="group" aria-labelledby="tmode-l">' + BW.tutor.modes.map(function (m) { return '<button data-act="teach-mode" data-mode="' + m.id + '" aria-pressed="' + (tm === m.id) + '" title="' + esc(m.blurb) + '">' + esc(m.label) + '</button>'; }).join('') + '</div><span class="hint">' + esc(modeInfo.blurb) + ' You can change mode at any point; the conversation continues.</span></div>' +
      '<div class="row">' + (p.tutorEndpoint ? '<div class="seg" role="group" aria-label="Tutor source"><button data-act="tutor-mode" data-m="demo" aria-pressed="' + !liveOn + '">Demo tutor</button><button data-act="tutor-mode" data-m="live" aria-pressed="' + !!liveOn + '">Live backend</button></div>' : '<a class="tiny" href="#preferences">Connect a live tutor backend (optional)</a>') +
      (hist.length ? '<button class="btn small ghost" data-act="tutor-clear">Clear conversation</button>' : '') + '</div></div>' +
      '<div class="chat" data-chat>' + (hist.length ? hist.map(function (h, i) { return msgHtml(h, i, lastBot); }).join('') : '<div class="empty"><strong>Try one of these to start</strong><div class="prompts">' + sugg + '</div><span class="muted">Or type your own question below.</span></div>') + '</div>' +
      (hist.length ? '<details class="more"><summary>Suggested questions</summary><div class="inner"><div class="prompts">' + sugg + '</div></div></details>' : '') +
      '<form class="composer" data-form="tutor">' +
      '<p class="err" role="alert" data-terr></p><span data-listen aria-live="polite"></span>' +
      (pend ? '<p class="tiny pending-hint">' + (pend.q && pend.q.type === 'short' ? 'Type your answer below.' : 'Tap an answer above, or ask something new.') + '</p>' : '') +
      '<div class="box"><label for="tq" class="sr-only">Your question or answer</label><textarea id="tq" rows="1" maxlength="1000" placeholder="' + (pend ? 'Your answer, or a new question…' : 'Ask a question…') + '"></textarea>' +
      '<button type="button" class="iconbtn" data-act="mic" aria-pressed="false" aria-label="' + (V.sttSupported ? 'Ask by speaking' : 'Voice input not supported in this browser') + '"' + (V.sttSupported ? '' : ' title="Voice input is not supported in this browser"') + '>' + icon('mic') + '</button>' +
      '<button class="iconbtn" type="submit" aria-label="Send" style="background:var(--accent);color:var(--accent-ink);border-color:var(--accent)">' + icon('send') + '</button></div>' +
      '</form><p class="tiny muted">Educational only, not medical advice. For health concerns, talk to a health worker.' + (V.sttSupported ? '' : ' Voice input is not available in this browser; typing works everywhere.') + ' The tutor uses progress saved in this browser; it has no memory beyond that.</p></div>';
    return { html: html, after: function (el) {
      mountTutorQuizzes(el);
      if (ui.pendingPrompt) { var q = ui.pendingPrompt; ui.pendingPrompt = null; askTutor(q); }
      var last = el.querySelector('.msg:last-of-type'); if (last && hist.length) last.scrollIntoView({ block: 'nearest' });
    } };
  };
  function mountTutorQuizzes(el) {
    el.querySelectorAll('.msg.bot').forEach(function (m) {
      var h = S.state.tutor.history[Number(m.getAttribute('data-msg'))];
      m.querySelectorAll('[data-tquiz]').forEach(function (slot) {
        var part = h.resp.parts[Number(slot.getAttribute('data-tquiz'))];
        BW.quiz.mount(slot, part.questions, { label: 'Tutor check', focus: false });
      });
    });
  }
  function pushHist(item) {
    var hh = S.state.tutor.history; hh.push(item);
    if (hh.length > 40) hh.splice(0, hh.length - 40);
  }
  function tutorFinish(resp) {
    var T = S.state.tutor;
    if (resp.record) S.recordAttempt(resp.record.qid, resp.record.lesson, resp.record.module, resp.record.correct);
    if (resp.setMode) S.state.prefs.teachMode = resp.setMode;
    if (!resp.keepPending) T.pending = resp.pending || null;
    if (resp.topic) T.lastTopic = resp.topic;
    if (resp.mode) T.lastMode = resp.mode;
    pushHist({ role: 'bot', resp: resp, ts: Date.now() });
    S.logActivity(); S.save();
    if (current.view === 'tutor') { rerender(); var msgs = main.querySelectorAll('.msg.bot'); var last = msgs[msgs.length - 1]; if (last) last.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }); }
  }
  function askTutor(q) {
    q = String(q || '').trim();
    var err = main.querySelector('[data-terr]');
    if (!q) { if (err) err.textContent = 'Type a question first, or tap the microphone to speak.'; return; }
    if (q.length > 1000) { if (err) err.textContent = 'Please keep questions under 1,000 characters.'; return; }
    if (err) err.textContent = '';
    var ctx = tutorCtx(), p = S.state.prefs;
    pushHist({ role: 'me', text: q, ts: Date.now() });
    if (p.tutorMode === 'live' && p.tutorEndpoint && !(ctx.pending && BW.tutor.isAnswerLike(q, ctx.pending))) {
      S.save(); rerender();
      var chat = main.querySelector('[data-chat]'); if (chat) chat.insertAdjacentHTML('beforeend', '<div class="msg bot" data-pending><span class="muted">Asking your backend…</span></div>');
      BW.tutor.live(q, ctx).then(function (j) {
        tutorFinish({ source: 'live', parts: [{ t: 'live', text: j.answer }], speak: j.answer });
      }).catch(function (e) {
        var demo = BW.tutor.respond(q, ctx);
        demo.parts.unshift({ t: 'note', text: e.message + ' Showing the demo tutor’s answer instead.' });
        tutorFinish(demo);
      });
    } else tutorFinish(BW.tutor.respond(q, ctx));
  }
  function answerTutor(i) {
    var ctx = tutorCtx(), pend = ctx.pending; if (!pend) return;
    var q = pend.q, txt = q.type === 'tf' ? (i === 0 ? 'True' : 'False') : q.options[i];
    pushHist({ role: 'me', text: 'My answer: ' + txt, ts: Date.now() });
    tutorFinish(BW.tutor.answer(pend, i, ctx));
  }
  function remodeTutor(mode) {
    var ctx = tutorCtx(), name = (BW.tutor.modes.filter(function (m) { return m.id === mode; })[0] || {}).label || mode;
    if (!ctx.lastTopic) { S.setPref('teachMode', mode); rerender(); toast(name + ' mode selected. Ask a question to begin.'); return; }
    pushHist({ role: 'me', text: 'Explain that again in ' + name.toLowerCase() + ' mode.', ts: Date.now() });
    var r = BW.tutor.explainTopic(ctx.lastTopic, mode, ctx);
    tutorFinish(r || BW.tutor.respond('explain ' + mode, ctx));
  }

  /* Practice */
  function questionsFor(kind, arg) {
    var all = BW.quiz.allQuestions(), studied = Object.keys(S.state.lessons);
    if (kind === 'module') return all.filter(function (q) { return q._module === arg; });
    if (kind === 'type') return all.filter(function (q) { return q.type === arg; });
    if (kind === 'weak') { var ids = S.needsRevision().map(function (r) { return r.id; }); return all.filter(function (q) { return ids.indexOf(q._lesson) !== -1; }); }
    if (kind === 'mixed') { var mine = all.filter(function (q) { return studied.indexOf(q._lesson) !== -1; }); return mine.length >= 5 ? mine : all; }
    return all;
  }
  VIEWS.practice = function (param) {
    if (param === 'cards') return cardsView();
    var due = S.dueCards(), total = Object.keys(S.state.cards).length, weak = S.needsRevision();
    var nd = S.nextDue();
    var mods = BW.modules.map(function (m) { return { m: m, n: questionsFor('module', m.id).length }; }).filter(function (x) { return x.n; });
    var types = [['label', 'Label the diagram'], ['scenario', 'Scenario questions'], ['tf', 'True or false'], ['short', 'Short answers'], ['mcq', 'Multiple choice']];
    var html = '<div class="page"><div class="stack"><p class="eyebrow">Practice</p><h1>Quizzes and revision</h1><p class="muted">Every answer comes with an explanation. Results feed your progress page and flag topics that need another look.</p></div>' +
      '<div data-practice-stage></div>' +
      '<div class="grid two" data-practice-menu>' +
      '<section class="card tint"><span class="eyebrow">Flashcards</span>' + (total ? '<h2>' + due.length + ' due now</h2><p class="muted">' + total + ' cards in your deck. ' + (due.length ? '' : 'Next card due ' + (nd ? fmtDate(nd) : 'soon') + '.') + '</p>' + (due.length ? '<a class="btn primary" href="#practice-cards">Review flashcards</a>' : '<a class="btn" href="#practice-cards">Review anyway</a>') :
        '<h2>Your deck is empty</h2><p class="muted">Complete a lesson or save a key term and its cards are added here.</p><a class="btn" href="#learn">Find a lesson</a>') +
      '<p class="tiny muted">Simple spaced repetition: cards you know come back after 1, 3, 7, 14 then 30 days; cards you miss come back soon. It is a well-known schedule, not a personalised algorithm.</p></section>' +
      '<section class="card"><span class="eyebrow">Revision quiz</span>' + (weak.length ? '<h2>' + weak.length + ' topic' + (weak.length > 1 ? 's' : '') + ' to strengthen</h2><p class="muted">' + weak.slice(0, 3).map(function (w) { return esc(L(w.id).title); }).join(', ') + '</p><button class="btn primary" data-act="start-quiz" data-kind="weak" data-label="Revision quiz">Start revision quiz</button>' :
        '<h2>Nothing to revise yet</h2><p class="muted">After you answer questions, topics where you score below 70% appear here.</p>') + '</section>' +
      '<section class="card"><span class="eyebrow">Mixed quiz</span><h2>10 questions</h2><p class="muted">Drawn from lessons you have opened' + (Object.keys(S.state.lessons).length ? '' : ' (or from every lesson, since you have not started any yet)') + '.</p><button class="btn primary" data-act="start-quiz" data-kind="mixed" data-label="Mixed quiz">Start mixed quiz</button></section>' +
      '<section class="card"><span class="eyebrow">Question drills</span><div class="stack">' + types.map(function (t) { var n = questionsFor('type', t[0]).length; return '<button class="btn" data-act="start-quiz" data-kind="type" data-arg="' + t[0] + '" data-label="' + t[1] + '">' + t[1] + ' <span class="chip">' + n + '</span></button>'; }).join('') + '</div></section>' +
      '</div>' +
      '<section class="stack" data-practice-mods><h2>Module quizzes</h2><div class="grid">' + mods.map(function (x) {
        var st = S.moduleStats(x.m.id);
        return '<div class="card"><span class="eyebrow">Module ' + x.m.n + '</span><h3>' + esc(x.m.title) + '</h3><p class="tiny muted">' + x.n + ' questions available' + (st.attempts ? ' · recent accuracy ' + Math.round(st.acc * 100) + '%' : '') + '</p><button class="btn small" data-act="start-quiz" data-kind="module" data-arg="' + x.m.id + '" data-label="Module ' + x.m.n + ' quiz">Start</button></div>';
      }).join('') + '</div></section></div>';
    return { html: html, after: function () { if (ui.autoQuiz) { var a = ui.autoQuiz; ui.autoQuiz = null; startQuiz(a[0], a[1], a[2]); } } };
  };
  function startQuiz(kind, arg, label) {
    var pool = questionsFor(kind, arg);
    var qs = BW.quiz.shuffle(pool).slice(0, kind === 'type' ? 8 : 10);
    var stage = main.querySelector('[data-practice-stage]');
    main.querySelector('[data-practice-menu]').hidden = true;
    var mods = main.querySelector('[data-practice-mods]'); if (mods) mods.hidden = true;
    stage.innerHTML = '<section class="card raised"><div class="row between"><h2>' + esc(label) + '</h2><button class="btn small" data-act="quit-quiz">Back to practice</button></div><div data-q-slot></div></section>';
    BW.quiz.mount(stage.querySelector('[data-q-slot]'), qs, { label: label, ref: kind + ':' + (arg || ''), after: '<button class="btn" data-act="quit-quiz">Back to practice</button>' });
    stage.scrollIntoView({ block: 'start' });
  }
  function cardText(id) {
    if (id.indexOf('term:') === 0) {
      var term = id.slice(5), def = '';
      BW.allLessons.forEach(function (l) { (l.terms || []).forEach(function (t) { if (t.t === term) def = t.d; }); });
      return { q: 'Define: ' + term, a: def || 'Definition not found.', src: null };
    }
    var parts = id.split('#'), l = L(parts[0]), c = l && l.flashcards && l.flashcards[Number(parts[1])];
    return c ? { q: c.q, a: c.a, src: l } : null;
  }
  function cardsView() {
    var ids = S.dueCards();
    if (!ids.length) ids = Object.keys(S.state.cards).sort(function (a, b) { return S.state.cards[a].due - S.state.cards[b].due; }).slice(0, 10);
    ids = ids.filter(function (id) { return cardText(id); });
    ui.cards = { ids: ids, i: 0, shown: false, knew: 0 };
    return { html: '<div class="page narrow"><nav class="crumbs"><a href="#practice">Practice</a><span>›</span><span>Flashcards</span></nav><h1>Flashcard review</h1><div data-cards></div></div>', after: renderCard };
  }
  function renderCard() {
    var box = main.querySelector('[data-cards]'), c = ui.cards; if (!box) return;
    if (!c.ids.length) { box.innerHTML = '<div class="empty"><strong>No flashcards yet.</strong><span>Complete a lesson or save key terms to build your deck.</span><a class="btn" href="#learn">Go to lessons</a></div>'; return; }
    if (c.i >= c.ids.length) {
      box.innerHTML = '<section class="card raised"><h2>Review finished</h2><p>You knew ' + c.knew + ' of ' + c.ids.length + '. Cards you knew move to a longer gap; the others come back soon.</p><div class="row"><a class="btn primary" href="#practice">Back to practice</a><a class="btn" href="#home">Home</a></div></section>';
      return;
    }
    var id = c.ids[c.i], t = cardText(id), st = S.state.cards[id];
    box.innerHTML = '<section class="card raised" aria-live="polite"><div class="row between"><span class="eyebrow">Card ' + (c.i + 1) + ' of ' + c.ids.length + '</span><span class="chip">Box ' + st.box + ' of 5</span></div>' +
      '<p class="quote">' + esc(t.q) + '</p>' + (c.shown ? '<div class="feedback neutral"><p>' + esc(t.a) + '</p>' + (t.src ? '<a class="tiny" href="#lesson-' + t.src.id + '">From: ' + esc(t.src.title) + '</a>' : '') + '</div>' +
        '<div class="row"><button class="btn" data-act="card-no">Not yet</button><button class="btn primary" data-act="card-yes">I knew it</button></div>' :
        '<div class="row"><button class="btn primary" data-act="card-show">Show answer</button></div>') + '</section>';
    var f = box.querySelector('.btn.primary'); if (f) f.focus({ preventScroll: true });
  }

  /* Progress */
  VIEWS.progress = function () {
    var comp = S.completion(), streak = S.streak(), rev = S.needsRevision();
    var topics = {}; S.state.attempts.forEach(function (a) { if (a.lesson) topics[a.lesson] = 1; });
    var tlist = Object.keys(topics).map(function (id) { return { id: id, st: S.lessonStats(id) }; }).sort(function (a, b) { return a.st.acc - b.st.acc; });
    var boxes = [0, 0, 0, 0, 0]; Object.keys(S.state.cards).forEach(function (k) { boxes[S.state.cards[k].box - 1]++; });
    var days = ''; for (var k = 27; k >= 0; k--) { var d = S._today(Date.now() - k * 86400000); days += '<span class="' + (S.state.activity.indexOf(d) !== -1 ? 'on' : '') + (k === 0 ? ' today' : '') + '" title="' + d + '"></span>'; }
    var started = Object.keys(S.state.lessons).length;
    var html = '<div class="page"><div class="stack"><p class="eyebrow">Progress</p><h1>Your progress and revision</h1><p class="muted">Everything here comes from what you have done in this browser. Nothing is estimated or invented.</p></div>' +
      (!S.available ? '<div class="notice">' + icon('warn') + '<span>This browser is blocking storage, so progress will be lost when you close the page. Use a normal (not private) window, or copy a backup code from Preferences.</span></div>' : '') +
      '<div class="grid">' +
      '<section class="card"><span class="eyebrow">Lessons</span><div class="statline"><span class="n mono">' + comp.done + '/' + comp.total + '</span><span class="muted">written lessons complete</span></div><div class="bar"><span style="width:' + comp.pct + '%"></span></div><p class="tiny muted">' + started + ' lesson' + (started === 1 ? '' : 's') + ' opened. ' + comp.syllabus + ' lessons in the full syllabus.</p></section>' +
      '<section class="card"><span class="eyebrow">Study days</span><div class="statline"><span class="n mono">' + streak + '</span><span class="muted">day streak · ' + S.state.activity.length + ' study days total</span></div><div class="days">' + days + '</div><p class="tiny muted">Last four weeks.</p></section>' +
      '<section class="card"><span class="eyebrow">Answers</span><div class="statline"><span class="n mono">' + S.state.attempts.length + '</span><span class="muted">questions answered</span></div>' + (S.state.attempts.length ? '<p class="tiny muted">' + Math.round(S.state.attempts.filter(function (a) { return a.correct; }).length / S.state.attempts.length * 100) + '% correct overall.</p>' : '<p class="tiny muted">No answers yet.</p>') + '</section>' +
      '</div>' +
      '<section class="card"><h2>Modules</h2><div class="stack">' + BW.modules.map(function (m) {
        var full = m.lessons.filter(function (l) { return L(l.id).status === 'full'; }); var done = full.filter(function (l) { return S.isComplete(l.id); }).length;
        return '<div class="row between"><a href="#module-' + m.n + '">' + m.n + '. ' + esc(m.title) + '</a><span class="tiny mono">' + done + '/' + full.length + ' written</span></div>' + (full.length ? '<div class="bar"><span style="width:' + (done / full.length * 100) + '%"></span></div>' : '');
      }).join('') + '</div></section>' +
      '<div class="grid two">' +
      '<section class="card"><h2>Performance by topic</h2>' + (tlist.length ? '<div class="stack">' + tlist.map(function (t) {
        var pct = Math.round(t.st.acc * 100), cls = pct >= 70 ? 'good' : pct >= 40 ? 'warn' : 'bad';
        return '<div class="stack" style="gap:4px"><div class="row between"><a href="#lesson-' + t.id + '">' + esc(L(t.id).title) + '</a><span class="chip ' + cls + '">' + pct + '% of last ' + t.st.attempts + '</span></div><div class="bar ' + cls + '"><span style="width:' + pct + '%"></span></div></div>';
      }).join('') + '</div>' : '<div class="empty">Answer some questions and your accuracy per topic will appear here.<a class="btn small" href="#practice">Go to practice</a></div>') + '</section>' +
      '<section class="card"><h2>Needs revision</h2>' + (rev.length ? '<ul class="lessonlist">' + rev.map(function (r) { return '<li class="row between"><a href="#lesson-' + r.id + '">' + esc(L(r.id).title) + '</a><span class="chip warn">' + Math.round(r.acc * 100) + '%</span></li>'; }).join('') + '</ul><button class="btn small primary" data-act="go-weak">Start a revision quiz</button>' : '<p class="muted">Nothing flagged. A topic is flagged when at least two recent answers average under 70%.</p>') +
      '<h3 style="margin-top:12px">Flashcard boxes</h3>' + (Object.keys(S.state.cards).length ? '<div class="stack">' + boxes.map(function (n, i) { return '<div class="row between tiny"><span>Box ' + (i + 1) + (i === 0 ? ' (learning)' : i === 4 ? ' (strong)' : '') + '</span><span class="mono">' + n + '</span></div>'; }).join('') + '</div><a class="btn small" href="#practice-cards">Review cards</a>' : '<p class="muted">No flashcards yet.</p>') + '</section>' +
      '</div>' +
      '<section class="card"><h2>Recent quizzes</h2>' + (S.state.quizzes.length ? '<ul class="lessonlist">' + S.state.quizzes.slice(-10).reverse().map(function (q) { return '<li class="row between"><span>' + esc(q.label) + ' <span class="tiny muted">' + fmtDate(q.ts) + '</span></span><span class="mono">' + q.score + '/' + q.total + '</span></li>'; }).join('') + '</ul>' : '<p class="muted">No quizzes completed yet.</p>') + '</section></div>';
    return { html: html };
  };

  /* Notes */
  VIEWS.notes = function () {
    var f = ui.notesFilter.toLowerCase();
    function match(s) { return !f || String(s).toLowerCase().indexOf(f) !== -1; }
    var free = S.state.notes.free.filter(function (n) { return match(n.text); });
    var lessonNotes = Object.keys(S.state.notes.lessons).filter(function (id) { return L(id) && (match(S.state.notes.lessons[id].text) || match(L(id).title)); });
    var savedL = S.state.saved.lessons.filter(function (id) { return L(id) && match(L(id).title); });
    var terms = S.state.saved.terms.filter(match);
    function defOf(term) { var d = ''; BW.allLessons.forEach(function (l) { (l.terms || []).forEach(function (t) { if (t.t === term) d = t.d; }); }); return d; }
    var html = '<div class="page narrow"><div class="stack"><p class="eyebrow">Notes</p><h1>My notes and saved concepts</h1><p class="muted">Notes stay in this browser. Save lessons with the star button and key terms from any lesson.</p></div>' +
      '<div class="field"><label for="nf">Search notes and saved items</label><input id="nf" type="search" value="' + esc(ui.notesFilter) + '" placeholder="For example: kidney"></div>' +
      '<form class="card" data-form="note"><label for="nn" class="label">New note</label><textarea id="nn" maxlength="5000" placeholder="Something you want to remember, a question for later, a connection you noticed…"></textarea><p class="err" role="alert" data-nerr></p><div class="row"><button class="btn primary">Add note</button></div></form>' +
      '<section class="stack"><h2>My notes</h2>' + (free.length ? free.map(function (n) {
        return '<div class="card"><p style="white-space:pre-wrap">' + esc(n.text) + '</p><div class="row between"><span class="tiny muted">' + fmtDate(n.ts) + '</span>' + (ui.confirmDel === n.id ? '<span class="row"><button class="btn small danger" data-act="note-del" data-id="' + n.id + '">Confirm delete</button><button class="btn small" data-act="note-cancel">Keep</button></span>' : '<button class="btn small ghost" data-act="note-ask" data-id="' + n.id + '">Delete</button>') + '</div></div>';
      }).join('') : '<div class="empty">' + (f ? 'No notes match your search.' : 'No notes yet. Add one above, or write notes at the bottom of any lesson.') + '</div>') + '</section>' +
      '<section class="stack"><h2>Lesson notes</h2>' + (lessonNotes.length ? lessonNotes.map(function (id) { return '<div class="card"><a href="#lesson-' + id + '"><strong>' + esc(L(id).title) + '</strong></a><p style="white-space:pre-wrap">' + esc(S.state.notes.lessons[id].text) + '</p></div>'; }).join('') : '<div class="empty">Notes you write inside lessons appear here.</div>') + '</section>' +
      '<div class="grid two"><section class="card"><h2>Saved lessons</h2>' + (savedL.length ? '<ul class="lessonlist">' + savedL.map(function (id) { return '<li><a href="#lesson-' + id + '">Lesson ' + lessonNo(L(id)) + ': ' + esc(L(id).title) + '</a></li>'; }).join('') + '</ul>' : '<p class="muted">Use the Save button on a lesson to keep it here.</p>') + '</section>' +
      '<section class="card"><h2>Saved concepts</h2>' + (terms.length ? '<div class="stack">' + terms.map(function (t) { return '<div class="term"><span class="t">' + esc(t) + '<button class="btn small ghost" data-act="save-term" data-term="' + esc(t) + '">Remove</button></span><span class="muted">' + esc(defOf(t)) + '</span></div>'; }).join('') + '</div>' : '<p class="muted">Save key terms from lessons; they also become flashcards.</p>') + '</section></div></div>';
    return { html: html };
  };

  /* Preferences */
  VIEWS.preferences = function () {
    var p = S.state.prefs;
    function seg(key, opts, label) { return '<div class="field"><span class="label" id="lb-' + key + '">' + label + '</span><div class="seg" role="group" aria-labelledby="lb-' + key + '">' + opts.map(function (o) { return '<button data-act="pref" data-k="' + key + '" data-v="' + o[0] + '" aria-pressed="' + (String(p[key]) === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div></div>'; }
    var voices = V.voices();
    var html = '<div class="page narrow"><div class="stack"><p class="eyebrow">Preferences</p><h1>Settings and accessibility</h1><p class="muted">Changes apply immediately and are saved in this browser.</p></div>' +
      '<section class="card"><h2>About you</h2><form class="field" data-form="pname"><label for="pn">Name for greetings (optional)</label><div class="row"><input id="pn" type="text" maxlength="40" value="' + esc(p.name) + '" style="flex:1;min-width:180px"><button class="btn">Save name</button></div></form></section>' +
      '<section class="card"><h2>Learning</h2>' + seg('level', [['simple', 'Simple'], ['detailed', 'Detailed'], ['advanced', 'Advanced']], 'Default explanation level') +
      '<label class="row"><input type="checkbox" id="pj" data-pref-check="jokes"' + (p.jokes !== false ? ' checked' : '') + '> Show jokes and memorable lines</label></section>' +
      '<section class="card"><h2>Display</h2>' + seg('theme', [['system', 'Match device'], ['light', 'Light'], ['dark', 'Dark']], 'Theme') + seg('textSize', [['s', 'Small'], ['m', 'Medium'], ['l', 'Large'], ['xl', 'Extra large']], 'Text size') +
      seg('motion', [['system', 'Match device'], ['reduce', 'Reduce motion'], ['full', 'Allow motion']], 'Animation') +
      '<label class="row"><input type="checkbox" id="ps" data-pref-check="readingFont"' + (p.readingFont ? ' checked' : '') + '> Extra letter and line spacing for easier reading</label></section>' +
      '<section class="card"><h2>Voice</h2>' +
      '<p><span class="chip ' + (V.ttsSupported ? 'good' : 'warn') + '">Read-aloud: ' + (V.ttsSupported ? 'available' : 'not available') + '</span> <span class="chip ' + (V.sttSupported ? 'good' : 'warn') + '">Voice input: ' + (V.sttSupported ? 'available' : 'not available') + '</span></p>' +
      '<p class="tiny muted">BodyWise uses your browser’s built-in speech features, so they are free but vary between browsers. Chrome, Edge and Safari support voice input in some form; Firefox usually does not. In Chrome, speech recognition audio is processed by Google’s servers. Every voice feature has a typing alternative.</p>' +
      (V.ttsSupported ? '<div class="field"><label for="pv">Reading voice</label><select id="pv" data-pref-select="voiceName"><option value="">Automatic (English)</option>' + voices.map(function (v) { return '<option' + (v.name === p.voiceName ? ' selected' : '') + ' value="' + esc(v.name) + '">' + esc(v.name + ' (' + v.lang + ')') + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="pr">Reading speed: <span data-rate>' + Number(p.voiceRate || 1).toFixed(1) + '×</span></label><input id="pr" type="range" min="0.6" max="1.6" step="0.1" value="' + (p.voiceRate || 1) + '" data-pref-range="voiceRate"></div>' +
        '<div class="row"><button class="btn small" data-act="test-voice">' + icon('speaker') + 'Test voice</button></div>' : '') +
      (V.sttSupported ? '<div class="field"><label for="pl">Voice input language</label><select id="pl" data-pref-select="speechLang">' + [['en-GB', 'English (UK)'], ['en-KE', 'English (Kenya)'], ['en-US', 'English (US)'], ['sw-KE', 'Kiswahili (Kenya)']].map(function (o) { return '<option value="' + o[0] + '"' + ((p.speechLang || 'en-GB') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select><span class="hint">The tutor understands English best; Kiswahili transcription depends on your browser.</span></div>' : '') + '</section>' +
      '<section class="card"><h2>Tutor backend (optional)</h2><p>The built-in tutor is a free demo that works offline. If you run your own tutor server (for example the included one with a free local model through Ollama), enter its address here. Your API keys stay on that server, never in this page.</p>' +
      '<form class="field" data-form="endpoint"><label for="pe">Backend address</label><input id="pe" type="url" inputmode="url" placeholder="http://localhost:8787/ask" value="' + esc(p.tutorEndpoint) + '"><span class="hint">Must start with https://, or http://localhost for a server on this computer. Questions you send in live mode go to that server.</span><p class="err" role="alert" data-eerr></p>' +
      '<div class="row"><button class="btn">Save address</button>' + (p.tutorEndpoint ? '<button type="button" class="btn" data-act="test-endpoint">Test connection</button><button type="button" class="btn ghost" data-act="clear-endpoint">Remove</button>' : '') + '</div></form></section>' +
      '<section class="card"><h2>Your data</h2><p>' + (S.available ? 'Progress is saved in this browser’s local storage. It is not sent anywhere. Clearing your browser data, or using another device, starts afresh.' : '<strong>Storage is blocked in this browser,</strong> so progress lasts only until you close the page.') + '</p>' +
      '<h3>Back up or move your progress</h3><p class="tiny muted">Copy the backup code and keep it somewhere safe, or paste it into BodyWise on another device.</p>' +
      '<div class="row"><button class="btn small" data-act="backup">Show backup code</button></div><div data-backup></div>' +
      '<form class="field" data-form="restore"><label for="pi">Restore from a backup code</label><textarea id="pi" placeholder="Paste a code starting with BW1."></textarea><p class="err" role="alert" data-rerr></p><div class="row"><button class="btn small">Restore</button></div></form>' +
      '<h3>Start over</h3>' + (ui.confirmReset ? '<div class="confirm"><p><strong>Delete all progress, notes and settings in this browser?</strong> This cannot be undone.</p><div class="row"><button class="btn danger" data-act="reset-yes">Yes, delete everything</button><button class="btn" data-act="reset-no">Cancel</button></div></div>' : '<button class="btn small danger" data-act="reset-ask">Reset all progress</button>') + '</section></div>';
    return { html: html };
  };

  /* Sources & about */
  VIEWS.sources = function () {
    var groups = {}; BW.references.forEach(function (r) { (groups[r.org] = groups[r.org] || []).push(r); });
    var html = '<div class="page narrow"><div class="stack"><p class="eyebrow">Sources</p><h1>Sources, accuracy and limits</h1><p class="muted">What BodyWise is based on, how it works, and what it cannot do.</p></div>' +
      '<section class="card"><h2>Educational, not medical</h2><p>BodyWise teaches normal human physiology. It does not diagnose, treat or give advice about anyone’s health. Where lessons mention a disease, it is only to contrast it with normal function. If you are worried about your health, speak to a health worker. In an emergency in Kenya, call 999 or 112.</p></section>' +
      '<section class="card"><h2>How the content is written</h2><ul class="objectives"><li>Lessons are original educational summaries based on the open sources listed below. They are simplified for learning.</li><li>Numbers such as pressures and volumes are typical values for healthy adults at rest; real people vary.</li><li>Analogies and jokes are memory aids and models, not exact descriptions.</li><li>Diagrams are original drawings made in code for BodyWise. They are schematic, not to anatomical scale.</li><li>' + BW.allLessons.filter(function (l) { return l.status === 'full'; }).length + ' of ' + BW.allLessons.length + ' syllabus lessons are fully written. The rest are clearly marked as outlines.</li></ul></section>' +
      '<section class="stack"><h2>References</h2><p class="tiny muted">Each link was opened and its title checked on 28 October 2026. Websites change; if a link breaks, search the source’s site for the title.</p>' +
      Object.keys(groups).map(function (org) { return '<div class="card"><h3>' + esc(org) + '</h3><ul class="reflist">' + groups[org].map(function (r) { return '<li><a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.title) + '</a>' + (r.licence ? '<br><span class="org">' + esc(r.licence) + '</span>' : '') + '</li>'; }).join('') + '</ul></div>'; }).join('') + '</section>' +
      '<section class="card"><h2>What is local, what is demo, what needs a backend</h2><ul class="objectives">' +
      '<li><strong>Works fully offline in your browser:</strong> lessons, diagrams, quizzes, flashcards, progress, notes, preferences, the body explorer and the connections map.</li>' +
      '<li><strong>Demo:</strong> the built-in tutor. It matches your question to prepared lesson content and assembles an answer. It does not reason, generate new text or know anything beyond these lessons, and it says so when it has no answer.</li>' +
      '<li><strong>Needs a backend you run:</strong> live AI answers. BodyWise includes a small server you can connect to a free local model (Ollama) or to a paid API. Paid APIs cost money per use; nothing paid is required for the rest of the app.</li>' +
      '<li><strong>Depends on your browser:</strong> read-aloud and voice input.</li></ul></section>' +
      '<section class="card" id="cost"><h2>What BodyWise costs: the KES 0 audit</h2><p>The full learning workflow (lessons, diagrams, quizzes, revision, progress, the Connection Map, scenarios and the built-in tutor) needs no payment, account or API key. Only the optional live AI tutor through a paid API costs money.</p>' +
      '<div class="costwrap"><table class="costtable"><thead><tr><th scope="col">Feature</th><th scope="col">Depends on</th><th scope="col">Status</th><th scope="col">How it works</th><th scope="col">Cost</th><th scope="col">Limitations</th><th scope="col">Next step</th><th scope="col">How it was tested</th></tr></thead><tbody>' +
      BW.costAudit.map(function (r) { return '<tr><th scope="row">' + esc(r.f) + '</th><td>' + r.cat.map(function (c) { return '<span class="cat c' + c + '">' + c + ' · ' + esc(BW.costCats[c]) + '</span>'; }).join(' ') + '</td><td>' + esc(r.status) + '</td><td>' + esc(r.how) + '</td><td>' + esc(r.cost) + '</td><td>' + esc(r.limits) + '</td><td>' + esc(r.next) + '</td><td>' + esc(r.tested) + '</td></tr>'; }).join('') +
      '</tbody></table></div><p class="tiny muted">To connect a live model you need: a server you run (included in the source as server/tutor-proxy.mjs) and either Ollama on your own computer (free, no account) or a paid API key kept on that server. API keys never go in this page’s code.</p></section>' +
      '<section class="card"><h2>Privacy</h2><p>BodyWise has no accounts and no analytics. Progress and notes stay in this browser. Two exceptions you control: voice input in some browsers (for example Chrome) sends audio to the browser maker’s speech service, and live tutor mode sends your questions to the backend address you enter.</p></section>' +
      '<section class="card"><h2>Known limits</h2><ul class="objectives"><li>Progress lives on one device and browser. Use the backup code to move it.</li><li>Streaks count calendar days on this device’s clock.</li><li>Short answers are checked for key ideas, so unusual wording can be marked wrong; you can count your answer as correct after comparing with the model answer.</li><li>Spaced revision uses a simple fixed schedule, not a personalised algorithm.</li></ul></section></div>';
    return { html: html };
  };

  /* ---------- actions ---------- */
  var ACT = {
    'sheet': function () { openSheet(!ui.sheet); },
    'sheet-close': function () { openSheet(false); },
    'tts-pause': function () { V.pause(); }, 'tts-resume': function () { V.resume(); }, 'tts-stop': function () { V.stop(); },
    'joke': function () { ui.jokeIdx++; ui.jokeOpen = false; rerender(); var b = main.querySelector('[data-act="joke"]'); if (b) b.focus({ preventScroll: true }); },
    'joke-science': function () { ui.jokeOpen = !ui.jokeOpen; rerender(); var b = main.querySelector('[data-act="joke-science"]'); if (b) b.focus({ preventScroll: true }); },
    'mystery': function () { ui.mystery = !ui.mystery; rerender(); var b = main.querySelector('[data-act="mystery"]'); if (b) b.focus({ preventScroll: true }); },
    'term': function (b) { BW.ui.openTerm(b); },
    'term-close': function () { BW.ui.closeTerm(true); },
    'term-save': function (b) { var t = b.getAttribute('data-term'), on = S.toggleSavedTerm(t); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'Saved to revision' : 'Save to revision'; toast(on ? '“' + t + '” saved and added to flashcards.' : '“' + t + '” removed.'); },
    'enlarge': function (b) { BW.ui.openDiagram(b.getAttribute('data-d'), b); },
    'dlg-close': function () { BW.ui.closeDiagram(); },
    'dlg-zoom': function (b) { BW.ui.zoomDiagram(Number(b.getAttribute('data-z'))); },
    'cc-prev': function (b) { BW.ui.cardiacAct('cc-prev', b); }, 'cc-next': function (b) { BW.ui.cardiacAct('cc-next', b); },
    'cc-go': function (b) { BW.ui.cardiacAct('cc-go', b); }, 'cc-play': function (b) { BW.ui.cardiacAct('cc-play', b); },
    'label-drill': function (b) {
      var l = L(current.param), q = l.check.filter(function (x) { return x.type === 'label'; })[0], fig = b.closest('figure');
      var slot = fig.querySelector('[data-labeldrill]'); if (!slot) { fig.insertAdjacentHTML('beforeend', '<div class="card flat" data-labeldrill></div>'); slot = fig.querySelector('[data-labeldrill]'); }
      BW.quiz.mount(slot, [Object.assign({ _lesson: l.id, _module: l.module }, q)], { single: true, label: 'Label the diagram', showSource: false });
      slot.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
    },
    'ask': function (b) {
      var q = b.getAttribute('data-q'), topic = b.getAttribute('data-topic');
      if (topic) { S.state.tutor.lastTopic = 'lesson:' + topic; S.state.tutor.currentLesson = topic; S.state.tutor.pending = null; }
      if (current.view === 'tutor') askTutor(q); else { ui.pendingPrompt = q; location.hash = '#tutor'; }
    },
    'level': function (b) { ui.level[current.param] = b.getAttribute('data-lv'); rerender(); },
    'read-lesson': function () {
      var l = L(current.param), lv = ui.level[l.id] || S.state.prefs.level;
      var txt = l.title + '. ' + l.intro + ' ' + (lv !== 'simple' ? l.detail.join(' ') + ' ' : '') + 'Step by step. ' + l.steps.join('. ') + '. Summary. ' + l.summary;
      speak(txt, l.title);
    },
    'read-summary': function () { var l = L(current.param); speak(l.summary, 'Summary: ' + l.title); },
    'read-scenario': function () { var s = BW.sysById[ui.explore]; speak(s.scenario.title + '. ' + s.scenario.text, s.scenario.title); },
    'read-path': function (b) { var P = BW.paths.filter(function (p) { return p.id === b.getAttribute('data-path'); })[0]; speak(P.title + '. ' + P.steps.map(function (s, i) { return 'Step ' + (i + 1) + ', ' + s.title + '. ' + s.text; }).join(' '), P.title); },
    'read-msg': function (b) { var h = S.state.tutor.history[Number(b.getAttribute('data-i'))]; var t = plain(renderParts(h.resp, false)); speak(t.length > 40 ? t : (h.resp.speak || t), 'Tutor answer'); },
    'save-lesson': function () { var on = S.toggleSavedLesson(current.param); toast(on ? 'Lesson saved to your notes page.' : 'Lesson removed from saved.'); rerender(); },
    'save-term': function (b) { var t = b.getAttribute('data-term'); var on = S.toggleSavedTerm(t); toast(on ? '“' + t + '” saved and added to flashcards.' : '“' + t + '” removed.'); rerender(); },
    'walk-start': function () { ui.walk[current.param] = 0; rerender(); },
    'walk-next': function () { var l = L(current.param); if (ui.walk[l.id] >= l.steps.length - 1) delete ui.walk[l.id]; else ui.walk[l.id]++; rerender(); },
    'walk-prev': function () { ui.walk[current.param] = Math.max(0, ui.walk[current.param] - 1); rerender(); },
    'alt-analogy': function () { ui.analogyAlt[current.param] = !ui.analogyAlt[current.param]; rerender(); },
    'flip': function (b) {
      var l = L(current.param), c = l.flashcards[Number(b.getAttribute('data-i'))], on = b.getAttribute('aria-pressed') === 'true';
      b.setAttribute('aria-pressed', String(!on));
      b.innerHTML = '<span class="side">' + (on ? 'Question' : 'Answer') + '</span><span>' + esc(on ? c.q : c.a) + '</span>';
    },
    'lesson-check': function () {
      var l = L(current.param), box = main.querySelector('[data-check]');
      BW.quiz.mount(box, l.check.map(function (q) { return Object.assign({ _lesson: l.id, _module: l.module }, q); }), { label: 'Knowledge check: ' + l.title, ref: 'lesson:' + l.id,
        after: S.isComplete(l.id) ? '' : '<button class="btn" data-act="complete">Mark lesson complete</button>' });
    },
    'complete': function () {
      var id = current.param, first = S.markComplete(id);
      if (first) {
        var n = S.completion().done;
        burst();
        toast(n === 1 ? BW.voiceLines.groupChat + ' Its flashcards are now in your revision deck.' : n === S.completion().total ? 'Every written lesson complete. Outstanding.' : n % 5 === 0 ? n + ' lessons complete. That is a milestone.' : 'Lesson complete. Flashcards added to your deck.', 'good');
      }
      rerender();
    },
    'module-quiz': function (b) {
      var mid = b.getAttribute('data-m'), m = modOf(mid);
      var qs = BW.quiz.shuffle(questionsFor('module', mid)).slice(0, 8);
      BW.quiz.mount(main.querySelector('[data-mq]'), qs, { label: 'Module ' + m.n + ' quiz', ref: 'module:' + mid });
    },
    'pick-sys': function (b) { ui.explore = b.getAttribute('data-sys'); history.replaceState(null, '', '#explore-' + ui.explore); rerender(); var p = main.querySelector('.explorer > .stack'); if (p && window.innerWidth < 900) p.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }); },
    'sys-quiz': function () { var s = BW.sysById[ui.explore]; BW.quiz.mount(main.querySelector('[data-sysquiz]'), s.quiz.map(function (q) { return Object.assign({ _lesson: null, _module: null }, q); }), { label: s.short + ' quick quiz', ref: 'system:' + s.id }); },
    'map-pick': function (b) { var id = b.getAttribute('data-sys'); ui.map = ui.map === id ? null : id; history.replaceState(null, '', ui.map ? '#connections-' + ui.map : '#connections'); current.param = ui.map; rerender(); },
    'map-clear': function () { ui.map = null; history.replaceState(null, '', '#connections'); current.param = null; rerender(); },
    'teach-mode': function (b) { S.setPref('teachMode', b.getAttribute('data-mode')); rerender(); },
    'tutor-answer': function (b) { answerTutor(Number(b.getAttribute('data-i'))); },
    'tutor-remode': function (b) { remodeTutor(b.getAttribute('data-mode')); },
    'map-quiz': function (b) {
      var sys = b.getAttribute('data-sys'), qs = BW.relationsFor(sys).map(function (r) { var q = BW.tutor.relationQuestion(sys, r.other); q._lesson = r.lesson; q._module = L(r.lesson) ? L(r.lesson).module : null; return q; });
      BW.quiz.mount(main.querySelector('[data-mapquiz]'), BW.quiz.shuffle(qs).slice(0, 4), { label: BW.sysById[sys].short + ' connections quiz', ref: 'connections:' + sys });
    },
    'scn-stage': function (b) { var id = current.param; ui.scStage = { id: id, i: Number(b.getAttribute('data-i')) }; rerender(); var f = main.querySelector('.scnbtn[aria-pressed="true"]'); if (f && b.classList.contains('scnbtn')) f.focus({ preventScroll: true }); },
    'tutor-mode': function (b) { S.setPref('tutorMode', b.getAttribute('data-m')); rerender(); },
    'tutor-clear': function () { S.state.tutor.history = []; S.state.tutor.lastTopic = null; S.state.tutor.pending = null; S.save(); rerender(); },
    'show-diagram': function (b) {
      var slot = b.closest('.msg').querySelector('[data-diagram-slot]');
      if (slot.innerHTML) { slot.innerHTML = ''; b.textContent = 'Show the diagram'; return; }
      slot.innerHTML = '<figure class="fig"><div class="figscroll">' + BW.diagram(b.getAttribute('data-d')) + '</div></figure>'; b.textContent = 'Hide the diagram';
    },
    'mic': function (b) {
      var status = main.querySelector('[data-listen]'), err = main.querySelector('[data-terr]'), ta = main.querySelector('#tq');
      if (!V.sttSupported) { err.textContent = 'Voice input is not available in this browser. Please type your question; Chrome, Edge or Safari offer voice input.'; return; }
      if (ui.listening) { V.stopListening(); return; }
      err.textContent = ''; ui.listening = true; b.setAttribute('aria-pressed', 'true');
      status.innerHTML = '<span class="listening"><i></i>Listening… speak your question, then pause.</span>';
      var r = V.listen({
        onText: function (t, fin) { ta.value = t; if (fin) status.innerHTML = '<span class="tiny muted">Heard you. Check the text, then send.</span>'; },
        onError: function (m) { err.textContent = m; },
        onEnd: function () { ui.listening = false; b.setAttribute('aria-pressed', 'false'); if (status.querySelector('.listening')) status.innerHTML = ''; ta.focus(); }
      });
      if (!r) { ui.listening = false; b.setAttribute('aria-pressed', 'false'); status.innerHTML = ''; }
    },
    'start-quiz': function (b) { startQuiz(b.getAttribute('data-kind'), b.getAttribute('data-arg'), b.getAttribute('data-label')); },
    'quit-quiz': function () { rerender(); },
    'go-weak': function () { ui.autoQuiz = ['weak', null, 'Revision quiz']; location.hash = '#practice'; },
    'card-show': function () { ui.cards.shown = true; renderCard(); },
    'card-yes': function () { var c = ui.cards; S.reviewCard(c.ids[c.i], true); c.knew++; c.i++; c.shown = false; renderCard(); },
    'card-no': function () { var c = ui.cards; S.reviewCard(c.ids[c.i], false); c.i++; c.shown = false; renderCard(); },
    'note-ask': function (b) { ui.confirmDel = b.getAttribute('data-id'); rerender(); },
    'note-cancel': function () { ui.confirmDel = null; rerender(); },
    'note-del': function (b) { S.deleteFreeNote(b.getAttribute('data-id')); ui.confirmDel = null; toast('Note deleted.'); rerender(); },
    'pref': function (b) { S.setPref(b.getAttribute('data-k'), b.getAttribute('data-v')); applyPrefs(); rerender(); },
    'test-voice': function () { speak('Hello! This is how BodyWise sounds when it reads to you. Your heart has beaten about once or twice while you listened.', 'Voice test'); },
    'test-endpoint': function () {
      var e = main.querySelector('[data-eerr]'); e.textContent = 'Testing…';
      BW.tutor.live('Reply with one short sentence confirming you are connected.', { level: 'simple', history: [] })
        .then(function () { e.textContent = ''; toast('Connected. Switch the tutor to “Live backend” to use it.', 'good'); })
        .catch(function (x) { e.textContent = x.message; });
    },
    'clear-endpoint': function () { S.setPref('tutorEndpoint', ''); S.setPref('tutorMode', 'demo'); rerender(); },
    'backup': function () {
      var code = S.exportCode(), box = main.querySelector('[data-backup]');
      box.innerHTML = '<div class="field"><label for="bk">Backup code</label><textarea id="bk" readonly>' + esc(code) + '</textarea><div class="row"><button class="btn small" data-act="copy-backup">Copy code</button></div></div>';
    },
    'copy-backup': function () {
      var ta = main.querySelector('#bk');
      var done = function () { toast('Backup code copied.'); };
      try { navigator.clipboard.writeText(ta.value).then(done, function () { ta.select(); toast('Select-all is ready: press copy on your keyboard.'); }); }
      catch (e) { ta.select(); toast('Select-all is ready: press copy on your keyboard.'); }
    },
    'reset-ask': function () { ui.confirmReset = true; rerender(); },
    'reset-no': function () { ui.confirmReset = false; rerender(); },
    'reset-yes': function () { V.stop(); S.reset(); ui.confirmReset = false; applyPrefs(); toast('Everything has been reset.'); location.hash = '#home'; rerender(); }
  };

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var j = e.target.closest('[data-jump]');
    if (j) { e.preventDefault(); var t = document.getElementById(j.getAttribute('data-jump')); if (t) { t.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' }); var h = t.querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } } return; }
    var b = e.target.closest('[data-act]');
    if (b && ACT[b.getAttribute('data-act')]) {
      if (b.tagName === 'A' && b.getAttribute('data-act') === 'sheet-close') { openSheet(false); return; }
      e.preventDefault(); ACT[b.getAttribute('data-act')](b, e);
    }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('g[data-act]')) { e.preventDefault(); ACT[e.target.getAttribute('data-act')](e.target, e); var again = main.querySelector('g[data-sys="' + e.target.getAttribute('data-sys') + '"]'); if (again) again.focus(); }
    if (e.key === 'Escape' && ui.sheet && !BW.ui.diagramOpen()) openSheet(false);
    if (e.key === 'Enter' && !e.shiftKey && e.target.id === 'tq') { e.preventDefault(); var v = e.target.value; e.target.value = ''; askTutor(v); }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target, kind = f.getAttribute('data-form'); if (!kind) return;
    e.preventDefault();
    if (kind === 'ask') { var aq = f.querySelector('#askq').value.trim(); if (!aq) { f.querySelector('#askq').focus(); toast('Type a question for BodyWise first.'); return; } ui.pendingPrompt = aq; location.hash = '#tutor'; return; }
    if (kind === 'tutor') { var ta = f.querySelector('#tq'), v = ta.value; ta.value = ''; askTutor(v); }
    if (kind === 'name' || kind === 'pname') { var n = f.querySelector('input').value.trim().slice(0, 40); S.setPref('name', n); toast(n ? 'Nice to meet you, ' + n + '.' : 'Name cleared.'); rerender(); }
    if (kind === 'note') {
      var t = f.querySelector('textarea').value;
      if (!t.trim()) { f.querySelector('[data-nerr]').textContent = 'Write something first.'; return; }
      S.addFreeNote(t); S.logActivity(); S.save(); toast('Note added.'); rerender();
    }
    if (kind === 'endpoint') {
      var u = f.querySelector('#pe').value.trim(), er = f.querySelector('[data-eerr]');
      if (u && !BW.tutor.validEndpoint(u)) { er.textContent = 'That address is not valid. Use https://… or http://localhost:PORT/…'; return; }
      S.setPref('tutorEndpoint', u); if (!u) S.setPref('tutorMode', 'demo'); toast(u ? 'Backend address saved.' : 'Backend removed.'); rerender();
    }
    if (kind === 'restore') {
      var code = f.querySelector('textarea').value, re = f.querySelector('[data-rerr]');
      if (!code.trim()) { re.textContent = 'Paste a backup code first.'; return; }
      try { S.importCode(code); applyPrefs(); toast('Progress restored.', 'good'); rerender(); } catch (x) { re.textContent = x.message; }
    }
  });
  var noteTimer;
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.matches('[data-lesson-note]')) {
      clearTimeout(noteTimer); var st = main.querySelector('[data-note-status]'); if (st) st.textContent = 'Saving…';
      noteTimer = setTimeout(function () { S.setLessonNote(t.getAttribute('data-lesson-note'), t.value); if (st) st.textContent = S.available ? 'Saved' : 'Not saved: storage is blocked in this browser'; }, 600);
    }
    if (t.id === 'nf') { ui.notesFilter = t.value; var pos = t.selectionStart; rerender(); var nf = main.querySelector('#nf'); nf.focus(); nf.setSelectionRange(pos, pos); }
    if (t.matches('[data-pref-range]')) { S.setPref(t.getAttribute('data-pref-range'), Number(t.value)); var r = main.querySelector('[data-rate]'); if (r) r.textContent = Number(t.value).toFixed(1) + '×'; }
    if (t.id === 'tq') { t.style.height = 'auto'; t.style.height = Math.min(160, t.scrollHeight) + 'px'; }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('[data-pref-check]')) { S.setPref(t.getAttribute('data-pref-check'), t.checked); applyPrefs(); }
    if (t.matches('[data-pref-select]')) { S.setPref(t.getAttribute('data-pref-select'), t.value); }
  });
  window.addEventListener('hashchange', route);
  window.addEventListener('storage', function (e) { if (e.key === 'bodywise.v1') { S.load(); applyPrefs(); } });

  /* ---------- boot ---------- */
  applyPrefs();
  renderShell();
  renderReadbar();
  route();
  if ('serviceWorker' in navigator && document.querySelector('link[rel="manifest"]') && /^https?:$/.test(location.protocol) && !/claude|anthropic/.test(location.hostname)) {
    try { navigator.serviceWorker.register('sw.js').catch(function () { /* offline cache is optional */ }); } catch (e) { /* ignore */ }
  }
  BW.app = { route: route, askTutor: askTutor, ui: ui, current: function () { return current; } };
})(window.BW = window.BW || {});
