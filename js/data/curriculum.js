/* BodyWise — curriculum map. Lessons marked full have their content in
   lessons-*.js. Everything else is an honest outline until it is written. */
(function (BW) {
  'use strict';
  function L(id, title, blurb) { return { id: id, title: title, blurb: blurb }; }

  BW.modules = [
    { id: 'm1', n: 1, title: 'Foundations of Human Physiology', systems: ['ns', 'en', 'cv'],
      summary: 'The rules every body system plays by: keeping the inside steady, feedback, and how substances cross membranes.',
      lessons: [
        L('m1-l1', 'What physiology is (and how it differs from anatomy)', 'Anatomy is the map; physiology is the traffic.'),
        L('m1-l2', 'Levels of organisation', 'From molecules and cells to tissues, organs, systems and you.'),
        L('m1-l3', 'The internal environment and homeostasis', 'Why your cells need stable surroundings, and who keeps them stable.'),
        L('m1-l4', 'Negative and positive feedback', 'The thermostat, the avalanche, and which one your body prefers.'),
        L('m1-l5', 'Membranes, diffusion, osmosis and active transport', 'How things get in and out of cells.'),
        L('m1-l6', 'Basic cell communication', 'Signals, receptors and responses.')
      ] },
    { id: 'm2', n: 2, title: 'Cells, Fluids and Electrolytes', systems: ['re', 'ns', 'cv'],
      summary: 'Where body water lives, the ions dissolved in it, and how those ions turn cells into tiny batteries.',
      lessons: [
        L('m2-l1', 'Cell structure and function', 'The organelles and what each one contributes.'),
        L('m2-l2', 'Intracellular and extracellular fluid', 'Two thirds inside, one third outside, and why that matters.'),
        L('m2-l3', 'Water balance and osmosis', 'How water follows solutes between compartments.'),
        L('m2-l4', 'Sodium, potassium, calcium and chloride', 'The four ions that do most of the work.'),
        L('m2-l5', 'Membrane potentials and electrical signalling', 'How a cell holds a voltage and fires an action potential.'),
        L('m2-l6', 'How fluid and electrolyte changes affect cells', 'Swelling, shrinking and misfiring.')
      ] },
    { id: 'm3', n: 3, title: 'Blood and the Cardiovascular System', systems: ['cv', 'ns', 're', 'rs'],
      summary: 'The pump, the pipes and the fluid that connects every other system.',
      lessons: [
        L('m3-l1', 'Components and functions of blood', 'Plasma and the cells suspended in it.'),
        L('m3-l2', 'Red cells, white cells, platelets and plasma', 'Who does what in the bloodstream.'),
        L('m3-l3', 'Haemoglobin and oxygen transport', 'Four seats for oxygen, and when it lets them go.'),
        L('m3-l4', 'Heart chambers, valves and blood flow', 'Two pumps side by side, with one-way doors.'),
        L('m3-l5', 'Cardiac cycle and electrical conduction', 'From the SA node to a full heartbeat.'),
        L('m3-l6', 'Heart rate, stroke volume and cardiac output', 'The equation that runs the circulation.'),
        L('m3-l7', 'Blood pressure and its regulation', 'Seconds, minutes and days: three layers of control.'),
        L('m3-l8', 'Blood vessels and capillary exchange', 'Where the delivery actually happens.'),
        L('m3-l9', 'Responses to exercise, rest and posture', 'The circulation adjusting in real time.')
      ] },
    { id: 'm4', n: 4, title: 'The Respiratory System', systems: ['rs', 'cv', 'ns', 're'],
      summary: 'Getting oxygen in, carbon dioxide out, and using breathing to tune blood pH.',
      lessons: [
        L('m4-l1', 'Airflow and respiratory anatomy', 'The route from nose to alveolus.'),
        L('m4-l2', 'Ventilation and gas exchange', 'Moving air, then letting gases diffuse.'),
        L('m4-l3', 'Alveoli and pulmonary circulation', 'A thin wall with an enormous surface.'),
        L('m4-l4', 'Oxygen and carbon dioxide transport', 'Haemoglobin, bicarbonate and a little dissolved gas.'),
        L('m4-l5', 'Respiratory control by the nervous system', 'The brainstem rhythm generator.'),
        L('m4-l6', 'Ventilation, carbon dioxide and blood pH', 'Breathing as an acid–base tool.'),
        L('m4-l7', 'Responses to exercise and altitude', 'Including what living in Nairobi does to you.')
      ] },
    { id: 'm5', n: 5, title: 'The Nervous System', systems: ['ns', 'ms', 'en', 'cv'],
      summary: 'Fast electrical communication: sensing, deciding and acting.',
      lessons: [
        L('m5-l1', 'Neurons and action potentials', 'The cells that carry signals.'),
        L('m5-l2', 'Synapses and neurotransmitters', 'How one neuron talks to the next.'),
        L('m5-l3', 'Central and peripheral nervous systems', 'Head office and the field staff.'),
        L('m5-l4', 'Sensory and motor pathways', 'Information in, commands out.'),
        L('m5-l5', 'Autonomic control: sympathetic and parasympathetic', 'The accelerator and the brake for your organs.'),
        L('m5-l6', 'Reflexes, pain and sleep', 'Fast automatic responses and the brain at rest.'),
        L('m5-l7', 'Nervous control of heart, breathing, digestion and temperature', 'One brain, many dials.')
      ] },
    { id: 'm6', n: 6, title: 'The Endocrine System', systems: ['en', 'ns', 'di', 're'],
      summary: 'Slower chemical messages that run metabolism, growth, fluid balance and stress.',
      lessons: [
        L('m6-l1', 'Hormones and their receptors', 'Why only some cells listen.'),
        L('m6-l2', 'Hypothalamus and pituitary gland', 'The control tower of the endocrine system.'),
        L('m6-l3', 'Thyroid and parathyroid hormones', 'Metabolic rate and calcium.'),
        L('m6-l4', 'Insulin and glucagon', 'Keeping blood glucose in a safe range.'),
        L('m6-l5', 'Adrenal hormones', 'Cortisol, aldosterone and adrenaline.'),
        L('m6-l6', 'Calcium regulation', 'Bone, gut and kidney working together.'),
        L('m6-l7', 'Stress responses', 'Fast and slow arms of the stress system.'),
        L('m6-l8', 'Hormonal feedback loops', 'Axes, loops and interactions.')
      ] },
    { id: 'm7', n: 7, title: 'The Digestive System', systems: ['di', 'en', 'cv', 'ns'],
      summary: 'Turning food into molecules your cells can use.',
      lessons: [
        L('m7-l1', 'Digestion versus absorption', 'Breaking down versus bringing in.'),
        L('m7-l2', 'Moving food through the gut', 'Peristalsis, sphincters and timing.'),
        L('m7-l3', 'Digestive enzymes and secretions', 'Who cuts what, and where.'),
        L('m7-l4', 'Absorbing carbohydrates, proteins, fats, vitamins and minerals', 'Different nutrients, different doors.'),
        L('m7-l5', 'Liver, gallbladder and pancreas', 'The accessory organs that do much of the chemistry.'),
        L('m7-l6', 'Gut motility and its control', 'Nerves and hormones in the gut.'),
        L('m7-l7', 'Nutrition as energy and building material', 'What the body does with what you absorb.')
      ] },
    { id: 'm8', n: 8, title: 'The Renal System', systems: ['re', 'cv', 'en', 'rs'],
      summary: 'Filtering blood, balancing water and salts, controlling pressure and pH.',
      lessons: [
        L('m8-l1', 'Kidney structure and the nephron', 'A million tiny filters per kidney.'),
        L('m8-l2', 'Filtration, reabsorption and secretion', 'The three processes that make urine.'),
        L('m8-l3', 'Urine formation', 'Putting the three processes together.'),
        L('m8-l4', 'Water and electrolyte regulation', 'ADH, aldosterone and friends.'),
        L('m8-l5', 'Acid–base balance', 'Bicarbonate, hydrogen ions and the lungs.'),
        L('m8-l6', 'The renin–angiotensin–aldosterone system', 'The kidney’s long-term pressure control.'),
        L('m8-l7', 'Kidney control of blood pressure', 'Volume is pressure.'),
        L('m8-l8', 'Erythropoietin and red cell production', 'The kidney as an oxygen sensor.')
      ] },
    { id: 'm9', n: 9, title: 'The Musculoskeletal System', systems: ['ms', 'ns', 'cv'],
      summary: 'Bones, joints and the molecular machinery of contraction.',
      lessons: [
        L('m9-l1', 'Skeletal muscle structure', 'Fibres, myofibrils and sarcomeres.'),
        L('m9-l2', 'Muscle contraction and ATP', 'Sliding filaments powered by ATP and switched on by calcium.'),
        L('m9-l3', 'The neuromuscular junction', 'Where a nerve tells a muscle to go.'),
        L('m9-l4', 'Bone and joint functions', 'Levers, protection and mineral storage.'),
        L('m9-l5', 'Movement and posture', 'Agonists, antagonists and balance.'),
        L('m9-l6', 'Exercise, fatigue and recovery', 'Energy systems and their limits.'),
        L('m9-l7', 'Calcium in muscle contraction', 'The on switch, in detail.')
      ] },
    { id: 'm10', n: 10, title: 'The Immune and Lymphatic Systems', systems: ['im', 'cv', 'rs'],
      summary: 'Defence, inflammation, memory and drainage.',
      lessons: [
        L('m10-l1', 'Innate and adaptive immunity', 'The rapid responders and the specialists.'),
        L('m10-l2', 'Inflammation', 'Redness, heat, swelling and pain, explained.'),
        L('m10-l3', 'White blood cells and antibodies', 'Meet the cast.'),
        L('m10-l4', 'Lymphatic drainage', 'The body’s second circulation.'),
        L('m10-l5', 'Immune memory and vaccination', 'Training without the illness.'),
        L('m10-l6', 'The immune system and other organs', 'Blood, gut, skin and beyond.')
      ] },
    { id: 'm11', n: 11, title: 'Temperature, Energy and Metabolism', systems: ['ns', 'cv', 'ms', 'en'],
      summary: 'Making ATP, managing heat and balancing energy in and out.',
      lessons: [
        L('m11-l1', 'ATP and cellular energy', 'The energy currency.'),
        L('m11-l2', 'Energy production and oxygen use', 'Why aerobic respiration is so efficient.'),
        L('m11-l3', 'Body temperature regulation', 'The hypothalamic thermostat and its tools.'),
        L('m11-l4', 'Fever versus normal regulation', 'A raised set point, not a broken thermostat.'),
        L('m11-l5', 'Heat loss and conservation', 'Radiation, conduction, convection, evaporation.'),
        L('m11-l6', 'Exercise, sweating and hydration', 'Cooling costs water.'),
        L('m11-l7', 'Systems that contribute to energy balance', 'Gut, lungs, heart and hormones together.')
      ] },
    { id: 'm12', n: 12, title: 'Reproductive Physiology', systems: ['rp', 'en', 'cv', 're'],
      summary: 'Hormones, cycles, pregnancy, birth and breastfeeding, explained respectfully.',
      lessons: [
        L('m12-l1', 'Basic male and female reproductive physiology', 'Structures and functions.'),
        L('m12-l2', 'Hormonal regulation', 'The hypothalamic–pituitary–gonadal axis.'),
        L('m12-l3', 'The menstrual cycle and ovulation', 'Ovarian and uterine cycles, side by side.'),
        L('m12-l4', 'Fertilisation and pregnancy physiology', 'How the mother’s body adapts to support a pregnancy.'),
        L('m12-l5', 'Lactation', 'Prolactin, oxytocin and milk.'),
        L('m12-l6', 'Postpartum physiological changes', 'How the body returns towards its non-pregnant state.')
      ] },
    { id: 'm13', n: 13, title: 'Integrated Human Physiology', systems: ['cv', 'rs', 'ms', 're', 'en', 'ns'],
      summary: 'Whole-body stories where every system plays a part.',
      lessons: [
        L('m13-l1', 'How the body responds to exercise', 'Everything turns up at once.'),
        L('m13-l2', 'What happens during dehydration', 'Volume, concentration and thirst.'),
        L('m13-l3', 'How the body responds to a meal', 'Digest, absorb, store.'),
        L('m13-l4', 'How blood pressure is regulated', 'Nerves, hormones and kidneys together.'),
        L('m13-l5', 'How the body responds to stress', 'Fast and slow responses.'),
        L('m13-l6', 'How temperature is controlled', 'Sensors, controller and effectors.'),
        L('m13-l7', 'How oxygen gets from the air to working muscle', 'The oxygen cascade, step by step.'),
        L('m13-l8', 'How systems maintain homeostasis together', 'The big picture.')
      ] }
  ];

  BW.fullLessons = BW.fullLessons || {};
  BW.lessonIndex = {};
  BW.allLessons = [];
  BW.indexCurriculum = function () {
    BW.lessonIndex = {}; BW.allLessons = [];
    BW.modules.forEach(function (m) {
      m.lessons.forEach(function (l, i) {
        var full = BW.fullLessons[l.id];
        var rec = full ? Object.assign({}, l, full, { status: 'full' }) : Object.assign({}, l, { status: 'outline' });
        rec.module = m.id; rec.moduleN = m.n; rec.index = i + 1;
        BW.lessonIndex[l.id] = rec; BW.allLessons.push(rec);
      });
    });
  };
})(window.BW = window.BW || {});
