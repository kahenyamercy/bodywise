/* BodyWise — question grading and the quiz player.
   Types: mcq, tf, short (key-idea check), label (diagram), scenario (mcq with a stem). */
(function (BW) {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function shuffle(a, rnd) { a = a.slice(); rnd = rnd || Math.random; for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function norm(t) { return String(t || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9₂⁺\s-]/g, ' ').replace(/\s+/g, ' ').trim(); }

  var GOOD = ['Exactly right.', 'Spot on.', 'Yes, nicely reasoned.', 'Correct. Your physiology instincts are working.'];
  var BAD = ['Not quite, but this is a useful mistake. Let’s follow the pathway again.', 'Close, but not this time. Here is the reasoning.', 'Not quite. Mistakes like this are where the learning happens.'];

  /* Pure grading function, used by the UI and by the tests. */
  function grade(q, resp) {
    switch (q.type) {
      case 'mcq': case 'scenario':
        return { correct: Number(resp) === q.answer };
      case 'tf':
        var v = (resp === true || resp === 'true') ? true : (resp === false || resp === 'false') ? false : null;
        return { correct: v !== null && v === q.answer };
      case 'short': {
        var t = norm(resp), words = t ? t.split(' ').length : 0;
        var hits = (q.keywords || []).map(function (group) { return group.some(function (k) { return t.indexOf(norm(k)) !== -1; }); });
        return { correct: words >= 2 && hits.every(Boolean), hits: hits };
      }
      case 'label': {
        var per = {}, all = true;
        Object.keys(q.answers).forEach(function (n) { per[n] = resp && resp[n] === q.answers[n]; if (!per[n]) all = false; });
        return { correct: all, per: per };
      }
    }
    return { correct: false };
  }

  function contextOf(q) {
    if (q._lesson !== undefined) return q;
    return q;
  }

  /* Every question in the app, tagged with where it came from. */
  function allQuestions() {
    var out = [];
    BW.allLessons.forEach(function (l) {
      if (l.status !== 'full') return;
      (l.check || []).forEach(function (q) { out.push(Object.assign({ _lesson: l.id, _module: l.module }, q)); });
    });
    BW.systems.forEach(function (s) { s.quiz.forEach(function (q) { out.push(Object.assign({ _lesson: null, _module: null, _sys: s.id }, q)); }); });
    return out;
  }

  /* The quiz player. opts: {label, onDone(score,total), record (default true), compact} */
  function mount(el, questions, opts) {
    opts = opts || {};
    var qs = questions.slice(), i = 0, results = [], checked = false, order = {};
    if (!qs.length) { el.innerHTML = '<div class="empty">No questions are available here yet.</div>'; return; }

    function dots() {
      return '<div class="dots" aria-hidden="true">' + qs.map(function (_, k) {
        var c = results[k] == null ? '' : results[k] ? 'right' : 'wrong'; return '<i class="' + c + (k === i ? ' cur' : '') + '"></i>';
      }).join('') + '</div>';
    }

    function body(q) {
      var h = '';
      if (q.shown) h += '<p class="eyebrow">So far</p><ol class="mini-steps">' + q.shown.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '<li class="q" aria-hidden="true">?</li></ol>';
      if (q.type === 'scenario' && q.scenario) h += '<div class="scenario-stem"><span class="eyebrow">Scenario</span><br>' + esc(q.scenario) + '</div>';
      if (q.type === 'mcq' || q.type === 'scenario') {
        order[i] = order[i] || shuffle(q.options.map(function (_, k) { return k; }));
        h += '<fieldset><legend>' + esc(q.prompt) + '</legend>' + order[i].map(function (k) {
          return '<label class="opt" data-k="' + k + '"><input type="radio" name="q' + i + '" value="' + k + '"><span>' + esc(q.options[k]) + '</span><span class="mark"></span></label>';
        }).join('') + '</fieldset>';
      } else if (q.type === 'tf') {
        h += '<fieldset><legend><span class="eyebrow">True or false?</span><br>' + esc(q.prompt) + '</legend>' +
          ['true', 'false'].map(function (v) { return '<label class="opt" data-k="' + v + '"><input type="radio" name="q' + i + '" value="' + v + '"><span>' + (v === 'true' ? 'True' : 'False') + '</span><span class="mark"></span></label>'; }).join('') + '</fieldset>';
      } else if (q.type === 'short') {
        h += '<div class="field"><label for="qs' + i + '">' + esc(q.prompt) + '</label><textarea id="qs' + i + '" maxlength="600" placeholder="Type your answer in your own words"></textarea>' +
          '<span class="hint">A sentence is enough. BodyWise checks for the key idea, then shows a model answer to compare.</span></div>';
      } else if (q.type === 'label') {
        var nums = Object.keys(q.answers);
        order[i] = order[i] || shuffle(q.options);
        h += '<p><strong>' + esc(q.prompt) + '</strong></p><figure class="fig"><div class="figscroll">' + BW.diagram(q.diagram, { hide: true }) + '</div><figcaption>Choose the correct name for each numbered label.</figcaption></figure>' +
          '<div class="labelgrid">' + nums.map(function (n) {
            return '<div class="field" data-n="' + n + '"><label for="ql' + i + '_' + n + '">Label ' + n + '</label><select id="ql' + i + '_' + n + '"><option value="">Choose…</option>' +
              order[i].map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select><span class="hint ans"></span></div>';
          }).join('') + '</div>';
      }
      return h;
    }

    function render() {
      var q = qs[i]; checked = false;
      el.innerHTML = '<div class="quiz">' +
        (opts.single ? '<div class="qhead"><span class="eyebrow">' + esc(opts.label || 'Quick check') + '</span></div>' : '<div class="qhead"><span class="eyebrow">' + esc(opts.label || 'Knowledge check') + ' · Question ' + (i + 1) + ' of ' + qs.length + '</span>' + dots() + '</div>') +
        body(q) +
        '<p class="err" role="alert" data-err></p>' +
        '<div data-fb aria-live="polite"></div>' +
        '<div class="row" data-actions><button class="btn primary" data-q="check">Check answer</button></div></div>';
      var first = el.querySelector('input, textarea, select'); if (first && opts.focus !== false && i > 0) first.focus();
    }

    function response(q) {
      if (q.type === 'mcq' || q.type === 'scenario' || q.type === 'tf') {
        var c = el.querySelector('input[name="q' + i + '"]:checked'); if (!c) return null;
        return q.type === 'tf' ? c.value === 'true' : Number(c.value);
      }
      if (q.type === 'short') { var t = el.querySelector('textarea').value.trim(); return t ? t : null; }
      if (q.type === 'label') {
        var r = {}, missing = false;
        el.querySelectorAll('.labelgrid .field').forEach(function (f) { var v = f.querySelector('select').value; if (!v) missing = true; r[f.getAttribute('data-n')] = v; });
        return missing ? null : r;
      }
    }

    function record(q, ok) {
      if (opts.record === false || !BW.store) return;
      BW.store.recordAttempt(q.id, q._lesson || opts.lesson || null, q._module || opts.module || null, ok);
    }

    function check() {
      var q = qs[i], resp = response(q), err = el.querySelector('[data-err]');
      if (resp == null) {
        err.textContent = q.type === 'short' ? 'Type an answer first. A few words is fine.' : q.type === 'label' ? 'Choose a name for every label first.' : 'Choose an answer first.';
        return;
      }
      err.textContent = '';
      var g = grade(q, resp); checked = true; results[i] = g.correct;
      record(q, g.correct);
      el.querySelectorAll('input, textarea, select').forEach(function (x) { x.disabled = true; });
      if (q.type === 'mcq' || q.type === 'scenario' || q.type === 'tf') {
        var right = q.type === 'tf' ? String(q.answer) : String(q.answer);
        el.querySelectorAll('.opt').forEach(function (o) {
          var k = o.getAttribute('data-k'), chosen = o.querySelector('input').checked;
          if (k === right) { o.classList.add('right'); o.querySelector('.mark').textContent = 'Correct answer'; }
          else if (chosen) { o.classList.add('wrong'); o.querySelector('.mark').textContent = 'Your answer'; }
        });
      }
      if (q.type === 'label') {
        el.querySelectorAll('.labelgrid .field').forEach(function (f) {
          var n = f.getAttribute('data-n'), ok = g.per[n];
          f.classList.add(ok ? 'right' : 'wrong');
          f.querySelector('.ans').textContent = ok ? 'Correct' : 'Answer: ' + q.answers[n];
        });
      }
      var partial = !g.correct && ((g.per && Object.keys(g.per).some(function (k) { return g.per[k]; })) || (g.hits && g.hits.some(Boolean)));
      var verdict = g.correct ? GOOD[i % GOOD.length] : partial && BW.voiceLines ? BW.voiceLines.almost : BAD[i % BAD.length];
      var fb = '<div class="feedback ' + (g.correct ? 'good' : 'bad') + '"><span class="verdict">' + verdict + '</span>';
      if (q.type === 'short') fb += '<p><strong>Model answer:</strong> ' + esc(q.model) + '</p>';
      fb += '<p>' + esc(q.explain) + '</p>';
      if (q._lesson && opts.showSource !== false && BW.lessonIndex[q._lesson]) fb += '<p class="tiny"><a href="#lesson-' + q._lesson + '">Revisit: ' + esc(BW.lessonIndex[q._lesson].title) + '</a></p>';
      fb += '</div>';
      el.querySelector('[data-fb]').innerHTML = fb;
      var act = opts.single ? '' : '<button class="btn primary" data-q="next">' + (i < qs.length - 1 ? 'Next question' : 'See results') + '</button>';
      if (q.type === 'short' && !g.correct) act += '<button class="btn" data-q="selfmark">My answer says the same thing</button>';
      el.querySelector('[data-actions]').innerHTML = act;
      if (!opts.single) el.querySelector('.qhead .dots').outerHTML = dots();
      var nx = el.querySelector('[data-q="next"]'); if (nx) nx.focus(); else el.querySelector('.feedback').setAttribute('tabindex', '-1');
    }

    function finish() {
      var score = results.filter(Boolean).length, n = qs.length, pct = Math.round(score / n * 100);
      if (opts.label && n > 1 && opts.record !== false && BW.store) BW.store.recordQuiz(opts.label, score, n, opts.ref);
      var msg = pct === 100 ? 'Perfect score. Your body would be proud of you, if it could read.' : pct >= 70 ? 'Strong work. Review the ones you missed and they will stick.' : pct >= 40 ? 'A solid start. The explanations below show where to look again.' : 'This topic needs another pass. That is normal; understanding comes in layers.';
      var missed = qs.map(function (q, k) { return results[k] ? null : q; }).filter(Boolean);
      el.innerHTML = '<div class="quiz"><div class="stack"><span class="eyebrow">' + esc(opts.label || 'Knowledge check') + ' · Results</span>' +
        '<div class="statline"><span class="n mono">' + score + '/' + n + '</span><span class="muted">(' + pct + '%)</span></div>' +
        '<div class="bar ' + (pct >= 70 ? 'good' : pct >= 40 ? 'warn' : 'bad') + '"><span style="width:' + pct + '%"></span></div>' +
        '<p>' + msg + '</p>' +
        (missed.length ? '<div class="stack"><h3>To revisit</h3><ul class="lessonlist">' + missed.map(function (q) {
          var l = q._lesson && BW.lessonIndex[q._lesson];
          return '<li class="card flat"><strong>' + esc(q.prompt) + '</strong><span class="muted tiny">' + esc(q.explain) + '</span>' + (l ? '<a href="#lesson-' + l.id + '" class="tiny">Open lesson: ' + esc(l.title) + '</a>' : '') + '</li>';
        }).join('') + '</ul></div>' : '') +
        '<div class="row"><button class="btn primary" data-q="again">Try again</button>' + (opts.after || '') + '</div></div></div>';
      if (opts.onDone) opts.onDone(score, n);
    }

    el.onclick = function (e) {
      var b = e.target.closest('[data-q]'); if (!b) return;
      var a = b.getAttribute('data-q');
      if (a === 'check') check();
      else if (a === 'next') { if (i < qs.length - 1) { i++; render(); } else finish(); }
      else if (a === 'selfmark') {
        results[i] = true; var q = qs[i];
        if (opts.record !== false && BW.store) { var at = BW.store.state.attempts; if (at.length && at[at.length - 1].qid === q.id) { at[at.length - 1].correct = true; at[at.length - 1].self = true; BW.store.save(); } }
        b.remove(); el.querySelector('.feedback .verdict').textContent = 'Counted as correct. Comparing with the model answer is a great habit.';
        el.querySelector('.feedback').className = 'feedback good';
        var dd = el.querySelector('.qhead .dots'); if (dd) dd.outerHTML = dots();
      } else if (a === 'again') { qs = shuffle(qs); i = 0; results = []; order = {}; render(); }
    };
    render();
    return { render: render };
  }

  BW.quiz = { grade: grade, mount: mount, allQuestions: allQuestions, shuffle: shuffle, norm: norm, ctx: contextOf };
})(window.BW = window.BW || {});
