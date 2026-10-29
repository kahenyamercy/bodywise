/* BodyWise — body systems, the relationships between them, cross-system
   learning paths, facts and jokes. Educational summaries, not clinical advice. */
(function (BW) {
  'use strict';

  BW.systems = [
    {
      id: 'cv', code: 'CV', name: 'Cardiovascular & blood', short: 'Cardiovascular',
      fn: 'Moves blood around the body so every cell gets oxygen and nutrients and loses its waste. Blood also carries heat, hormones and immune cells.',
      organs: ['Heart', 'Arteries, capillaries and veins', 'Blood (plasma, red cells, white cells, platelets)', 'Red bone marrow (makes blood cells)'],
      processes: ['Pumping (the cardiac cycle)', 'Regulating blood pressure', 'Capillary exchange', 'Oxygen transport by haemoglobin', 'Clotting'],
      lessons: ['m3-l4', 'm3-l7', 'm13-l7'],
      spot: { x: 136, y: 150 },
      quiz: [
        { id: 'sys-cv-1', type: 'mcq', prompt: 'Which chamber pumps oxygen-rich blood out to the body?', options: ['Right atrium', 'Right ventricle', 'Left atrium', 'Left ventricle'], answer: 3, explain: 'The left ventricle pumps oxygenated blood into the aorta. Its thick muscular wall reflects the higher pressure needed to push blood around the whole body.' },
        { id: 'sys-cv-2', type: 'tf', prompt: 'Capillaries are where most exchange between blood and tissues happens.', answer: true, explain: 'True. Capillary walls are one cell thick, so gases, nutrients and wastes can cross between blood and the fluid around cells.' }
      ],
      scenario: { title: 'What happens if you stand up quickly?', text: 'Gravity pulls blood into the veins of your legs, so less blood returns to the heart for a moment and blood pressure dips. Baroreceptors in the carotid arteries and aorta notice within seconds. The brainstem raises sympathetic output: heart rate goes up and blood vessels tighten. Pressure recovers, usually before you notice more than a brief light-headed feeling. This is a negative feedback loop doing its job.' }
    },
    {
      id: 'rs', code: 'RS', name: 'Respiratory', short: 'Respiratory',
      fn: 'Brings oxygen into the blood and removes carbon dioxide. By adjusting how much carbon dioxide leaves, it also helps control blood pH.',
      organs: ['Nose and mouth', 'Pharynx and larynx', 'Trachea and bronchi', 'Lungs and alveoli', 'Diaphragm and intercostal muscles'],
      processes: ['Ventilation (moving air in and out)', 'Gas exchange in the alveoli', 'Carbon dioxide removal', 'Acid–base adjustment'],
      lessons: ['m4-l2', 'm13-l7'],
      spot: { x: 96, y: 140 },
      quiz: [
        { id: 'sys-rs-1', type: 'mcq', prompt: 'Where does gas exchange between air and blood take place?', options: ['Trachea', 'Bronchi', 'Alveoli', 'Larynx'], answer: 2, explain: 'The alveoli are tiny air sacs wrapped in capillaries. Their very thin walls and huge combined surface area make diffusion fast.' },
        { id: 'sys-rs-2', type: 'tf', prompt: 'Rising carbon dioxide in the blood is the main everyday signal that makes you breathe more.', answer: true, explain: 'True. Chemoreceptors respond mainly to carbon dioxide and the acidity it creates. Low oxygen becomes a strong signal mostly when oxygen falls a lot, for example at high altitude.' }
      ],
      scenario: { title: 'What happens if you hold your breath?', text: 'Your cells keep making carbon dioxide. It builds up in the blood and makes it slightly more acidic. Chemoreceptors in the brainstem and in the carotid and aortic bodies detect the change and the respiratory centre pushes harder and harder for a breath. That growing urge comes mostly from carbon dioxide, not from running out of oxygen.' }
    },
    {
      id: 'ns', code: 'NS', name: 'Nervous', short: 'Nervous',
      fn: 'Senses what is happening, decides what to do and sends fast electrical and chemical signals to muscles and glands.',
      organs: ['Brain', 'Spinal cord', 'Cranial and spinal nerves', 'Autonomic ganglia', 'Sense organs'],
      processes: ['Action potentials', 'Synaptic transmission', 'Reflexes', 'Autonomic control of organs', 'Sensation and movement'],
      lessons: ['m2-l5', 'm5-l5'],
      spot: { x: 120, y: 44 },
      quiz: [
        { id: 'sys-ns-1', type: 'mcq', prompt: 'Which division of the autonomic nervous system dominates during a sudden fright?', options: ['Parasympathetic', 'Sympathetic', 'Somatic', 'Enteric'], answer: 1, explain: 'The sympathetic division prepares the body for action: faster heart rate, wider airways, more glucose released into the blood.' },
        { id: 'sys-ns-2', type: 'tf', prompt: 'Nerve signals travel along a neuron as electrical changes across its membrane.', answer: true, explain: 'True. An action potential is a rapid change in membrane voltage caused by ions moving through channels.' }
      ],
      scenario: { title: 'What happens if you get a sudden fright?', text: 'Within a second the sympathetic nervous system fires. The heart beats faster and harder, airways widen, blood is redirected towards skeletal muscle and away from the gut, and the adrenal medulla releases adrenaline into the blood to keep the response going. When the threat passes, parasympathetic activity helps bring things back to baseline.' }
    },
    {
      id: 'en', code: 'EN', name: 'Endocrine', short: 'Endocrine',
      fn: 'Sends chemical messages (hormones) through the blood to control slower, longer-lasting processes such as growth, metabolism, fluid balance and reproduction.',
      organs: ['Hypothalamus and pituitary', 'Thyroid and parathyroids', 'Adrenal glands', 'Pancreatic islets', 'Ovaries and testes', 'Hormone-making cells in the heart, kidneys and gut'],
      processes: ['Hormone release and feedback', 'Blood glucose control', 'Calcium control', 'Stress response', 'Fluid balance (ADH, aldosterone)'],
      lessons: ['m6-l4', 'm8-l6', 'm12-l4'],
      spot: { x: 120, y: 96 },
      quiz: [
        { id: 'sys-en-1', type: 'mcq', prompt: 'Which hormone lowers blood glucose?', options: ['Glucagon', 'Insulin', 'Adrenaline', 'Cortisol'], answer: 1, explain: 'Insulin helps many cells take up glucose and promotes storage as glycogen and fat. The others tend to raise blood glucose.' },
        { id: 'sys-en-2', type: 'tf', prompt: 'Hormones affect only cells that have the right receptor.', answer: true, explain: 'True. A hormone reaches nearly every cell through the blood, but only target cells with a matching receptor respond.' }
      ],
      scenario: { title: 'What happens if you skip breakfast?', text: 'Overnight and into the morning, blood glucose drifts down. The pancreas releases less insulin and more glucagon. Glucagon tells the liver to break down stored glycogen and release glucose, so blood glucose stays in a safe range. If the fast continues for much longer, the body relies more on fat and the liver makes glucose from other building blocks.' }
    },
    {
      id: 'di', code: 'DI', name: 'Digestive', short: 'Digestive',
      fn: 'Breaks food into molecules small enough to absorb, takes them into the blood and lymph, and removes what is left.',
      organs: ['Mouth and oesophagus', 'Stomach', 'Small intestine', 'Large intestine', 'Liver and gallbladder', 'Pancreas (exocrine part)'],
      processes: ['Mechanical and chemical digestion', 'Absorption', 'Motility (peristalsis)', 'Secretion of enzymes and bile'],
      lessons: ['m7-l1', 'm6-l4'],
      spot: { x: 112, y: 214 },
      quiz: [
        { id: 'sys-di-1', type: 'mcq', prompt: 'Where are most nutrients absorbed?', options: ['Stomach', 'Small intestine', 'Large intestine', 'Oesophagus'], answer: 1, explain: 'The small intestine is long and folded, with villi and microvilli that give it an enormous surface area for absorption.' },
        { id: 'sys-di-2', type: 'tf', prompt: 'Digestion and absorption mean the same thing.', answer: false, explain: 'False. Digestion breaks food down. Absorption moves the products across the gut wall into blood or lymph.' }
      ],
      scenario: { title: 'What happens after a fatty meal?', text: 'When fat reaches the small intestine, cells there release the hormone cholecystokinin (CCK). CCK makes the gallbladder squeeze bile into the intestine, prompts the pancreas to release enzymes, and slows how fast the stomach empties. Bile breaks fat into small droplets so lipase can work. That slower emptying is one reason a fatty meal keeps you feeling full for longer.' }
    },
    {
      id: 're', code: 'RE', name: 'Renal (kidneys)', short: 'Renal',
      fn: 'Filters the blood, keeps the right amounts of water and salts, removes wastes, helps control blood pressure and pH, and makes hormones.',
      organs: ['Kidneys and nephrons', 'Ureters', 'Bladder', 'Urethra'],
      processes: ['Filtration, reabsorption and secretion', 'Water and electrolyte balance', 'Acid–base balance', 'Renin release (blood pressure)', 'Erythropoietin release (red cell production)'],
      lessons: ['m8-l2', 'm8-l6'],
      spot: { x: 154, y: 204 },
      quiz: [
        { id: 'sys-re-1', type: 'mcq', prompt: 'Which hormone made by the kidneys stimulates red blood cell production?', options: ['Renin', 'Erythropoietin', 'Aldosterone', 'ADH'], answer: 1, explain: 'When kidney cells sense low oxygen delivery, they release erythropoietin (EPO), which tells the bone marrow to make more red blood cells.' },
        { id: 'sys-re-2', type: 'tf', prompt: 'Most of the fluid filtered by the kidneys is reabsorbed.', answer: true, explain: 'True. Adults filter roughly 180 litres of plasma a day but usually pass only about 1 to 2 litres of urine.' }
      ],
      scenario: { title: 'What happens if you drink a lot of water quickly?', text: 'Your blood becomes slightly more dilute. Osmoreceptors in the hypothalamus detect this and the pituitary releases less antidiuretic hormone (ADH). With less ADH, the collecting ducts in the kidney let less water back into the blood, so you produce a larger volume of dilute urine. Within an hour or two the balance is restored.' }
    },
    {
      id: 'ms', code: 'MS', name: 'Musculoskeletal', short: 'Musculoskeletal',
      fn: 'Supports and protects the body, makes movement and posture possible, stores calcium and produces heat. Red bone marrow makes blood cells.',
      organs: ['Skeletal muscles', 'Bones', 'Joints, ligaments and tendons', 'Red bone marrow'],
      processes: ['Muscle contraction (sliding filaments)', 'ATP use and regeneration', 'Calcium storage and release', 'Heat production'],
      lessons: ['m9-l2', 'm13-l7'],
      spot: { x: 100, y: 334 },
      quiz: [
        { id: 'sys-ms-1', type: 'mcq', prompt: 'Which ion is released inside a muscle fibre to start contraction?', options: ['Sodium', 'Potassium', 'Calcium', 'Chloride'], answer: 2, explain: 'Calcium released from the sarcoplasmic reticulum binds troponin, which uncovers the binding sites on actin so myosin can pull.' },
        { id: 'sys-ms-2', type: 'tf', prompt: 'Muscles push bones as well as pull them.', answer: false, explain: 'False. Muscles can only pull by shortening. Movement in the opposite direction comes from a different (antagonist) muscle.' }
      ],
      scenario: { title: 'What happens during a 100-metre sprint?', text: 'For the first few seconds, muscle uses the small amount of ATP it has stored, then quickly regenerates ATP from creatine phosphate. Anaerobic glycolysis then supplies much of the energy, producing lactate. Oxygen-based (aerobic) energy production is also rising, but it takes longer to ramp up. Afterwards you keep breathing hard to restore these stores.' }
    },
    {
      id: 'im', code: 'IM', name: 'Immune & lymphatic', short: 'Immune',
      fn: 'Defends the body against microbes and damaged cells, and returns leaked tissue fluid to the blood through lymphatic vessels.',
      organs: ['White blood cells', 'Lymph nodes and lymphatic vessels', 'Spleen', 'Thymus', 'Red bone marrow', 'Tonsils and gut lymphoid tissue'],
      processes: ['Barrier defences', 'Inflammation', 'Innate response', 'Adaptive response (T and B cells, antibodies)', 'Immune memory', 'Lymph drainage'],
      lessons: ['m10-l1'],
      spot: { x: 76, y: 126 },
      quiz: [
        { id: 'sys-im-1', type: 'mcq', prompt: 'Which response is specific to one particular microbe and can form memory?', options: ['Innate', 'Adaptive', 'Inflammation', 'Fever'], answer: 1, explain: 'The adaptive response uses T and B cells with receptors for specific antigens, and it leaves memory cells behind.' },
        { id: 'sys-im-2', type: 'tf', prompt: 'Lymphatic vessels return excess tissue fluid to the blood.', answer: true, explain: 'True. Some fluid leaves capillaries and is not reabsorbed. Lymphatic vessels collect it and return it to veins near the heart.' }
      ],
      scenario: { title: 'What happens when you get a splinter?', text: 'Damaged cells and resident immune cells release signals such as histamine. Nearby blood vessels widen and become leakier, so the area turns red, warm and swollen. Neutrophils and macrophages move in to engulf microbes and debris. If microbes persist, the adaptive system can join in over the following days.' }
    },
    {
      id: 'rp', code: 'RP', name: 'Reproductive', short: 'Reproductive',
      fn: 'Produces gametes and sex hormones, and in pregnancy supports the growth of a baby, birth and breastfeeding.',
      organs: ['Ovaries, uterine tubes, uterus, vagina', 'Testes and ducts', 'Placenta (in pregnancy)', 'Breasts (lactation)'],
      processes: ['Gamete production', 'The ovarian and menstrual cycle', 'Fertilisation and pregnancy', 'Lactation', 'Postpartum recovery'],
      lessons: ['m12-l4'],
      spot: { x: 120, y: 262 },
      quiz: [
        { id: 'sys-rp-1', type: 'mcq', prompt: 'Which hormone, made early in pregnancy, keeps the corpus luteum producing progesterone?', options: ['hCG', 'FSH', 'Oxytocin', 'Prolactin'], answer: 0, explain: 'Human chorionic gonadotropin (hCG) from the developing embryo keeps the corpus luteum active until the placenta can make enough progesterone itself.' },
        { id: 'sys-rp-2', type: 'tf', prompt: 'Blood volume increases during pregnancy.', answer: true, explain: 'True. Plasma volume and red cell mass both rise, plasma more than red cells. This supports the placenta and provides a reserve for blood loss at birth.' }
      ],
      scenario: { title: 'What happens to breathing during pregnancy?', text: 'Progesterone makes the respiratory centre more sensitive to carbon dioxide, so the amount of air breathed per minute rises, mainly through deeper breaths. Arterial carbon dioxide falls slightly, which helps carbon dioxide move from the fetus to the mother across the placenta. Later, the growing uterus pushes up on the diaphragm, which can make breathing feel harder.' }
    }
  ];

  BW.sysById = {};
  BW.systems.forEach(function (s) { BW.sysById[s.id] = s; });

  /* Relationships: each is a two-way link with a plain-language explanation. */
  BW.relations = [
    { a: 'cv', b: 'rs', text: 'The right side of the heart pumps blood to the lungs, where it picks up oxygen and drops off carbon dioxide before returning to the left side.', lesson: 'm4-l2' },
    { a: 'cv', b: 're', text: 'The kidneys receive about a fifth of the heart’s output. They adjust blood volume and, through renin, blood pressure.', lesson: 'm8-l6' },
    { a: 'cv', b: 'ns', text: 'Autonomic nerves set heart rate and vessel diameter. Baroreceptors report blood pressure back to the brainstem every heartbeat.', lesson: 'm3-l7' },
    { a: 'cv', b: 'en', text: 'Adrenaline speeds the heart; ADH and aldosterone raise blood volume; the heart itself releases a hormone (ANP) that helps the kidneys lose sodium.', lesson: 'm3-l7' },
    { a: 'cv', b: 'di', text: 'Absorbed nutrients enter intestinal capillaries and travel through the hepatic portal vein to the liver before reaching the rest of the body.', lesson: 'm7-l1' },
    { a: 'cv', b: 'ms', text: 'Working muscles need more oxygen, so cardiac output rises. Contracting leg muscles also squeeze veins and help blood return to the heart.', lesson: 'm13-l7' },
    { a: 'cv', b: 'im', text: 'Blood carries white cells to where they are needed. During inflammation, local vessels widen and become leakier so cells and proteins can get out.', lesson: 'm10-l1' },
    { a: 'cv', b: 'rp', text: 'In pregnancy, blood volume and cardiac output rise to supply the placenta. The placenta exchanges gases and nutrients with maternal blood.', lesson: 'm12-l4' },
    { a: 'rs', b: 'ns', text: 'Respiratory centres in the brainstem set the rhythm of breathing. Chemoreceptors tell them when carbon dioxide or acidity rises.', lesson: 'm4-l2' },
    { a: 'rs', b: 're', text: 'Both control blood pH. The lungs change carbon dioxide within minutes; the kidneys adjust acid and bicarbonate over hours to days.', lesson: 'm8-l2' },
    { a: 'rs', b: 'ms', text: 'Breathing is powered by skeletal muscles (diaphragm, intercostals). Working muscles make carbon dioxide, which drives breathing up.', lesson: 'm13-l7' },
    { a: 'rs', b: 'im', text: 'Mucus and cilia trap and sweep out particles; macrophages in the alveoli engulf anything that gets deep into the lungs.', lesson: 'm10-l1' },
    { a: 'rs', b: 'rp', text: 'In pregnancy, progesterone increases breathing. Lower maternal carbon dioxide helps the fetus offload its carbon dioxide across the placenta.', lesson: 'm12-l4' },
    { a: 'ns', b: 'en', text: 'The hypothalamus controls the pituitary gland, and sympathetic nerves trigger the adrenal medulla to release adrenaline.', lesson: 'm5-l5' },
    { a: 'ns', b: 'di', text: 'The gut has its own nervous system. Parasympathetic signals (mainly the vagus nerve) increase digestion; sympathetic signals slow it.', lesson: 'm5-l5' },
    { a: 'ns', b: 'ms', text: 'Motor neurons release acetylcholine at the neuromuscular junction, which triggers each skeletal muscle contraction.', lesson: 'm9-l2' },
    { a: 'ns', b: 're', text: 'Sympathetic nerves narrow kidney arterioles and stimulate renin release, which helps hold blood pressure up.', lesson: 'm8-l6' },
    { a: 'ns', b: 'im', text: 'The brain’s temperature set point rises during fever in response to immune signals, and stress hormones can dampen immune activity.', lesson: 'm11-l3' },
    { a: 'en', b: 'di', text: 'The pancreas releases insulin and glucagon; gut hormones such as gastrin, secretin and CCK coordinate digestion.', lesson: 'm6-l4' },
    { a: 'en', b: 're', text: 'ADH and aldosterone act on the kidneys. The kidneys in turn release renin and erythropoietin and activate vitamin D.', lesson: 'm8-l6' },
    { a: 'en', b: 'ms', text: 'Insulin promotes glucose uptake by muscle; parathyroid hormone and vitamin D move calcium in and out of bone.', lesson: 'm6-l4' },
    { a: 'en', b: 'rp', text: 'FSH, LH, oestrogen and progesterone run the ovarian cycle; in pregnancy hCG and placental hormones take over.', lesson: 'm12-l4' },
    { a: 'di', b: 'ms', text: 'Digestion supplies glucose and amino acids; muscle stores glucose as glycogen and uses amino acids for repair.', lesson: 'm7-l1' },
    { a: 'di', b: 'im', text: 'Stomach acid kills many swallowed microbes, and the gut wall holds large amounts of lymphoid tissue.', lesson: 'm10-l1' },
    { a: 'ms', b: 'im', text: 'Red bone marrow makes white blood cells as well as red cells and platelets.', lesson: 'm10-l1' },
    { a: 're', b: 'rp', text: 'Kidney blood flow and filtration rise substantially in pregnancy to clear the extra wastes of mother and fetus.', lesson: 'm12-l4' },
    { a: 'im', b: 'rp', text: 'Certain maternal antibodies cross the placenta, and breast milk carries antibodies that protect the baby’s gut.', lesson: 'm12-l4' }
  ];

  BW.relationsFor = function (id) {
    return BW.relations.filter(function (r) { return r.a === id || r.b === id; }).map(function (r) {
      return { other: r.a === id ? r.b : r.a, text: r.text, lesson: r.lesson };
    });
  };
  BW.relationBetween = function (x, y) {
    for (var i = 0; i < BW.relations.length; i++) {
      var r = BW.relations[i];
      if ((r.a === x && r.b === y) || (r.a === y && r.b === x)) return r;
    }
    return null;
  };

  /* Cross-system learning paths. */
  BW.paths = [
    {
      id: 'breath-to-muscle', title: 'From a breath to a muscle contraction',
      blurb: 'Follow one oxygen molecule from the air to the mitochondria of a working muscle.',
      check: { q: 'Why does oxygen move from the alveoli into the blood without any pump?', a: 'Its partial pressure is higher in alveolar air (about 104 mmHg) than in blood arriving at the lungs (about 40 mmHg), so it diffuses down the gradient.' },
      steps: [
        { sys: 'rs', title: 'Breathe in', text: 'The diaphragm contracts and air flows down the airways to the alveoli.', lesson: 'm4-l2' },
        { sys: 'rs', title: 'Oxygen crosses into blood', text: 'Oxygen diffuses from alveolar air into pulmonary capillaries because its partial pressure is higher in the alveoli.', lesson: 'm4-l2' },
        { sys: 'cv', title: 'Haemoglobin loads oxygen', text: 'Most oxygen binds haemoglobin inside red blood cells. The left ventricle pumps this blood into the systemic circulation.', lesson: 'm3-l4' },
        { sys: 'ms', title: 'Muscle unloads oxygen', text: 'Working muscle is warm, acidic and rich in carbon dioxide, which helps haemoglobin release oxygen there.', lesson: 'm13-l7' },
        { sys: 'ms', title: 'Mitochondria make ATP', text: 'Oxygen is the final electron acceptor in aerobic respiration. The ATP produced powers the myosin heads that pull actin.', lesson: 'm9-l2' }
      ]
    },
    {
      id: 'meal-to-energy', title: 'From a meal to cellular energy',
      blurb: 'See how a plate of ugali becomes ATP inside your cells.',
      check: { q: 'Which step needs a hormone, and which hormone is it?', a: 'Glucose entry into muscle and fat cells. Insulin moves GLUT4 transporters to the cell surface so glucose can get in.' },
      steps: [
        { sys: 'di', title: 'Starch is digested', text: 'Amylase in saliva and from the pancreas breaks starch down; enzymes on the intestinal lining finish the job, releasing glucose.', lesson: 'm7-l1' },
        { sys: 'di', title: 'Glucose is absorbed', text: 'Glucose crosses the intestinal lining using transporters, then enters capillaries and travels to the liver.', lesson: 'm7-l1' },
        { sys: 'en', title: 'Insulin is released', text: 'Rising blood glucose triggers beta cells in the pancreatic islets to release insulin.', lesson: 'm6-l4' },
        { sys: 'ms', title: 'Cells take in glucose', text: 'Insulin moves glucose transporters to the surface of muscle and fat cells. The liver and muscle store extra glucose as glycogen.', lesson: 'm6-l4' },
        { sys: 'ms', title: 'ATP is produced', text: 'Glucose is broken down by glycolysis and, with oxygen, in the mitochondria, capturing energy as ATP.', lesson: 'm9-l2' }
      ]
    },
    {
      id: 'sweat-to-thirst', title: 'From sweating to thirst',
      blurb: 'How a hot afternoon walk ends with your kidneys saving water and you reaching for a drink.',
      check: { q: 'Why does heavy sweating make urine darker?', a: 'Fluid loss concentrates the plasma, ADH rises, and the collecting ducts reabsorb more water, so the urine that remains is more concentrated.' },
      steps: [
        { sys: 'ns', title: 'Body heats up', text: 'The hypothalamus detects rising temperature and triggers sweating and wider skin blood vessels.', lesson: 'm11-l3' },
        { sys: 'cv', title: 'Fluid is lost', text: 'Sweat comes from the extracellular fluid, so plasma volume falls and the blood becomes slightly more concentrated.', lesson: 'm1-l5' },
        { sys: 'en', title: 'ADH is released', text: 'Osmoreceptors in the hypothalamus sense the higher concentration; the posterior pituitary releases ADH.', lesson: 'm8-l2' },
        { sys: 're', title: 'Kidneys save water', text: 'ADH inserts water channels in the collecting ducts, so more water returns to the blood and urine becomes concentrated.', lesson: 'm8-l2' },
        { sys: 'ns', title: 'You feel thirsty', text: 'The same hypothalamic osmoreceptors create the sensation of thirst, which drives you to drink and restore volume.', lesson: 'm1-l4' }
      ]
    },
    {
      id: 'bleed-to-rbc', title: 'From blood loss to new red cells',
      blurb: 'The short-, medium- and long-term responses to losing blood.',
      check: { q: 'Put the three responses in order of speed.', a: 'Baroreflex (seconds), then the renin–angiotensin–aldosterone system and ADH (minutes to hours), then erythropoietin-driven red cell production (days).' },
      steps: [
        { sys: 'cv', title: 'Pressure drops', text: 'Losing blood reduces the volume returning to the heart, so stroke volume and blood pressure fall.', lesson: 'm3-l7' },
        { sys: 'ns', title: 'Baroreflex responds (seconds)', text: 'Baroreceptors fire less; the brainstem raises sympathetic output, increasing heart rate and constricting vessels.', lesson: 'm3-l7' },
        { sys: 're', title: 'Kidneys release renin (minutes to hours)', text: 'Lower kidney perfusion and sympathetic signals trigger renin, starting the renin–angiotensin–aldosterone system.', lesson: 'm8-l6' },
        { sys: 'en', title: 'Hormones hold on to fluid', text: 'Angiotensin II constricts vessels and stimulates aldosterone and ADH, so the kidneys retain sodium and water.', lesson: 'm8-l6' },
        { sys: 're', title: 'EPO rebuilds red cells (days)', text: 'Reduced oxygen delivery to kidney cells increases erythropoietin, which drives the bone marrow to make more red cells.', lesson: 'm8-l6' }
      ]
    }
  ];

  BW.facts = [
    'Your lungs contain hundreds of millions of tiny air sacs called alveoli, where oxygen enters the blood and carbon dioxide leaves it.',
    'Adult kidneys filter roughly 180 litres of plasma a day, yet most people pass only 1 to 2 litres of urine. Nearly everything is reabsorbed.',
    'At rest, an adult heart pumps around 5 litres of blood a minute. That is roughly the whole blood volume, every minute.',
    'A red blood cell lives for about 120 days before it is recycled, mostly in the spleen and liver.',
    'Nairobi sits at about 1,795 metres. Each breath there carries noticeably less oxygen than the same breath at the coast in Mombasa.',
    'About two thirds of the water in your body is inside your cells, not in your blood.',
    'The stomach is acidic enough (pH roughly 1.5 to 3.5) to kill many swallowed microbes. Its lining protects itself with a thick layer of mucus.',
    'Every normal heartbeat begins in a small cluster of cells in the right atrium called the sinoatrial (SA) node.',
    'The fastest nerve fibres carry signals at over 100 metres per second, faster than a Formula 1 car.',
    'Folds, villi and microvilli give the small intestine an absorptive surface many times larger than a flat tube of the same length.'
  ];

  BW.jokes = [
    'Your kidneys are the body’s water-management team. Excellent accountants, but they prefer urine to spreadsheets.',
    'Your heart does not get weekends off. It has the most intense full-time job in the body.',
    'Negative feedback is the body’s thermostat. Unlike some humans, it actually responds to feedback.',
    'Insulin is like a key for certain cells. Glucose without it is a delivery rider standing outside a locked gate.',
    'Haemoglobin is a bus with four seats for oxygen. It picks up passengers in the lungs and drops them where the party is: working muscle.',
    'The sodium–potassium pump is the club bouncer of the cell: three sodium out, two potassium in, and it charges ATP at the door.',
    'Mitochondria are the power station of the cell. Yes, everyone says it. It keeps being true.',
    'Your diaphragm is the hardest-working muscle you forget about until you get hiccups.',
    'Osmosis: water moves towards where things are more crowded. Like matatu passengers heading for the busiest stage.'
  ];

  BW.medicalWords = ['symptom', 'diagnos', 'dose', 'dosage', 'medicine', 'medication', 'drug', 'treat', 'prescri', 'my baby', 'pregnant and', 'bleeding', 'chest pain', 'emergency', 'should i take', 'is it normal that i', 'do i have', 'fever of', 'my child', 'overdose', 'suicid'];
})(window.BW = window.BW || {});
