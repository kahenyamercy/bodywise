/* BodyWise — full lessons, part 1 (Modules 1–3). Educational summaries based on
   the cited open sources. Analogies are models, not exact descriptions. */
(function (BW) {
  'use strict';
  var F = BW.fullLessons = BW.fullLessons || {};

  F['m1-l3'] = {
    keywords: ['homeostasis', 'internal environment', 'set point', 'stable', 'balance', 'extracellular fluid', 'normal range'],
    why: 'Almost every topic in physiology is a story about keeping something steady: temperature, glucose, blood pressure, water, pH. Once you see the pattern, the rest of the body becomes easier to understand.',
    objectives: ['Explain what the internal environment is and why cells depend on it.', 'Define homeostasis and a normal range.', 'Name the parts of a homeostatic control loop.', 'Describe one everyday example of homeostasis in action.'],
    intro: 'Your cells are fussy. They work properly only when the fluid around them has the right temperature, the right amount of water, the right salts, enough glucose and oxygen, and not too much acid. That surrounding fluid is the internal environment. Homeostasis is the body’s constant work to keep it within a comfortable range, even when the outside world is hot, cold, salty, dry or chaotic.',
    detail: [
      'Most cells are bathed in extracellular fluid (ECF): the interstitial fluid between cells plus blood plasma. Claude Bernard called this the milieu intérieur. Cells exchange nutrients, gases and wastes with this fluid, so its composition directly affects how they work.',
      'Homeostasis does not mean that values never change. It means each variable is held within a normal range around a set point. Body temperature drifts slightly through the day; blood glucose rises after a meal and falls overnight. What matters is that the deviation is detected and corrected.',
      'A control loop has a receptor (sensor) that detects the variable, a control centre that compares it with the set point (often in the brain or an endocrine gland), and an effector (a muscle, gland or organ) that changes the variable. Communication travels along nerves, hormones or both.',
      'Homeostasis is a shared job. The kidneys manage water and salts, the lungs manage carbon dioxide, the liver and pancreas manage glucose, and the nervous and endocrine systems coordinate them.'
    ],
    advanced: 'Set points are not fixed. They can shift with circadian rhythms, with the menstrual cycle, during pregnancy, or during fever, when immune signals raise the hypothalamic temperature set point. Some variables also use feedforward control: you begin salivating and releasing insulin when you smell or start eating food, before glucose actually rises.',
    steps: [
      'A variable changes (the stimulus), for example body temperature rises on a hot afternoon.',
      'Receptors detect the change: thermoreceptors in the skin and hypothalamus.',
      'The control centre compares the value with the set point: the hypothalamus.',
      'Effectors act: sweat glands secrete sweat and skin blood vessels widen.',
      'The response opposes the change: heat is lost and temperature returns towards the set point.',
      'Receptors detect the return, so the response winds down.'
    ],
    diagram: 'loop',
    analogy: 'Think of a household water tank with a float valve. When the level drops, the float drops and opens the inlet; when the tank refills, the float rises and closes it. The level wobbles a little but stays in a useful range. The float is the receptor, the valve linkage is the control centre, and the inlet pipe is the effector.',
    altAnalogy: 'Picture a matatu driver keeping to a speed limit on a hilly road. Uphill, speed drops, so they press the accelerator; downhill, speed rises, so they brake. The speedometer is the receptor, the driver is the control centre, and the pedals are the effectors.',
    joke: 'Your body is the ultimate micromanager. It checks your blood glucose more often than you check your phone.',
    connections: [
      { sys: 'ns', text: 'The hypothalamus is a control centre for temperature, water balance and hunger.', lesson: 'm5-l5' },
      { sys: 'en', text: 'Hormones such as insulin, glucagon and ADH are the messengers in many homeostatic loops.', lesson: 'm6-l4' },
      { sys: 're', text: 'The kidneys are effectors for water, salt and pH balance.', lesson: 'm8-l2' }
    ],
    scenario: { title: 'Worked example: a long walk in the midday sun', text: 'You walk for an hour in the heat. Your core temperature starts to rise. Thermoreceptors report this to the hypothalamus, which increases sweating and widens skin blood vessels. Sweat evaporates and carries heat away. But sweating costs water, so plasma becomes slightly more concentrated. A second loop now kicks in: osmoreceptors trigger ADH release and thirst. One problem solved by one loop creates a new challenge for another. That is homeostasis in real life: many loops, constantly negotiating.' },
    misconceptions: [
      { myth: 'Homeostasis means everything in the body stays exactly constant.', fact: 'Variables fluctuate within a normal range. The system detects and corrects deviations rather than preventing all change.' },
      { myth: 'Homeostasis is the job of one organ.', fact: 'It depends on many organs working together, coordinated by nerves and hormones.' },
      { myth: 'Any change from normal is a disease.', fact: 'Many changes are normal adjustments, such as glucose rising after a meal or heart rate rising during exercise.' }
    ],
    check: [
      { id: 'm1l3-q1', type: 'mcq', prompt: 'What is the internal environment?', options: ['The inside of each cell', 'The fluid that surrounds cells (extracellular fluid)', 'The contents of the stomach', 'The air in the lungs'], answer: 1, explain: 'The internal environment is the extracellular fluid that bathes cells: interstitial fluid and plasma. Cells exchange substances with it, so its composition matters.' },
      { id: 'm1l3-q2', type: 'tf', prompt: 'In homeostasis, a variable such as blood glucose never changes.', answer: false, explain: 'False. Glucose rises after a meal and falls during fasting. Homeostasis keeps it within a normal range by correcting deviations.' },
      { id: 'm1l3-q3', type: 'label', prompt: 'Label the parts of this homeostatic control loop.', diagram: 'loop', options: ['Stimulus', 'Receptor', 'Control centre', 'Effector', 'Response'], answers: { 1: 'Stimulus', 2: 'Receptor', 3: 'Control centre', 4: 'Effector', 5: 'Response' }, explain: 'A change (stimulus) is detected by a receptor, compared with the set point by a control centre, and corrected by an effector, which produces a response.' },
      { id: 'm1l3-q4', type: 'scenario', scenario: 'On a hot day, sweat glands increase their output.', prompt: 'In this loop, what are the sweat glands?', options: ['Receptors', 'The control centre', 'Effectors', 'The stimulus'], answer: 2, explain: 'Sweat glands carry out the response that changes the variable, so they are effectors. The hypothalamus is the control centre.' },
      { id: 'm1l3-q5', type: 'short', prompt: 'In one sentence, why do cells need a stable internal environment?', keywords: [['enzyme', 'protein', 'function', 'work', 'chemical reaction', 'reactions', 'survive']], model: 'Cell processes such as enzyme reactions, transport and electrical signalling work properly only within narrow ranges of temperature, pH, water and solutes.', explain: 'Cells rely on proteins (enzymes, channels, pumps) whose shape and activity depend on temperature, pH and ion levels. Big changes disrupt them.' }
    ],
    summary: 'Your cells live in the extracellular fluid. Homeostasis keeps that fluid’s temperature, water, salts, glucose, gases and pH within normal ranges. Receptors detect changes, a control centre compares them with a set point, and effectors push the value back.',
    terms: [
      { t: 'Internal environment', d: 'The extracellular fluid that surrounds cells.' },
      { t: 'Homeostasis', d: 'Maintaining relatively stable internal conditions within a normal range.' },
      { t: 'Set point', d: 'The target value a control system aims for.' },
      { t: 'Receptor (sensor)', d: 'Detects a change in a variable.' },
      { t: 'Control centre', d: 'Compares the value with the set point and decides on a response.' },
      { t: 'Effector', d: 'An organ, muscle or gland that changes the variable.' }
    ],
    flashcards: [
      { q: 'What fluid is the internal environment?', a: 'Extracellular fluid: interstitial fluid plus plasma.' },
      { q: 'Name the three parts of a control loop.', a: 'Receptor, control centre, effector.' },
      { q: 'Does homeostasis keep values exactly constant?', a: 'No, within a normal range around a set point.' }
    ],
    refs: ['os-homeostasis', 'os-fluids'],
    next: 'm1-l4'
  };

  F['m1-l4'] = {
    keywords: ['feedback', 'negative feedback', 'positive feedback', 'thermostat', 'oxytocin', 'labour', 'clotting', 'loop'],
    why: 'Feedback is the logic behind almost every control system in the body. If you can recognise negative and positive feedback, you can predict how the body will respond to most changes.',
    objectives: ['Distinguish negative from positive feedback.', 'Explain why negative feedback is far more common.', 'Describe childbirth and blood clotting as positive feedback.', 'Explain how positive feedback loops end.'],
    intro: 'In negative feedback, the response pushes a variable back towards where it started. Too hot? Cool down. Too much glucose? Store some. In positive feedback, the response pushes the variable further in the same direction, building up until some event ends it. Negative feedback keeps things steady. Positive feedback gets a job finished quickly.',
    detail: [
      'Negative feedback is stabilising. The output of the loop reduces the original stimulus, so the system settles around its set point. Examples include body temperature, blood glucose, blood pressure (the baroreflex) and blood calcium.',
      'Positive feedback is amplifying. The output increases the stimulus. Because this can run away, the body uses it only for processes with a clear endpoint. During labour, the baby’s head stretches the cervix; stretch receptors signal the hypothalamus; the posterior pituitary releases oxytocin; oxytocin strengthens uterine contractions, which push the head harder against the cervix. The loop ends when the baby is born and the stretch stops.',
      'Blood clotting is another positive feedback loop: activated clotting factors activate more clotting factors, rapidly building a clot. It stops when the clot seals the vessel and anticlotting mechanisms limit spread.',
      'Many hormone systems combine both. Hormones from the hypothalamus and pituitary usually act with negative feedback: the final hormone suppresses its own releasing signals.'
    ],
    advanced: 'Negative feedback loops can overshoot and oscillate if responses are delayed, which is one reason body variables wobble around their set points rather than sitting perfectly flat. Ovulation is an interesting exception in endocrinology: for a short window, high oestrogen switches from inhibiting to stimulating LH release, producing the LH surge.',
    steps: [
      'Negative feedback: a variable moves away from the set point.',
      'The control system triggers a response that opposes the change.',
      'The variable returns towards the set point and the response decreases.',
      'Positive feedback: a stimulus triggers a response that adds to the stimulus.',
      'The loop intensifies with each cycle.',
      'An outside event (birth, a sealed vessel) breaks the loop.'
    ],
    diagram: 'feedback',
    analogy: 'Negative feedback is a room thermostat: when the room is warm, the heater switches off. Positive feedback is a crowd at a football stadium starting a wave: each person standing up makes the next person more likely to stand, until the wave runs out of stadium.',
    altAnalogy: 'Negative feedback is a careful driver steering back to the centre of the lane. Positive feedback is microphone squeal: the speaker output goes back into the mic, gets louder, goes back in again, until someone pulls the plug.',
    joke: 'Negative feedback is the body’s thermostat. Unlike some humans, it actually responds to feedback.',
    connections: [
      { sys: 'rp', text: 'Oxytocin during labour is the classic positive feedback loop.', lesson: 'm12-l4' },
      { sys: 'cv', text: 'The baroreflex is a negative feedback loop for blood pressure.', lesson: 'm3-l7' },
      { sys: 'en', text: 'Insulin and glucagon form a pair of negative feedback loops for glucose.', lesson: 'm6-l4' }
    ],
    scenario: { title: 'Worked example: sorting loops', text: 'Blood glucose rises after lunch, insulin is released, glucose is taken up and blood glucose falls: negative feedback, because the response reverses the change. A cut finger activates platelets, which release chemicals that recruit more platelets: positive feedback, because the response amplifies the change until the gap is sealed. A useful test: ask whether the response reverses the change (negative) or reinforces it (positive).' },
    misconceptions: [
      { myth: 'Negative feedback is bad and positive feedback is good.', fact: 'The words describe direction, not value. Negative feedback is what keeps you stable.' },
      { myth: 'Positive feedback is common in the body.', fact: 'It is relatively rare and used for processes that must be completed quickly, such as birth and clotting.' },
      { myth: 'Positive feedback loops stop on their own.', fact: 'They need an outside event to end them, such as the delivery of the baby.' }
    ],
    check: [
      { id: 'm1l4-q1', type: 'mcq', prompt: 'Which statement describes negative feedback?', options: ['The response amplifies the original change', 'The response reverses the original change', 'There is no control centre', 'It only works in hormone systems'], answer: 1, explain: 'In negative feedback, the response opposes the change, bringing the variable back towards its set point.' },
      { id: 'm1l4-q2', type: 'mcq', prompt: 'Which is an example of positive feedback?', options: ['Shivering when cold', 'Insulin release after a meal', 'Oxytocin release during labour', 'Sweating in the heat'], answer: 2, explain: 'Oxytocin strengthens contractions, which increase cervical stretch, which releases more oxytocin. The loop reinforces itself until birth.' },
      { id: 'm1l4-q3', type: 'tf', prompt: 'A positive feedback loop needs an outside event to stop it.', answer: true, explain: 'True. Because each cycle strengthens the next, something external, such as birth or a sealed vessel, has to break the loop.' },
      { id: 'm1l4-q4', type: 'scenario', scenario: 'Blood calcium falls. The parathyroid glands release parathyroid hormone, which releases calcium from bone and helps the kidneys keep calcium.', prompt: 'What type of feedback is this?', options: ['Negative feedback', 'Positive feedback', 'Feedforward control', 'No feedback'], answer: 0, explain: 'The response raises calcium back towards normal, opposing the original fall. That is negative feedback.' },
      { id: 'm1l4-q5', type: 'short', prompt: 'Why is positive feedback used only for a few processes?', keywords: [['unstable', 'runaway', 'run away', 'amplif', 'escalat', 'out of control', 'endpoint', 'end point', 'stop']], model: 'Because it amplifies change, it would destabilise the body if it were not stopped, so it is used only for processes with a clear endpoint.', explain: 'Positive feedback drives a variable further from its starting point. That is useful for quick, finite events but dangerous for anything that must stay stable.' }
    ],
    summary: 'Negative feedback reverses changes and keeps the body stable; it runs most of physiology. Positive feedback amplifies changes and is reserved for events that must finish, like childbirth and clotting, and it needs an outside event to stop.',
    terms: [
      { t: 'Negative feedback', d: 'The response opposes the stimulus, restoring the set point.' },
      { t: 'Positive feedback', d: 'The response reinforces the stimulus, amplifying change.' },
      { t: 'Oxytocin', d: 'Posterior pituitary hormone that strengthens uterine contractions and causes milk let-down.' },
      { t: 'Feedforward', d: 'A response made in anticipation of a change, before it happens.' }
    ],
    flashcards: [
      { q: 'Negative feedback: reverses or reinforces the change?', a: 'Reverses.' },
      { q: 'Two examples of positive feedback?', a: 'Oxytocin in labour; blood clotting.' },
      { q: 'What ends the labour positive feedback loop?', a: 'Delivery of the baby removes the cervical stretch.' }
    ],
    refs: ['os-homeostasis', 'os-pituitary'],
    next: 'm1-l5'
  };

  F['m1-l5'] = {
    keywords: ['membrane', 'diffusion', 'osmosis', 'active transport', 'sodium potassium pump', 'concentration gradient', 'facilitated diffusion', 'tonicity', 'hypertonic', 'hypotonic', 'phospholipid'],
    why: 'Every exchange in the body, from oxygen entering blood to the kidney saving water, depends on substances crossing membranes. These four mechanisms appear in nearly every later module.',
    objectives: ['Describe the structure of the plasma membrane.', 'Explain diffusion and the factors that speed it up.', 'Explain osmosis and tonicity.', 'Distinguish passive transport from active transport.'],
    intro: 'Every cell is wrapped in a thin, oily membrane. Some things slip straight through, some need a special door, and some have to be pumped in or out using energy. Passive movement goes downhill, from where there is more to where there is less. Active transport goes uphill, and it costs ATP.',
    detail: [
      'The plasma membrane is a phospholipid bilayer with proteins embedded in it. Small, non-polar molecules such as oxygen, carbon dioxide and fats dissolve through the lipid easily. Ions and larger polar molecules such as glucose need protein channels or carriers.',
      'Diffusion is the net movement of a substance from higher to lower concentration. It needs no energy from the cell. It is faster when the concentration difference is larger, the surface area is larger, the distance is shorter and the temperature is higher. That is why alveoli are thin and numerous.',
      'Facilitated diffusion is still passive but uses a channel or carrier protein. Glucose enters most cells this way through GLUT transporters.',
      'Osmosis is diffusion of water across a selectively permeable membrane towards the side with more dissolved particles (higher osmolarity). Tonicity describes the effect of a solution on cell volume: in a hypotonic solution cells swell, in a hypertonic solution they shrink, and in an isotonic solution they stay the same.',
      'Active transport moves substances against their gradient using energy. The sodium–potassium pump uses one ATP to move three sodium ions out and two potassium ions in. Many other transporters use the sodium gradient this pump creates (secondary active transport), for example to absorb glucose in the gut and kidney.'
    ],
    advanced: 'Diffusion rate across a membrane is summarised by Fick’s law: proportional to surface area, permeability and concentration difference, and inversely proportional to thickness. Secondary active transporters such as SGLT1 couple glucose to sodium moving down its gradient, so the ATP cost is paid indirectly by the sodium–potassium pump.',
    steps: [
      'Diffusion: oxygen moves from high concentration in alveolar air to lower concentration in blood.',
      'Facilitated diffusion: glucose binds a carrier protein that changes shape and releases it inside the cell.',
      'Osmosis: water moves through aquaporin channels towards the more concentrated side.',
      'Active transport: the sodium–potassium pump uses ATP to push 3 Na⁺ out and 2 K⁺ in.',
      'Secondary active transport: sodium flowing back in down its gradient drags glucose along with it.'
    ],
    diagram: 'membrane',
    analogy: 'Diffusion is people leaving a packed hall into an empty courtyard: no one needs to push them. Facilitated diffusion is the same crowd using a door. Active transport is a bouncer pushing people back into the packed hall, which takes effort.',
    altAnalogy: 'Drop a spoon of sugar into a cup of chai without stirring. Over time it spreads evenly: diffusion. Now imagine you wanted all the sugar back in one corner. You would have to scoop it there yourself, using energy: active transport.',
    joke: 'The sodium–potassium pump is the club bouncer of the cell: three sodium out, two potassium in, and it charges one ATP at the door.',
    connections: [
      { sys: 'rs', text: 'Oxygen and carbon dioxide cross alveolar walls by simple diffusion.', lesson: 'm4-l2' },
      { sys: 're', text: 'Kidney tubules use active transport and osmosis to reclaim salts and water.', lesson: 'm8-l2' },
      { sys: 'di', text: 'The gut absorbs glucose with sodium-coupled transporters.', lesson: 'm7-l1' },
      { sys: 'ns', text: 'The pump’s ion gradients make nerve signalling possible.', lesson: 'm2-l5' }
    ],
    scenario: { title: 'Worked example: oral rehydration solution', text: 'Oral rehydration solution contains both salt and glucose. In the small intestine, SGLT1 transporters carry sodium and glucose into the lining cells together. As sodium and glucose are absorbed, water follows by osmosis. This is why a correctly mixed solution of salt and sugar rehydrates better than plain water during diarrhoea. The physiology here explains a public health tool; follow health workers’ guidance on how to use it.' },
    misconceptions: [
      { myth: 'Diffusion stops when molecules are evenly spread.', fact: 'Molecules keep moving randomly. Only the net movement stops at equilibrium.' },
      { myth: 'Water moves towards where there is more water.', fact: 'Water moves towards the side with more dissolved particles, which has relatively less free water.' },
      { myth: 'Facilitated diffusion uses energy because it needs a protein.', fact: 'It is passive. The protein provides a route; the gradient provides the drive.' }
    ],
    check: [
      { id: 'm1l5-q1', type: 'mcq', prompt: 'Which process requires ATP directly?', options: ['Simple diffusion', 'Osmosis', 'Facilitated diffusion', 'The sodium–potassium pump'], answer: 3, explain: 'The sodium–potassium pump is primary active transport. It hydrolyses ATP to move ions against their gradients.' },
      { id: 'm1l5-q2', type: 'scenario', scenario: 'A red blood cell is placed in a solution that has a higher solute concentration than the cell’s cytoplasm.', prompt: 'What happens to the cell?', options: ['It swells and may burst', 'It shrinks as water leaves', 'Nothing changes', 'It actively pumps water in'], answer: 1, explain: 'The solution is hypertonic, so water leaves the cell by osmosis towards the more concentrated outside and the cell shrinks.' },
      { id: 'm1l5-q3', type: 'tf', prompt: 'Oxygen crosses cell membranes mainly by simple diffusion through the lipid bilayer.', answer: true, explain: 'True. Oxygen is small and non-polar, so it dissolves through the lipid bilayer without a carrier.' },
      { id: 'm1l5-q4', type: 'label', prompt: 'Label the transport mechanisms shown on the membrane.', diagram: 'membrane', options: ['Simple diffusion', 'Osmosis', 'Facilitated diffusion', 'Active transport (Na⁺/K⁺ pump)'], answers: { 1: 'Simple diffusion', 2: 'Osmosis', 3: 'Facilitated diffusion', 4: 'Active transport (Na⁺/K⁺ pump)' }, explain: '1 crosses the lipid directly, 2 is water through aquaporins, 3 uses a carrier but no ATP, 4 uses ATP to move ions uphill.' },
      { id: 'm1l5-q5', type: 'short', prompt: 'Give two features of alveoli that speed up diffusion.', keywords: [['thin', 'short distance', 'surface area', 'large area', 'many', 'numerous', 'blood supply', 'capillar', 'gradient', 'moist']], model: 'A very thin wall (short diffusion distance) and an enormous combined surface area, plus a rich capillary supply that keeps the gradient steep.', explain: 'Diffusion is faster with more surface area, a shorter distance and a steeper gradient. Alveoli maximise all three.' }
    ],
    summary: 'Membranes are oily barriers with protein doors. Diffusion and osmosis move things downhill for free; facilitated diffusion does the same through proteins; active transport pushes things uphill using ATP. These mechanisms power exchange in the lungs, gut, kidneys and nerves.',
    terms: [
      { t: 'Diffusion', d: 'Net movement from higher to lower concentration.' },
      { t: 'Osmosis', d: 'Diffusion of water across a selectively permeable membrane.' },
      { t: 'Tonicity', d: 'The effect of a solution on cell volume (hypo-, iso-, hypertonic).' },
      { t: 'Active transport', d: 'Movement against a gradient using energy.' },
      { t: 'Aquaporin', d: 'A membrane channel for water.' }
    ],
    flashcards: [
      { q: 'Na⁺/K⁺ pump: how many of each ion per ATP?', a: '3 Na⁺ out, 2 K⁺ in.' },
      { q: 'Cell in hypotonic solution?', a: 'Water enters; the cell swells.' },
      { q: 'Four factors that speed diffusion?', a: 'Bigger gradient, bigger area, shorter distance, higher temperature.' }
    ],
    refs: ['os-membrane', 'os-fluids'],
    next: 'm2-l5'
  };

  F['m2-l5'] = {
    keywords: ['membrane potential', 'resting potential', 'action potential', 'depolarisation', 'depolarization', 'repolarisation', 'threshold', 'voltage', 'sodium channel', 'potassium channel', 'electrical'],
    why: 'Every heartbeat, thought and muscle twitch begins as an electrical change across a membrane. This lesson is the foundation for nerves, muscles and the heart.',
    objectives: ['Explain why cells have a negative resting membrane potential.', 'Describe the phases of an action potential.', 'Explain the roles of sodium and potassium channels.', 'Explain the all-or-none principle.'],
    intro: 'Cells are like tiny batteries. The inside of a resting nerve cell is slightly negative compared with the outside, about −70 millivolts. When the cell is stimulated enough, sodium channels open, positive charge rushes in, and the voltage briefly flips positive. That rapid flip and recovery is an action potential: the electrical message nerves and muscles use.',
    detail: [
      'The resting potential exists because ions are unevenly distributed and the membrane is more permeable to some than others. The sodium–potassium pump keeps sodium high outside and potassium high inside. At rest, many potassium leak channels are open, so potassium drifts out, leaving the inside negative.',
      'When a stimulus depolarises the membrane to threshold (about −55 mV), voltage-gated sodium channels open. Sodium rushes in down its electrical and concentration gradients and the inside becomes positive, peaking at around +30 mV.',
      'Sodium channels then inactivate and voltage-gated potassium channels open. Potassium flows out and the membrane repolarises. The potassium channels are slow to close, so the membrane briefly overshoots below rest (hyperpolarisation) before settling.',
      'Action potentials are all-or-none: if threshold is reached, a full-size action potential fires; if not, nothing propagates. Stimulus strength is coded by how often action potentials fire, not by their size.',
      'During the refractory period, inactivated sodium channels prevent another action potential, which keeps signals moving in one direction along an axon.'
    ],
    advanced: 'The resting potential sits close to the potassium equilibrium potential (about −90 mV) because resting permeability to potassium is much higher than to sodium. The Goldman equation combines each ion’s gradient and permeability to predict membrane voltage. Myelination speeds conduction by forcing the signal to jump between nodes of Ranvier (saltatory conduction).',
    steps: [
      'Rest: about −70 mV, maintained by K⁺ leak and the Na⁺/K⁺ pump.',
      'Stimulus depolarises the membrane to threshold (about −55 mV).',
      'Voltage-gated Na⁺ channels open; Na⁺ rushes in (depolarisation).',
      'At the peak (about +30 mV), Na⁺ channels inactivate and K⁺ channels open.',
      'K⁺ flows out; the membrane repolarises.',
      'Slow K⁺ channel closure causes a brief hyperpolarisation, then rest returns.'
    ],
    diagram: 'actionpotential',
    analogy: 'A row of dominoes: you need a firm enough push (threshold) to topple the first one; once it falls, the whole row falls at full force regardless of how hard you pushed. You cannot make a domino fall “a bit”.',
    altAnalogy: 'A camera flash: it charges up (resting potential), fires all at once when triggered (action potential), and then needs a moment to recharge before it can fire again (refractory period).',
    joke: 'A neuron at rest is like a teenager at −70 mV: quietly negative until something exciting crosses threshold.',
    connections: [
      { sys: 'ns', text: 'Action potentials carry every nerve signal.', lesson: 'm5-l5' },
      { sys: 'ms', text: 'Muscle fibres fire action potentials that release calcium and trigger contraction.', lesson: 'm9-l2' },
      { sys: 'cv', text: 'Heart cells use their own action potentials, with a long plateau that prevents tetanus.', lesson: 'm3-l4' }
    ],
    scenario: { title: 'Worked example: why potassium levels matter', text: 'If extracellular potassium rises, the potassium gradient across the membrane shrinks, so less potassium leaks out and the resting potential becomes less negative. Heart and muscle cells then behave abnormally. This is why the kidneys tightly control blood potassium, and why changes in potassium are treated seriously in hospital. The physiology: resting potential depends on the potassium gradient.' },
    misconceptions: [
      { myth: 'Huge amounts of sodium flood in during an action potential.', fact: 'Only a tiny fraction of ions move; concentrations barely change. The pump restores them over time.' },
      { myth: 'Stronger stimuli make bigger action potentials.', fact: 'Action potentials are all-or-none. Stronger stimuli increase their frequency.' },
      { myth: 'Repolarisation is caused by the sodium–potassium pump.', fact: 'Repolarisation is caused mainly by potassium flowing out through voltage-gated channels.' }
    ],
    check: [
      { id: 'm2l5-q1', type: 'mcq', prompt: 'What causes the rapid depolarisation phase of an action potential?', options: ['Potassium flowing out', 'Sodium flowing in', 'Chloride flowing in', 'The Na⁺/K⁺ pump speeding up'], answer: 1, explain: 'Voltage-gated sodium channels open at threshold and sodium rushes into the cell, making the inside positive.' },
      { id: 'm2l5-q2', type: 'tf', prompt: 'A stronger stimulus produces a taller action potential.', answer: false, explain: 'False. Action potentials are all-or-none. Stimulus strength is coded by firing frequency.' },
      { id: 'm2l5-q3', type: 'label', prompt: 'Label the phases on the action potential graph.', diagram: 'actionpotential', options: ['Resting potential', 'Threshold', 'Depolarisation', 'Repolarisation', 'Hyperpolarisation'], answers: { 1: 'Resting potential', 2: 'Threshold', 3: 'Depolarisation', 4: 'Repolarisation', 5: 'Hyperpolarisation' }, explain: 'Rest (−70 mV), reach threshold (−55 mV), sodium-driven rise, potassium-driven fall, then a brief undershoot.' },
      { id: 'm2l5-q4', type: 'mcq', prompt: 'Why is the resting membrane potential negative?', options: ['Sodium leaks in at rest', 'Potassium leaks out at rest, leaving the inside negative', 'Calcium is pumped in', 'Cells contain no positive ions'], answer: 1, explain: 'At rest the membrane is most permeable to potassium. Potassium leaving the cell takes positive charge with it.' },
      { id: 'm2l5-q5', type: 'short', prompt: 'What is the refractory period for?', keywords: [['one direction', 'one way', 'backward', 'backwards', 'reverse', 'direction', 'cannot fire', 'prevent', 'limits', 'frequency']], model: 'It prevents a new action potential firing immediately, so signals travel in one direction and firing frequency is limited.', explain: 'Inactivated sodium channels behind the travelling signal cannot reopen straight away, so the action potential cannot travel backwards.' }
    ],
    summary: 'Resting cells are about −70 mV inside because potassium leaks out. At threshold, sodium rushes in and the voltage spikes; then potassium rushes out and it falls back. The signal is all-or-none and travels one way because of the refractory period.',
    terms: [
      { t: 'Resting membrane potential', d: 'Voltage across the membrane at rest, about −70 mV in neurons.' },
      { t: 'Threshold', d: 'The voltage at which voltage-gated sodium channels open, about −55 mV.' },
      { t: 'Depolarisation', d: 'The membrane becoming less negative or positive.' },
      { t: 'Repolarisation', d: 'Return towards the resting potential.' },
      { t: 'Refractory period', d: 'Time when another action potential cannot be triggered (or needs a bigger stimulus).' }
    ],
    flashcards: [
      { q: 'Typical neuron resting potential?', a: 'About −70 mV.' },
      { q: 'Which ion causes depolarisation?', a: 'Sodium, flowing in.' },
      { q: 'Which ion causes repolarisation?', a: 'Potassium, flowing out.' }
    ],
    refs: ['os-action-potential', 'os-nervous-tissue'],
    next: 'm3-l4'
  };

  F['m3-l4'] = {
    keywords: ['heart', 'chamber', 'atrium', 'ventricle', 'valve', 'aorta', 'pulmonary', 'blood flow', 'tricuspid', 'mitral', 'lub dub', 'heart sounds'],
    why: 'The heart links every system in the body. Knowing the route blood takes through it makes blood pressure, breathing, exercise and pregnancy physiology much easier to follow.',
    objectives: ['Name the four chambers and four valves of the heart.', 'Trace blood flow through the pulmonary and systemic circuits.', 'Explain why the left ventricle wall is thicker.', 'Explain what causes the heart sounds.'],
    intro: 'Your heart is really two pumps sitting side by side. The right side receives blood that has delivered its oxygen and sends it to the lungs. The left side receives freshly oxygenated blood from the lungs and sends it to the whole body. Four one-way valves make sure blood only ever goes forward.',
    detail: [
      'Each side has an upper chamber, the atrium, which receives blood, and a lower chamber, the ventricle, which pumps it out. The atria contract slightly before the ventricles, topping them up.',
      'Deoxygenated blood returns from the body through the superior and inferior venae cavae into the right atrium. It passes through the tricuspid valve into the right ventricle, which pumps it through the pulmonary valve into the pulmonary trunk and arteries to the lungs. This is the pulmonary circuit.',
      'Oxygenated blood returns through the pulmonary veins to the left atrium, passes through the mitral (bicuspid) valve into the left ventricle, and is pumped through the aortic valve into the aorta. This is the systemic circuit.',
      'The left ventricle wall is much thicker than the right because it must generate higher pressure to push blood around the entire body. The lungs are close and low-resistance, so the right ventricle needs less force. Both ventricles still pump the same volume per beat on average.',
      'The heart sounds come from valves closing. The first sound (“lub”) is the atrioventricular valves (tricuspid and mitral) closing as the ventricles start to contract. The second (“dub”) is the semilunar valves (pulmonary and aortic) closing as the ventricles relax.'
    ],
    advanced: 'Cardiac output equals heart rate times stroke volume: at rest roughly 70 beats per minute × 70 mL ≈ 5 L/min. The Frank–Starling mechanism means that more blood filling the ventricle stretches it and produces a stronger contraction, which automatically matches the output of the two sides.',
    steps: [
      'Body → venae cavae → right atrium.',
      'Right atrium → tricuspid valve → right ventricle.',
      'Right ventricle → pulmonary valve → pulmonary arteries → lungs (gas exchange).',
      'Lungs → pulmonary veins → left atrium.',
      'Left atrium → mitral valve → left ventricle.',
      'Left ventricle → aortic valve → aorta → body.'
    ],
    diagram: 'heart',
    analogy: 'The heart is a two-storey house with two separate flats. On each side, the upstairs room (atrium) collects visitors and sends them down to the downstairs room (ventricle), which pushes them out the front door. The doors (valves) only swing one way.',
    altAnalogy: 'Think of a boda boda dispatch office with two counters. The right counter only sends riders on the short trip to the lungs. The left counter sends riders on the long trip across the whole city, so its riders need much bigger engines.',
    joke: 'Your heart does not get weekends off. It has the most intense full-time job in the body, and it never takes a lunch break.',
    connections: [
      { sys: 'rs', text: 'The pulmonary circuit takes blood to the alveoli for gas exchange.', lesson: 'm4-l2' },
      { sys: 'ns', text: 'Autonomic nerves change heart rate and the strength of contraction.', lesson: 'm5-l5' },
      { sys: 're', text: 'The kidneys control blood volume, which sets how much blood returns to the heart.', lesson: 'm8-l6' },
      { sys: 'ms', text: 'Exercising muscle drives the heart to increase its output.', lesson: 'm13-l7' }
    ],
    scenario: { title: 'Worked example: follow one red blood cell', text: 'A red blood cell leaves a capillary in your big toe with little oxygen. It travels up the inferior vena cava into the right atrium, through the tricuspid valve into the right ventricle, and out through the pulmonary valve to the lungs. In an alveolar capillary it loads oxygen and turns brighter red. It returns via a pulmonary vein to the left atrium, passes the mitral valve, and is launched from the left ventricle through the aortic valve into the aorta, heading back down towards the toe. The whole loop takes about a minute at rest.' },
    misconceptions: [
      { myth: 'Arteries always carry oxygenated blood.', fact: 'Arteries carry blood away from the heart. The pulmonary arteries carry deoxygenated blood to the lungs.' },
      { myth: 'Deoxygenated blood is blue.', fact: 'It is dark red. Veins look blue because of how light passes through skin.' },
      { myth: 'The left side pumps more blood than the right.', fact: 'Both sides pump the same volume; the left generates higher pressure.' }
    ],
    check: [
      { id: 'm3l4-q1', type: 'label', prompt: 'Label the chambers and great vessels.', diagram: 'heart', options: ['Right atrium', 'Right ventricle', 'Left atrium', 'Left ventricle', 'Aorta', 'Pulmonary artery'], answers: { 1: 'Right atrium', 2: 'Right ventricle', 3: 'Left atrium', 4: 'Left ventricle', 5: 'Aorta', 6: 'Pulmonary artery' }, explain: 'In standard diagrams the heart is drawn as if facing you, so its right side appears on your left.' },
      { id: 'm3l4-q2', type: 'mcq', prompt: 'Which valve does blood pass through as it leaves the left ventricle?', options: ['Tricuspid', 'Mitral', 'Pulmonary', 'Aortic'], answer: 3, explain: 'Blood leaves the left ventricle through the aortic valve into the aorta.' },
      { id: 'm3l4-q3', type: 'tf', prompt: 'The pulmonary arteries carry oxygen-poor blood.', answer: true, explain: 'True. Arteries are defined by direction (away from the heart), not by oxygen content.' },
      { id: 'm3l4-q4', type: 'mcq', prompt: 'Why is the left ventricle wall thicker than the right?', options: ['It pumps more blood per beat', 'It must generate higher pressure for the systemic circuit', 'It receives deoxygenated blood', 'It contracts first'], answer: 1, explain: 'The systemic circuit is long and has higher resistance, so the left ventricle needs more muscle to generate higher pressure.' },
      { id: 'm3l4-q5', type: 'short', prompt: 'What causes the first heart sound (“lub”)?', keywords: [['atrioventricular', 'av valve', 'tricuspid', 'mitral', 'bicuspid']], model: 'Closure of the atrioventricular (tricuspid and mitral) valves as the ventricles begin to contract.', explain: 'When ventricular pressure rises above atrial pressure, the AV valves snap shut, producing “lub”. “Dub” is the semilunar valves closing.' }
    ],
    summary: 'The heart is two pumps. The right side sends oxygen-poor blood to the lungs; the left side sends oxygen-rich blood to the body. Atria receive, ventricles pump, and four one-way valves keep blood moving forward. The heart sounds are valves closing.',
    terms: [
      { t: 'Atrium', d: 'Upper receiving chamber of the heart.' },
      { t: 'Ventricle', d: 'Lower pumping chamber of the heart.' },
      { t: 'Atrioventricular valves', d: 'Tricuspid (right) and mitral (left), between atria and ventricles.' },
      { t: 'Semilunar valves', d: 'Pulmonary and aortic valves, at the exits of the ventricles.' },
      { t: 'Cardiac output', d: 'Volume pumped per minute = heart rate × stroke volume.' }
    ],
    flashcards: [
      { q: 'Valve between right atrium and right ventricle?', a: 'Tricuspid.' },
      { q: 'Vessels returning blood from the lungs?', a: 'Pulmonary veins, into the left atrium.' },
      { q: 'What makes the “dub” sound?', a: 'Aortic and pulmonary valves closing.' }
    ],
    refs: ['os-heart-anatomy', 'os-cardiac-cycle', 'nhlbi-heart'],
    next: 'm3-l7'
  };

  F['m3-l7'] = {
    keywords: ['blood pressure', 'baroreceptor', 'baroreflex', 'hypertension', 'systolic', 'diastolic', 'resistance', 'mean arterial pressure', 'posture', 'vasoconstriction', 'vasodilation'],
    why: 'Blood pressure is what pushes blood into every organ. The way the body controls it shows the nervous, endocrine, cardiovascular and renal systems working as one team.',
    objectives: ['Define systolic, diastolic and mean arterial pressure.', 'Explain how cardiac output and resistance determine pressure.', 'Describe the baroreceptor reflex.', 'Compare short-, medium- and long-term pressure control.'],
    intro: 'Blood pressure is the push of blood against artery walls. It depends on two things: how much blood the heart pumps per minute, and how hard it is for blood to get through the vessels. The body controls both, using fast nerve reflexes for second-to-second changes and hormones and the kidneys for the long haul.',
    detail: [
      'A reading such as 120/80 mmHg gives systolic pressure (the peak, as the ventricles contract) over diastolic pressure (the lowest, as they relax). Mean arterial pressure (MAP) is the average pushing pressure through a cycle, roughly diastolic plus one third of the difference.',
      'MAP ≈ cardiac output × total peripheral resistance. Cardiac output is heart rate × stroke volume. Resistance depends mostly on the diameter of small arteries and arterioles: narrowing (vasoconstriction) raises resistance and pressure.',
      'Short term (seconds): baroreceptors in the carotid sinus and aortic arch are stretch sensors. When pressure rises they fire faster; the cardiovascular centre in the medulla increases parasympathetic and decreases sympathetic output, slowing the heart and dilating vessels. When pressure falls, the opposite happens.',
      'Medium term (minutes to hours): hormones. Adrenaline raises heart rate and contractility. The renin–angiotensin–aldosterone system constricts vessels and retains sodium. ADH retains water and constricts vessels at high levels. Atrial natriuretic peptide (ANP), released when the atria are stretched, promotes sodium and water loss.',
      'Long term (days): the kidneys control blood volume. Higher pressure increases sodium and water excretion; lower pressure reduces it. Because volume affects how much blood returns to the heart, the kidneys ultimately set the long-term level of blood pressure.'
    ],
    advanced: 'The baroreflex resets over days if pressure stays high, which is one reason it cannot by itself correct sustained hypertension. Long-term pressure is set largely by the relationship between renal sodium excretion and arterial pressure (pressure natriuresis). Hypertension is a disease state in which this balance is shifted; that is a separate topic from the normal physiology described here.',
    steps: [
      'Pressure rises (for example, after lying down from standing).',
      'Baroreceptors in the carotid sinus and aortic arch stretch more and fire faster.',
      'Signals travel to the cardiovascular centre in the medulla.',
      'Parasympathetic (vagal) output rises; sympathetic output falls.',
      'Heart rate and contractility fall; arterioles dilate.',
      'Cardiac output and resistance fall, so pressure returns towards normal.'
    ],
    diagram: 'baroreflex',
    analogy: 'Think of watering a garden with a hosepipe. The pressure depends on how far you open the tap (cardiac output) and how much you squeeze the end of the hose (resistance). Squeeze harder, pressure rises. The baroreflex is you watching the spray and adjusting both, all day long.',
    altAnalogy: 'The kidneys are like the county water board managing how much water is in the reservoir. The baroreflex can open and close taps quickly, but if the reservoir level is wrong, only the water board can fix it over the long term.',
    joke: 'Your baroreceptors check your blood pressure with every heartbeat. No cuff, no queue at the clinic, no complaints.',
    connections: [
      { sys: 'ns', text: 'Autonomic nerves carry the baroreflex response to the heart and vessels.', lesson: 'm5-l5' },
      { sys: 're', text: 'The kidneys set long-term pressure through blood volume and renin.', lesson: 'm8-l6' },
      { sys: 'en', text: 'Adrenaline, angiotensin II, aldosterone, ADH and ANP all shift blood pressure.', lesson: 'm8-l6' }
    ],
    scenario: { title: 'Worked example: standing up after lying in bed', text: 'When you stand, about half a litre of blood shifts into the veins of your legs and abdomen. Venous return, stroke volume and blood pressure dip. Within one or two heartbeats the baroreceptors fire less. The medulla reduces vagal output and boosts sympathetic output: heart rate rises, arterioles and veins constrict. Pressure recovers within seconds. If this reflex is sluggish, people can feel dizzy when standing; that is a symptom worth discussing with a health worker if it happens often.' },
    misconceptions: [
      { myth: 'Blood pressure is controlled only by the heart.', fact: 'It depends equally on vessel resistance, and in the long term on blood volume set by the kidneys.' },
      { myth: 'The diastolic number is the pressure inside the heart when it relaxes.', fact: 'It is the lowest pressure in the arteries during the cycle; elastic arteries keep it well above zero.' },
      { myth: 'The baroreflex keeps blood pressure correct in the long run.', fact: 'It handles fast changes; it resets over days. Long-term control belongs mostly to the kidneys.' }
    ],
    check: [
      { id: 'm3l7-q1', type: 'mcq', prompt: 'Mean arterial pressure is approximately equal to:', options: ['Heart rate × stroke volume', 'Cardiac output × total peripheral resistance', 'Systolic − diastolic', 'Blood volume ÷ heart rate'], answer: 1, explain: 'Pressure depends on flow (cardiac output) and resistance. Heart rate × stroke volume gives cardiac output alone.' },
      { id: 'm3l7-q2', type: 'scenario', scenario: 'Blood pressure suddenly rises.', prompt: 'How does the baroreflex respond?', options: ['More sympathetic output, faster heart rate', 'More parasympathetic output, slower heart rate and vasodilation', 'More renin release', 'More ADH release'], answer: 1, explain: 'Increased baroreceptor firing shifts the balance towards parasympathetic activity, slowing the heart and relaxing arterioles, so pressure falls.' },
      { id: 'm3l7-q3', type: 'tf', prompt: 'The kidneys are the main long-term regulators of blood pressure.', answer: true, explain: 'True. By adjusting sodium and water excretion, the kidneys set blood volume and so long-term pressure.' },
      { id: 'm3l7-q4', type: 'mcq', prompt: 'Where are the main arterial baroreceptors?', options: ['Kidneys and liver', 'Carotid sinus and aortic arch', 'Right atrium only', 'Medulla'], answer: 1, explain: 'Stretch receptors in the walls of the carotid sinus and aortic arch report arterial pressure to the medulla.' },
      { id: 'm3l7-q5', type: 'short', prompt: 'Name one hormone that raises blood pressure and say how.', keywords: [['angiotensin', 'aldosterone', 'adh', 'antidiuretic', 'vasopressin', 'adrenaline', 'epinephrine', 'noradrenaline', 'norepinephrine']], model: 'Angiotensin II constricts arterioles (raising resistance) and stimulates aldosterone, which makes the kidneys retain sodium and water (raising volume).', explain: 'Hormones raise pressure by increasing resistance (vasoconstriction), heart activity or blood volume.' }
    ],
    summary: 'Blood pressure equals cardiac output times resistance. The baroreflex corrects changes within seconds via autonomic nerves. Hormones (adrenaline, RAAS, ADH, ANP) adjust it over minutes to hours. The kidneys set the long-term level by controlling blood volume.',
    terms: [
      { t: 'Systolic pressure', d: 'Peak arterial pressure during ventricular contraction.' },
      { t: 'Diastolic pressure', d: 'Lowest arterial pressure during ventricular relaxation.' },
      { t: 'Total peripheral resistance', d: 'Overall resistance to flow, set mainly by arteriole diameter.' },
      { t: 'Baroreceptor', d: 'Stretch receptor that senses arterial pressure.' },
      { t: 'ANP', d: 'Atrial natriuretic peptide; promotes sodium and water loss.' }
    ],
    flashcards: [
      { q: 'MAP formula?', a: 'MAP ≈ cardiac output × total peripheral resistance.' },
      { q: 'Fastest blood pressure control mechanism?', a: 'The baroreceptor reflex (seconds).' },
      { q: 'Long-term regulator of blood pressure?', a: 'The kidneys, through blood volume.' }
    ],
    refs: ['os-vascular-regulation', 'os-kidney-endocrine', 'nhlbi-heart'],
    next: 'm4-l2'
  };
})(window.BW = window.BW || {});
