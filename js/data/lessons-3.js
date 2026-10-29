/* BodyWise — full lessons, part 3 (Modules 9–13). */
(function (BW) {
  'use strict';
  var F = BW.fullLessons = BW.fullLessons || {};

  F['m9-l2'] = {
    keywords: ['muscle', 'contraction', 'atp', 'actin', 'myosin', 'sarcomere', 'sliding filament', 'cross-bridge', 'calcium', 'troponin', 'tropomyosin', 'creatine phosphate', 'fatigue'],
    why: 'Every movement, every breath and much of your body heat come from skeletal muscle contraction. The mechanism connects nerves, calcium, ATP, oxygen and the cardiovascular system.',
    objectives: ['Describe the sarcomere and its filaments.', 'Explain the sliding filament mechanism.', 'Describe the role of calcium and ATP in contraction and relaxation.', 'Name three ways muscle regenerates ATP.'],
    intro: 'Muscle fibres are packed with two kinds of protein strands: thin actin and thick myosin. When a muscle contracts, myosin heads grab actin and pull it, so the strands slide past each other and the muscle shortens. Calcium is the on switch. ATP is the fuel, and surprisingly, ATP is also needed to let go.',
    detail: [
      'A skeletal muscle fibre is a long cell containing myofibrils. Each myofibril is a chain of sarcomeres, the contractile units, bounded by Z discs. Thin filaments (actin) attach to the Z discs; thick filaments (myosin) sit in the middle. During contraction, the filaments themselves do not shorten; they slide, bringing the Z discs closer.',
      'At rest, the protein tropomyosin covers the myosin-binding sites on actin, held in place by troponin.',
      'A motor neuron releases acetylcholine at the neuromuscular junction. The muscle fibre fires an action potential that travels into T-tubules and triggers the sarcoplasmic reticulum (SR) to release calcium. Calcium binds troponin, which shifts tropomyosin and exposes the binding sites.',
      'The cross-bridge cycle: an energised myosin head binds actin; it pivots in the power stroke, pulling actin towards the centre and releasing ADP and phosphate; a new ATP binds and the head detaches; ATP is hydrolysed, re-cocking the head. The cycle repeats while calcium and ATP are present.',
      'Relaxation needs ATP too: calcium is actively pumped back into the SR, tropomyosin covers the sites again, and the filaments slide back passively.',
      'Muscle stores only a few seconds of ATP. It regenerates ATP from creatine phosphate (very fast, about 10–15 seconds), from anaerobic glycolysis (fast, produces lactate) and from aerobic respiration in mitochondria (slower to start, far more ATP per glucose, needs oxygen).'
    ],
    advanced: 'Force depends on the number of motor units recruited and their firing frequency; high-frequency stimulation produces tetanus (a smooth sustained contraction). The length–tension relationship means force is greatest at intermediate sarcomere lengths where actin and myosin overlap optimally. Rigor mortis occurs after death because, without ATP, myosin heads cannot detach from actin.',
    steps: [
      'Motor neuron releases acetylcholine at the neuromuscular junction.',
      'Muscle action potential spreads along the membrane and into T-tubules.',
      'Sarcoplasmic reticulum releases calcium.',
      'Calcium binds troponin; tropomyosin moves off actin’s binding sites.',
      'Myosin heads bind, perform the power stroke, then detach when ATP binds.',
      'Calcium is pumped back (using ATP) and the muscle relaxes.'
    ],
    diagram: 'sarcomere',
    analogy: 'Imagine a team pulling a rope hand over hand during a tug of war. Each hand (myosin head) grabs, pulls, lets go and grabs again further along. The rope (actin) moves; the people stay put. Calcium is the referee’s whistle; ATP is the energy to let go and reach again.',
    altAnalogy: 'Think of rowers in a long canoe. Each oar (myosin head) dips, pulls and lifts. Many oars out of sync keep the canoe moving smoothly. Without energy (ATP), the oars stay stuck in the water.',
    joke: 'Mitochondria are the power station of the cell. Yes, everyone says it. Muscle is why it keeps being true.',
    connections: [
      { sys: 'ns', text: 'Motor neurons trigger every skeletal muscle contraction.', lesson: 'm2-l5' },
      { sys: 'cv', text: 'Working muscles depend on increased blood flow and oxygen delivery.', lesson: 'm13-l7' },
      { sys: 'en', text: 'Insulin drives glucose into muscle; parathyroid hormone controls blood calcium.', lesson: 'm6-l4' },
      { sys: 'rs', text: 'Muscle carbon dioxide output drives breathing during exercise.', lesson: 'm4-l2' }
    ],
    scenario: { title: 'Worked example: carrying a heavy jerrycan', text: 'You lift a 20-litre jerrycan. Your brain recruits more motor units in the forearm and shoulder; each fires faster, producing a sustained (tetanic) contraction. For the first seconds, stored ATP and creatine phosphate supply energy. As you keep walking, glycolysis and then aerobic respiration take over, and blood flow to the working muscles rises. If the grip becomes tiring, fatigue reflects changes in ion balance, metabolites and energy supply inside the fibres, not simply “lactic acid poisoning”.' },
    misconceptions: [
      { myth: 'Actin and myosin filaments shorten during contraction.', fact: 'They slide past each other; the sarcomere shortens, the filaments do not.' },
      { myth: 'ATP is only needed for the power stroke.', fact: 'ATP is needed to detach myosin from actin and to pump calcium back for relaxation.' },
      { myth: 'Lactic acid causes the soreness you feel a day or two after exercise.', fact: 'Lactate is cleared within an hour or so; delayed soreness is linked to muscle micro-damage and inflammation.' }
    ],
    check: [
      { id: 'm9l2-q1', type: 'label', prompt: 'Label the sarcomere.', diagram: 'sarcomere', options: ['Actin (thin filament)', 'Myosin (thick filament)', 'Z disc', 'M line'], answers: { 1: 'Actin (thin filament)', 2: 'Myosin (thick filament)', 3: 'Z disc', 4: 'M line' }, explain: 'Thin actin filaments anchor at the Z discs; thick myosin filaments sit in the middle, centred on the M line.' },
      { id: 'm9l2-q2', type: 'mcq', prompt: 'What does calcium bind to in order to start contraction?', options: ['Myosin', 'Actin', 'Troponin', 'Tropomyosin'], answer: 2, explain: 'Calcium binds troponin, which pulls tropomyosin away from the binding sites on actin.' },
      { id: 'm9l2-q3', type: 'tf', prompt: 'Muscle needs ATP to relax.', answer: true, explain: 'True. ATP releases myosin from actin, and the SR calcium pump uses ATP to remove calcium.' },
      { id: 'm9l2-q4', type: 'mcq', prompt: 'Which system regenerates ATP fastest at the start of a sprint?', options: ['Aerobic respiration', 'Creatine phosphate', 'Fat oxidation', 'Protein breakdown'], answer: 1, explain: 'Creatine phosphate transfers its phosphate to ADP almost instantly, supplying the first several seconds.' },
      { id: 'm9l2-q5', type: 'short', prompt: 'Explain why rigor mortis happens.', keywords: [['atp']], model: 'After death, ATP runs out, so myosin heads cannot detach from actin and muscles stay rigid.', explain: 'Detachment of myosin from actin requires ATP binding. Without it, cross-bridges lock.' }
    ],
    summary: 'A nerve signal triggers calcium release; calcium binds troponin, uncovering actin; myosin heads pull actin in repeated cross-bridge cycles powered by ATP. ATP is also needed for detachment and relaxation. Muscle regenerates ATP from creatine phosphate, glycolysis and aerobic respiration.',
    terms: [
      { t: 'Sarcomere', d: 'Contractile unit of a myofibril, from Z disc to Z disc.' },
      { t: 'Actin', d: 'Thin filament protein pulled by myosin.' },
      { t: 'Myosin', d: 'Thick filament protein whose heads form cross-bridges.' },
      { t: 'Troponin', d: 'Calcium-binding protein that moves tropomyosin.' },
      { t: 'Sarcoplasmic reticulum', d: 'Calcium store inside the muscle fibre.' }
    ],
    flashcards: [
      { q: 'What is the on switch for contraction?', a: 'Calcium binding troponin.' },
      { q: 'What does ATP binding do to myosin?', a: 'Detaches it from actin.' },
      { q: 'Three ATP sources in muscle?', a: 'Creatine phosphate, glycolysis, aerobic respiration.' }
    ],
    refs: ['os-muscle'],
    next: 'm10-l1'
  };

  F['m10-l1'] = {
    keywords: ['immune', 'immunity', 'innate', 'adaptive', 'antibody', 'antibodies', 'lymphocyte', 't cell', 'b cell', 'macrophage', 'neutrophil', 'vaccine', 'vaccination', 'memory', 'infection', 'inflammation', 'white blood cell'],
    why: 'The immune system protects every other system. Understanding its two arms explains inflammation, fever, vaccines and why a second infection is often milder.',
    objectives: ['Describe the barrier, innate and adaptive defences.', 'Name the main cells of each arm.', 'Explain how innate and adaptive responses are linked.', 'Explain immune memory and vaccination.'],
    intro: 'Your immune defence has layers. Barriers like skin and mucus keep most microbes out. If something gets through, the innate system responds within minutes to hours, attacking anything that looks foreign in general ways. Over days, the adaptive system builds a precise response to that specific invader, and it remembers it for next time.',
    detail: [
      'Barrier defences: intact skin, mucus and cilia in the airways, stomach acid, tears and saliva containing antimicrobial enzymes, and the normal microbes that compete with invaders.',
      'Innate response: fast and general. Neutrophils and macrophages engulf microbes (phagocytosis); natural killer cells destroy infected cells; complement proteins tag and puncture microbes. Inflammation brings blood, fluid and cells to the site. Fever may follow.',
      'Adaptive response: slower on first exposure (days) but specific. Dendritic cells carry pieces of the microbe (antigens) to lymph nodes and present them to T cells. Helper T cells coordinate; cytotoxic T cells kill infected cells; B cells, with T cell help, become plasma cells that secrete antibodies.',
      'Antibodies bind specific antigens, neutralising toxins and viruses and marking microbes for destruction by phagocytes and complement.',
      'Memory: after the response, long-lived memory B and T cells remain. On re-exposure, the secondary response is faster, larger and more effective. Vaccination safely triggers this memory without causing the disease.'
    ],
    advanced: 'The two arms are tightly coupled: innate cells provide the signals (co-stimulation and cytokines) that tell T cells whether a threat is real, and antibodies from the adaptive arm enhance innate killing (opsonisation, complement activation). Self-tolerance, established in the thymus and bone marrow, normally stops the adaptive system attacking the body’s own cells.',
    steps: [
      'Barriers block most microbes.',
      'A microbe enters through a cut; resident macrophages detect it.',
      'Inflammation recruits neutrophils and more macrophages (hours).',
      'Dendritic cells carry antigen to a lymph node.',
      'T and B cells specific to that antigen multiply (days); antibodies are produced.',
      'The infection clears; memory cells remain for a faster future response.'
    ],
    diagram: 'immune',
    analogy: 'Barriers are the estate wall and gate. Innate immunity is the night guards who chase anyone suspicious. Adaptive immunity is a detective unit that studies a specific intruder’s photo, trains a squad to recognise exactly that person, and keeps the photo on file.',
    altAnalogy: 'Innate immunity is a smoke alarm: it reacts to any smoke. Adaptive immunity is a security system that learns a specific face and alerts instantly next time that face appears.',
    joke: 'Your adaptive immune system never forgets a face. It is the friend who remembers exactly what you said at a party ten years ago.',
    connections: [
      { sys: 'cv', text: 'Blood carries white cells; inflammation makes local vessels leaky.', lesson: 'm3-l7' },
      { sys: 'ms', text: 'Red bone marrow produces all white blood cells.', lesson: 'm9-l2' },
      { sys: 'rp', text: 'Antibodies cross the placenta and are present in breast milk.', lesson: 'm12-l4' },
      { sys: 'ns', text: 'Immune signals raise the hypothalamic set point during fever.', lesson: 'm11-l3' }
    ],
    scenario: { title: 'Worked example: why the second measles exposure is different', text: 'On a first exposure to a virus, the adaptive system needs days to select and expand the right T and B cells, so the illness can develop before the response peaks. After recovery, or after vaccination, memory cells remain. On a later exposure they recognise the antigen within hours and produce high-affinity antibodies quickly, often clearing the virus before illness develops. This is the physiology that makes vaccination programmes protect communities.' },
    misconceptions: [
      { myth: 'Fever and inflammation are the illness itself.', fact: 'They are largely the body’s own defensive responses, though they can cause harm if excessive.' },
      { myth: 'Antibodies kill microbes on their own.', fact: 'Antibodies mostly neutralise and tag; phagocytes and complement do much of the killing.' },
      { myth: 'Vaccines give you the disease.', fact: 'Vaccines present antigens in a safe form so memory develops without the illness. Mild short-term reactions reflect the immune response.' }
    ],
    check: [
      { id: 'm10l1-q1', type: 'label', prompt: 'Label the layers of defence in time order.', diagram: 'immune', options: ['Barriers', 'Innate response', 'Adaptive response', 'Memory'], answers: { 1: 'Barriers', 2: 'Innate response', 3: 'Adaptive response', 4: 'Memory' }, explain: 'Barriers act constantly, innate within minutes to hours, adaptive over days, and memory lasts for years.' },
      { id: 'm10l1-q2', type: 'mcq', prompt: 'Which cells secrete antibodies?', options: ['Neutrophils', 'Plasma cells (from B cells)', 'Cytotoxic T cells', 'Macrophages'], answer: 1, explain: 'Activated B cells become plasma cells, which secrete large amounts of antibody.' },
      { id: 'm10l1-q3', type: 'tf', prompt: 'The innate response is specific to one particular microbe.', answer: false, explain: 'False. Innate responses recognise general features shared by many microbes. Specificity is a feature of the adaptive response.' },
      { id: 'm10l1-q4', type: 'mcq', prompt: 'What links the innate response to the adaptive response?', options: ['Platelets', 'Dendritic cells presenting antigen', 'Red blood cells', 'Mucus'], answer: 1, explain: 'Dendritic cells capture antigen at the site and present it to T cells in lymph nodes, starting the adaptive response.' },
      { id: 'm10l1-q5', type: 'short', prompt: 'Why is a secondary immune response faster?', keywords: [['memory']], model: 'Memory B and T cells from the first exposure are already present and respond quickly and strongly.', explain: 'The first response leaves expanded populations of memory cells that do not need to be selected from scratch.' }
    ],
    summary: 'Barriers keep most microbes out. The innate response acts within hours in general ways, including inflammation. The adaptive response, started when dendritic cells present antigen, builds specific T cells and antibodies over days and leaves memory, which vaccination uses safely.',
    terms: [
      { t: 'Innate immunity', d: 'Fast, non-specific defences present from birth.' },
      { t: 'Adaptive immunity', d: 'Specific defence by T and B cells, with memory.' },
      { t: 'Antigen', d: 'A molecule recognised by the adaptive immune system.' },
      { t: 'Antibody', d: 'Protein from plasma cells that binds a specific antigen.' },
      { t: 'Phagocytosis', d: 'Engulfing and digesting particles or microbes.' }
    ],
    flashcards: [
      { q: 'Two main phagocytes?', a: 'Neutrophils and macrophages.' },
      { q: 'Which cell type coordinates the adaptive response?', a: 'Helper T cells.' },
      { q: 'What does vaccination create?', a: 'Immune memory without the disease.' }
    ],
    refs: ['os-innate', 'os-adaptive'],
    next: 'm11-l3'
  };

  F['m11-l3'] = {
    keywords: ['temperature', 'thermoregulation', 'hypothalamus', 'sweat', 'sweating', 'shivering', 'fever', 'heat loss', 'cold', 'hot', 'vasodilation', 'vasoconstriction', 'evaporation', 'newborn', 'kangaroo'],
    why: 'Enzymes and membranes work best within a narrow temperature range. Temperature control shows nerves, skin, blood vessels, muscles, hormones and behaviour working together.',
    objectives: ['Describe the hypothalamus as the body’s thermostat.', 'Explain the four routes of heat loss.', 'Describe responses to heat and to cold.', 'Explain why fever is a regulated rise in set point.'],
    intro: 'Your core temperature is held around 37 °C, give or take a little through the day. The hypothalamus acts as the thermostat. When you are too warm, it widens skin blood vessels and turns on sweating. When you are too cold, it narrows skin vessels and makes you shiver. Your behaviour helps too: you seek shade or a jumper.',
    detail: [
      'Heat is produced by metabolism, especially in the liver, brain, heart and active skeletal muscle. Heat is lost from the skin by radiation, conduction, convection and evaporation. When the air is hotter than the skin, evaporation of sweat is the only way to lose heat.',
      'Thermoreceptors in the skin, spinal cord and hypothalamus send temperature information to the preoptic area of the hypothalamus, which compares it with the set point.',
      'Heat-loss responses: skin arterioles dilate, sending warm blood to the surface; sweat glands secrete; behaviour changes (less activity, lighter clothing).',
      'Heat-conserving and heat-producing responses: skin arterioles constrict; shivering generates heat by rapid involuntary muscle contraction; non-shivering thermogenesis (important in newborns, using brown fat) produces heat; over longer periods thyroid hormone raises metabolic rate.',
      'Fever is different from overheating. Immune signals cause the hypothalamus to make prostaglandins that raise the set point. The body then feels cold at a normal temperature and uses shivering and vasoconstriction to heat up to the new set point. When the set point falls back, sweating cools the body down.'
    ],
    advanced: 'Newborns have a large surface area relative to their mass and little insulating fat, so they lose heat quickly. They rely heavily on non-shivering thermogenesis in brown adipose tissue. This physiology underlies why keeping newborns warm, including through skin-to-skin contact, is emphasised in newborn care; specific care guidance should come from health workers.',
    steps: [
      'Core temperature rises (exercise, hot weather).',
      'Thermoreceptors report to the hypothalamus.',
      'Hypothalamus triggers skin vasodilation and sweating.',
      'Sweat evaporates and heat is lost; temperature falls towards set point.',
      'In cold: vasoconstriction, shivering and behaviour conserve and produce heat.'
    ],
    diagram: 'thermo',
    analogy: 'The hypothalamus is a thermostat connected to both a fan (sweating, vasodilation) and a heater (shivering, vasoconstriction). Fever is someone turning the thermostat dial up: the system is working perfectly, aiming for a new target.',
    altAnalogy: 'Think of a charcoal jiko in a kitchen. Open the window and fan the air when it gets too hot; close the window and add a lid when it is cold. Fever is deciding the kitchen should be warmer today.',
    joke: 'Fever is the hypothalamus deciding it would like to work in a warmer office. Shivering is your muscles reluctantly agreeing.',
    connections: [
      { sys: 'cv', text: 'Skin blood flow is the main dial for heat loss.', lesson: 'm3-l7' },
      { sys: 'ms', text: 'Shivering is skeletal muscle generating heat.', lesson: 'm9-l2' },
      { sys: 'im', text: 'Immune signals raise the set point during fever.', lesson: 'm10-l1' },
      { sys: 're', text: 'Sweating costs water, which the kidneys and ADH must replace.', lesson: 'm8-l2' }
    ],
    scenario: { title: 'Worked example: an afternoon football match', text: 'Thirty minutes into a match, muscle heat production is many times higher than at rest. Core temperature rises; the hypothalamus increases sweating and skin blood flow. Cardiac output must now supply both working muscle and skin, so heart rate climbs. Sweating may lose more than a litre an hour in hot conditions, so plasma volume falls, ADH rises and thirst increases. Drinking water at half-time supports all three systems at once.' },
    misconceptions: [
      { myth: 'Fever means the thermostat is broken.', fact: 'Fever is a regulated rise in set point; the thermostat works, aiming for a higher target.' },
      { myth: '37 °C is the exact normal temperature for everyone.', fact: 'Normal temperature varies between people, by time of day and by measurement site.' },
      { myth: 'Sweating cools you by itself.', fact: 'Cooling comes from sweat evaporating; dripping sweat in humid air cools you very little.' }
    ],
    check: [
      { id: 'm11l3-q1', type: 'mcq', prompt: 'Which part of the brain acts as the body’s thermostat?', options: ['Cerebellum', 'Hypothalamus', 'Medulla', 'Cerebral cortex'], answer: 1, explain: 'The preoptic area of the hypothalamus integrates temperature information and controls responses.' },
      { id: 'm11l3-q2', type: 'tf', prompt: 'When air temperature is above skin temperature, evaporation is the only way to lose heat.', answer: true, explain: 'True. The body gains heat by radiation, conduction and convection in that situation, so evaporation must do all the work.' },
      { id: 'm11l3-q3', type: 'scenario', scenario: 'At the start of a fever, a person shivers under a blanket even though their temperature is already 37.5 °C.', prompt: 'Why?', options: ['The thermostat has failed', 'The set point has been raised, so 37.5 °C feels too cold', 'Shivering lowers temperature', 'The blanket is too thin'], answer: 1, explain: 'Immune signals raised the set point. The body is below its new target, so it activates heat-gain responses.' },
      { id: 'm11l3-q4', type: 'mcq', prompt: 'What happens to skin arterioles in a cold environment?', options: ['They dilate', 'They constrict', 'They do not change', 'They fill with sweat'], answer: 1, explain: 'Vasoconstriction keeps warm blood away from the surface, reducing heat loss.' },
      { id: 'm11l3-q5', type: 'short', prompt: 'Why do newborns lose heat faster than adults?', keywords: [['surface area', 'surface', 'small', 'fat', 'insulat']], model: 'They have a large surface area relative to body mass and little insulating fat.', explain: 'Heat loss is proportional to surface area, and newborns have much more surface per kilogram than adults.' }
    ],
    summary: 'The hypothalamus holds core temperature near its set point. Heat is lost by radiation, conduction, convection and evaporation. Heat triggers vasodilation and sweating; cold triggers vasoconstriction and shivering. Fever is a deliberate rise in set point.',
    terms: [
      { t: 'Set point', d: 'Target temperature the hypothalamus aims for.' },
      { t: 'Evaporation', d: 'Heat loss as sweat turns to vapour.' },
      { t: 'Vasoconstriction', d: 'Narrowing of blood vessels.' },
      { t: 'Non-shivering thermogenesis', d: 'Heat production without muscle contraction, e.g. by brown fat.' },
      { t: 'Pyrogen', d: 'A substance that causes fever.' }
    ],
    flashcards: [
      { q: 'Four routes of heat loss?', a: 'Radiation, conduction, convection, evaporation.' },
      { q: 'What raises the set point in fever?', a: 'Immune signals acting via prostaglandins in the hypothalamus.' },
      { q: 'Main heat-producing response to cold?', a: 'Shivering.' }
    ],
    refs: ['os-heat', 'mp-temperature', 'statpearls-temp'],
    next: 'm12-l4'
  };

  F['m12-l4'] = {
    keywords: ['pregnancy', 'pregnant', 'fertilisation', 'fertilization', 'placenta', 'hcg', 'progesterone', 'oestrogen', 'estrogen', 'maternal', 'implantation', 'fetus', 'blood volume', 'trimester'],
    why: 'Pregnancy is one of the most remarkable examples of integrated physiology: almost every maternal system adapts to support a growing baby. Knowing what is normal helps you understand why antenatal checks look for specific changes.',
    objectives: ['Outline fertilisation and implantation.', 'Explain the roles of hCG, progesterone and oestrogen.', 'Describe normal cardiovascular, respiratory, renal and metabolic adaptations.', 'Distinguish normal adaptations from conditions that need medical attention.'],
    intro: 'Pregnancy begins when a sperm fertilises an egg, usually in the uterine tube. The early embryo travels to the uterus and implants about a week later. From then on, hormones from the embryo and the placenta reshape the mother’s body: more blood, a harder-working heart, deeper breathing, busier kidneys and shifted metabolism, all to supply the baby.',
    detail: [
      'After ovulation, the follicle becomes the corpus luteum, which makes progesterone to prepare the uterine lining. If an embryo implants, it releases human chorionic gonadotropin (hCG), which keeps the corpus luteum working. hCG is the hormone detected by pregnancy tests.',
      'By the end of the first trimester the placenta produces enough progesterone and oestrogen to take over. Progesterone keeps the uterine lining stable and the uterine muscle relatively quiet; oestrogen promotes growth of the uterus and breast tissue.',
      'Cardiovascular: blood volume rises by roughly 30 to 50 percent, with plasma rising more than red cells, so haemoglobin concentration falls slightly (dilutional). Cardiac output rises substantially and resting heart rate increases. Blood pressure often dips in mid-pregnancy because vessels relax.',
      'Respiratory: progesterone increases sensitivity to carbon dioxide, so ventilation rises, mainly through deeper breaths. Maternal carbon dioxide falls a little, helping fetal carbon dioxide cross the placenta.',
      'Renal: kidney blood flow and glomerular filtration rate rise substantially (by up to about 50 percent), so the kidneys clear more waste. Gastrointestinal: progesterone slows gut motility, which can contribute to heartburn and constipation.',
      'Metabolic: later in pregnancy, placental hormones make the mother’s tissues less sensitive to insulin, leaving more glucose available for the fetus. Clotting factors increase, which helps limit blood loss at birth but also raises clot risk.'
    ],
    advanced: 'Late in pregnancy, lying flat on the back can let the uterus compress the inferior vena cava, reducing venous return and cardiac output; this is the physiological reason health workers often advise side-lying. Pre-eclampsia, gestational diabetes and anaemia are conditions in which these adaptations go wrong. They are monitored in antenatal care; this lesson explains normal physiology only and is not medical advice.',
    steps: [
      'Fertilisation, usually in the uterine tube.',
      'The embryo implants in the uterine lining about a week later.',
      'hCG maintains the corpus luteum and its progesterone.',
      'The placenta takes over progesterone and oestrogen production.',
      'Maternal systems adapt: more blood volume, cardiac output, ventilation and GFR.',
      'After birth, most adaptations reverse over the following weeks.'
    ],
    diagram: 'pregnancy',
    analogy: 'Think of a household preparing for a long visit from a relative who will stay nine months and needs constant meals. The family stocks up (blood volume), runs the kitchen longer hours (cardiac output), opens windows more (ventilation), and takes out the rubbish more often (kidney filtration).',
    altAnalogy: 'The placenta is like a border post between two countries: goods (oxygen, glucose) and waste (carbon dioxide, urea) are exchanged, but the two populations of blood cells do not mix.',
    joke: 'In pregnancy the kidneys work overtime, the heart works overtime and the lungs work overtime. Physiologically, it is the busiest office in town.',
    connections: [
      { sys: 'cv', text: 'Blood volume and cardiac output rise to supply the placenta.', lesson: 'm3-l7' },
      { sys: 'rs', text: 'Progesterone increases ventilation.', lesson: 'm4-l2' },
      { sys: 're', text: 'GFR rises to clear the extra wastes.', lesson: 'm8-l2' },
      { sys: 'en', text: 'Insulin sensitivity changes to direct glucose to the fetus.', lesson: 'm6-l4' },
      { sys: 'en', text: 'Oxytocin drives labour by positive feedback.', lesson: 'm1-l4' }
    ],
    scenario: { title: 'Worked example: interpreting a routine antenatal reading', text: 'A pregnant person at 24 weeks has a slightly lower haemoglobin concentration than before pregnancy and a resting heart rate about 10 beats per minute higher. Both fit normal physiology: plasma volume has risen faster than red cell mass, and cardiac output has increased. However, haemoglobin below the recommended threshold is not just “normal dilution”, which is exactly why health workers check it and may recommend iron. The physiology tells you what to expect; the clinic tells you whether it is within healthy limits.' },
    misconceptions: [
      { myth: 'A lower haemoglobin concentration in pregnancy always means iron deficiency.', fact: 'Some fall is expected from plasma expansion, but values below recommended thresholds need assessment.' },
      { myth: 'The mother’s and baby’s blood mix in the placenta.', fact: 'The two circulations are separated by a thin barrier; substances cross by diffusion and transport.' },
      { myth: 'Breathlessness in pregnancy is always caused by the uterus pressing on the lungs.', fact: 'Early on it is mainly progesterone increasing ventilation; later, the uterus also restricts the diaphragm. Sudden or severe breathlessness should be checked by a health worker.' }
    ],
    check: [
      { id: 'm12l4-q1', type: 'mcq', prompt: 'Which hormone, detected by pregnancy tests, keeps the corpus luteum active?', options: ['hCG', 'FSH', 'Prolactin', 'Oxytocin'], answer: 0, explain: 'Human chorionic gonadotropin from the implanted embryo maintains the corpus luteum until the placenta takes over.' },
      { id: 'm12l4-q2', type: 'tf', prompt: 'Plasma volume rises more than red cell mass in pregnancy.', answer: true, explain: 'True. This produces a dilutional fall in haemoglobin concentration even though total red cell mass increases.' },
      { id: 'm12l4-q3', type: 'mcq', prompt: 'What mainly increases ventilation in pregnancy?', options: ['Lower blood volume', 'Progesterone increasing CO₂ sensitivity', 'Higher altitude', 'Reduced kidney function'], answer: 1, explain: 'Progesterone increases the respiratory centre’s sensitivity to carbon dioxide.' },
      { id: 'm12l4-q4', type: 'scenario', scenario: 'In late pregnancy, a person feels light-headed when lying flat on their back, and better when they roll onto their side.', prompt: 'What is the most likely physiological explanation?', options: ['Low blood glucose', 'The uterus compressing the inferior vena cava, reducing venous return', 'Increased ventilation', 'High kidney filtration'], answer: 1, explain: 'Compression of the vena cava reduces blood returning to the heart, lowering cardiac output; turning to the side relieves it. Persistent symptoms should be reviewed by a health worker.' },
      { id: 'm12l4-q5', type: 'short', prompt: 'Why does the kidney filtration rate rise in pregnancy?', keywords: [['waste', 'clear', 'blood flow', 'blood volume', 'cardiac output', 'fetus', 'baby']], model: 'Increased blood volume and kidney blood flow raise GFR, helping clear the extra metabolic wastes of mother and fetus.', explain: 'More renal blood flow means more filtration, and more filtration means faster clearance of wastes.' }
    ],
    summary: 'After implantation, hCG keeps progesterone flowing until the placenta takes over. The mother’s body adapts in every system: more blood volume and cardiac output, deeper breathing, higher kidney filtration, slower gut and shifted glucose use. These are normal changes that antenatal care checks stay within healthy limits.',
    terms: [
      { t: 'hCG', d: 'Human chorionic gonadotropin; maintains the corpus luteum.' },
      { t: 'Corpus luteum', d: 'Structure formed from the follicle after ovulation; makes progesterone.' },
      { t: 'Placenta', d: 'Organ of exchange and hormone production between mother and fetus.' },
      { t: 'Dilutional anaemia (physiological)', d: 'Lower haemoglobin concentration due to plasma expansion.' },
      { t: 'GFR', d: 'Glomerular filtration rate; rises in pregnancy.' }
    ],
    flashcards: [
      { q: 'Where does fertilisation usually happen?', a: 'In the uterine tube.' },
      { q: 'Blood volume change in pregnancy?', a: 'Increases by roughly 30–50%.' },
      { q: 'Why side-lying in late pregnancy?', a: 'Avoids compression of the inferior vena cava.' }
    ],
    refs: ['os-pregnancy', 'os-ovarian', 'who-maternal'],
    next: 'm13-l7'
  };

  F['m13-l7'] = {
    keywords: ['oxygen cascade', 'oxygen delivery', 'exercise', 'working muscle', 'mitochondria', 'bohr', 'haemoglobin', 'hemoglobin', 'altitude', 'cardiac output', 'oxygen', 'muscles'],
    why: 'This is the whole body in one journey. Oxygen moving from the air to working muscle needs the respiratory, cardiovascular, blood, musculoskeletal, nervous and renal systems all to do their part.',
    objectives: ['Trace oxygen from the atmosphere to the mitochondria.', 'Describe how partial pressure falls at each step.', 'Explain how each system increases oxygen delivery during exercise.', 'Explain how altitude changes the cascade.'],
    intro: 'Oxygen moves downhill all the way from the air to your mitochondria. At each step, its partial pressure drops a bit, and that drop is what pushes it forward. During exercise, every system along the route turns up its effort: you breathe more, your heart pumps more, your muscles open more capillaries, and haemoglobin lets go of oxygen more easily.',
    detail: [
      'Air at sea level has an oxygen partial pressure of about 160 mmHg. Humidifying it in the airways and mixing it with old air in the lungs lowers it to about 100–104 mmHg in the alveoli.',
      'Oxygen diffuses into pulmonary capillaries; arterial blood leaves the lungs at about 95–100 mmHg, with haemoglobin about 97–98 percent saturated. The left ventricle pumps it out to the body.',
      'In muscle capillaries, oxygen diffuses into the fibres. Venous blood leaving resting muscle has about 40 mmHg. Inside mitochondria, oxygen is used almost as fast as it arrives, so its partial pressure is only a few mmHg, keeping the gradient steep.',
      'During exercise: ventilation rises (driven by carbon dioxide, signals from moving limbs and the brain); cardiac output rises several-fold through higher heart rate and stroke volume; blood is redirected to working muscle; more muscle capillaries open; and warmer, more acidic, carbon dioxide-rich muscle makes haemoglobin release oxygen more readily (the Bohr effect). Myoglobin inside muscle fibres helps move oxygen to mitochondria.',
      'Over weeks to months of altitude exposure, low oxygen delivery to the kidneys increases erythropoietin, raising red cell mass and oxygen-carrying capacity. Regular endurance training also adds mitochondria and capillaries to muscle.'
    ],
    advanced: 'Oxygen delivery = cardiac output × arterial oxygen content. Oxygen consumption (Fick principle) = cardiac output × (arterial − venous oxygen content). During heavy exercise, both terms rise: cardiac output can increase four- to fivefold in trained people, and muscle extracts much more oxygen, so the arteriovenous difference widens.',
    steps: [
      'Atmosphere: about 160 mmHg at sea level (about 130 in Nairobi).',
      'Alveoli: about 100–104 mmHg.',
      'Arterial blood: about 95–100 mmHg, mostly bound to haemoglobin.',
      'Muscle capillary to venous blood: about 40 mmHg at rest, lower in exercise.',
      'Mitochondria: a few mmHg; oxygen accepts electrons and ATP is made.'
    ],
    diagram: 'o2cascade',
    analogy: 'The oxygen cascade is a series of water tanks on a hillside, each a little lower than the last. Water flows downhill on its own. Exercise is like widening every pipe and speeding up the pumps between tanks so more water flows each minute.',
    altAnalogy: 'Think of a supply chain from a port to a shop: a ship (lungs) unloads, lorries (red blood cells) drive the highway (arteries), handcarts (myoglobin) cover the last stretch, and the shop (mitochondria) sells everything as fast as it arrives, so the shelves never fill.',
    joke: 'Haemoglobin is a bus with four seats for oxygen. It picks up passengers in the lungs and drops them where the party is: working muscle.',
    connections: [
      { sys: 'rs', text: 'Ventilation and alveolar diffusion load oxygen into the blood.', lesson: 'm4-l2' },
      { sys: 'cv', text: 'Cardiac output and redistribution deliver oxygen to muscle.', lesson: 'm3-l7' },
      { sys: 'ms', text: 'Mitochondria use oxygen to regenerate ATP for contraction.', lesson: 'm9-l2' },
      { sys: 're', text: 'Erythropoietin from the kidneys raises red cell mass at altitude.', lesson: 'm8-l2' },
      { sys: 'ns', text: 'The brain and autonomic nerves coordinate the response.', lesson: 'm5-l5' }
    ],
    scenario: { title: 'Worked example: a Nairobi runner racing at the coast', text: 'A runner who trains in Nairobi has, over months, increased red cell mass in response to the lower oxygen partial pressure. Racing in Mombasa, near sea level, they breathe air with about 160 mmHg of oxygen instead of about 130. With the same blood but a steeper gradient, haemoglobin loads oxygen more fully and delivery to working muscle is easier. This is part of why altitude training is popular, though the effect varies between individuals.' },
    misconceptions: [
      { myth: 'Blood running through muscle releases all its oxygen.', fact: 'At rest, venous blood still carries about three quarters of its oxygen; during heavy exercise, extraction rises a lot.' },
      { myth: 'Breathing faster is the main way oxygen delivery rises in exercise.', fact: 'Arterial blood is already nearly saturated; the biggest gain comes from increased cardiac output and extraction.' },
      { myth: 'Air at altitude has less oxygen percentage.', fact: 'It is still about 21% oxygen; the total pressure is lower, so each breath carries fewer oxygen molecules.' }
    ],
    check: [
      { id: 'm13l7-q1', type: 'mcq', prompt: 'Roughly what is the oxygen partial pressure in alveoli at sea level?', options: ['160 mmHg', '100–104 mmHg', '40 mmHg', '5 mmHg'], answer: 1, explain: 'Humidification and mixing with residual air lower it from about 160 mmHg in the atmosphere to about 100–104 mmHg in alveoli.' },
      { id: 'm13l7-q2', type: 'tf', prompt: 'During exercise, increased cardiac output contributes more to oxygen delivery than increasing arterial saturation.', answer: true, explain: 'True. Arterial blood is already about 97–98% saturated at rest, so more flow and more extraction provide most of the increase.' },
      { id: 'm13l7-q3', type: 'mcq', prompt: 'Which conditions in working muscle help haemoglobin release oxygen?', options: ['Cold and alkaline', 'Warm, acidic, high CO₂', 'Low CO₂', 'High oxygen'], answer: 1, explain: 'Heat, acidity and carbon dioxide reduce haemoglobin’s affinity for oxygen (the Bohr effect), so more is unloaded.' },
      { id: 'm13l7-q4', type: 'scenario', scenario: 'A person moves from Mombasa to Nairobi and lives there for three months.', prompt: 'Which kidney-driven change helps them adapt?', options: ['Less renin', 'More erythropoietin and red cells', 'Lower GFR', 'Less ADH'], answer: 1, explain: 'Lower oxygen delivery to the kidneys increases EPO, which stimulates red cell production.' },
      { id: 'm13l7-q5', type: 'short', prompt: 'Why does oxygen keep moving into mitochondria rather than building up there?', keywords: [['used', 'consum', 'electron', 'gradient', 'low']], model: 'Mitochondria use oxygen as fast as it arrives (as the final electron acceptor), keeping their partial pressure very low and the gradient steep.', explain: 'A steep gradient depends on continuous use at the destination.' }
    ],
    summary: 'Oxygen flows down a partial pressure cascade: air → alveoli → arterial blood → muscle → mitochondria. In exercise, ventilation, cardiac output, capillary recruitment and the Bohr effect all increase delivery. At altitude, lower inspired oxygen triggers EPO-driven red cell production.',
    terms: [
      { t: 'Oxygen cascade', d: 'Stepwise fall in oxygen partial pressure from air to mitochondria.' },
      { t: 'Bohr effect', d: 'Lower pH and higher CO₂ reduce haemoglobin’s oxygen affinity.' },
      { t: 'Myoglobin', d: 'Oxygen-binding protein in muscle.' },
      { t: 'Erythropoietin', d: 'Kidney hormone that stimulates red cell production.' },
      { t: 'Oxygen extraction', d: 'Fraction of delivered oxygen that tissues remove.' }
    ],
    flashcards: [
      { q: 'Atmospheric PO₂ at sea level?', a: 'About 160 mmHg.' },
      { q: 'Venous PO₂ from resting muscle?', a: 'About 40 mmHg.' },
      { q: 'Biggest contributor to more oxygen delivery in exercise?', a: 'Increased cardiac output (plus greater extraction).' }
    ],
    refs: ['os-gas-transport', 'os-gas-exchange', 'os-blood'],
    next: 'm13-l1'
  };
})(window.BW = window.BW || {});
