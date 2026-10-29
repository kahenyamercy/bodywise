/* BodyWise — extra learning content: daily body mysteries, jokes that lead
   into real science, memory tricks, pathway caveats and cardiac-cycle stages. */
(function (BW) {
  'use strict';

  /* Each mystery: a question to puzzle over, then the explanation. */
  BW.mysteries = [
    { q: 'Why does your heart beat faster when you run, even though you never consciously told it to?', sys: 'ns', lesson: 'm5-l5',
      a: 'Your autonomic nervous system does it for you. As you start moving, the brain turns up sympathetic signals and turns down vagal (parasympathetic) brake on the SA node, so heart rate rises. Adrenaline from the adrenal medulla adds to the effect, and signals from working muscles and rising carbon dioxide keep it going. You never need to think about it.' },
    { q: 'When you hold your breath, is the desperate urge to breathe caused by running out of oxygen?', sys: 'rs', lesson: 'm4-l2',
      a: 'Mostly not. The main trigger is carbon dioxide building up and making the blood slightly more acidic. Chemoreceptors in the brainstem and in the carotid and aortic bodies detect it and the respiratory centre insists on a breath, usually well before oxygen falls dangerously low.' },
    { q: 'Why can you feel light-headed for a second when you stand up quickly?', sys: 'cv', lesson: 'm3-l7',
      a: 'Gravity pulls blood into your leg veins, so less returns to the heart and blood pressure dips briefly. Baroreceptors notice within a heartbeat or two and the brainstem raises heart rate and tightens blood vessels. The light-headed moment is the gap before the reflex catches up.' },
    { q: 'Why is your urine darker after a hot day with little to drink?', sys: 're', lesson: 'm8-l2',
      a: 'Sweating concentrates your plasma, so the hypothalamus triggers antidiuretic hormone (ADH). ADH inserts water channels in the kidney’s collecting ducts, pulling water back into the blood. Less water leaves, so the same waste is dissolved in less urine.' },
    { q: 'Why does a fatty meal keep you feeling full for longer than a sugary drink?', sys: 'di', lesson: 'm7-l1',
      a: 'When fat reaches the small intestine, it triggers the hormone cholecystokinin (CCK). CCK releases bile and pancreatic enzymes and also slows how fast the stomach empties, so food stays with you longer.' },
    { q: 'If you have a fever, why do you shiver and feel cold even though you are hot?', sys: 'ns', lesson: 'm11-l3',
      a: 'Immune signals raise the hypothalamus’s temperature set point. Your actual temperature is now below the new target, so the body responds as if it is cold: shivering and narrowing skin blood vessels until it reaches the higher set point.' },
    { q: 'Why do muscles become stiff after death?', sys: 'ms', lesson: 'm9-l2',
      a: 'Myosin needs a fresh ATP molecule to let go of actin. After death, ATP runs out, so the cross-bridges stay locked and muscles stiffen (rigor mortis) until the proteins break down.' },
    { q: 'Why do so many distance runners train in high-altitude towns like Iten?', sys: 're', lesson: 'm13-l7',
      a: 'At altitude, each breath carries less oxygen. Kidney cells sense the lower oxygen delivery and release more erythropoietin (EPO), which drives the bone marrow to make more red blood cells. More haemoglobin can help deliver oxygen when racing lower down, although the effect varies between people.' },
    { q: 'Why is a second infection with the same virus often milder than the first?', sys: 'im', lesson: 'm10-l1',
      a: 'The first infection leaves memory B and T cells. Next time, they recognise the virus within hours and produce strong, specific antibodies quickly, often clearing it before illness develops. Vaccines create this memory without the illness.' },
    { q: 'Why does your mouth go dry when you are nervous before a presentation?', sys: 'ns', lesson: 'm5-l5',
      a: 'Sympathetic activity shifts the salivary glands towards a smaller amount of thicker saliva, while parasympathetic “rest and digest” activity, which drives watery saliva, is turned down.' },
    { q: 'Why does a very salty meal make you thirsty?', sys: 'en', lesson: 'm1-l5',
      a: 'Absorbed salt raises the concentration of your extracellular fluid. Water moves out of cells by osmosis, including osmoreceptor cells in the hypothalamus, which trigger thirst and ADH release so you drink and keep water.' },
    { q: 'Why do people breathe more in early pregnancy, long before the bump is big?', sys: 'rp', lesson: 'm12-l4',
      a: 'Progesterone makes the breathing centre more sensitive to carbon dioxide, so each breath gets deeper. Slightly lower maternal carbon dioxide helps carbon dioxide move from the fetus across the placenta.' }
  ];

  /* Jokes always lead into the real explanation. */
  BW.jokes = [
    { joke: 'Your mitochondria are busy making ATP while you are busy making excuses not to exercise.', lesson: 'm9-l2',
      science: 'Mitochondria use oxygen to turn the energy in glucose and fat into ATP. When you exercise, muscle ATP use rises sharply, so the mitochondria work harder, and regular training actually adds more mitochondria to muscle.' },
    { joke: 'Your kidneys are the body’s water-management team. Excellent accountants, but they prefer urine to spreadsheets.', lesson: 'm8-l2',
      science: 'Adult kidneys filter roughly 180 litres of plasma a day, then reabsorb nearly all of it, leaving about 1 to 2 litres of urine. ADH and aldosterone fine-tune exactly how much water and salt is kept.' },
    { joke: 'Your heart does not get weekends off. It has the most intense full-time job in the body.', lesson: 'm3-l4',
      science: 'At about 70 beats a minute, the heart beats roughly 100,000 times a day. Cardiac muscle rests between beats rather than between shifts, and the SA node sets the rhythm without any instruction from you.' },
    { joke: 'Negative feedback is the body’s thermostat. Unlike some humans, it actually responds to feedback.', lesson: 'm1-l4',
      science: 'In negative feedback, a change is detected and the response pushes it back the other way. That is how temperature, glucose and blood pressure stay in their normal ranges.' },
    { joke: 'Insulin is a key for certain cells. Glucose without it is a delivery rider standing outside a locked gate.', lesson: 'm6-l4',
      science: 'Insulin causes muscle and fat cells to move GLUT4 transporters to their surface so glucose can enter. The brain and liver take up glucose largely without needing insulin, so the analogy fits muscle and fat best.' },
    { joke: 'Haemoglobin is a bus with four seats for oxygen. It picks up in the lungs and drops off where the party is: working muscle.', lesson: 'm13-l7',
      science: 'Each haemoglobin molecule can carry four oxygen molecules. Warm, acidic, carbon dioxide-rich muscle makes haemoglobin release oxygen more easily (the Bohr effect).' },
    { joke: 'The sodium–potassium pump is the club bouncer of the cell: three sodium out, two potassium in, and it charges one ATP at the door.', lesson: 'm1-l5',
      science: 'The pump uses one ATP to move three sodium ions out and two potassium ions in. The gradients it builds power nerve signals and many other transporters.' },
    { joke: 'Your diaphragm is the hardest-working muscle you forget about until you get hiccups.', lesson: 'm4-l2',
      science: 'The diaphragm contracts with every quiet breath, pulling air in by lowering pressure in the chest. A hiccup is a sudden involuntary diaphragm contraction followed by the vocal cords snapping shut, which makes the “hic”.' },
    { joke: 'Osmosis: water heads to where things are more crowded, like passengers rushing to the busiest matatu stage.', lesson: 'm1-l5',
      science: 'Water moves across a membrane towards the side with more dissolved particles. That is why a cell in salty fluid shrinks and a cell in very dilute fluid swells.' }
  ];

  /* Memory tricks, one per written lesson. */
  BW.memoryTricks = {
    'm1-l3': 'Stimulus → Receptor → Control centre → Effector → Response: “Some Really Clever Engineers Respond.”',
    'm1-l4': 'Negative feedback Nudges back. Positive feedback Pushes further, and needs an outside Pause button (birth, a sealed clot).',
    'm1-l5': '3 Na⁺ out, 2 K⁺ in: “Salt leaves the cell, bananas come home.” (Bananas are rich in potassium.)',
    'm2-l5': 'Sodium Swims in on the way up; Potassium Paddles out on the way down.',
    'm3-l4': 'LAB RAT: Left Atrium has the Bicuspid (mitral) valve; Right Atrium has the Tricuspid.',
    'm3-l7': 'Pressure = Pump × Pipes: cardiac output times peripheral resistance.',
    'm4-l2': 'Gases roll downhill: from high partial pressure to low, no pump required.',
    'm5-l5': 'Sympathetic = Stress and Speed. Parasympathetic = Peace and Plates (rest and digest).',
    'm6-l4': 'Insulin puts glucose IN. GlucaGON: the glucose is GONE, so the liver makes more.',
    'm7-l1': 'Digestion chops; absorption carries across. The small intestine does most of both.',
    'm8-l2': 'Filter, Reclaim, Send: excretion = filtration − reabsorption + secretion.',
    'm8-l6': 'Renin Rings the alarm, Angiotensin II squeezes, Aldosterone saves salt.',
    'm9-l2': 'Calcium unlocks actin; ATP lets myosin let go.',
    'm10-l1': 'Innate is Instant and general. Adaptive is slow, Accurate and Archives a memory.',
    'm11-l3': 'Too hot: open the vents (sweat, wide skin vessels). Too cold: shut the windows and shiver.',
    'm12-l4': 'hCG = “hold the Corpus luteum Going.”',
    'm13-l7': 'Oxygen rolls downhill: 160 → 104 → 98 → 40 → a few mmHg.'
  };

  /* Pathways are simplified; these notes give the important details and exceptions. */
  var caveats = {
    'breath-to-muscle': ['About 98% of oxygen travels bound to haemoglobin; only a small fraction is dissolved in plasma.', 'In short bursts, muscle also makes ATP without oxygen (creatine phosphate, anaerobic glycolysis).', 'Muscle holds a small oxygen store of its own in myoglobin.', 'Carbon dioxide makes the return trip mostly as bicarbonate.'],
    'meal-to-energy': ['Starch is only one fuel: fats travel in lymph as chylomicrons and proteins arrive as amino acids.', 'Fructose and galactose are absorbed too and are mostly converted by the liver.', 'The liver sees absorbed glucose first, through the portal vein, and stores much of it as glycogen.', 'The brain, liver and red blood cells take up glucose largely without insulin.', 'Insulin release starts before glucose rises, helped by gut hormones and nerve signals during eating.'],
    'sweat-to-thirst': ['Sweat is less salty than plasma, so losing it makes the remaining plasma more concentrated.', 'Large volume losses also trigger ADH and the renin–angiotensin–aldosterone system through pressure sensors.', 'Thirst can lag behind need, especially in older adults.', 'Drinking eases thirst before the water is even absorbed, thanks to signals from the mouth and throat.'],
    'bleed-to-rbc': ['Plasma volume recovers within hours as fluid shifts in from tissues and as you drink.', 'New red cells take about a week to start appearing and several weeks to restore numbers, and need enough iron.', 'Severe blood loss is a medical emergency; these reflexes buy time but cannot replace treatment.']
  };
  BW.paths.forEach(function (p) {
    p.caveats = caveats[p.id] || [];
    if (p.id === 'meal-to-energy' && !p.steps.some(function (s) { return s.sys === 'cv'; })) {
      p.steps.splice(2, 0, { sys: 'cv', title: 'Blood carries glucose', text: 'Absorbed glucose travels in the hepatic portal vein to the liver, then in the general circulation to every tissue.', lesson: 'm7-l1' });
    }
  });

  /* The cardiac cycle, stage by stage, for the interactive heart. */
  BW.cardiacStages = [
    { name: 'Ventricular filling', phase: 'Diastole', contract: [], av: 'open', sl: 'closed', flow: ['veins', 'av'], sound: '',
      text: 'All four chambers are relaxed. Blood flows in from the veins, through the atria and the open AV valves, straight into the ventricles. Most ventricular filling happens now, without any pumping.' },
    { name: 'Atrial contraction', phase: 'Atrial systole', contract: ['ra', 'la'], av: 'open', sl: 'closed', flow: ['av'], sound: '',
      text: 'The SA node fires and the atria contract, topping up the ventricles with the last part of their filling.' },
    { name: 'Isovolumetric contraction', phase: 'Ventricular systole begins', contract: ['rv', 'lv'], av: 'closed', sl: 'closed', flow: [], sound: 'lub',
      text: 'The ventricles start contracting. Their pressure rises above the atria, so the AV valves snap shut: the first heart sound, “lub”. All valves are closed, so volume stays the same while pressure builds.' },
    { name: 'Ventricular ejection', phase: 'Ventricular systole', contract: ['rv', 'lv'], av: 'closed', sl: 'open', flow: ['out'], sound: '',
      text: 'Ventricular pressure now exceeds pressure in the pulmonary trunk and aorta, so the semilunar valves open and blood is ejected: the right side to the lungs, the left side to the body.' },
    { name: 'Isovolumetric relaxation', phase: 'Diastole begins', contract: [], av: 'closed', sl: 'closed', flow: ['veins'], sound: 'dub',
      text: 'The ventricles relax and their pressure drops below the arteries, so the semilunar valves close: the second heart sound, “dub”. Once ventricular pressure falls below atrial pressure, the AV valves open and filling starts again.' }
  ];

  /* Short tutor-style microcopy, used sparingly. */
  BW.voiceLines = {
    slowDown: 'Let’s slow this down. Biology is complicated enough without us speed-running it.',
    twoSystems: 'Good question! This is where two body systems start working together.',
    almost: 'Almost. You have the right idea, but one important step is missing.',
    groupChat: 'Congratulations! You have successfully followed the body’s internal group chat.'
  };
})(window.BW = window.BW || {});
