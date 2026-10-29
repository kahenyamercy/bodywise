/* BodyWise — original SVG diagrams. Every diagram is drawn in code so it is
   free, scales to any screen and follows the light/dark theme.
   draw(key, {hide:true}) replaces numbered labels with blanks for labelling quizzes. */
(function (BW) {
  'use strict';
  var uid = 0;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function svgOpen(w, h, key, meta) {
    var id = 'dg' + (++uid);
    return {
      id: id,
      open: '<svg viewBox="0 0 ' + w + ' ' + h + '" class="diagram" role="img" aria-labelledby="' + id + 't ' + id + 'd" xmlns="http://www.w3.org/2000/svg">' +
        '<title id="' + id + 't">' + esc(meta.title) + '</title><desc id="' + id + 'd">' + esc(meta.desc) + '</desc>' +
        '<defs><marker id="' + id + 'a" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="d-ah"/></marker>' +
        '<marker id="' + id + 'b" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="d-ah-accent"/></marker></defs>',
      arrow: 'url(#' + id + 'a)', arrowB: 'url(#' + id + 'b)'
    };
  }

  /* Numbered label: a badge plus text. In hide mode the text becomes a blank. */
  function tag(n, x, y, text, hide, anchor) {
    anchor = anchor || 'start';
    var bx = anchor === 'end' ? x + 14 : x - 14;
    return '<g class="d-tag"><circle cx="' + bx + '" cy="' + (y - 5) + '" r="10" class="d-badge"/>' +
      '<text x="' + bx + '" y="' + (y - 1) + '" class="d-badge-t" text-anchor="middle">' + n + '</text>' +
      '<text x="' + x + '" y="' + y + '" class="d-label" text-anchor="' + anchor + '">' + (hide ? '?' : esc(text)) + '</text></g>';
  }
  function txt(x, y, s, cls, anchor) {
    return '<text x="' + x + '" y="' + y + '" class="' + (cls || 'd-small') + '" text-anchor="' + (anchor || 'start') + '">' + esc(s) + '</text>';
  }

  /* Generic flowchart renderer. */
  function flow(spec, opt) {
    var s = svgOpen(spec.w, spec.h, spec.key, spec.meta);
    var out = s.open, byId = {}, labels = '';
    spec.nodes.forEach(function (n) {
      var lines = (opt.hide && n.n ? '?' : n.label).split('\n');
      var subs = n.sub ? n.sub.split('\n') : [];
      n._h = n.h || (18 + lines.length * 18 + subs.length * 15 + (n.n ? 4 : 0));
      n._w = n.w || 150;
      byId[n.id] = n;
    });
    function clip(n, tx, ty) {
      var cx = n.x + n._w / 2, cy = n.y + n._h / 2, dx = tx - cx, dy = ty - cy;
      if (dx === 0 && dy === 0) return [cx, cy];
      var sx = (n._w / 2 + 4) / Math.abs(dx || 1e-9), sy = (n._h / 2 + 4) / Math.abs(dy || 1e-9), k = Math.min(sx, sy);
      return [cx + dx * k, cy + dy * k];
    }
    (spec.edges || []).forEach(function (e) {
      var a = byId[e.from], b = byId[e.to];
      var acx = a.x + a._w / 2, acy = a.y + a._h / 2, bcx = b.x + b._w / 2, bcy = b.y + b._h / 2;
      var p1, p2, d;
      if (e.via) {
        p1 = clip(a, e.via[0][0], e.via[0][1]);
        var last = e.via[e.via.length - 1];
        p2 = clip(b, last[0], last[1]);
        d = 'M' + p1.join(',') + e.via.map(function (v) { return ' L' + v.join(','); }).join('') + ' L' + p2.join(',');
      } else {
        p1 = clip(a, bcx, bcy); p2 = clip(b, acx, acy);
        d = 'M' + p1.join(',') + ' L' + p2.join(',');
      }
      out += '<path d="' + d + '" class="d-edge' + (e.dash ? ' d-dash' : '') + (e.accent ? ' d-edge-accent' : '') + '" marker-end="' + (e.accent ? s.arrowB : s.arrow) + '"/>';
      if (e.label) {
        var lx = e.lx != null ? e.lx : (p1[0] + p2[0]) / 2, ly = e.ly != null ? e.ly : Math.min(p1[1], p2[1]) - 8;
        labels += '<text x="' + lx + '" y="' + ly + '" class="d-elabel" text-anchor="middle">' + esc(e.label) + '</text>';
      }
    });
    spec.nodes.forEach(function (n) {
      var lines = (opt.hide && n.n ? '?' : n.label).split('\n');
      var subs = n.sub ? n.sub.split('\n') : [];
      out += '<g class="d-node' + (n.sys ? ' sys-' + n.sys : '') + (n.strong ? ' d-strong' : '') + '">';
      out += '<rect x="' + n.x + '" y="' + n.y + '" width="' + n._w + '" height="' + n._h + '" rx="10"/>';
      var ty = n.y + 22 + (n.n ? 2 : 0);
      if (n.n) {
        out += '<circle cx="' + (n.x + 2) + '" cy="' + (n.y + 2) + '" r="11" class="d-badge"/><text x="' + (n.x + 2) + '" y="' + (n.y + 6) + '" class="d-badge-t" text-anchor="middle">' + n.n + '</text>';
      }
      lines.forEach(function (l) { out += '<text x="' + (n.x + n._w / 2) + '" y="' + ty + '" class="d-ntext" text-anchor="middle">' + esc(l) + '</text>'; ty += 18; });
      subs.forEach(function (l) { out += '<text x="' + (n.x + n._w / 2) + '" y="' + (ty - 2) + '" class="d-nsub" text-anchor="middle">' + esc(l) + '</text>'; ty += 15; });
      out += '</g>';
    });
    out += labels;
    (spec.notes || []).forEach(function (t) { out += txt(t[0], t[1], t[2], t[3] || 'd-small', t[4]); });
    return out + '</svg>';
  }

  var D = {};
  var META = {
    loop: { title: 'Homeostatic control loop', desc: 'A stimulus is detected by a receptor, compared by a control centre, and corrected by an effector; the response feeds back to reduce the stimulus. Example: body temperature.' },
    feedback: { title: 'Negative versus positive feedback', desc: 'Left: rising glucose triggers insulin, which lowers glucose (negative). Right: cervical stretch triggers oxytocin, which strengthens contractions and increases stretch until birth (positive).' },
    membrane: { title: 'Four ways substances cross a membrane', desc: 'A phospholipid bilayer with simple diffusion of oxygen, osmosis of water through an aquaporin, facilitated diffusion of glucose through a carrier, and the sodium–potassium pump using ATP.' },
    actionpotential: { title: 'Phases of an action potential', desc: 'Membrane voltage over time: resting at −70 mV, rising to threshold at −55 mV, rapid depolarisation to about +30 mV, repolarisation, then brief hyperpolarisation.' },
    heart: { title: 'Blood flow through the heart', desc: 'Four chambers drawn as if facing the person. Deoxygenated blood enters the right atrium, passes to the right ventricle and the pulmonary artery. Oxygenated blood returns to the left atrium, passes to the left ventricle and leaves by the aorta.' },
    baroreflex: { title: 'Baroreceptor reflex', desc: 'Rising blood pressure stretches baroreceptors, which signal the medulla. Parasympathetic output rises and sympathetic falls, slowing the heart and dilating arterioles, so pressure falls.' },
    alveolus: { title: 'Gas exchange at an alveolus', desc: 'An alveolus beside a capillary. Oxygen diffuses from alveolar air (about 104 mmHg) into blood (about 40 mmHg); carbon dioxide diffuses from blood (about 45 mmHg) into the alveolus (about 40 mmHg).' },
    autonomic: { title: 'Sympathetic and parasympathetic effects', desc: 'Side-by-side effects of the two autonomic divisions on the heart, airways, pupils, gut, liver and bladder.' },
    glucose: { title: 'Insulin and glucagon control of blood glucose', desc: 'High glucose stimulates beta cells to release insulin, which moves glucose into cells and stores. Low glucose stimulates alpha cells to release glucagon, which makes the liver release glucose.' },
    gitract: { title: 'The digestive tract', desc: 'Food passes from mouth to oesophagus, stomach, small intestine and large intestine. The liver (bile) and pancreas (enzymes) deliver secretions into the small intestine.' },
    nephron: { title: 'The nephron', desc: 'Filtrate forms at the glomerulus, flows through the proximal tubule, the loop of Henle dipping into the medulla, the distal tubule, and into the collecting duct, where ADH controls water reabsorption.' },
    raas: { title: 'Renin–angiotensin–aldosterone system', desc: 'Low pressure triggers renin from the kidney, which converts liver angiotensinogen to angiotensin I; ACE in the lungs forms angiotensin II, which constricts vessels and triggers aldosterone, ADH and thirst.' },
    sarcomere: { title: 'Sliding filaments in a sarcomere', desc: 'A relaxed sarcomere (top) and a contracted one (bottom). Actin filaments attached to Z discs slide over myosin towards the M line; the filaments themselves stay the same length.' },
    immune: { title: 'Layers of immune defence over time', desc: 'Barriers act constantly, the innate response within minutes to hours, the adaptive response over days, and memory lasts for years.' },
    thermo: { title: 'Temperature regulation by the hypothalamus', desc: 'When too hot, the hypothalamus triggers sweating and skin vasodilation. When too cold, it triggers shivering and vasoconstriction. Both return core temperature to the set point.' },
    pregnancy: { title: 'Maternal adaptations in pregnancy', desc: 'Pregnancy hormones drive changes across systems: higher blood volume and cardiac output, more ventilation, higher kidney filtration, slower gut, reduced insulin sensitivity late in pregnancy and more clotting factors.' },
    o2cascade: { title: 'The oxygen cascade', desc: 'Bar chart of oxygen partial pressure: about 160 mmHg in air at sea level, 130 in Nairobi air, 104 in alveoli, 98 in arterial blood, 40 in venous blood from resting muscle, and a few mmHg in mitochondria.' }
  };
  BW.diagramMeta = META;

  D.loop = function (o) {
    return flow({ key: 'loop', meta: META.loop, w: 660, h: 300,
      nodes: [
        { id: 'a', n: 1, label: 'Stimulus', sub: 'Core temperature rises', x: 20, y: 30, w: 180, sys: 'ns' },
        { id: 'b', n: 2, label: 'Receptor', sub: 'Thermoreceptors', x: 240, y: 30, w: 180, sys: 'ns' },
        { id: 'c', n: 3, label: 'Control centre', sub: 'Hypothalamus', x: 460, y: 30, w: 180, sys: 'ns' },
        { id: 'd', n: 4, label: 'Effector', sub: 'Sweat glands, skin vessels', x: 460, y: 190, w: 180, sys: 'cv' },
        { id: 'e', n: 5, label: 'Response', sub: 'Heat lost, temperature falls', x: 240, y: 190, w: 180, sys: 'cv' }
      ],
      edges: [
        { from: 'a', to: 'b' }, { from: 'b', to: 'c' },
        { from: 'c', to: 'd', label: 'command', lx: 600, ly: 160 }, { from: 'd', to: 'e' },
        { from: 'e', to: 'a', label: 'feedback reduces stimulus', accent: true, via: [[110, 220]], lx: 120, ly: 270 }
      ]
    }, o);
  };

  D.feedback = function (o) {
    return flow({ key: 'feedback', meta: META.feedback, w: 660, h: 330,
      nodes: [
        { id: 'n1', label: 'Glucose rises', x: 30, y: 40, w: 170, sys: 'di' },
        { id: 'n2', label: 'Insulin released', x: 30, y: 135, w: 170, sys: 'en' },
        { id: 'n3', label: 'Glucose falls', sub: 'back to set point', x: 30, y: 230, w: 170, sys: 'en' },
        { id: 'p1', label: 'Cervix stretched', x: 380, y: 40, w: 200, sys: 'rp' },
        { id: 'p2', label: 'Oxytocin released', x: 380, y: 135, w: 200, sys: 'en' },
        { id: 'p3', label: 'Stronger contractions', sub: 'more stretch', x: 380, y: 230, w: 200, sys: 'rp' }
      ],
      edges: [
        { from: 'n1', to: 'n2' }, { from: 'n2', to: 'n3' },
        { from: 'n3', to: 'n1', label: '− opposes', accent: true, via: [[250, 255], [250, 60]], lx: 262, ly: 160 },
        { from: 'p1', to: 'p2' }, { from: 'p2', to: 'p3' },
        { from: 'p3', to: 'p1', label: '+ amplifies', accent: true, via: [[630, 255], [630, 60]], lx: 620, ly: 160 }
      ],
      notes: [[115, 22, 'NEGATIVE FEEDBACK', 'd-head', 'middle'], [480, 22, 'POSITIVE FEEDBACK', 'd-head', 'middle'], [480, 318, 'Loop ends when the baby is born', 'd-small', 'middle'], [115, 318, 'Stabilises', 'd-small', 'middle']]
    }, o);
  };

  D.membrane = function (o) {
    var s = svgOpen(660, 330, 'membrane', META.membrane), h = o.hide, out = s.open;
    out += '<rect x="0" y="40" width="660" height="100" class="d-zone-a"/>' + '<rect x="0" y="210" width="660" height="120" class="d-zone-b"/>';
    out += txt(650, 60, 'OUTSIDE (extracellular fluid)', 'd-head', 'end') + txt(16, 324, 'INSIDE (cytoplasm)', 'd-head');
    var gaps = [[230, 290], [380, 450], [520, 610]];
    for (var x = 10; x < 660; x += 14) {
      var inGap = gaps.some(function (g) { return x > g[0] - 6 && x < g[1] + 6; });
      if (inGap) continue;
      out += '<line x1="' + x + '" y1="152" x2="' + x + '" y2="172" class="d-tail"/><line x1="' + x + '" y1="178" x2="' + x + '" y2="198" class="d-tail"/>';
      out += '<circle cx="' + x + '" cy="148" r="6" class="d-head-c"/><circle cx="' + x + '" cy="202" r="6" class="d-head-c"/>';
    }
    // 1 simple diffusion
    out += '<path d="M110,95 L110,250" class="d-edge" marker-end="' + s.arrow + '"/>';
    ['O₂', 'O₂', 'O₂'].forEach(function (g, i) { out += txt(78 + i * 14, 100 + i * 14, g, 'd-mol'); });
    out += txt(126, 255, 'O₂', 'd-mol');
    out += tag(1, 40, 30, 'Simple diffusion', h);
    // 2 osmosis via aquaporin
    out += '<rect x="234" y="140" width="18" height="70" rx="5" class="d-protein"/><rect x="268" y="140" width="18" height="70" rx="5" class="d-protein"/>';
    out += '<path d="M260,90 L260,255" class="d-edge" marker-end="' + s.arrow + '"/>' + txt(270, 100, 'H₂O', 'd-mol') + txt(270, 252, 'H₂O', 'd-mol');
    out += tag(2, 210, 30, 'Osmosis', h);
    // 3 facilitated diffusion
    out += '<rect x="385" y="135" width="60" height="80" rx="18" class="d-protein"/>';
    out += '<path d="M415,90 L415,262" class="d-edge" marker-end="' + s.arrow + '"/>' + txt(425, 104, 'glucose', 'd-mol') + txt(425, 260, 'glucose', 'd-mol');
    out += tag(3, 350, 30, 'Facilitated diffusion', h);
    // 4 pump
    out += '<rect x="525" y="130" width="80" height="90" rx="14" class="d-protein d-pump"/>';
    out += '<path d="M545,250 L545,95" class="d-edge d-edge-accent" marker-end="' + s.arrowB + '"/><path d="M585,95 L585,250" class="d-edge d-edge-accent" marker-end="' + s.arrowB + '"/>';
    out += txt(535, 268, '3 Na⁺', 'd-mol', 'end') + txt(595, 92, '2 K⁺', 'd-mol') + txt(565, 292, 'ATP → ADP', 'd-small', 'middle');
    out += tag(4, 400, 318, 'Active transport (Na⁺/K⁺ pump)', h);
    out += txt(16, 286, 'Passive: high → low, no ATP', 'd-small') + txt(16, 302, 'Active: low → high, uses ATP', 'd-small');
    return out + '</svg>';
  };

  D.actionpotential = function (o) {
    var s = svgOpen(660, 330, 'actionpotential', META.actionpotential), h = o.hide, out = s.open;
    function Y(mv) { return 280 - (mv + 90) * (240 / 130); }
    out += '<line x1="70" y1="20" x2="70" y2="290" class="d-axis"/><line x1="70" y1="290" x2="640" y2="290" class="d-axis"/>';
    [30, 0, -55, -70, -90].forEach(function (v) { out += '<line x1="64" y1="' + Y(v) + '" x2="70" y2="' + Y(v) + '" class="d-axis"/>' + txt(60, Y(v) + 4, (v > 0 ? '+' : '') + v, 'd-small', 'end'); });
    out += txt(20, 150, 'mV', 'd-small') + txt(640, 315, 'time (about 2–3 ms for the spike) →', 'd-small', 'end');
    out += '<line x1="70" y1="' + Y(-55) + '" x2="640" y2="' + Y(-55) + '" class="d-grid d-dash"/>';
    out += '<line x1="70" y1="' + Y(0) + '" x2="640" y2="' + Y(0) + '" class="d-grid"/>';
    var p = 'M70,' + Y(-70) + ' L170,' + Y(-70) + ' C185,' + Y(-70) + ' 195,' + Y(-58) + ' 205,' + Y(-55) +
      ' C215,' + Y(-40) + ' 222,' + Y(25) + ' 232,' + Y(30) + ' C244,' + Y(30) + ' 252,' + Y(-20) + ' 268,' + Y(-70) +
      ' C278,' + Y(-84) + ' 296,' + Y(-82) + ' 320,' + Y(-76) + ' C350,' + Y(-71) + ' 380,' + Y(-70) + ' 420,' + Y(-70) + ' L640,' + Y(-70);
    out += '<path d="' + p + '" class="d-trace"/>';
    out += txt(214, Y(5), 'Na⁺ in', 'd-mol', 'end') + txt(258, Y(5), 'K⁺ out', 'd-mol');
    out += tag(1, 90, Y(-70) - 12, 'Resting potential', h);
    out += tag(2, 480, Y(-55) - 8, 'Threshold', h);
    out += tag(3, 110, Y(25), 'Depolarisation', h);
    out += '<line x1="216" y1="' + Y(15) + '" x2="200" y2="' + Y(20) + '" class="d-leader"/>';
    out += tag(4, 300, Y(18), 'Repolarisation', h);
    out += '<line x1="296" y1="' + Y(14) + '" x2="252" y2="' + Y(-10) + '" class="d-leader"/>';
    out += tag(5, 330, Y(-86) + 6, 'Hyperpolarisation', h);
    return out + '</svg>';
  };

  D.heart = function (o) {
    var s = svgOpen(680, 400, 'heart', META.heart), h = o.hide, out = s.open;
    out += '<rect x="120" y="100" width="140" height="90" rx="16" class="d-chamber deoxy"/>';
    out += '<rect x="120" y="200" width="140" height="140" rx="22" class="d-chamber deoxy"/>';
    out += '<rect x="340" y="100" width="140" height="90" rx="16" class="d-chamber oxy"/>';
    out += '<rect x="340" y="200" width="140" height="150" rx="22" class="d-chamber oxy d-thick"/>';
    // vessels
    out += '<path d="M140,22 L140,98" class="d-vessel deoxy" marker-end="' + s.arrow + '"/>' + txt(128, 30, 'Superior vena cava', 'd-small', 'end');
    out += '<path d="M80,380 L80,165 L118,165" class="d-vessel deoxy" marker-end="' + s.arrow + '"/>' + txt(20, 395, 'Inferior vena cava', 'd-small');
    out += '<path d="M245,215 C290,200 290,90 290,60 C290,46 270,44 236,44" class="d-vessel deoxy" marker-end="' + s.arrow + '"/>';
    out += '<path d="M352,215 C318,205 318,120 318,40 C318,26 330,22 360,22 L540,22 C556,22 560,30 560,46 L560,330" class="d-vessel oxy" marker-end="' + s.arrow + '"/>';
    out += '<path d="M430,52 L430,98" class="d-vessel oxy" marker-end="' + s.arrow + '"/>' + txt(440, 62, 'Pulmonary veins', 'd-small') + txt(440, 76, '(from lungs)', 'd-small');
    // valves
    out += '<line x1="150" y1="195" x2="230" y2="195" class="d-valve"/>' + txt(154, 214, 'tricuspid valve', 'd-tiny');
    out += '<line x1="370" y1="195" x2="450" y2="195" class="d-valve"/>' + txt(374, 214, 'mitral valve', 'd-tiny');
    out += '<line x1="279" y1="150" x2="301" y2="150" class="d-valve"/>' + ''+'';
    out += '<line x1="307" y1="150" x2="329" y2="150" class="d-valve"/>' + ''+'';
    // in-chamber flow
    out += '<path d="M190,150 L190,250" class="d-flow" marker-end="' + s.arrow + '"/><path d="M410,150 L410,255" class="d-flow" marker-end="' + s.arrow + '"/>';
    out += tag(1, 140, 128, 'Right atrium', h);
    out += tag(2, 140, 300, 'Right ventricle', h);
    out += tag(3, 360, 128, 'Left atrium', h);
    out += tag(4, 360, 310, 'Left ventricle', h);
    out += tag(5, 586, 180, 'Aorta → body', h);
    out += tag(6, 168, 84, 'Pulmonary artery', h) + txt(232, 38, 'to lungs', 'd-tiny', 'end');
    out += '<line x1="250" y1="76" x2="282" y2="70" class="d-leader"/>';
    // legend
    out += '<g class="d-legend"><line x1="540" y1="360" x2="570" y2="360" class="d-vessel oxy"/>' + txt(576, 364, 'oxygen-rich', 'd-tiny') +
      '<line x1="540" y1="382" x2="570" y2="382" class="d-vessel deoxy"/>' + txt(576, 386, 'oxygen-poor', 'd-tiny') + '</g>';
    out += txt(120, 368, 'Drawn facing the person: their right side is on your left. Black bars = valves.', 'd-tiny');
    return out + '</svg>';
  };

  D.baroreflex = function (o) {
    return flow({ key: 'baroreflex', meta: META.baroreflex, w: 660, h: 320,
      nodes: [
        { id: 'a', label: 'Blood pressure rises', x: 20, y: 30, w: 190, sys: 'cv' },
        { id: 'b', label: 'Baroreceptors fire faster', sub: 'carotid sinus, aortic arch', x: 240, y: 30, w: 190, sys: 'ns' },
        { id: 'c', label: 'Cardiovascular centre', sub: 'medulla (brainstem)', x: 460, y: 30, w: 180, sys: 'ns' },
        { id: 'd', label: '↑ Parasympathetic\n↓ Sympathetic', x: 460, y: 175, w: 180, sys: 'ns' },
        { id: 'e', label: 'Slower, weaker beats\nArterioles dilate', x: 240, y: 175, w: 190, sys: 'cv' },
        { id: 'f', label: 'Pressure falls', sub: 'towards normal', x: 20, y: 175, w: 190, sys: 'cv', strong: true }
      ],
      edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'd' }, { from: 'd', to: 'e' }, { from: 'e', to: 'f' },
        { from: 'f', to: 'a', label: 'negative feedback', accent: true, lx: 115, ly: 150 }],
      notes: [[330, 300, 'If pressure falls instead, every arrow runs the other way: more sympathetic, faster heart, narrower arterioles.', 'd-small', 'middle']]
    }, o);
  };

  D.alveolus = function (o) {
    var s = svgOpen(660, 330, 'alveolus', META.alveolus), h = o.hide, out = s.open;
    out += '<circle cx="190" cy="170" r="130" class="d-air"/>';
    out += txt(190, 160, 'Alveolar air', 'd-head', 'middle') + txt(190, 182, 'PO₂ ≈ 104 mmHg', 'd-small', 'middle') + txt(190, 200, 'PCO₂ ≈ 40 mmHg', 'd-small', 'middle');
    out += '<rect x="360" y="20" width="80" height="300" rx="40" class="d-capillary"/>';
    [70, 135, 200, 265].forEach(function (y) { out += '<ellipse cx="400" cy="' + y + '" rx="22" ry="12" class="d-rbc"/>'; });
    out += '<path d="M400,30 L400,40" class="d-flow"/>';
    out += txt(450, 34, 'From body:', 'd-small') + txt(450, 50, 'PO₂ ≈ 40, PCO₂ ≈ 45', 'd-small') + txt(450, 316, 'Blood to heart: PO₂ ≈ 100', 'd-small');
    out += '<path d="M600,60 L600,280" class="d-flow" marker-end="' + s.arrow + '"/>' + txt(608, 175, 'flow', 'd-tiny');
    out += '<path d="M300,120 L372,120" class="d-edge d-edge-accent" marker-end="' + s.arrowB + '"/>';
    out += '<path d="M372,230 L300,230" class="d-edge" marker-end="' + s.arrow + '"/>';
    out += tag(1, 60, 30, 'Alveolus', h);
    out += tag(2, 470, 90, 'Capillary', h);
    out += tag(3, 250, 100, 'Oxygen into blood', h, 'end');
    out += tag(4, 250, 255, 'Carbon dioxide out of blood', h, 'end');
    out += tag(5, 470, 240, 'Red blood cell', h);
    out += '<line x1="456" y1="236" x2="424" y2="262" class="d-leader"/>';
    out += txt(330, 176, 'barrier < 1 µm', 'd-tiny', 'middle');
    return out + '</svg>';
  };

  D.autonomic = function (o) {
    var s = svgOpen(660, 360, 'autonomic', META.autonomic), out = s.open;
    var rows = [['Heart', 'Faster, stronger', 'Slower'], ['Airways', 'Widen', 'Narrow'], ['Pupils', 'Dilate', 'Constrict'], ['Gut', 'Slows down', 'Speeds up, secretes'], ['Liver', 'Releases glucose', 'Stores glycogen'], ['Bladder', 'Holds urine', 'Empties']];
    out += '<rect x="10" y="10" width="220" height="56" rx="10" class="d-colhead sys-ns"/>' + txt(120, 34, 'Sympathetic', 'd-head', 'middle') + txt(120, 54, 'action · noradrenaline', 'd-small', 'middle');
    out += '<rect x="430" y="10" width="220" height="56" rx="10" class="d-colhead sys-di"/>' + txt(540, 34, 'Parasympathetic', 'd-head', 'middle') + txt(540, 54, 'rest & digest · acetylcholine', 'd-small', 'middle');
    rows.forEach(function (r, i) {
      var y = 100 + i * 42;
      out += '<rect x="265" y="' + (y - 18) + '" width="130" height="30" rx="15" class="d-organ"/>' + txt(330, y + 2, r[0], 'd-ntext', 'middle');
      out += '<path d="M232,' + (y - 3) + ' L262,' + (y - 3) + '" class="d-edge" marker-end="' + s.arrow + '"/>' + txt(225, y + 2, r[1], 'd-small', 'end');
      out += '<path d="M428,' + (y - 3) + ' L398,' + (y - 3) + '" class="d-edge" marker-end="' + s.arrow + '"/>' + txt(435, y + 2, r[2], 'd-small');
    });
    return out + '</svg>';
  };

  D.glucose = function (o) {
    return flow({ key: 'glucose', meta: META.glucose, w: 680, h: 360,
      nodes: [
        { id: 'hi', label: 'Glucose rises', sub: 'after a meal', x: 20, y: 30, w: 150, sys: 'di' },
        { id: 'b', n: 1, label: 'Beta cells', sub: 'pancreatic islets', x: 200, y: 30, w: 140, sys: 'en' },
        { id: 'i', n: 2, label: 'Insulin', x: 370, y: 30, w: 120, sys: 'en' },
        { id: 'up', label: 'Cells take up glucose', sub: 'liver & muscle\nstore glycogen', x: 510, y: 14, w: 160, sys: 'ms' },
        { id: 'norm', label: 'Normal range', sub: '≈ 4–5.5 mmol/L fasting', x: 255, y: 150, w: 170, sys: 'cv', strong: true },
        { id: 'lo', label: 'Glucose falls', sub: 'between meals', x: 20, y: 270, w: 150, sys: 'di' },
        { id: 'a', n: 3, label: 'Alpha cells', sub: 'pancreatic islets', x: 200, y: 270, w: 140, sys: 'en' },
        { id: 'g', n: 4, label: 'Glucagon', x: 370, y: 270, w: 120, sys: 'en' },
        { id: 'rel', label: 'Liver releases glucose', sub: 'glycogen breakdown', x: 510, y: 262, w: 160, sys: 'di' }
      ],
      edges: [{ from: 'hi', to: 'b' }, { from: 'b', to: 'i' }, { from: 'i', to: 'up' }, { from: 'up', to: 'norm', accent: true },
        { from: 'lo', to: 'a' }, { from: 'a', to: 'g' }, { from: 'g', to: 'rel' }, { from: 'rel', to: 'norm', accent: true },
        { from: 'norm', to: 'hi', dash: true }, { from: 'norm', to: 'lo', dash: true }]
    }, o);
  };

  D.gitract = function (o) {
    return flow({ key: 'gitract', meta: META.gitract, w: 640, h: 440,
      nodes: [
        { id: 'm', label: 'Mouth', sub: 'chewing, amylase', x: 230, y: 10, w: 180, sys: 'di' },
        { id: 'o', label: 'Oesophagus', sub: 'peristalsis', x: 230, y: 85, w: 180, sys: 'di' },
        { id: 's', n: 1, label: 'Stomach', sub: 'acid, pepsin, churning', x: 230, y: 165, w: 180, sys: 'di' },
        { id: 'si', n: 2, label: 'Small intestine', sub: 'most digestion & absorption', x: 230, y: 255, w: 180, sys: 'di', strong: true },
        { id: 'li', n: 3, label: 'Large intestine', sub: 'water, electrolytes, fibre', x: 230, y: 345, w: 180, sys: 'di' },
        { id: 'lv', n: 4, label: 'Liver', sub: 'makes bile', x: 20, y: 200, w: 150, sys: 'en' },
        { id: 'pa', n: 5, label: 'Pancreas', sub: 'enzymes, bicarbonate', x: 470, y: 200, w: 150, sys: 'en' }
      ],
      edges: [{ from: 'm', to: 'o' }, { from: 'o', to: 's' }, { from: 's', to: 'si' }, { from: 'si', to: 'li' },
        { from: 'lv', to: 'si', label: 'bile', accent: true, via: [[95, 280]], lx: 140, ly: 300 },
        { from: 'pa', to: 'si', label: 'enzymes', accent: true, via: [[545, 280]], lx: 500, ly: 300 }],
      notes: [[20, 432, 'Absorbed sugars and amino acids → liver (portal vein). Fats → lymph.', 'd-small']]
    }, o);
  };

  D.nephron = function (o) {
    var s = svgOpen(700, 390, 'nephron', META.nephron), h = o.hide, out = s.open;
    out += '<rect x="0" y="0" width="700" height="170" class="d-zone-a"/><rect x="0" y="170" width="700" height="220" class="d-zone-b"/>';
    out += txt(690, 20, 'CORTEX', 'd-head', 'end') + txt(16, 192, 'MEDULLA (salty)', 'd-head');
    out += '<path d="M20,60 L70,80" class="d-vessel oxy" marker-end="' + s.arrow + '"/>' + txt(14, 50, 'blood in', 'd-tiny');
    out += '<path d="M120,72 C130,40 70,30 60,60 C50,90 70,120 100,122 C118,124 128,112 130,100" class="d-capsule"/>';
    out += '<circle cx="95" cy="85" r="24" class="d-glom"/>';
    var tube = 'M130,100 C165,60 190,135 225,95 S275,55 300,105 L300,330 C300,350 345,350 345,330 L345,145 C370,105 410,160 440,115 S500,80 540,100';
    out += '<path d="' + tube + '" class="d-tube"/><path d="' + tube + '" class="d-lumen"/>';
    out += '<path d="M540,40 L540,370" class="d-tube"/><path d="M540,40 L540,370" class="d-lumen"/>';
    out += '<path d="M540,370 L540,385" class="d-flow" marker-end="' + s.arrow + '"/>' + txt(552, 384, 'urine', 'd-tiny');
    out += '<path d="M215,110 L215,150" class="d-edge d-edge-accent" marker-end="' + s.arrowB + '"/>' + txt(222, 156, 'reabsorb', 'd-tiny');
    out += '<path d="M548,250 L600,250" class="d-edge d-edge-accent" marker-end="' + s.arrowB + '"/>' + txt(560, 240, 'water (ADH)', 'd-tiny');
    out += '<path d="M312,240 L280,240" class="d-edge" marker-end="' + s.arrow + '"/>' + txt(275, 236, 'water', 'd-tiny', 'end');
    out += '<path d="M333,240 L370,240" class="d-edge" marker-end="' + s.arrow + '"/>' + txt(374, 236, 'salt', 'd-tiny');
    out += tag(1, 30, 150, 'Glomerulus', h);
    out += tag(2, 175, 40, 'Proximal convoluted tubule', h);
    out += tag(3, 370, 330, 'Loop of Henle', h);
    out += tag(4, 395, 70, 'Distal convoluted tubule', h);
    out += tag(5, 570, 320, 'Collecting duct', h);
    return out + '</svg>';
  };

  D.raas = function (o) {
    return flow({ key: 'raas', meta: META.raas, w: 680, h: 400,
      nodes: [
        { id: 't', label: 'Low BP · low NaCl · sympathetic', x: 20, y: 20, w: 250, sys: 'cv' },
        { id: 'r', n: 1, label: 'Renin', sub: 'kidney (JG cells)', x: 320, y: 20, w: 150, sys: 're' },
        { id: 'ag', n: 2, label: 'Angiotensinogen', sub: 'from liver', x: 20, y: 120, w: 170, sys: 'di' },
        { id: 'a1', label: 'Angiotensin I', x: 240, y: 125, w: 150, sys: 'en' },
        { id: 'ace', n: 3, label: 'ACE', sub: 'mostly lung vessels', x: 440, y: 120, w: 150, sys: 'rs' },
        { id: 'a2', n: 4, label: 'Angiotensin II', x: 240, y: 220, w: 170, sys: 'en', strong: true },
        { id: 'vc', label: 'Vasoconstriction', x: 20, y: 310, w: 160, sys: 'cv' },
        { id: 'al', n: 5, label: 'Aldosterone', sub: 'adrenal cortex → Na⁺ kept', x: 210, y: 310, w: 210, sys: 'en' },
        { id: 'adh', label: 'ADH + thirst', x: 450, y: 310, w: 150, sys: 'ns' },
        { id: 'up', label: 'BP & volume rise', x: 470, y: 215, w: 190, sys: 'cv' }
      ],
      edges: [{ from: 't', to: 'r' }, { from: 'r', to: 'ag', label: 'acts on', via: [[395, 95], [105, 95]], lx: 250, ly: 90 }, { from: 'ag', to: 'a1' }, { from: 'a1', to: 'ace' }, { from: 'ace', to: 'a2', label: 'converts', via: [[515, 200], [325, 200]], lx: 440, ly: 195 },
        { from: 'a2', to: 'vc' }, { from: 'a2', to: 'al' }, { from: 'a2', to: 'adh' }, { from: 'adh', to: 'up' }, { from: 'up', to: 'r', label: 'renin falls', accent: true, dash: true, via: [[640, 60]], lx: 610, ly: 50 }]
    }, o);
  };

  D.sarcomere = function (o) {
    var s = svgOpen(660, 330, 'sarcomere', META.sarcomere), h = o.hide, out = s.open;
    function sarc(y, zl, zr, label) {
      var o2 = txt(10, y - 52, label, 'd-head');
      [zl, zr].forEach(function (z) { o2 += '<path d="M' + z + ',' + (y - 45) + ' l8,12 l-16,12 l16,12 l-16,12 l16,12 l-16,12 l8,12" class="d-zdisc"/>'; });
      [-30, 0, 30].forEach(function (dy) {
        o2 += '<line x1="' + zl + '" y1="' + (y + dy) + '" x2="' + (zl + 180) + '" y2="' + (y + dy) + '" class="d-actin"/>';
        o2 += '<line x1="' + (zr - 180) + '" y1="' + (y + dy) + '" x2="' + zr + '" y2="' + (y + dy) + '" class="d-actin"/>';
      });
      [-15, 15].forEach(function (dy) {
        o2 += '<rect x="200" y="' + (y + dy - 5) + '" width="260" height="10" rx="5" class="d-myosin"/>';
        for (var x = 210; x <= 450; x += 20) { if (Math.abs(x - 330) < 14) continue; var dir = x < 330 ? -1 : 1; o2 += '<line x1="' + x + '" y1="' + (y + dy) + '" x2="' + (x + dir * 7) + '" y2="' + (y + dy + (dy < 0 ? -9 : 9)) + '" class="d-head-m"/>'; }
      });
      o2 += '<line x1="330" y1="' + (y - 42) + '" x2="330" y2="' + (y + 42) + '" class="d-mline"/>';
      return o2;
    }
    out += sarc(95, 60, 600, 'RELAXED');
    out += sarc(255, 140, 520, 'CONTRACTED (Z discs closer; filaments same length)');
    out += '<path d="M150,300 L190,300" class="d-edge" marker-end="' + s.arrow + '"/><path d="M510,300 L470,300" class="d-edge" marker-end="' + s.arrow + '"/>';
    out += tag(1, 90, 40, 'Actin (thin filament)', h);
    out += '<line x1="110" y1="45" x2="120" y2="62" class="d-leader"/>';
    out += tag(2, 360, 40, 'Myosin (thick filament)', h);
    out += '<line x1="380" y1="45" x2="400" y2="78" class="d-leader"/>';
    out += tag(3, 612, 140, 'Z disc', h);
    out += '<line x1="618" y1="128" x2="604" y2="110" class="d-leader"/>';
    out += tag(4, 240, 155, 'M line', h);
    out += '<line x1="290" y1="150" x2="326" y2="132" class="d-leader"/>';
    return out + '</svg>';
  };

  D.immune = function (o) {
    return flow({ key: 'immune', meta: META.immune, w: 680, h: 230,
      nodes: [
        { id: 'a', n: 1, label: 'Barriers', sub: 'skin, mucus, acid\nalways on', x: 10, y: 40, w: 150, sys: 'im' },
        { id: 'b', n: 2, label: 'Innate response', sub: 'neutrophils, macrophages\nminutes–hours', x: 180, y: 40, w: 160, sys: 'im' },
        { id: 'c', n: 3, label: 'Adaptive response', sub: 'T cells, B cells, antibodies\ndays', x: 360, y: 40, w: 160, sys: 'im', strong: true },
        { id: 'd', n: 4, label: 'Memory', sub: 'memory B & T cells\nyears', x: 540, y: 40, w: 130, sys: 'im' }
      ],
      edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'd' },
        { from: 'd', to: 'c', label: 'faster second response', accent: true, via: [[605, 175], [440, 175]], lx: 520, ly: 195 }],
      notes: [[10, 215, 'Vaccination trains step 3 and creates step 4 without the illness.', 'd-small']]
    }, o);
  };

  D.thermo = function (o) {
    return flow({ key: 'thermo', meta: META.thermo, w: 680, h: 330,
      nodes: [
        { id: 'hot', label: 'Too hot', sub: 'exercise, sun', x: 20, y: 30, w: 140, sys: 'cv' },
        { id: 'cold', label: 'Too cold', sub: 'cool night', x: 20, y: 240, w: 140, sys: 'cv' },
        { id: 'h', label: 'Hypothalamus', sub: 'compares with set point ≈ 37 °C', x: 200, y: 130, w: 220, sys: 'ns', strong: true },
        { id: 'sw', label: 'Sweating\nSkin vessels dilate', x: 470, y: 22, w: 190, sys: 'cv' },
        { id: 'sh', label: 'Shivering\nSkin vessels narrow', x: 470, y: 232, w: 190, sys: 'ms' }
      ],
      edges: [{ from: 'hot', to: 'h' }, { from: 'cold', to: 'h' },
        { from: 'h', to: 'sw' }, { from: 'h', to: 'sh' },
        { from: 'sw', to: 'hot', label: 'heat lost', accent: true, via: [[565, 10], [90, 10]], lx: 330, ly: 28 },
        { from: 'sh', to: 'cold', label: 'heat kept & made', accent: true, via: [[565, 320], [90, 320]], lx: 330, ly: 316 }]
    }, o);
  };

  D.pregnancy = function (o) {
    return flow({ key: 'pregnancy', meta: META.pregnancy, w: 680, h: 380,
      nodes: [
        { id: 'h', label: 'Pregnancy hormones', sub: 'hCG, progesterone, oestrogen,\nplacental hormones', x: 230, y: 150, w: 220, sys: 'rp', strong: true },
        { id: 'cv', label: 'Cardiovascular', sub: 'blood volume ↑ 30–50%\ncardiac output ↑', x: 20, y: 20, w: 190, sys: 'cv' },
        { id: 'rs', label: 'Respiratory', sub: 'ventilation ↑\n(deeper breaths)', x: 245, y: 20, w: 190, sys: 'rs' },
        { id: 're', label: 'Renal', sub: 'kidney filtration ↑\n(up to ~50%)', x: 470, y: 20, w: 190, sys: 're' },
        { id: 'di', label: 'Digestive', sub: 'slower gut movement', x: 20, y: 290, w: 190, sys: 'di' },
        { id: 'en', label: 'Metabolic', sub: 'insulin sensitivity ↓\n(later pregnancy)', x: 245, y: 290, w: 190, sys: 'en' },
        { id: 'bl', label: 'Blood', sub: 'clotting factors ↑\nHb concentration dilutes', x: 470, y: 290, w: 190, sys: 'cv' }
      ],
      edges: ['cv', 'rs', 're', 'di', 'en', 'bl'].map(function (k) { return { from: 'h', to: k }; })
    }, o);
  };

  D.o2cascade = function (o) {
    var s = svgOpen(660, 340, 'o2cascade', META.o2cascade), out = s.open;
    var bars = [['Air, sea level', 160, 'rs'], ['Air, Nairobi', 130, 'rs'], ['Alveoli', 104, 'rs'], ['Arterial blood', 98, 'cv'], ['Venous (resting muscle)', 40, 'cv'], ['Mitochondria', 3, 'ms']];
    var base = 280, scale = 220 / 180, bw = 70, gap = 30, x0 = 70;
    out += '<line x1="60" y1="' + base + '" x2="650" y2="' + base + '" class="d-axis"/><line x1="60" y1="40" x2="60" y2="' + base + '" class="d-axis"/>';
    [0, 40, 80, 120, 160].forEach(function (v) { var y = base - v * scale; out += '<line x1="60" y1="' + y + '" x2="650" y2="' + y + '" class="d-grid"/>' + txt(54, y + 4, String(v), 'd-small', 'end'); });
    out += txt(14, 30, 'PO₂ (mmHg)', 'd-small');
    bars.forEach(function (b, i) {
      var x = x0 + i * (bw + gap), hgt = Math.max(2, b[1] * scale);
      out += '<g class="d-node sys-' + b[2] + (i === 1 ? ' d-alt' : '') + '"><rect x="' + x + '" y="' + (base - hgt) + '" width="' + bw + '" height="' + hgt + '" rx="4"/></g>';
      out += txt(x + bw / 2, base - hgt - 8, (b[1] === 3 ? '≈ 1–5' : '≈ ' + b[1]), 'd-ntext', 'middle');
      var words = b[0].split(' ');
      var l1 = words.slice(0, 2).join(' '), l2 = words.slice(2).join(' ');
      out += txt(x + bw / 2, base + 18, l1, 'd-tiny', 'middle');
      if (l2) out += txt(x + bw / 2, base + 32, l2, 'd-tiny', 'middle');
    });
    out += txt(650, 330, 'Approximate values for a healthy adult at rest. Nairobi ≈ 1,795 m.', 'd-tiny', 'end');
    return out + '</svg>';
  };

  BW.diagram = function (key, opt) {
    opt = opt || {};
    if (!D[key]) return '<p class="muted">Diagram unavailable.</p>';
    return D[key](opt);
  };
  BW.diagramKeys = Object.keys(D);
})(window.BW = window.BW || {});
