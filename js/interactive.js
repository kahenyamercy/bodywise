/* BodyWise — interactive learning components:
   pathway strips, the cardiac-cycle stepper, clickable terms, generated
   "predict what happens next" and between-section questions, and a zoomable diagram viewer. */
(function (BW) {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var UI = BW.ui = BW.ui || {};

  /* ---------- Glossary and clickable terms ---------- */
  function termKey(t) { return t.replace(/\s*\(.*?\)\s*/g, ' ').trim(); }
  UI.glossary = function () {
    if (UI._gloss) return UI._gloss;
    var g = {};
    BW.allLessons.forEach(function (l) { (l.terms || []).forEach(function (t) { var k = termKey(t.t).toLowerCase(); if (!g[k]) g[k] = { t: t.t, d: t.d, lesson: l.id }; }); });
    return (UI._gloss = g);
  };
  /* Wrap the first appearance of each term in a button. `used` is shared across a lesson. */
  UI.linkTerms = function (text, terms, used) {
    var html = esc(text), tokens = [];
    (terms || []).slice().sort(function (a, b) { return termKey(b.t).length - termKey(a.t).length; }).forEach(function (t) {
      var key = termKey(t.t), lk = key.toLowerCase();
      if (used[lk] || key.length < 3) return;
      var rx = new RegExp('\\b(' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(s|es)?\\b', 'i');
      var m = html.match(rx);
      if (!m) return;
      used[lk] = true;
      tokens.push('<button type="button" class="term-btn" data-act="term" data-term="' + esc(t.t) + '" aria-haspopup="dialog" aria-expanded="false">' + m[0] + '</button>');
      html = html.replace(rx, '\u0001' + (tokens.length - 1) + '\u0002');
    });
    return html.replace(/\u0001(\d+)\u0002/g, function (_, i) { return tokens[Number(i)]; });
  };

  var pop = null, popOpener = null;
  UI.openTerm = function (btn) {
    var g = UI.glossary(), name = btn.getAttribute('data-term'), entry = g[termKey(name).toLowerCase()];
    if (!entry) return;
    if (popOpener === btn) { UI.closeTerm(); return; }
    UI.closeTerm();
    pop = document.createElement('div');
    pop.className = 'termpop'; pop.id = 'termpop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Definition of ' + entry.t);
    var saved = BW.store.isSavedTerm(entry.t), cur = BW.app && BW.app.current && BW.app.current().param;
    pop.innerHTML = '<p class="eyebrow">Key term</p><h3>' + esc(entry.t) + '</h3><p>' + esc(entry.d) + '</p>' +
      '<div class="row"><button class="btn small" data-act="term-save" data-term="' + esc(entry.t) + '" aria-pressed="' + saved + '">' + (saved ? 'Saved to revision' : 'Save to revision') + '</button>' +
      (entry.lesson !== cur ? '<a class="btn small" href="#lesson-' + entry.lesson + '">Open its lesson</a>' : '') +
      '<button class="btn small ghost" data-act="term-close">Close</button></div>';
    document.body.appendChild(pop);
    btn.setAttribute('aria-expanded', 'true'); btn.setAttribute('aria-controls', 'termpop');
    popOpener = btn;
    if (window.innerWidth >= 640) {
      var r = btn.getBoundingClientRect(), w = Math.min(340, window.innerWidth - 32);
      pop.style.width = w + 'px';
      pop.style.left = Math.max(16, Math.min(r.left + window.scrollX, window.scrollX + window.innerWidth - w - 16)) + 'px';
      pop.style.top = (r.bottom + window.scrollY + 8) + 'px';
    } else pop.classList.add('sheetpop');
    pop.querySelector('button').focus({ preventScroll: true });
  };
  UI.closeTerm = function (restore) {
    if (!pop) return;
    pop.remove(); pop = null;
    if (popOpener) { popOpener.setAttribute('aria-expanded', 'false'); if (restore) popOpener.focus({ preventScroll: true }); }
    popOpener = null;
  };
  UI.termOpen = function () { return !!pop; };
  document.addEventListener('click', function (e) {
    if (pop && !pop.contains(e.target) && !e.target.closest('.term-btn')) UI.closeTerm();
  });

  /* ---------- Generated questions ---------- */
  UI.predictQuestion = function (l) {
    var k = Math.max(1, Math.floor(l.steps.length / 2));
    var later = l.steps.slice(k + 1, k + 3);
    if (later.length < 2) later = later.concat(l.steps.slice(0, k).slice(-(2 - later.length)));
    return { id: l.id + '-predict', type: 'mcq', shown: l.steps.slice(0, k), prompt: 'What happens next?', options: [l.steps[k]].concat(later), answer: 0,
      explain: 'Next comes: “' + l.steps[k] + '” Each step causes the one after it, so following the cause-and-effect chain is the key skill here.' };
  };
  UI.mythQuestion = function (l) {
    var m = l.misconceptions[0];
    return { id: l.id + '-myth', type: 'tf', prompt: m.myth, answer: false, explain: m.fact };
  };
  UI.relationQuestion = function (l) {
    var c = l.connections[0], used = l.connections.map(function (x) { return x.sys; });
    var others = BW.systems.filter(function (s) { return used.indexOf(s.id) === -1; });
    var start = (l.moduleN * 3) % Math.max(1, others.length);
    var pick = others.slice(start).concat(others.slice(0, start)).slice(0, 3);
    var name = BW.sysById[c.sys].name;
    return { id: l.id + '-rel', type: 'mcq', prompt: 'Which system does this connection involve? “' + c.text + '”', options: [name].concat(pick.map(function (s) { return s.name; })), answer: 0,
      explain: 'It is the ' + name.toLowerCase() + ' system. ' + c.text };
  };

  /* ---------- Pathway strip ---------- */
  UI.pathsFor = function (lessonId) { return BW.paths.filter(function (p) { return p.steps.some(function (s) { return s.lesson === lessonId; }); }); };
  UI.pathStrip = function (P, currentLesson, opts) {
    opts = opts || {};
    return '<div class="pathstrip">' +
      (opts.title !== false ? '<div class="row between"><h3>' + esc(P.title) + '</h3><a class="tiny" href="#path-' + P.id + '">Open the full path</a></div>' : '') +
      '<ol class="strip" aria-label="' + esc(P.title) + ', ' + P.steps.length + ' steps">' + P.steps.map(function (s, i) {
        var sys = BW.sysById[s.sys], here = s.lesson === currentLesson;
        return '<li><a class="pstep sys-' + s.sys + (here ? ' here' : '') + '" href="#lesson-' + s.lesson + '"' + (here ? ' aria-current="step"' : '') + '>' +
          '<span class="code">' + sys.code + '</span><span class="pt">' + esc(s.title) + '</span><span class="ps">' + (here ? 'You are here' : esc(sys.short)) + '</span></a></li>';
      }).join('') + '</ol>' +
      '<p class="tiny muted"><strong>Simplified pathway.</strong> Real physiology has more branches and feedback than one line can show.</p>' +
      (P.caveats && P.caveats.length ? '<details class="more"><summary>Important details and exceptions</summary><div class="inner"><ul class="objectives">' + P.caveats.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></div></details>' : '') +
      '</div>';
  };

  /* ---------- Cardiac cycle stepper ---------- */
  UI.cardiacHtml = function () {
    return '<div class="cardiac" data-cardiac tabindex="-1">' +
      '<div class="cardiac-grid"><div class="cardiac-fig" data-cfig></div><div class="cardiac-info" aria-live="polite" data-cinfo></div></div>' +
      '<div class="row cardiac-ctrl"><button class="btn small" data-act="cc-prev">Previous stage</button>' +
      '<div class="seg" role="group" aria-label="Stages">' + BW.cardiacStages.map(function (s, i) { return '<button data-act="cc-go" data-i="' + i + '" aria-label="Stage ' + (i + 1) + ': ' + esc(s.name) + '">' + (i + 1) + '</button>'; }).join('') + '</div>' +
      '<button class="btn small primary" data-act="cc-next">Next stage</button><button class="btn small" data-act="cc-play" aria-pressed="false">Play the cycle</button></div>' +
      '<p class="tiny muted">Use the stage buttons or the arrow keys. Chambers marked “contracting” are squeezing; valve states are written out, not just drawn.</p></div>';
  };
  function cardiacSvg(st) {
    var c = function (id) { return st.contract.indexOf(id) !== -1; };
    var f = function (k) { return st.flow.indexOf(k) !== -1 ? ' on' : ''; };
    function chamber(id, x, y, w, h, name, side) {
      return '<g class="ch ' + side + (c(id) ? ' squeeze' : '') + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="18"/>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 - (c(id) ? 4 : -4)) + '" text-anchor="middle" class="cn">' + name + '</text>' +
        (c(id) ? '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 16) + '" text-anchor="middle" class="cs">contracting</text>' : '') + '</g>';
    }
    function av(x1, x2, y) {
      return st.av === 'open' ? '<path d="M' + x1 + ',' + (y - 6) + ' L' + (x1 + 16) + ',' + (y + 12) + ' M' + x2 + ',' + (y - 6) + ' L' + (x2 - 16) + ',' + (y + 12) + '" class="valve open"/>'
        : '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" class="valve shut"/>';
    }
    function sl(x, y) {
      return st.sl === 'open' ? '<path d="M' + (x - 10) + ',' + (y + 6) + ' L' + (x - 4) + ',' + (y - 10) + ' M' + (x + 10) + ',' + (y + 6) + ' L' + (x + 4) + ',' + (y - 10) + '" class="valve open"/>'
        : '<line x1="' + (x - 11) + '" y1="' + y + '" x2="' + (x + 11) + '" y2="' + y + '" class="valve shut"/>';
    }
    return '<svg viewBox="0 0 380 340" role="img" aria-label="Heart during ' + esc(st.name) + '">' +
      '<path d="M160,212 L178,212 L178,18" class="tube deoxy"/><path d="M220,212 L202,212 L202,18" class="tube oxy"/>' +
      '<text x="172" y="12" text-anchor="end" class="tl">to lungs</text><text x="208" y="12" class="tl">to body</text>' +
      chamber('ra', 20, 62, 140, 92, 'Right atrium', 'deoxy') + chamber('la', 220, 62, 140, 92, 'Left atrium', 'oxy') +
      chamber('rv', 20, 176, 140, 130, 'Right ventricle', 'deoxy') + chamber('lv', 220, 176, 140, 130, 'Left ventricle', 'oxy thick') +
      av(52, 128, 165) + av(252, 328, 165) + sl(178, 186) + sl(202, 186) +
      '<text x="90" y="194" text-anchor="middle" class="vl">tricuspid: ' + st.av + '</text><text x="290" y="194" text-anchor="middle" class="vl">mitral: ' + st.av + '</text>' +
      '<path d="M60,22 L60,58" class="fl deoxy' + f('veins') + '"/><path d="M320,22 L320,58" class="fl oxy' + f('veins') + '"/>' +
      '<text x="68" y="34" class="tl">from body</text><text x="312" y="34" text-anchor="end" class="tl">from lungs</text>' +
      '<path d="M90,120 L90,226" class="fl deoxy' + f('av') + '"/><path d="M290,120 L290,226" class="fl oxy' + f('av') + '"/>' +
      '<path d="M178,200 L178,40" class="fl deoxy' + f('out') + '"/><path d="M202,200 L202,40" class="fl oxy' + f('out') + '"/>' +
      '<text x="190" y="330" text-anchor="middle" class="vl">pulmonary &amp; aortic (semilunar) valves: ' + st.sl + '</text>' +
      (st.sound ? '<text x="190" y="128" text-anchor="middle" class="snd">“' + st.sound + '”</text>' : '') +
      '</svg>';
  }
  UI.cardiacMount = function (root) {
    var i = 0, el = root.querySelector('[data-cardiac]'); if (!el) return;
    function show(n) {
      i = (n + BW.cardiacStages.length) % BW.cardiacStages.length;
      var st = BW.cardiacStages[i];
      el.querySelector('[data-cfig]').innerHTML = cardiacSvg(st);
      var names = { ra: 'right atrium', la: 'left atrium', rv: 'right ventricle', lv: 'left ventricle' };
      el.querySelector('[data-cinfo]').innerHTML = '<p class="eyebrow">Stage ' + (i + 1) + ' of ' + BW.cardiacStages.length + ' · ' + esc(st.phase) + '</p><h3>' + esc(st.name) + '</h3><p>' + esc(st.text) + '</p>' +
        '<dl class="facts"><dt>Contracting</dt><dd>' + (st.contract.length ? st.contract.map(function (x) { return names[x]; }).join(' and ') : 'Nothing; all chambers relaxed') + '</dd>' +
        '<dt>AV valves (tricuspid, mitral)</dt><dd><span class="vstate ' + st.av + '">' + st.av + '</span></dd>' +
        '<dt>Semilunar valves (pulmonary, aortic)</dt><dd><span class="vstate ' + st.sl + '">' + st.sl + '</span></dd>' +
        '<dt>Heart sound</dt><dd>' + (st.sound ? '“' + st.sound + '”' : 'None at this stage') + '</dd></dl>';
      el.querySelectorAll('[data-act="cc-go"]').forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === i)); });
    }
    el._show = function (d, abs) { show(abs ? d : i + d); };
    el.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); UI.cardiacStop(); show(i + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); UI.cardiacStop(); show(i - 1); }
    });
    show(0);
  };
  UI.cardiacStop = function () {
    if (UI._ccTimer) { clearInterval(UI._ccTimer); UI._ccTimer = null; }
    var b = document.querySelector('[data-act="cc-play"]'); if (b) { b.setAttribute('aria-pressed', 'false'); b.textContent = 'Play the cycle'; }
  };
  UI.cardiacAct = function (act, btn) {
    var el = document.querySelector('[data-cardiac]'); if (!el) return;
    if (act === 'cc-next') { UI.cardiacStop(); el._show(1); }
    if (act === 'cc-prev') { UI.cardiacStop(); el._show(-1); }
    if (act === 'cc-go') { UI.cardiacStop(); el._show(Number(btn.getAttribute('data-i')), true); }
    if (act === 'cc-play') {
      if (UI._ccTimer) { UI.cardiacStop(); return; }
      btn.setAttribute('aria-pressed', 'true'); btn.textContent = 'Pause';
      UI._ccTimer = setInterval(function () { if (!document.body.contains(el)) { UI.cardiacStop(); return; } el._show(1); }, 3200);
    }
  };

  /* ---------- Scenario flow diagram ---------- */
  UI.scenarioSvg = function (sc, sel) {
    var n = sc.stages.length, rowH = 66, top = 34, H = top + n * rowH, cx = 78;
    var y = function (i) { return top + i * rowH; };
    var out = '<svg viewBox="0 0 400 ' + H + '" class="scnsvg" role="img" aria-label="' + esc(sc.title) + ': ' + n + ' stages' + (sc.loops.length ? ' with ' + sc.loops.length + ' feedback loop' + (sc.loops.length > 1 ? 's' : '') : '') + '. The numbered list gives the same stages as text.">' +
      '<defs><marker id="scA" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="scn-ah"/></marker></defs>';
    for (var i = 0; i < n - 1; i++) out += '<line x1="' + cx + '" y1="' + (y(i) + 20) + '" x2="' + cx + '" y2="' + (y(i + 1) - 22) + '" class="scn-fwd" marker-end="url(#scA)"/>';
    sc.loops.forEach(function (lp, k) {
      var a = Math.min(lp.a, lp.b), b = Math.max(lp.a, lp.b), bend = 30 + k * 14;
      out += '<path d="M' + (cx - 20) + ',' + y(a) + ' C' + (cx - 20 - bend) + ',' + y(a) + ' ' + (cx - 20 - bend) + ',' + y(b) + ' ' + (cx - 20) + ',' + y(b) + '" class="scn-loop" marker-start="url(#scA)" marker-end="url(#scA)"/>' +
        '<text x="' + (cx - 22 - bend) + '" y="' + (y(a) + (y(b) - y(a)) * (0.3 + 0.4 * (k % 2)) + 4) + '" class="scn-lt" text-anchor="end">↺' + (k + 1) + '</text>';
    });
    sc.stages.forEach(function (s, i) {
      var main = s.systems[0];
      out += '<g class="scn-node sys-' + main + (i === sel ? ' on' : '') + '" data-act="scn-stage" data-i="' + i + '">' +
        '<circle cx="' + cx + '" cy="' + y(i) + '" r="19"/><text x="' + cx + '" y="' + (y(i) + 5) + '" text-anchor="middle" class="scn-n">' + (i + 1) + '</text>' +
        '<text x="' + (cx + 32) + '" y="' + (y(i) - 2) + '" class="scn-t">' + esc(s.title) + '</text>' +
        '<text x="' + (cx + 32) + '" y="' + (y(i) + 15) + '" class="scn-s">' + s.systems.map(function (x) { return BW.sysById[x].code; }).join(' · ') + '</text></g>';
    });
    return out + '</svg>';
  };

  /* ---------- Zoomable diagram viewer ---------- */
  var dlg = null, dlgOpener = null, zoom = 1;
  UI.openDiagram = function (key, opener) {
    UI.closeDiagram();
    dlgOpener = opener; zoom = 1;
    dlg = document.createElement('div');
    dlg.className = 'dlg-backdrop';
    dlg.innerHTML = '<div class="dlg" role="dialog" aria-modal="true" aria-label="' + esc(BW.diagramMeta[key].title) + '"><div class="row between"><h2>' + esc(BW.diagramMeta[key].title) + '</h2><button class="btn small" data-act="dlg-close">Close</button></div>' +
      '<div class="row"><button class="btn small" data-act="dlg-zoom" data-z="-1" aria-label="Zoom out">−</button><span class="tiny mono" data-zl>100%</span><button class="btn small" data-act="dlg-zoom" data-z="1" aria-label="Zoom in">+</button><span class="tiny muted">Scroll or drag to move around.</span></div>' +
      '<div class="dlg-body" tabindex="0" aria-label="Diagram, scrollable"><div class="dlg-canvas">' + BW.diagram(key) + '</div></div><p class="tiny muted">' + esc(BW.diagramMeta[key].desc) + '</p></div>';
    document.body.appendChild(dlg);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) UI.closeDiagram(); });
    dlg.querySelector('[data-act="dlg-close"]').focus();
  };
  UI.zoomDiagram = function (d) {
    if (!dlg) return;
    zoom = Math.max(1, Math.min(3, zoom + d * 0.5));
    dlg.querySelector('.dlg-canvas').style.width = (zoom * 100) + '%';
    dlg.querySelector('[data-zl]').textContent = Math.round(zoom * 100) + '%';
  };
  UI.closeDiagram = function () { if (dlg) { dlg.remove(); dlg = null; if (dlgOpener) dlgOpener.focus({ preventScroll: true }); dlgOpener = null; } };
  UI.diagramOpen = function () { return !!dlg; };

  /* Loop trap for the dialog. */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (dlg) { UI.closeDiagram(); return; } if (pop) UI.closeTerm(true); }
    if (e.key === 'Tab' && dlg) {
      var f = dlg.querySelectorAll('button, [tabindex="0"]'), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})(window.BW = window.BW || {});
