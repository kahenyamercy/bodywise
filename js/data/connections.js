/* BodyWise — detail for the Body Connection Map and scenario mode.
   For every relationship: what each system gives the other, the mechanism,
   and whether it is a regulatory feedback loop (drawn with arrows both ways).
   All of this is an educational simplification of normal physiology. */
(function (BW) {
  'use strict';
  function D(a, b, aGives, bGives, mechanism, loop) { return { key: a + '-' + b, aGives: aGives, bGives: bGives, mechanism: mechanism, loop: !!loop }; }

  var details = [
    D('cv', 'rs', 'Pumps oxygen-poor blood through the lungs so it can be reloaded.', 'Loads oxygen into the blood and removes carbon dioxide from it.',
      'The right ventricle pumps blood returning from the body into the pulmonary arteries. In the alveolar capillaries, oxygen diffuses into the blood because its partial pressure is higher in alveolar air, and carbon dioxide diffuses out because it is higher in the blood. The left heart then pumps the reloaded blood to the tissues, which use oxygen and add carbon dioxide, and the cycle repeats. Gas exchange works only if airflow and blood flow are both adequate and well matched.'),
    D('cv', 're', 'Delivers about a fifth of cardiac output, and the pressure that drives filtration.', 'Controls blood volume through sodium and water excretion; releases renin when pressure falls and erythropoietin when oxygen delivery falls.',
      'Pressure in the glomerular capillaries pushes plasma into the nephrons. When kidney perfusion falls, granular cells release renin; angiotensin II constricts arterioles and aldosterone makes the kidneys keep sodium, and water follows, so volume and pressure rise and renin release falls again. When pressure stays high, the kidneys excrete more sodium and water, lowering volume. Because volume sets how much blood returns to the heart, this loop makes the kidneys the long-term regulators of blood pressure.', true),
    D('cv', 'ns', 'Sends pressure information from baroreceptors; supplies the brain with oxygen and glucose.', 'Sets heart rate, contraction strength and blood vessel diameter through autonomic nerves.',
      'Baroreceptors in the carotid sinus and aortic arch stretch with every beat and report pressure to the medulla. If pressure rises, vagal output increases and sympathetic output falls, slowing the heart and relaxing arterioles; if pressure falls, the reverse happens. The new pressure is detected straight away, closing the loop within seconds. The brain itself depends on steady blood flow, which this reflex helps protect.', true),
    D('cv', 'en', 'Carries hormones to every tissue; stretched atria release ANP, a hormone that promotes sodium loss.', 'Adrenaline speeds the heart; ADH, angiotensin II and aldosterone raise volume and resistance; ANP lowers volume.',
      'Hormones only reach their targets because the blood carries them. In return, several hormones tune the circulation: adrenaline increases heart rate and contractility, angiotensin II and high ADH constrict vessels, and aldosterone and ADH increase volume. When volume rises, stretched atria release ANP, which helps the kidneys excrete sodium and water. Opposing hormones like these keep pressure and volume within range.', true),
    D('cv', 'di', 'Supplies blood to the gut and carries absorbed nutrients to the liver in the hepatic portal vein.', 'Absorbs nutrients, water and electrolytes into the blood.',
      'After a meal, blood flow to the gut increases. Sugars and amino acids absorbed by the villi enter capillaries that drain into the hepatic portal vein, so the liver processes them first; fats enter lymph and reach the blood near the heart. The blood then distributes these nutrients to every tissue.'),
    D('cv', 'ms', 'Delivers oxygen, glucose and fatty acids to muscle; removes carbon dioxide, lactate and heat.', 'Contracting leg muscles squeeze veins to return blood (the muscle pump); muscle metabolites dilate local vessels; red bone marrow makes blood cells.',
      'When muscle works harder, it releases metabolites such as carbon dioxide, hydrogen ions, potassium and adenosine that dilate its own arterioles, increasing local flow. At the same time, sympathetic activity raises heart rate and narrows vessels in less active organs, redirecting cardiac output to muscle. Rhythmic contractions squeeze leg veins and push blood back to the heart, which supports stroke volume. When effort stops, metabolites wash out and flow falls back.', true),
    D('cv', 'im', 'Carries white blood cells and antibodies around the body.', 'Inflammatory signals widen and loosen local vessels so cells and proteins can leave; lymphatics return leaked fluid to the blood.',
      'At a site of injury or infection, signals such as histamine dilate local blood vessels and make capillary walls leakier. White cells in the passing blood slow down, stick to the vessel wall and squeeze out into the tissue, guided by chemical signals. This causes redness, warmth and swelling. Inflammation is normally local; when it becomes widespread, as in severe infection, it can lower blood pressure, which is a medical emergency.'),
    D('cv', 'rp', 'Supplies the uterus and placenta with blood.', 'Pregnancy hormones expand blood volume and relax vessels; the placenta exchanges gases, nutrients and wastes with maternal blood.',
      'During pregnancy, hormones increase plasma volume and red cell mass and relax blood vessels, so cardiac output rises while blood pressure often dips in mid-pregnancy. Maternal blood bathes the placenta, where oxygen and nutrients cross to fetal blood and carbon dioxide and wastes cross back, without the two blood supplies mixing.'),
    D('rs', 'ns', 'Provides chemical information: carbon dioxide and acidity sensed by chemoreceptors, and lung stretch.', 'Brainstem respiratory centres send rhythmic signals to the diaphragm and intercostal muscles.',
      'Carbon dioxide combines with water to form carbonic acid, so when carbon dioxide rises, blood and brain fluid become slightly more acidic. Chemoreceptors in the brainstem and in the carotid and aortic bodies detect this and the respiratory centre increases the depth and rate of breathing. More breathing removes carbon dioxide, acidity falls, and the drive to breathe eases: a negative feedback loop that runs every minute of your life.', true),
    D('rs', 're', 'Adjusts carbon dioxide within minutes.', 'Adjusts bicarbonate and acid excretion over hours to days.',
      'Blood pH depends on the balance between bicarbonate (a base) and carbon dioxide (which forms acid). The lungs change carbon dioxide quickly by breathing more or less. The kidneys reabsorb and make bicarbonate and excrete hydrogen ions, more slowly but powerfully. If one side is disturbed, the other compensates: for example, if breathing is reduced and carbon dioxide rises, the kidneys gradually keep more bicarbonate.', true),
    D('rs', 'ms', 'Supplies oxygen for aerobic ATP production and removes the carbon dioxide muscle makes.', 'The diaphragm and intercostals are skeletal muscles that power breathing; working muscle output of carbon dioxide drives breathing up.',
      'Breathing is itself muscle work: the diaphragm and intercostals contract to enlarge the chest. During exercise, working muscles produce more carbon dioxide and send signals from moving limbs, so ventilation increases. The extra breathing keeps arterial oxygen high and removes carbon dioxide, which lets muscle keep producing ATP aerobically.', true),
    D('rs', 'im', 'Airway surfaces are where many inhaled microbes are first met.', 'Mucus, cilia, alveolar macrophages and airway lymphoid tissue keep the lungs clean.',
      'Mucus traps inhaled particles and microbes, and beating cilia sweep it up and out of the airways to be swallowed or coughed. Anything that reaches the alveoli meets macrophages that engulf it. If microbes get past these defences, inflammation and the adaptive response follow.'),
    D('rs', 'rp', 'Supplies oxygen to mother, placenta and fetus.', 'Progesterone increases sensitivity to carbon dioxide, so breathing deepens in pregnancy.',
      'Progesterone makes the respiratory centre respond more strongly to carbon dioxide, so tidal volume rises. Maternal carbon dioxide falls slightly, increasing the gradient for fetal carbon dioxide to cross the placenta into maternal blood.'),
    D('ns', 'en', 'The hypothalamus controls the pituitary; sympathetic nerves trigger the adrenal medulla.', 'Hormones such as cortisol and thyroid hormone act back on the brain and change its activity.',
      'In a stressful moment, the fast arm is neural: sympathetic nerves act within seconds and stimulate the adrenal medulla to release adrenaline, which spreads the response through the blood. The slower arm is hormonal: the hypothalamus releases CRH, the pituitary releases ACTH, and the adrenal cortex releases cortisol over minutes to hours. Cortisol then inhibits CRH and ACTH release, so the system turns itself down when the stressor passes.', true),
    D('ns', 'di', 'The gut’s own enteric nervous system and the vagus nerve drive motility and secretion; sympathetic activity slows them.', 'Stretch and chemical signals from the gut tell the brain about fullness and gut contents.',
      'Food stretching the stomach and intestine triggers enteric reflexes that move and mix it. Parasympathetic signals, mainly through the vagus nerve, increase secretions and motility, while sympathetic signals reduce them during stress or exercise. Sensory signals travel back to the brain, contributing to feelings of fullness and nausea.', true),
    D('ns', 'ms', 'Motor neurons release acetylcholine at the neuromuscular junction to trigger contraction.', 'Muscle spindles and tendon organs report muscle length and tension.',
      'Each skeletal muscle contraction starts with a motor neuron action potential, acetylcholine release and a muscle action potential that releases calcium inside the fibre. Sensory receptors inside muscles constantly report length and tension, which the spinal cord and brain use to adjust force, posture and reflexes such as the knee jerk.', true),
    D('ns', 're', 'Sympathetic nerves narrow kidney arterioles, stimulate renin release and increase sodium reabsorption.', 'Angiotensin II, produced through the kidney’s renin, acts on the brain to increase thirst and ADH release.',
      'When blood pressure falls, sympathetic activity to the kidneys rises, reducing filtration, releasing renin and retaining sodium. The angiotensin II produced acts on the brain to trigger thirst and ADH release. Together these restore volume, after which sympathetic drive and renin fall.', true),
    D('ns', 'im', 'Stress hormones and autonomic signals modulate immune activity.', 'Immune signalling molecules (cytokines) act on the brain, causing fever, sleepiness and reduced appetite.',
      'During infection, cytokines from immune cells act on the hypothalamus, which makes prostaglandins that raise the temperature set point, and they change brain activity in ways that make us rest. In the other direction, cortisol released during stress dampens many immune responses, which helps prevent excessive inflammation.', true),
    D('di', 'en', 'Absorbed glucose raises blood glucose; gut hormones (incretins, CCK, secretin) are themselves endocrine signals.', 'Insulin and glucagon decide whether the liver and muscles store or release glucose.',
      'After a carbohydrate meal, digested glucose is absorbed and blood glucose rises. Beta cells in the pancreatic islets respond by releasing insulin, helped by incretin hormones from the gut that boost insulin release as food arrives. Insulin moves glucose into muscle and fat and promotes glycogen storage, so glucose falls back and insulin release decreases. Between meals, falling glucose triggers glucagon, which makes the liver release glucose.', true),
    D('en', 're', 'ADH, aldosterone and parathyroid hormone act on kidney tubules.', 'The kidneys release renin and erythropoietin and activate vitamin D (calcitriol).',
      'Hormones fine-tune the kidney: ADH adds water channels in collecting ducts, aldosterone increases sodium reabsorption and potassium secretion, and parathyroid hormone increases calcium reabsorption and stimulates vitamin D activation. The kidneys in turn act as an endocrine organ, releasing renin when perfusion falls and erythropoietin when oxygen delivery falls.', true),
    D('en', 'ms', 'Insulin drives glucose into muscle; parathyroid hormone and vitamin D move calcium in and out of bone; growth and thyroid hormones affect muscle and bone.', 'Bone stores calcium and phosphate; skeletal muscle is the largest site of insulin-stimulated glucose uptake.',
      'When blood calcium falls, parathyroid hormone releases calcium from bone and increases calcium reabsorption and vitamin D activation, raising calcium back to normal, after which parathyroid hormone falls. After meals, insulin directs much of the absorbed glucose into skeletal muscle, where it is stored as glycogen or used for energy.', true),
    D('en', 'rp', 'FSH and LH from the pituitary control the ovaries and testes.', 'The gonads secrete oestrogen, progesterone and testosterone, which feed back on the hypothalamus and pituitary; the placenta adds hCG and other hormones.',
      'GnRH from the hypothalamus triggers FSH and LH from the pituitary, which drive gamete development and sex hormone production. Sex hormones usually inhibit GnRH, FSH and LH (negative feedback), with an important exception just before ovulation, when high oestrogen briefly stimulates an LH surge. In pregnancy, hCG and placental hormones take over the support of the uterine lining.', true),
    D('di', 'ms', 'Supplies glucose, amino acids and fatty acids for muscle energy and repair.', 'Skeletal muscle stores glucose as glycogen; skeletal muscles power chewing and swallowing.',
      'Digested carbohydrate and protein provide the glucose and amino acids muscle needs. After meals, muscle takes up glucose under insulin’s influence and stores it as glycogen for later work, and amino acids support repair and growth. Muscle glycogen fuels the muscle itself rather than being released into the blood.'),
    D('di', 'im', 'Stomach acid and the gut lining form a barrier against swallowed microbes.', 'Gut lymphoid tissue monitors gut contents and makes antibodies (IgA) that protect the gut surface.',
      'Stomach acid kills many swallowed microbes, and the gut lining forms a tight barrier. Lymphoid tissue in the gut wall samples what passes and produces IgA antibodies that are secreted onto the gut surface, helping to neutralise microbes without triggering inflammation.'),
    D('ms', 'im', 'Red bone marrow produces all white blood cells.', 'Immune cells clear damaged tissue and support repair after muscle injury.',
      'White blood cells are made from stem cells in red bone marrow, inside bones. After strenuous exercise or injury, macrophages and other immune cells move into damaged muscle, clear debris and release signals that support repair.'),
    D('re', 'rp', 'Clears the extra metabolic wastes of mother and fetus.', 'Pregnancy increases kidney blood flow and filtration.',
      'In pregnancy, increased blood volume and kidney blood flow raise the glomerular filtration rate substantially, so wastes such as urea and creatinine are cleared faster.'),
    D('im', 'rp', 'Certain maternal antibodies (IgG) cross the placenta; breast milk carries antibodies (IgA).', 'Pregnancy adjusts maternal immune responses so the fetus is tolerated.',
      'The placenta actively transports IgG antibodies from mother to fetus, giving the newborn temporary protection. After birth, breast milk supplies IgA antibodies that protect the baby’s gut. During pregnancy, local immune adjustments at the placenta allow the genetically different fetus to be tolerated.')
  ];
  var byKey = {}; details.forEach(function (d) { byKey[d.key] = d; });
  BW.relations.forEach(function (r) {
    var d = byKey[r.a + '-' + r.b], rev = !d && byKey[r.b + '-' + r.a];
    if (d) { r.aGives = d.aGives; r.bGives = d.bGives; r.mechanism = d.mechanism; r.loop = d.loop; }
    else if (rev) { r.aGives = rev.bGives; r.bGives = rev.aGives; r.mechanism = rev.mechanism; r.loop = rev.loop; }
  });

  /* A system's view of one relationship. */
  BW.relationView = function (sys, r) {
    var mine = r.a === sys;
    return { other: mine ? r.b : r.a, gives: mine ? r.aGives : r.bGives, receives: mine ? r.bGives : r.aGives, mechanism: r.mechanism, loop: r.loop, text: r.text, lesson: r.lesson };
  };

  /* Where each analogy stops being accurate. */
  BW.analogyLimits = {
    'm1-l3': 'A float valve has one sensor and a fixed level. The body uses many sensors and effectors at once, and its set points can move, for example during fever.',
    'm1-l4': 'A thermostat is on or off, but body responses are graded. A stadium wave fades on its own, whereas physiological positive feedback needs a specific event, such as birth, to stop it.',
    'm1-l5': 'Molecules do not choose where to go: diffusion is the net result of random movement. And the pump moves ions in a fixed ratio, not as many as it likes.',
    'm2-l5': 'Dominoes cannot stand themselves back up, but a membrane recovers within milliseconds. The signal is also regenerated at each patch of membrane rather than pushed along.',
    'm3-l4': 'Rooms cannot squeeze, but chambers contract. The two “flats” beat together and pump the same volume per beat on average.',
    'm3-l7': 'Blood vessels are elastic and actively change diameter throughout the body, and the heart pumps in pulses rather than a steady flow like a tap.',
    'm4-l2': 'Opening a window can fully refresh a room, but each breath only partly replaces the air in the lungs, which is why alveolar oxygen is lower than in the atmosphere.',
    'm5-l5': 'A car has one accelerator and one brake for everything. The autonomic divisions can act on different organs selectively, and most blood vessels receive only sympathetic nerves.',
    'm6-l4': 'Insulin does not physically unlock a door. It binds a receptor and triggers signalling that moves glucose transporters to the membrane, and the brain and liver take up glucose without it.',
    'm7-l1': 'Digestion and absorption overlap in time and place; some final digestion happens on the surface of the very cells that absorb the products.',
    'm8-l2': 'You sort a cupboard one step at a time, but the nephron filters, reabsorbs and secretes continuously, in different segments at once, under hormonal control.',
    'm8-l6': 'In a relay each runner waits for the last. In RAAS all the components are present all the time, and angiotensin II acts on several targets in parallel.',
    'm9-l2': 'Tug-of-war hands pull in step and in one direction; myosin heads cycle independently and pull actin from both ends towards the centre.',
    'm10-l1': 'Guards and detectives are separate teams, but innate cells actively instruct the adaptive response, and antibodies make innate killing more effective.',
    'm11-l3': 'A fan and heater are on or off; the body grades many heat-loss and heat-gain responses at once, and behaviour such as seeking shade is part of control.',
    'm12-l4': 'A visitor does not redesign the house, but the placenta’s hormones actively reshape the mother’s body, and many changes start before extra demand exists.',
    'm13-l7': 'Water flows downhill under gravity. Oxygen moves by diffusion down partial pressure gradients at exchange surfaces and is carried between them by breathing and blood flow.'
  };

  function St(title, systems, text, lesson) { return { title: title, systems: systems, text: text, lesson: lesson }; }

  /* Scenario mode: follow one situation across the body. Each is simplified. */
  BW.scenarios = [
    { id: 'running', title: 'I begin running', summary: 'Within seconds, your brain, heart, lungs and muscles coordinate to deliver more oxygen and fuel to working muscle and to remove carbon dioxide and heat.',
      stages: [
        St('Brain starts the run', ['ns', 'ms'], 'Motor areas of the brain send signals to the leg muscles. At the same time (“central command”), the brainstem withdraws vagal tone and raises sympathetic output, so heart rate begins to rise within seconds, before muscle metabolism has changed much.', 'm5-l5'),
        St('Muscles use more ATP', ['ms'], 'Contracting muscle uses ATP rapidly and regenerates it from creatine phosphate, glycolysis and aerobic respiration. Oxygen use and carbon dioxide production rise.', 'm9-l2'),
        St('Local signals open muscle vessels', ['ms', 'cv'], 'Metabolites from working muscle (carbon dioxide, hydrogen ions, potassium, adenosine, lower oxygen) dilate its arterioles, so flow rises where it is needed. Sympathetic signals narrow vessels in the gut and kidneys, redirecting blood.', 'm13-l7'),
        St('The heart pumps more', ['cv', 'ns'], 'Sympathetic nerves and adrenaline raise heart rate and contraction strength. The muscle pump and deeper breathing return more blood to the heart, raising stroke volume. Cardiac output rises several-fold.', 'm3-l7'),
        St('Breathing increases', ['rs', 'ns'], 'Signals from moving limbs, the brain and rising carbon dioxide drive deeper, faster breathing, keeping arterial oxygen high and removing extra carbon dioxide.', 'm4-l2'),
        St('Muscle extracts more oxygen', ['cv', 'ms'], 'Warm, acidic, carbon dioxide-rich muscle makes haemoglobin release oxygen more readily (the Bohr effect), and muscle extracts a larger share of the oxygen delivered.', 'm13-l7'),
        St('Extra heat is lost', ['ns', 'cv'], 'Muscle heat raises core temperature, so the hypothalamus triggers sweating and skin vasodilation. Skin and muscle now compete for cardiac output.', 'm11-l3')
      ],
      loops: [{ a: 1, b: 4, label: 'Carbon dioxide from working muscle drives breathing up; breathing removes it (negative feedback).' }, { a: 3, b: 2, label: 'More flow washes metabolites out of muscle, which limits further dilation.' }],
      check: { prompt: 'Why does heart rate rise in the first few seconds of a run, before muscle metabolism has changed much?', options: ['The brain withdraws vagal tone and raises sympathetic output (central command)', 'Blood oxygen has already fallen sharply', 'The kidneys release renin', 'Lactate has built up in the blood'], answer: 0, explain: 'The earliest rise is neural. The brain lowers the parasympathetic brake on the SA node and raises sympathetic drive as you start moving. Metabolic signals add to it moments later.' },
      next: 'recovery' },
    { id: 'dehydration', title: 'I become dehydrated', summary: 'When you lose more water than you take in, the body senses both concentrated plasma and lower blood volume, then conserves water, protects blood pressure and makes you thirsty.',
      stages: [
        St('Water is lost', ['cv'], 'Sweat, moist exhaled air and urine remove water (and in illness, diarrhoea or vomiting). Plasma becomes more concentrated and, if losses continue, blood volume falls.', 'm1-l5'),
        St('Osmoreceptors notice', ['ns'], 'Osmoreceptor cells in the hypothalamus lose water by osmosis and shrink slightly, which increases their signalling.', 'm8-l2'),
        St('ADH and thirst', ['en', 'ns'], 'The posterior pituitary releases antidiuretic hormone (ADH), and you begin to feel thirsty.', 'm8-l2'),
        St('Kidneys save water', ['re'], 'ADH inserts aquaporin water channels in the collecting ducts, so more water returns to the blood and urine becomes small in volume and dark.', 'm8-l2'),
        St('Volume sensors respond', ['cv', 'ns', 're'], 'If blood volume falls enough, baroreceptors and the kidneys detect lower pressure. Sympathetic activity rises and renin starts the renin–angiotensin–aldosterone system.', 'm8-l6'),
        St('Sodium and water are kept', ['en', 're', 'cv'], 'Angiotensin II constricts vessels and strengthens thirst; aldosterone increases sodium reabsorption, and water follows, helping restore volume.', 'm8-l6'),
        St('Drinking restores balance', ['di', 're'], 'Water absorbed from the gut dilutes the plasma, ADH falls, thirst eases and the kidneys release any excess.', 'm7-l1')
      ],
      loops: [{ a: 6, b: 1, label: 'Drinking lowers plasma concentration, which switches off the osmoreceptor signal (negative feedback).' }, { a: 5, b: 4, label: 'Restored volume reduces renin release.' }],
      note: 'Severe dehydration, especially in babies, young children and older adults, needs medical care.',
      check: { prompt: 'Which hormone makes the kidneys reabsorb more water without reabsorbing more salt?', options: ['ADH (antidiuretic hormone)', 'Aldosterone', 'Insulin', 'Renin'], answer: 0, explain: 'ADH adds water channels to the collecting ducts. Aldosterone mainly increases sodium reabsorption, with water following.' } },
    { id: 'meal', title: 'I eat a carbohydrate-rich meal', summary: 'Digestion turns starch into glucose, absorption brings it into the blood, and insulin helps tissues take it up and store it, returning blood glucose towards baseline.',
      stages: [
        St('Starch is digested', ['di'], 'Salivary and pancreatic amylase break starch into smaller sugars; enzymes on the intestinal lining finish the job, releasing glucose.', 'm7-l1'),
        St('Glucose is absorbed', ['di', 'cv'], 'Glucose enters intestinal cells with sodium (SGLT1), leaves them into capillaries, and travels in the hepatic portal vein to the liver first.', 'm7-l1'),
        St('Gut hormones prime the pancreas', ['di', 'en'], 'Incretin hormones from the gut (such as GLP-1 and GIP) and vagal signals boost insulin release, so insulin starts rising as food arrives.', 'm6-l4'),
        St('Insulin is released', ['en'], 'Beta cells in the pancreatic islets respond to rising blood glucose by releasing insulin.', 'm6-l4'),
        St('Tissues take up and store glucose', ['ms', 'di', 'en'], 'Insulin moves GLUT4 transporters to muscle and fat cell membranes; the liver and muscle build glycogen; the liver releases less glucose of its own.', 'm6-l4'),
        St('Cells make ATP', ['ms'], 'Glucose is broken down through glycolysis and aerobic respiration in mitochondria, capturing energy as ATP.', 'm9-l2'),
        St('Glucose returns towards baseline', ['en'], 'As blood glucose falls, insulin release falls. Hours later, glucagon rises to keep glucose up between meals.', 'm6-l4')
      ],
      loops: [{ a: 6, b: 3, label: 'Falling glucose reduces insulin release (negative feedback).' }],
      check: { prompt: 'Why does insulin start rising before blood glucose has peaked?', options: ['Gut hormones and nerve signals boost insulin release as food arrives', 'Glucagon triggers insulin release', 'Muscle glycogen enters the blood', 'The kidneys release insulin'], answer: 0, explain: 'Incretin hormones from the gut and vagal signals prime the beta cells, so insulin release anticipates the rise in glucose.' } },
    { id: 'heat', title: 'My body temperature rises', summary: 'When heat gain outpaces heat loss, the hypothalamus sends warm blood to the skin and turns on sweating, at the cost of some water and extra work for the heart.',
      stages: [
        St('Heat is gained', ['ms', 'cv'], 'Exercise or a hot environment adds heat faster than it is lost, and core temperature starts to rise.', 'm11-l3'),
        St('Thermoreceptors report', ['ns'], 'Warm receptors in the skin and in the hypothalamus increase their signalling.', 'm11-l3'),
        St('The hypothalamus responds', ['ns'], 'The preoptic area of the hypothalamus compares core temperature with its set point and activates heat-loss responses.', 'm11-l3'),
        St('Skin vessels widen', ['cv', 'ns'], 'Sympathetic constriction of skin vessels eases and active dilation increases, carrying warm blood to the surface. Heart rate rises to supply the skin as well as working muscle.', 'm3-l7'),
        St('Sweating begins', ['ns'], 'Sympathetic nerves (using acetylcholine) drive sweat glands. Evaporation of sweat removes heat.', 'm11-l3'),
        St('Fluid has to be replaced', ['re', 'en'], 'Sweat losses concentrate the plasma, triggering ADH and thirst (see the dehydration scenario).', 'm8-l2'),
        St('Temperature returns to the set point', ['ns'], 'As core temperature falls, thermoreceptor signals drop and sweating and skin flow ease off.', 'm1-l4')
      ],
      loops: [{ a: 6, b: 1, label: 'Lower temperature reduces thermoreceptor signals (negative feedback).' }],
      note: 'This is normal heat regulation. Fever is different: the set point itself is raised.',
      check: { prompt: 'In very hot, dry air that is warmer than your skin, which route of heat loss still works?', options: ['Evaporation of sweat', 'Radiation', 'Conduction', 'Convection'], answer: 0, explain: 'When the air is hotter than the skin, radiation, conduction and convection add heat instead of removing it, so evaporation is the only route left.' } },
    { id: 'standing', title: 'I move from lying down to standing up', summary: 'Standing makes blood pool in the legs. Within seconds, the baroreflex speeds the heart and tightens vessels to protect blood flow to the brain.',
      stages: [
        St('Blood pools in the legs', ['cv'], 'Gravity shifts roughly half a litre or more of blood into the veins of the legs and abdomen.', 'm3-l7'),
        St('Less blood returns to the heart', ['cv'], 'Venous return falls, so the ventricles fill less and stroke volume drops.', 'm3-l4'),
        St('Blood pressure dips', ['cv'], 'With less output per beat, arterial pressure falls briefly.', 'm3-l7'),
        St('Baroreceptors fire less', ['cv', 'ns'], 'Stretch receptors in the carotid sinus and aortic arch signal the drop to the medulla.', 'm3-l7'),
        St('The brainstem responds', ['ns'], 'The cardiovascular centre reduces vagal output and increases sympathetic output.', 'm5-l5'),
        St('Heart and vessels adjust', ['cv'], 'Heart rate and contractility rise; arterioles and veins constrict. Pressure recovers within seconds.', 'm3-l7'),
        St('If you keep standing', ['ms', 're', 'en'], 'Leg muscle contractions squeeze veins and help return blood; over longer periods renin and ADH help maintain volume.', 'm8-l6')
      ],
      loops: [{ a: 5, b: 3, label: 'Restored pressure increases baroreceptor firing again, so the response settles (negative feedback).' }],
      note: 'A brief light-headed moment can be normal. Fainting or frequent dizziness on standing should be checked by a health worker.',
      check: { prompt: 'What do the baroreceptors detect when you stand up quickly?', options: ['A fall in arterial pressure (less stretch)', 'A rise in blood glucose', 'Low carbon dioxide', 'Higher plasma concentration'], answer: 0, explain: 'Less blood returning to the heart lowers pressure, so the carotid and aortic baroreceptors stretch less and fire less.' } },
    { id: 'stress', title: 'I experience a sudden stressful event', summary: 'A fast neural surge prepares you for action within seconds, adrenaline spreads it through the blood, and cortisol sustains energy supply before switching itself off.',
      stages: [
        St('A threat is perceived', ['ns'], 'Brain areas that process threat activate the hypothalamus and brainstem.', 'm5-l5'),
        St('Sympathetic surge (seconds)', ['ns', 'cv', 'rs'], 'Heart rate and contractility rise, airways widen, pupils dilate and sweating increases.', 'm5-l5'),
        St('Adrenaline is released', ['en', 'ns'], 'Sympathetic nerves trigger the adrenal medulla to release adrenaline, spreading and prolonging the response.', 'm5-l5'),
        St('Fuel is mobilised', ['en', 'di', 'ms'], 'The liver releases glucose, fat stores release fatty acids, and insulin release is held back, so fuel is available for muscle and brain.', 'm6-l4'),
        St('Blood is redirected', ['cv', 'ms', 'di'], 'Vessels to skeletal muscle open while the gut and skin receive less; digestion slows and the mouth may feel dry.', 'm3-l7'),
        St('Cortisol (minutes to hours)', ['ns', 'en'], 'The hypothalamus releases CRH, the pituitary releases ACTH, and the adrenal cortex releases cortisol, which supports blood glucose and dampens inflammation.', 'm5-l5'),
        St('Switching off', ['en', 'ns'], 'Cortisol inhibits CRH and ACTH release, and as the threat passes parasympathetic activity restores resting function.', 'm1-l4')
      ],
      loops: [{ a: 6, b: 5, label: 'Cortisol inhibits CRH and ACTH release (negative feedback).' }],
      note: 'Short stress responses are normal and useful. Long-lasting stress is a different situation worth discussing with a health worker.',
      check: { prompt: 'Why does your mouth often feel dry when you are suddenly nervous?', options: ['Sympathetic activity reduces watery saliva', 'Cortisol blocks the salivary glands permanently', 'Breathing faster dries the stomach', 'Insulin rises'], answer: 0, explain: 'Watery saliva is driven mainly by parasympathetic activity; the sympathetic surge reduces it.' } },
    { id: 'recovery', title: 'My body recovers after exercise', summary: 'After effort stops, heart rate falls quickly, breathing stays raised for a while to repay the energy debt, and over hours to days fuel, fluid and muscle are restored.',
      stages: [
        St('Effort stops', ['ms', 'ns'], 'Central command and signals from moving muscle fall; vagal tone returns, so heart rate drops quickly in the first minute.', 'm5-l5'),
        St('Breathing stays raised', ['rs', 'ms'], 'Extra oxygen is used to rebuild creatine phosphate, refill oxygen stores on myoglobin and haemoglobin, clear lactate, and support a still-raised temperature and metabolism.', 'm4-l2'),
        St('Lactate is cleared', ['cv', 'ms', 'di'], 'Heart and muscle use lactate as fuel, and the liver converts some back into glucose.', 'm9-l2'),
        St('Cooling continues', ['ns', 'cv'], 'Sweating and skin blood flow continue until core temperature returns to its set point.', 'm11-l3'),
        St('Fluid and fuel are restored', ['re', 'en', 'di'], 'ADH and thirst replace sweat losses; eating and insulin help muscle refill its glycogen.', 'm6-l4'),
        St('Repair and adaptation', ['ms', 'im', 'en'], 'Over hours to days, immune cells clear micro-damage and muscle repairs. With regular training, muscle adds mitochondria and capillaries.', 'm10-l1')
      ],
      loops: [{ a: 0, b: 3, label: 'As temperature and metabolism fall, sympathetic drive and heart rate settle further.' }],
      check: { prompt: 'Why do you keep breathing hard for a few minutes after a sprint?', options: ['Extra oxygen is needed to rebuild creatine phosphate, clear lactate and restore oxygen stores', 'The lungs need to cool down', 'The brain has not noticed the sprint ended', 'Carbon dioxide production stops completely'], answer: 0, explain: 'This excess post-exercise oxygen consumption repays the energy used during the sprint and supports a still-raised metabolism.' } }
  ];
  BW.scenarioById = {}; BW.scenarios.forEach(function (s) { BW.scenarioById[s.id] = s; });

  /* Words that point the tutor to a scenario. */
  BW.scenarioHints = {
    running: ['running', 'start to run', 'begin running', 'during exercise', 'when i exercise', 'exercising', 'heart rate increase', 'heart rate rise', 'heart beat faster', 'heart rate go up', 'jogging', 'workout'],
    dehydration: ['dehydrat', 'not drinking', 'without water', 'lose water'],
    meal: ['carbohydrate', 'after a meal', 'after eating', 'eat a meal', 'eat ugali', 'after i eat', 'carb'],
    heat: ['temperature rise', 'temperature rises', 'overheat', 'too hot', 'hot day', 'get hot'],
    standing: ['stand up', 'standing up', 'from lying', 'lying down', 'posture', 'get up quickly'],
    stress: ['stress', 'fright', 'scared', 'panic', 'fight or flight', 'sudden shock', 'nervous before'],
    recovery: ['recover', 'after exercise', 'cool down', 'cooldown', 'post-exercise', 'after a run', 'after running']
  };
})(window.BW = window.BW || {});
