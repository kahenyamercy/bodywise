/* BodyWise — full lessons, part 2 (Modules 4–8). */
(function (BW) {
  'use strict';
  var F = BW.fullLessons = BW.fullLessons || {};

  F['m4-l2'] = {
    keywords: ['ventilation', 'gas exchange', 'breathing', 'alveoli', 'alveolus', 'diaphragm', 'oxygen', 'carbon dioxide', 'partial pressure', 'inhale', 'exhale', 'lungs', 'breathe'],
    why: 'Every cell needs a steady oxygen supply and a way to get rid of carbon dioxide. Ventilation and gas exchange are where that begins, and they explain how breathing links to the heart, blood pH and exercise.',
    objectives: ['Explain how the diaphragm and pressure changes move air.', 'Describe gas exchange in the alveoli in terms of partial pressures.', 'Explain why alveoli are well suited to diffusion.', 'Describe how breathing is linked to carbon dioxide and blood pH.'],
    intro: 'Breathing has two separate jobs. Ventilation is the mechanical part: muscles move air in and out. Gas exchange is the chemical part: oxygen diffuses from the air sacs into the blood, and carbon dioxide diffuses the other way. Nothing pumps the gases across; they simply move from where there is more of them to where there is less.',
    detail: [
      'To breathe in, the diaphragm contracts and flattens and the external intercostal muscles lift the ribs. The chest cavity gets bigger, so pressure inside the lungs falls slightly below atmospheric pressure, and air flows in. This follows Boyle’s law: at a constant temperature, larger volume means lower pressure.',
      'Quiet breathing out is mostly passive. The muscles relax, the elastic lungs recoil, lung pressure rises above atmospheric and air flows out. During exercise, abdominal and internal intercostal muscles help push air out.',
      'In a mixture of gases, each gas contributes a partial pressure. Alveolar oxygen is about 104 mmHg at sea level while blood arriving from the body has about 40 mmHg, so oxygen diffuses into the blood. Carbon dioxide is about 45 mmHg in arriving blood and about 40 mmHg in alveoli, so it diffuses out. Carbon dioxide needs only a small gradient because it is far more soluble.',
      'Alveoli are built for diffusion: hundreds of millions of them create a huge surface, their walls plus the capillary walls are extremely thin, and a dense capillary network keeps carrying away oxygenated blood so the gradient stays steep.',
      'Most oxygen (about 98%) travels bound to haemoglobin; most carbon dioxide travels as bicarbonate. Because carbon dioxide forms carbonic acid in blood, breathing faster or slower changes blood pH within minutes.'
    ],
    advanced: 'Matching ventilation to blood flow matters. Where alveoli are poorly ventilated, local arterioles constrict (hypoxic pulmonary vasoconstriction), redirecting blood to better-ventilated regions. This is the opposite of what systemic vessels do in low oxygen. At altitude, lower barometric pressure reduces inspired oxygen partial pressure, which is the starting point for acclimatisation.',
    steps: [
      'Diaphragm and external intercostals contract; chest volume increases.',
      'Pressure in the lungs falls below atmospheric; air flows in.',
      'Oxygen diffuses from alveoli (≈104 mmHg) into capillary blood (≈40 mmHg).',
      'Carbon dioxide diffuses from blood (≈45 mmHg) into alveoli (≈40 mmHg).',
      'Muscles relax; lungs recoil; air flows out carrying carbon dioxide.'
    ],
    diagram: 'alveolus',
    analogy: 'Ventilation is opening the windows of a stuffy room; gas exchange is the fresh air mixing in on its own once the window is open. You do work to open the window, but not to make the air spread.',
    altAnalogy: 'Think of a syringe: pull the plunger back (bigger volume, lower pressure) and fluid rushes in; push it in and fluid leaves. Your diaphragm is the plunger and your lungs are the barrel.',
    joke: 'Your diaphragm is the hardest-working muscle you forget about until you get hiccups.',
    connections: [
      { sys: 'cv', text: 'The pulmonary circuit brings blood to the alveoli and carries oxygen away.', lesson: 'm3-l4' },
      { sys: 'ns', text: 'Brainstem centres set breathing rhythm; chemoreceptors respond to carbon dioxide.', lesson: 'm5-l5' },
      { sys: 're', text: 'Lungs and kidneys share control of blood pH.', lesson: 'm8-l2' },
      { sys: 'ms', text: 'Breathing muscles are skeletal muscles; working muscles drive breathing up.', lesson: 'm13-l7' }
    ],
    scenario: { title: 'Worked example: living at altitude in Nairobi', text: 'Nairobi is about 1,795 m above sea level. Air still contains 21% oxygen, but total air pressure is lower, so each breath carries less oxygen (an inspired partial pressure of roughly 130 mmHg instead of about 160 at sea level). The oxygen gradient into the blood is smaller. Over weeks, the body adapts: breathing is slightly deeper, and the kidneys release more erythropoietin so the blood carries more haemoglobin. Visitors from the coast may notice they get breathless faster for the first few days.' },
    misconceptions: [
      { myth: 'We breathe in pure oxygen and breathe out pure carbon dioxide.', fact: 'Air is about 21% oxygen; exhaled air still contains about 16% oxygen and roughly 4% carbon dioxide.' },
      { myth: 'The lungs pull air in by themselves.', fact: 'Lungs have no muscle for this; the diaphragm and chest wall change volume and the lungs follow.' },
      { myth: 'Low oxygen is the main everyday trigger to breathe.', fact: 'Rising carbon dioxide is the main everyday trigger; low oxygen matters mostly when oxygen falls a lot.' }
    ],
    check: [
      { id: 'm4l2-q1', type: 'mcq', prompt: 'What happens to pressure in the lungs when the diaphragm contracts?', options: ['It rises above atmospheric pressure', 'It falls below atmospheric pressure', 'It stays the same', 'It equals blood pressure'], answer: 1, explain: 'Contraction enlarges the chest cavity. Larger volume means lower pressure (Boyle’s law), so air flows in.' },
      { id: 'm4l2-q2', type: 'label', prompt: 'Label the alveolus diagram.', diagram: 'alveolus', options: ['Alveolus', 'Capillary', 'Oxygen into blood', 'Carbon dioxide out of blood', 'Red blood cell'], answers: { 1: 'Alveolus', 2: 'Capillary', 3: 'Oxygen into blood', 4: 'Carbon dioxide out of blood', 5: 'Red blood cell' }, explain: 'Gases cross the thin barrier between the alveolar air space and the capillary, moving down their partial pressure gradients.' },
      { id: 'm4l2-q3', type: 'tf', prompt: 'Quiet exhalation is mainly passive.', answer: true, explain: 'True. At rest, breathing out relies on the elastic recoil of the lungs and chest wall as muscles relax.' },
      { id: 'm4l2-q4', type: 'scenario', scenario: 'A person breathes rapidly and deeply for a minute (hyperventilates).', prompt: 'What happens to blood carbon dioxide and pH?', options: ['CO₂ rises, pH falls', 'CO₂ falls, pH rises', 'Both rise', 'Neither changes'], answer: 1, explain: 'Blowing off extra carbon dioxide reduces carbonic acid, so pH rises (becomes more alkaline).' },
      { id: 'm4l2-q5', type: 'short', prompt: 'Why can carbon dioxide diffuse out with a much smaller gradient than oxygen needs?', keywords: [['soluble', 'solubility', 'dissolves']], model: 'Carbon dioxide is far more soluble in the fluid of the barrier than oxygen, so a small partial pressure difference moves a lot of it.', explain: 'Diffusion rate depends on solubility as well as gradient. CO₂ is about 20 times more soluble than O₂.' }
    ],
    summary: 'Muscles change chest volume, which changes lung pressure and moves air. In the alveoli, oxygen and carbon dioxide move by diffusion down partial pressure gradients across an extremely thin, enormous surface. Breathing also controls blood pH through carbon dioxide.',
    terms: [
      { t: 'Ventilation', d: 'Movement of air into and out of the lungs.' },
      { t: 'Partial pressure', d: 'The pressure contributed by one gas in a mixture.' },
      { t: 'Alveolus', d: 'Tiny air sac where gas exchange happens.' },
      { t: 'Boyle’s law', d: 'At constant temperature, gas pressure is inversely related to volume.' },
      { t: 'Chemoreceptor', d: 'Sensor that responds to chemical changes, such as CO₂ or pH.' }
    ],
    flashcards: [
      { q: 'Alveolar PO₂ vs PO₂ of blood arriving at the lungs?', a: 'About 104 vs 40 mmHg.' },
      { q: 'Main muscle of quiet inspiration?', a: 'The diaphragm.' },
      { q: 'Main way CO₂ travels in blood?', a: 'As bicarbonate.' }
    ],
    refs: ['os-gas-exchange', 'os-gas-transport', 'nhlbi-lungs'],
    next: 'm5-l5'
  };

  F['m5-l5'] = {
    keywords: ['autonomic', 'sympathetic', 'parasympathetic', 'fight or flight', 'rest and digest', 'vagus', 'noradrenaline', 'acetylcholine', 'adrenal medulla', 'stress'],
    why: 'The autonomic nervous system adjusts your heart, lungs, gut, bladder, pupils and glands without you thinking about it. It is the main fast link between the brain and the organs.',
    objectives: ['Distinguish the sympathetic and parasympathetic divisions.', 'Describe their effects on key organs.', 'Name the main neurotransmitters used.', 'Explain dual innervation and autonomic tone.'],
    intro: 'Your autonomic nervous system runs the organs on autopilot. It has two main divisions. The sympathetic division prepares you for action: “fight or flight”. The parasympathetic division supports restoration: “rest and digest”. Most organs receive both, and their balance sets what the organ does at any moment.',
    detail: [
      'Sympathetic nerves leave the spinal cord from the thoracic and upper lumbar regions. They usually have short preganglionic fibres that synapse in chains of ganglia beside the spine, then long postganglionic fibres to the organs. Most sympathetic targets receive noradrenaline.',
      'Parasympathetic nerves leave from the brainstem (through cranial nerves, especially the vagus) and the sacral spinal cord. They have long preganglionic fibres that synapse in ganglia close to or inside the target organ. Their targets receive acetylcholine.',
      'Sympathetic effects include faster, stronger heartbeats, dilated airways, dilated pupils, glucose release from the liver, reduced gut activity and redirected blood flow to skeletal muscle. Parasympathetic effects include slower heart rate, constricted pupils and airways, increased salivation, gut motility and digestive secretions, and bladder emptying.',
      'The adrenal medulla is a modified sympathetic ganglion. When stimulated by sympathetic preganglionic fibres it releases adrenaline (and some noradrenaline) into the blood, spreading and prolonging the sympathetic response.',
      'Both divisions are active all the time. This background activity is called tone. At rest, parasympathetic tone dominates the heart, which is why resting heart rate (about 60–80 bpm) is lower than the intrinsic rate of the SA node (about 100 bpm).'
    ],
    advanced: 'The response of a target depends on its receptors: for example, noradrenaline constricts most arterioles via α1 receptors but β2 receptors in airways respond to adrenaline with relaxation. Sweat glands are an exception: they are sympathetic but use acetylcholine. The hypothalamus coordinates autonomic output with endocrine and behavioural responses.',
    steps: [
      'A threat is perceived; the hypothalamus and brainstem increase sympathetic output.',
      'Preganglionic neurons release acetylcholine in sympathetic ganglia.',
      'Postganglionic neurons release noradrenaline at target organs.',
      'The adrenal medulla releases adrenaline into the blood.',
      'Heart rate, airway diameter and blood glucose rise; digestion slows.',
      'As the threat passes, parasympathetic tone restores resting function.'
    ],
    diagram: 'autonomic',
    analogy: 'Think of a car with an accelerator (sympathetic) and a brake (parasympathetic). A good driver uses both all the time. At a red light, the brake dominates; on the highway, the accelerator does. Most organs have both pedals connected.',
    altAnalogy: 'Sympathetic is the emergency response team arriving with sirens. Parasympathetic is the maintenance crew that comes in at night to clean, refuel and restock. Both are always on duty; their shift sizes change.',
    joke: 'The sympathetic system is called sympathetic, yet it is the one that makes your heart race before an exam. Not very sympathetic at all.',
    connections: [
      { sys: 'cv', text: 'Autonomic balance sets heart rate and vessel diameter.', lesson: 'm3-l7' },
      { sys: 'di', text: 'Parasympathetic activity drives digestion; sympathetic slows it.', lesson: 'm7-l1' },
      { sys: 'en', text: 'The adrenal medulla turns a nerve signal into a hormonal one.', lesson: 'm6-l4' },
      { sys: 're', text: 'Sympathetic nerves trigger renin release from the kidneys.', lesson: 'm8-l6' }
    ],
    scenario: { title: 'Worked example: before a big presentation', text: 'Your heart pounds, your mouth feels dry, and your stomach feels uneasy. Each symptom maps to sympathetic activity: increased heart rate and contractility, reduced salivary secretion, and reduced gut motility with blood redirected away from the gut. Slow breathing with long exhalations increases vagal (parasympathetic) influence on the heart, which is one reason it can help calm a racing pulse.' },
    misconceptions: [
      { myth: 'Only one division is active at a time.', fact: 'Both are continuously active; their balance shifts.' },
      { myth: 'Parasympathetic means “weak” or “less important”.', fact: 'It controls essential functions like digestion and resting heart rate.' },
      { myth: 'Adrenaline and noradrenaline are completely different systems.', fact: 'Both are catecholamines; noradrenaline is mainly a neurotransmitter, adrenaline mainly a hormone from the adrenal medulla.' }
    ],
    check: [
      { id: 'm5l5-q1', type: 'mcq', prompt: 'Which effect is sympathetic?', options: ['Pupil constriction', 'Increased gut motility', 'Bronchodilation', 'Slower heart rate'], answer: 2, explain: 'Sympathetic activity widens airways to increase airflow during action. The others are parasympathetic effects.' },
      { id: 'm5l5-q2', type: 'mcq', prompt: 'Which nerve carries most parasympathetic output to the heart and gut?', options: ['Phrenic nerve', 'Vagus nerve', 'Sciatic nerve', 'Optic nerve'], answer: 1, explain: 'The vagus nerve (cranial nerve X) supplies parasympathetic fibres to the heart, lungs and most of the gut.' },
      { id: 'm5l5-q3', type: 'tf', prompt: 'Resting heart rate is lower than the SA node’s intrinsic rate because of parasympathetic tone.', answer: true, explain: 'True. Continuous vagal activity slows the SA node from about 100 bpm to a typical resting rate of 60–80 bpm.' },
      { id: 'm5l5-q4', type: 'scenario', scenario: 'After a large lunch, you feel relaxed and your stomach is busy digesting.', prompt: 'Which division dominates?', options: ['Sympathetic', 'Parasympathetic', 'Somatic', 'Neither'], answer: 1, explain: 'Rest-and-digest activity, with increased gut motility and secretions, is parasympathetic.' },
      { id: 'm5l5-q5', type: 'short', prompt: 'What does the adrenal medulla add to the sympathetic response?', keywords: [['adrenaline', 'epinephrine', 'hormone', 'blood', 'bloodstream', 'longer', 'prolong', 'spread']], model: 'It releases adrenaline into the blood, spreading the response to the whole body and making it last longer.', explain: 'Nerve signals are fast but local; hormones in the blood reach every tissue with the right receptors and last longer.' }
    ],
    summary: 'The autonomic nervous system controls organs automatically. Sympathetic (thoracolumbar, noradrenaline) prepares for action; parasympathetic (craniosacral, acetylcholine, mainly vagus) supports rest and digestion. Both are always active, and the adrenal medulla extends sympathetic effects through the blood.',
    terms: [
      { t: 'Sympathetic division', d: 'Autonomic division that prepares the body for action.' },
      { t: 'Parasympathetic division', d: 'Autonomic division that supports rest, digestion and recovery.' },
      { t: 'Vagus nerve', d: 'Cranial nerve X; main parasympathetic nerve to the chest and abdomen.' },
      { t: 'Autonomic tone', d: 'Ongoing background activity of an autonomic division.' },
      { t: 'Adrenal medulla', d: 'Inner adrenal gland; releases adrenaline in response to sympathetic signals.' }
    ],
    flashcards: [
      { q: 'Neurotransmitter at most sympathetic targets?', a: 'Noradrenaline.' },
      { q: 'Neurotransmitter at parasympathetic targets?', a: 'Acetylcholine.' },
      { q: 'Parasympathetic effect on the pupil?', a: 'Constriction.' }
    ],
    refs: ['os-autonomic', 'os-nervous-tissue'],
    next: 'm6-l4'
  };

  F['m6-l4'] = {
    keywords: ['insulin', 'glucagon', 'glucose', 'blood sugar', 'pancreas', 'islets', 'beta cells', 'alpha cells', 'glycogen', 'diabetes', 'liver'],
    why: 'Your brain depends heavily on a steady glucose supply, yet you eat in bursts. Insulin and glucagon bridge the gap, and they link digestion, the liver, muscle, fat and the brain.',
    objectives: ['Identify the cells that release insulin and glucagon.', 'Describe the actions of each hormone.', 'Explain how they keep glucose in a normal range.', 'Distinguish normal regulation from what goes wrong in diabetes.'],
    intro: 'After a meal, glucose floods into the blood. The pancreas releases insulin, which helps cells take glucose in and tells the liver and muscles to store it. Between meals, glucose drifts down, so the pancreas releases glucagon, which tells the liver to release stored glucose. Two hormones, two directions, one stable blood glucose.',
    detail: [
      'The pancreas is mostly an exocrine gland that makes digestive enzymes, but scattered through it are the pancreatic islets. Beta cells make insulin; alpha cells make glucagon.',
      'When blood glucose rises, beta cells take in more glucose, generate more ATP and release insulin. Insulin causes muscle and fat cells to insert GLUT4 transporters into their membranes so glucose can enter. It promotes glycogen formation in liver and muscle, fat storage, and protein synthesis, and it suppresses glucose output by the liver.',
      'When blood glucose falls, alpha cells release glucagon. Glucagon acts mainly on the liver, triggering glycogen breakdown (glycogenolysis) and the making of new glucose from amino acids, lactate and glycerol (gluconeogenesis). Muscle glycogen is not released into the blood because muscle lacks the enzyme to export free glucose.',
      'In healthy adults, fasting blood glucose is typically about 4 to 5.5 mmol/L. The brain takes up glucose largely without insulin, which is why preventing low glucose matters so much.',
      'Other hormones also raise glucose: adrenaline in stress, cortisol over longer periods, and growth hormone. Insulin is the main hormone that lowers it.'
    ],
    advanced: 'Disease contrast: in type 1 diabetes, the immune system destroys beta cells, so insulin is lacking. In type 2 diabetes, tissues respond less to insulin (insulin resistance) and beta cells eventually cannot compensate. Pregnancy normally increases insulin resistance in the second half, sparing glucose for the fetus; gestational diabetes occurs when insulin secretion cannot keep up. These are disease mechanisms, explained here only to contrast with normal physiology.',
    steps: [
      'You eat; glucose is absorbed and blood glucose rises.',
      'Beta cells release insulin.',
      'Muscle and fat take up glucose; liver and muscle store glycogen.',
      'Blood glucose falls back into the normal range; insulin release slows.',
      'Hours later, glucose drifts down; alpha cells release glucagon.',
      'The liver breaks down glycogen and makes new glucose; blood glucose rises back.'
    ],
    diagram: 'glucose',
    analogy: 'Insulin is like a key that opens certain cells to glucose. Glucose without insulin signalling is like a delivery rider standing outside a locked gate. Glucagon is the warehouse manager who opens the liver’s storeroom when supplies run low.',
    altAnalogy: 'Think of a chama savings group. After payday (a meal), insulin collects contributions and deposits them in the account (glycogen). When members need money (fasting), glucagon makes a withdrawal. The account balance (blood glucose) stays healthy.',
    joke: 'Insulin and glucagon are the body’s oldest married couple: they never agree, and that is exactly why the household runs smoothly.',
    connections: [
      { sys: 'di', text: 'Digestion and absorption deliver the glucose that triggers insulin.', lesson: 'm7-l1' },
      { sys: 'ms', text: 'Skeletal muscle is the largest site of insulin-stimulated glucose uptake.', lesson: 'm9-l2' },
      { sys: 'ns', text: 'Adrenaline raises glucose in stress; the brain depends on a steady supply.', lesson: 'm5-l5' },
      { sys: 'rp', text: 'Pregnancy shifts glucose regulation to support the fetus.', lesson: 'm12-l4' }
    ],
    scenario: { title: 'Worked example: breakfast, then a busy morning', text: 'At 7am you eat mandazi and tea with sugar. By 7:45 blood glucose has risen, insulin is high, and your liver and muscles are filling their glycogen stores. By 11am, absorption is complete and glucose has drifted down. Insulin falls, glucagon rises and your liver releases glucose to keep your brain supplied until lunch. If you walk briskly to a meeting, muscle uses more glucose, and adrenaline helps the liver release more.' },
    misconceptions: [
      { myth: 'Insulin “removes” sugar from the body.', fact: 'Insulin moves glucose into cells and stores; the glucose is still in the body.' },
      { myth: 'Glucagon acts on muscle to release glucose into the blood.', fact: 'Glucagon acts mainly on the liver. Muscle glycogen fuels the muscle itself.' },
      { myth: 'All cells need insulin to take up glucose.', fact: 'The brain, liver and red blood cells take up glucose largely independently of insulin.' }
    ],
    check: [
      { id: 'm6l4-q1', type: 'label', prompt: 'Label the glucose control diagram.', diagram: 'glucose', options: ['Beta cells', 'Insulin', 'Alpha cells', 'Glucagon'], answers: { 1: 'Beta cells', 2: 'Insulin', 3: 'Alpha cells', 4: 'Glucagon' }, explain: 'High glucose → beta cells → insulin. Low glucose → alpha cells → glucagon.' },
      { id: 'm6l4-q2', type: 'mcq', prompt: 'What is glucagon’s main target organ?', options: ['Skeletal muscle', 'Liver', 'Brain', 'Kidney'], answer: 1, explain: 'Glucagon acts mainly on the liver to break down glycogen and make new glucose.' },
      { id: 'm6l4-q3', type: 'tf', prompt: 'Insulin increases the number of glucose transporters on muscle cell membranes.', answer: true, explain: 'True. Insulin causes GLUT4 transporters to move to the membrane of muscle and fat cells.' },
      { id: 'm6l4-q4', type: 'scenario', scenario: 'Someone has not eaten for 12 hours overnight.', prompt: 'Which hormone pattern do you expect?', options: ['High insulin, low glucagon', 'Low insulin, higher glucagon', 'Both high', 'Both zero'], answer: 1, explain: 'Fasting lowers glucose, so insulin falls and glucagon rises to release liver glucose.' },
      { id: 'm6l4-q5', type: 'short', prompt: 'Why does the body work so hard to prevent low blood glucose?', keywords: [['brain', 'nervous', 'neuron']], model: 'The brain relies heavily on glucose and cannot store much, so low glucose quickly affects brain function.', explain: 'The brain uses a large share of the body’s glucose and has little reserve. This is why several hormones defend against low glucose.' }
    ],
    summary: 'Beta cells release insulin when glucose is high, moving glucose into cells and stores. Alpha cells release glucagon when glucose is low, making the liver release glucose. Together they keep blood glucose in a normal range for the brain and other tissues.',
    terms: [
      { t: 'Pancreatic islets', d: 'Clusters of endocrine cells in the pancreas.' },
      { t: 'Insulin', d: 'Hormone from beta cells that lowers blood glucose.' },
      { t: 'Glucagon', d: 'Hormone from alpha cells that raises blood glucose.' },
      { t: 'Glycogen', d: 'Stored form of glucose in liver and muscle.' },
      { t: 'Gluconeogenesis', d: 'Making new glucose from non-carbohydrate sources.' }
    ],
    flashcards: [
      { q: 'Which islet cells make insulin?', a: 'Beta cells.' },
      { q: 'Glucagon’s two main actions in the liver?', a: 'Glycogenolysis and gluconeogenesis.' },
      { q: 'Typical healthy fasting glucose?', a: 'About 4–5.5 mmol/L.' }
    ],
    refs: ['os-pancreas'],
    next: 'm7-l1'
  };

  F['m7-l1'] = {
    keywords: ['digestion', 'absorption', 'enzyme', 'small intestine', 'stomach', 'villi', 'microvilli', 'amylase', 'lipase', 'pepsin', 'bile', 'food', 'meal', 'gut', 'ugali'],
    why: 'Food is useless to cells until it is broken down and absorbed. Understanding the difference between digestion and absorption explains nutrition, the gut’s structure and how nutrients reach every system.',
    objectives: ['Distinguish digestion from absorption.', 'Compare mechanical and chemical digestion.', 'Identify where each main nutrient is digested and absorbed.', 'Describe the routes absorbed nutrients take.'],
    intro: 'Digestion is breaking food down into small molecules. Absorption is moving those molecules from the inside of the gut into the blood or lymph. Your gut is technically outside your body, like the hole through a doughnut. Food only truly enters you when it is absorbed.',
    detail: [
      'Mechanical digestion breaks food into smaller pieces without changing molecules: chewing, the churning of the stomach and segmentation in the small intestine. It increases the surface area for enzymes.',
      'Chemical digestion uses enzymes to split large molecules. Carbohydrates: salivary and pancreatic amylase, then brush-border enzymes release glucose, galactose and fructose. Proteins: pepsin in the acidic stomach, then pancreatic trypsin and others, then brush-border peptidases release amino acids. Fats: bile salts emulsify fat into droplets, and pancreatic lipase releases fatty acids and monoglycerides.',
      'Most absorption happens in the small intestine, about 3 metres long in a living person. Circular folds, finger-like villi and microvilli massively increase its surface area. Sugars and amino acids cross the lining using transporters, many linked to sodium.',
      'Water-soluble nutrients (sugars, amino acids, many vitamins and minerals) enter capillaries in the villi and travel through the hepatic portal vein to the liver first. Fats are packaged into chylomicrons and enter lacteals, the lymphatic vessels of the villi, joining the blood later near the heart.',
      'The large intestine absorbs much of the remaining water and electrolytes, and its bacteria ferment some fibre, producing short-chain fatty acids and some vitamins.'
    ],
    advanced: 'Digestion is coordinated by the enteric nervous system and hormones. Gastrin stimulates stomach acid; secretin (released when acid enters the duodenum) triggers bicarbonate from the pancreas; cholecystokinin (released when fat and protein arrive) triggers gallbladder contraction and pancreatic enzyme release and slows gastric emptying.',
    steps: [
      'Mouth: chewing and salivary amylase begin starch digestion.',
      'Stomach: churning, acid and pepsin begin protein digestion.',
      'Small intestine: pancreatic enzymes and bile finish digestion.',
      'Small intestine: villi absorb sugars, amino acids and fats.',
      'Blood carries water-soluble nutrients to the liver; lymph carries fats.',
      'Large intestine: water and electrolytes are absorbed; waste is formed.'
    ],
    diagram: 'gitract',
    analogy: 'Digestion is cutting a whole goat into pieces small enough to carry; absorption is carrying those pieces through the gate into the homestead. Cutting happens outside the gate; only absorption brings food inside.',
    altAnalogy: 'Think of recycling a building: demolition crews (enzymes) break walls down to individual bricks (molecules); only then can trucks (transporters) carry the bricks through a narrow gate to the new site.',
    joke: 'Technically your gut is outside your body. So that plate of githeri is not really part of you until it passes absorption control.',
    connections: [
      { sys: 'en', text: 'Absorbed glucose triggers insulin release; gut hormones coordinate digestion.', lesson: 'm6-l4' },
      { sys: 'cv', text: 'The hepatic portal vein carries absorbed nutrients to the liver.', lesson: 'm3-l4' },
      { sys: 'ns', text: 'Parasympathetic activity increases gut motility and secretion.', lesson: 'm5-l5' },
      { sys: 'im', text: 'Stomach acid and gut lymphoid tissue defend against swallowed microbes.', lesson: 'm10-l1' }
    ],
    scenario: { title: 'Worked example: a plate of ugali, sukuma and beans', text: 'Ugali is mostly starch. Amylase begins on it in your mouth; pancreatic amylase and brush-border enzymes finish it into glucose, which is absorbed and travels to the liver, then raises blood glucose and insulin. Beans supply protein: pepsin starts on it in the stomach, pancreatic enzymes and brush-border peptidases release amino acids. Any oil used in cooking is emulsified by bile and digested by lipase; the products travel in lymph as chylomicrons. Sukuma wiki supplies fibre, much of which reaches the large intestine for bacteria to ferment.' },
    misconceptions: [
      { myth: 'Most digestion happens in the stomach.', fact: 'The stomach starts protein digestion, but most chemical digestion and nearly all absorption happen in the small intestine.' },
      { myth: 'Bile is an enzyme that digests fat.', fact: 'Bile contains no digestive enzymes; it emulsifies fat so lipase can work.' },
      { myth: 'All nutrients go straight into the general circulation.', fact: 'Water-soluble nutrients go to the liver first; fats travel via lymph.' }
    ],
    check: [
      { id: 'm7l1-q1', type: 'mcq', prompt: 'What is absorption?', options: ['Breaking large molecules into small ones', 'Moving nutrients from the gut into blood or lymph', 'Churning food in the stomach', 'Removing waste'], answer: 1, explain: 'Absorption is the movement of digested products across the gut wall into blood or lymph.' },
      { id: 'm7l1-q2', type: 'label', prompt: 'Label the digestive organs.', diagram: 'gitract', options: ['Stomach', 'Small intestine', 'Large intestine', 'Liver', 'Pancreas'], answers: { 1: 'Stomach', 2: 'Small intestine', 3: 'Large intestine', 4: 'Liver', 5: 'Pancreas' }, explain: 'Food passes stomach → small intestine → large intestine. The liver (bile) and pancreas (enzymes) are accessory organs that empty into the small intestine.' },
      { id: 'm7l1-q3', type: 'tf', prompt: 'Bile contains enzymes that break down fat.', answer: false, explain: 'False. Bile salts emulsify fat into small droplets; the enzyme lipase does the chemical digestion.' },
      { id: 'm7l1-q4', type: 'mcq', prompt: 'How do absorbed fats mainly enter circulation?', options: ['Hepatic portal vein', 'Lacteals (lymphatic vessels)', 'Directly into the aorta', 'Through the large intestine'], answer: 1, explain: 'Fats are packaged into chylomicrons, which are too large for capillaries and enter lacteals, joining the blood later.' },
      { id: 'm7l1-q5', type: 'short', prompt: 'Name two features that increase the surface area of the small intestine.', keywords: [['villi', 'villus', 'microvilli', 'circular folds', 'folds', 'brush border', 'plicae']], model: 'Circular folds, villi and microvilli (the brush border).', explain: 'These three levels of folding multiply the absorptive surface many times over.' }
    ],
    summary: 'Digestion breaks food into small molecules using mechanical action and enzymes. Absorption moves them across the gut wall, mostly in the small intestine, whose folds, villi and microvilli give it a huge surface. Water-soluble nutrients go to the liver first; fats travel via lymph.',
    terms: [
      { t: 'Digestion', d: 'Breakdown of food into absorbable molecules.' },
      { t: 'Absorption', d: 'Movement of nutrients from the gut into blood or lymph.' },
      { t: 'Villi', d: 'Finger-like projections of the small intestine lining.' },
      { t: 'Lacteal', d: 'Lymphatic capillary in a villus that absorbs fat.' },
      { t: 'Hepatic portal vein', d: 'Carries blood from the gut to the liver.' }
    ],
    flashcards: [
      { q: 'Where is most food absorbed?', a: 'The small intestine.' },
      { q: 'What does bile do?', a: 'Emulsifies fats.' },
      { q: 'Where does protein digestion begin?', a: 'The stomach (pepsin).' }
    ],
    refs: ['os-digestive', 'os-absorption'],
    next: 'm8-l2'
  };

  F['m8-l2'] = {
    keywords: ['kidney', 'nephron', 'filtration', 'reabsorption', 'secretion', 'glomerulus', 'loop of henle', 'collecting duct', 'urine', 'adh', 'antidiuretic', 'gfr', 'renal'],
    why: 'The kidneys decide how much water, salt, acid and waste stay in your body. Their three basic processes explain urine, fluid balance, blood pressure and pH control.',
    objectives: ['Describe the parts of a nephron.', 'Explain filtration, reabsorption and secretion.', 'Describe what each tubule segment mainly does.', 'Explain how ADH controls urine concentration.'],
    intro: 'Each kidney has around a million tiny units called nephrons. Each nephron first filters a large volume of plasma, letting water and small molecules through but holding back cells and large proteins. Then it takes back almost everything useful (reabsorption) and adds a few extra unwanted substances (secretion). What is left becomes urine.',
    detail: [
      'Filtration happens in the glomerulus, a knot of capillaries inside Bowman’s capsule. Blood pressure pushes water and small solutes through. The glomerular filtration rate (GFR) is about 125 mL per minute in adults, roughly 180 litres a day.',
      'The proximal convoluted tubule (PCT) reabsorbs about two thirds of filtered sodium and water, and normally nearly all glucose and amino acids, mostly using sodium-linked transport.',
      'The loop of Henle creates a salty gradient in the kidney medulla. The descending limb lets water out; the thick ascending limb pumps out salt but is impermeable to water. This gradient later allows urine to be concentrated.',
      'The distal convoluted tubule and collecting duct fine-tune what leaves. Aldosterone increases sodium reabsorption and potassium secretion. ADH (antidiuretic hormone) inserts aquaporin water channels into collecting duct cells, so water is drawn out into the salty medulla and urine becomes concentrated.',
      'Secretion moves substances from blood into the tubule: hydrogen ions (for pH balance), potassium, and many drugs and waste products.'
    ],
    advanced: 'Excretion = filtration − reabsorption + secretion. The countercurrent arrangement of the loop of Henle and its blood vessels (vasa recta) maintains the medullary gradient. Autoregulation (myogenic response and tubuloglomerular feedback via the macula densa) keeps GFR fairly stable across a range of blood pressures.',
    steps: [
      'Glomerulus: plasma is filtered into Bowman’s capsule.',
      'Proximal tubule: most water, sodium, glucose and amino acids are reabsorbed.',
      'Loop of Henle: builds the salt gradient in the medulla.',
      'Distal tubule: fine-tuning of sodium, potassium, calcium and acid.',
      'Collecting duct: ADH controls how much water is reabsorbed.',
      'Urine flows to the renal pelvis, ureter and bladder.'
    ],
    diagram: 'nephron',
    analogy: 'Imagine clearing out a cupboard by tipping everything onto the floor (filtration), putting back everything you want to keep (reabsorption), then adding a few extra things from another room to throw away (secretion). What is left on the floor goes out with the rubbish (urine).',
    altAnalogy: 'A nephron is like a sorting line at a recycling centre: everything small enough rides onto the belt, workers pick back the valuables, and a few items are tossed onto the belt from the side.',
    joke: 'Your kidneys are excellent accountants. They audit 180 litres a day and only bill you for one or two.',
    connections: [
      { sys: 'cv', text: 'Blood volume set by the kidneys determines long-term blood pressure.', lesson: 'm3-l7' },
      { sys: 'en', text: 'ADH and aldosterone control how much water and sodium are kept.', lesson: 'm8-l6' },
      { sys: 'rs', text: 'Kidneys and lungs share acid–base control.', lesson: 'm4-l2' },
      { sys: 'cv', text: 'Kidneys release erythropoietin to drive red cell production.', lesson: 'm13-l7' }
    ],
    scenario: { title: 'Worked example: dehydration after a long hot day', text: 'You have sweated a lot and drunk little. Plasma is more concentrated, so the hypothalamus triggers ADH release. In the collecting ducts, aquaporins open and water moves into the salty medulla. Your urine becomes small in volume and dark. Lower blood volume also activates renin and aldosterone, retaining sodium (and water with it). Once you drink, ADH falls and the kidneys let more water go.' },
    misconceptions: [
      { myth: 'The kidneys only filter out what the body does not need.', fact: 'They filter almost everything small, then reabsorb what is needed.' },
      { myth: 'Urine colour reliably reflects hydration in every situation.', fact: 'It usually tracks concentration, but vitamins, foods and medicines can change colour too.' },
      { myth: 'Glucose in urine is normal.', fact: 'Normally almost all filtered glucose is reabsorbed; glucose appears in urine only when blood levels exceed the transporters’ capacity.' }
    ],
    check: [
      { id: 'm8l2-q1', type: 'label', prompt: 'Label the parts of the nephron.', diagram: 'nephron', options: ['Glomerulus', 'Proximal convoluted tubule', 'Loop of Henle', 'Distal convoluted tubule', 'Collecting duct'], answers: { 1: 'Glomerulus', 2: 'Proximal convoluted tubule', 3: 'Loop of Henle', 4: 'Distal convoluted tubule', 5: 'Collecting duct' }, explain: 'Filtrate flows from the glomerulus through the PCT, loop of Henle and DCT into the collecting duct.' },
      { id: 'm8l2-q2', type: 'mcq', prompt: 'Which segment reabsorbs the largest share of filtered water and sodium?', options: ['Proximal convoluted tubule', 'Loop of Henle', 'Distal convoluted tubule', 'Collecting duct'], answer: 0, explain: 'The PCT reabsorbs about two thirds of filtered sodium and water, plus nearly all glucose and amino acids.' },
      { id: 'm8l2-q3', type: 'tf', prompt: 'ADH makes urine more dilute.', answer: false, explain: 'False. ADH adds water channels in the collecting duct, so more water is reabsorbed and urine becomes more concentrated.' },
      { id: 'm8l2-q4', type: 'scenario', scenario: 'A person drinks 1.5 litres of water quickly.', prompt: 'What happens to ADH and urine?', options: ['ADH rises, urine concentrated', 'ADH falls, urine dilute and larger volume', 'ADH unchanged, no urine change', 'ADH falls, urine concentrated'], answer: 1, explain: 'Dilute plasma lowers ADH, so fewer aquaporins are present and more dilute urine is produced.' },
      { id: 'm8l2-q5', type: 'short', prompt: 'Write the equation linking filtration, reabsorption, secretion and excretion.', keywords: [['filtration', 'filtered'], ['reabsorption', 'reabsorbed'], ['secretion', 'secreted']], model: 'Excretion = filtration − reabsorption + secretion.', explain: 'What leaves in urine is what was filtered, minus what was taken back, plus what was added.' }
    ],
    summary: 'Nephrons filter plasma at the glomerulus, reabsorb most water and useful solutes in the tubules, and secrete some extra wastes and ions. The loop of Henle builds a salt gradient; ADH and aldosterone fine-tune water and sodium in the final segments.',
    terms: [
      { t: 'Nephron', d: 'Functional unit of the kidney.' },
      { t: 'Glomerulus', d: 'Capillary network where filtration occurs.' },
      { t: 'GFR', d: 'Glomerular filtration rate, about 125 mL/min in adults.' },
      { t: 'Reabsorption', d: 'Movement from tubule back into blood.' },
      { t: 'Secretion', d: 'Movement from blood into tubule.' }
    ],
    flashcards: [
      { q: 'Daily filtrate volume?', a: 'About 180 litres.' },
      { q: 'Which hormone inserts aquaporins in the collecting duct?', a: 'ADH (antidiuretic hormone).' },
      { q: 'Which segment creates the medullary salt gradient?', a: 'The loop of Henle.' }
    ],
    refs: ['os-urine', 'niddk-kidneys'],
    next: 'm8-l6'
  };

  F['m8-l6'] = {
    keywords: ['renin', 'angiotensin', 'aldosterone', 'raas', 'ace', 'juxtaglomerular', 'macula densa', 'blood pressure', 'sodium retention'],
    why: 'The renin–angiotensin–aldosterone system (RAAS) is how the kidneys, liver, lungs, adrenal glands and blood vessels cooperate to protect blood pressure and blood volume. Several common blood pressure medicines act on it.',
    objectives: ['Name the triggers for renin release.', 'Trace the RAAS cascade from renin to aldosterone.', 'Describe the actions of angiotensin II.', 'Explain how RAAS is switched off.'],
    intro: 'When the kidneys sense that blood pressure or blood volume is too low, they release an enzyme called renin. Renin starts a chain reaction that produces angiotensin II, a powerful hormone that tightens blood vessels and tells the adrenal glands to release aldosterone. Aldosterone makes the kidneys hold on to salt, and water follows. Pressure goes back up.',
    detail: [
      'Renin is released by juxtaglomerular (granular) cells in the walls of the afferent arterioles. Three main triggers: lower stretch of these arterioles (low perfusion pressure), less sodium chloride reaching the macula densa in the distal tubule, and sympathetic nerve stimulation.',
      'Renin cuts angiotensinogen, a protein made by the liver and always present in plasma, into angiotensin I. Angiotensin-converting enzyme (ACE), found mostly on the lining of lung capillaries, converts angiotensin I into angiotensin II.',
      'Angiotensin II constricts arterioles (raising resistance), stimulates aldosterone release from the adrenal cortex, stimulates ADH release and thirst, and increases sodium reabsorption in the proximal tubule.',
      'Aldosterone acts on the late distal tubule and collecting duct to increase sodium reabsorption and potassium secretion. Water follows sodium, increasing blood volume.',
      'As pressure and volume recover, renin release falls: classic negative feedback. Stretching of the atria also releases ANP, which opposes RAAS.'
    ],
    advanced: 'Medicines such as ACE inhibitors and angiotensin receptor blockers lower blood pressure by interrupting this cascade; their use is a clinical decision, mentioned here only to show how physiology underpins treatment. Aldosterone secretion is also strongly stimulated by high plasma potassium, linking RAAS to potassium balance.',
    steps: [
      'Low blood pressure, low sodium delivery or sympathetic signals trigger renin release.',
      'Renin converts angiotensinogen (from the liver) to angiotensin I.',
      'ACE (mainly in the lungs) converts angiotensin I to angiotensin II.',
      'Angiotensin II constricts vessels and stimulates thirst and ADH.',
      'Angiotensin II stimulates aldosterone from the adrenal cortex.',
      'Aldosterone increases sodium and water retention; volume and pressure rise; renin falls.'
    ],
    diagram: 'raas',
    analogy: 'RAAS is a relay race across organs. The kidney fires the starting pistol (renin), the liver supplies the baton (angiotensinogen), the lungs hand it on (ACE), and angiotensin II sprints to blood vessels and the adrenal glands, which send aldosterone back to the kidney for the finish.',
    altAnalogy: 'Think of a dry-season water plan: the county (kidney) notices the reservoir is low, so it tightens taps across the city (vasoconstriction), asks everyone to drink and store more (thirst, ADH), and stops letting water drain away (aldosterone).',
    joke: 'RAAS involves your kidneys, liver, lungs, adrenal glands and blood vessels. It is the only group project where every member actually contributes.',
    connections: [
      { sys: 'cv', text: 'RAAS raises blood pressure through resistance and volume.', lesson: 'm3-l7' },
      { sys: 'en', text: 'Aldosterone (adrenal cortex) and ADH (posterior pituitary) are the hormonal arms.', lesson: 'm8-l2' },
      { sys: 'rs', text: 'ACE is concentrated in the lung capillaries.', lesson: 'm4-l2' },
      { sys: 'ns', text: 'Sympathetic nerves directly stimulate renin release.', lesson: 'm5-l5' }
    ],
    scenario: { title: 'Worked example: losing blood', text: 'Within seconds the baroreflex raises heart rate and constricts vessels. Within minutes, low renal perfusion and sympathetic signals release renin. Angiotensin II tightens arterioles further and triggers aldosterone, ADH and thirst, so the kidneys retain sodium and water and the person wants to drink. Over the following days, erythropoietin from the kidneys drives new red cell production. Several systems, three timescales, one goal: restore delivery to tissues.' },
    misconceptions: [
      { myth: 'Renin is a hormone that directly raises blood pressure.', fact: 'Renin is an enzyme; it starts the cascade. Angiotensin II and aldosterone do the work.' },
      { myth: 'ACE is made in the kidney.', fact: 'ACE is found on blood vessel linings, especially in the lungs.' },
      { myth: 'Aldosterone makes the kidneys retain water directly.', fact: 'It retains sodium; water follows by osmosis (with ADH’s help).' }
    ],
    check: [
      { id: 'm8l6-q1', type: 'label', prompt: 'Label the RAAS cascade.', diagram: 'raas', options: ['Renin', 'Angiotensinogen', 'ACE', 'Angiotensin II', 'Aldosterone'], answers: { 1: 'Renin', 2: 'Angiotensinogen', 3: 'ACE', 4: 'Angiotensin II', 5: 'Aldosterone' }, explain: 'Renin acts on angiotensinogen to form angiotensin I; ACE forms angiotensin II, which stimulates aldosterone.' },
      { id: 'm8l6-q2', type: 'mcq', prompt: 'Which organ makes angiotensinogen?', options: ['Kidney', 'Liver', 'Lung', 'Adrenal gland'], answer: 1, explain: 'The liver produces angiotensinogen continuously; renin from the kidney cuts it.' },
      { id: 'm8l6-q3', type: 'tf', prompt: 'Low blood pressure increases renin release.', answer: true, explain: 'True. Reduced stretch of the afferent arteriole is one of the main triggers.' },
      { id: 'm8l6-q4', type: 'mcq', prompt: 'What is aldosterone’s main action?', options: ['Inserts aquaporins', 'Increases sodium reabsorption and potassium secretion', 'Constricts arterioles', 'Converts angiotensin I'], answer: 1, explain: 'Aldosterone acts on the late distal tubule and collecting duct to reabsorb sodium and secrete potassium.' },
      { id: 'm8l6-q5', type: 'short', prompt: 'Name two actions of angiotensin II.', keywords: [['vasoconstrict', 'constrict', 'narrow', 'aldosterone', 'adh', 'antidiuretic', 'thirst', 'sodium']], model: 'It constricts arterioles, stimulates aldosterone release, stimulates ADH and thirst, and increases sodium reabsorption.', explain: 'Angiotensin II raises pressure both directly (vasoconstriction) and indirectly (more volume via aldosterone, ADH and thirst).' }
    ],
    summary: 'When kidney perfusion falls, renin starts a cascade: angiotensinogen → angiotensin I → (ACE) → angiotensin II. Angiotensin II constricts vessels and triggers aldosterone, ADH and thirst. Sodium and water are retained, pressure rises, and renin falls again.',
    terms: [
      { t: 'Renin', d: 'Kidney enzyme that converts angiotensinogen to angiotensin I.' },
      { t: 'ACE', d: 'Angiotensin-converting enzyme; forms angiotensin II.' },
      { t: 'Angiotensin II', d: 'Hormone that constricts vessels and stimulates aldosterone.' },
      { t: 'Aldosterone', d: 'Adrenal cortex hormone that increases sodium retention.' },
      { t: 'Macula densa', d: 'Distal tubule cells that sense sodium chloride delivery.' }
    ],
    flashcards: [
      { q: 'Three triggers for renin?', a: 'Low perfusion pressure, low NaCl at macula densa, sympathetic stimulation.' },
      { q: 'Where is most ACE?', a: 'Lung capillary endothelium.' },
      { q: 'Aldosterone: sodium and potassium?', a: 'Retains sodium, excretes potassium.' }
    ],
    refs: ['os-kidney-endocrine', 'statpearls-raas'],
    next: 'm9-l2'
  };
})(window.BW = window.BW || {});
