/* BodyWise — voice features using only built-in browser speech APIs.
   Support differs between browsers, so every feature is detected first and
   every voice action has a typed alternative. */
(function (BW) {
  'use strict';
  var synth = (typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) ? window.speechSynthesis : null;
  var Rec = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
  var listeners = [];
  var st = { speaking: false, paused: false, title: '' };
  var queue = [], rec = null;

  function emit() { listeners.forEach(function (f) { try { f(st); } catch (e) { /* ignore */ } }); }

  /* Long utterances can stop early in some browsers, so speak sentence by sentence. */
  function chunks(text) {
    var parts = String(text).replace(/\s+/g, ' ').match(/[^.!?]+[.!?]*\s*/g) || [text];
    var out = [], cur = '';
    parts.forEach(function (p) { if ((cur + p).length > 220 && cur) { out.push(cur); cur = p; } else cur += p; });
    if (cur.trim()) out.push(cur);
    return out;
  }
  function pickVoice() {
    if (!synth) return null;
    var want = BW.store && BW.store.state.prefs.voiceName;
    var voices = synth.getVoices();
    if (want) { var v = voices.filter(function (x) { return x.name === want; })[0]; if (v) return v; }
    return voices.filter(function (x) { return /^en(-|_)(KE|GB)/i.test(x.lang); })[0] || voices.filter(function (x) { return /^en/i.test(x.lang); })[0] || null;
  }
  function next() {
    if (!queue.length) { st.speaking = false; st.paused = false; emit(); return; }
    var u = new window.SpeechSynthesisUtterance(queue.shift());
    var v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-GB';
    u.rate = Number(BW.store && BW.store.state.prefs.voiceRate) || 1;
    u.onend = function () { if (st.speaking) next(); };
    u.onerror = function (e) { if (e.error !== 'interrupted' && e.error !== 'canceled') { st.error = 'Read-aloud stopped: ' + e.error; } st.speaking = false; emit(); };
    synth.speak(u);
  }

  var V = {
    ttsSupported: !!synth,
    sttSupported: !!Rec,
    state: st,
    onChange: function (f) { listeners.push(f); },
    voices: function () { return synth ? synth.getVoices().filter(function (v) { return /^en/i.test(v.lang); }) : []; },
    speak: function (text, title) {
      if (!synth) return false;
      synth.cancel(); queue = chunks(text);
      st.speaking = true; st.paused = false; st.title = title || 'Reading aloud'; st.error = null; emit();
      next(); return true;
    },
    pause: function () { if (synth && st.speaking) { synth.pause(); st.paused = true; emit(); } },
    resume: function () { if (synth && st.speaking) { synth.resume(); st.paused = false; emit(); } },
    stop: function () { if (synth) { queue = []; st.speaking = false; st.paused = false; synth.cancel(); emit(); } },

    /* Speech-to-text. cb: {onText(text, final), onError(message), onEnd()} */
    listen: function (cb) {
      if (!Rec) { cb.onError('Voice input is not available in this browser. You can type your question instead.'); return null; }
      try {
        rec = new Rec();
        rec.lang = (BW.store && BW.store.state.prefs.speechLang) || 'en-GB';
        rec.interimResults = true; rec.maxAlternatives = 1; rec.continuous = false;
        rec.onresult = function (e) {
          var txt = '', fin = false;
          for (var k = e.resultIndex; k < e.results.length; k++) { txt += e.results[k][0].transcript; if (e.results[k].isFinal) fin = true; }
          cb.onText(txt, fin);
        };
        rec.onerror = function (e) { cb.onError(V.errorText(e.error)); };
        rec.onend = function () { rec = null; cb.onEnd && cb.onEnd(); };
        rec.start();
        return rec;
      } catch (err) { cb.onError('Voice input could not start here. You can type your question instead.'); return null; }
    },
    stopListening: function () { if (rec) try { rec.stop(); } catch (e) { /* ignore */ } },
    errorText: function (code) {
      return ({
        'not-allowed': 'Microphone access is blocked. Allow the microphone for this site in your browser settings, or type your question instead. (Inside the Claude preview the microphone is always blocked; it works when you run BodyWise from its own web address.)',
        'service-not-allowed': 'This browser does not allow speech recognition on this page. Type your question instead.',
        'no-speech': 'I did not hear anything. Try again closer to the microphone, or type your question.',
        'audio-capture': 'No microphone was found. Check that one is connected, or type your question.',
        'network': 'Speech recognition needs an internet connection in this browser. Type your question instead.',
        'aborted': 'Listening stopped.',
        'language-not-supported': 'This speech language is not supported here. Try another in Preferences, or type instead.'
      })[code] || 'Voice input stopped unexpectedly (' + code + '). You can type your question instead.';
    }
  };
  if (synth && 'onvoiceschanged' in synth) synth.onvoiceschanged = function () { emit(); };
  BW.voice = V;
})(window.BW = window.BW || {});
