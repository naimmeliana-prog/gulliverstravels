import { ComprehensionQuestion } from '../types/study';

export const COMPREHENSION_QUESTIONS: ComprehensionQuestion[] = [
  // INTRODUCTION
  {
    id: 'comp-intro-1',
    chapterId: 'intro',
    type: 'multiple-choice',
    prompt: 'According to the Introduction, what is Jonathan Swift’s primary purpose in writing Gulliver’s Travels beyond telling a clever and funny story?',
    options: [
      'To document real geographical routes to the South Seas for English sailors',
      'To make readers reflect on their own ideas and lives, and perhaps change them',
      'To write a book exclusively for young children in Dublin',
      'To praise the kindness of English rule in Ireland after 1714'
    ],
    correctIndex: 1,
    explanationEn: 'Swift uses fictional lands (little people, giants, and horses) as a mirror so readers examine their own society, ideas, and lives.',
    explanationEs: 'Swift utiliza tierras ficticias como espejo para que los lectores reflexionen sobre sus propias ideas y modo de vida.',
    skillTag: 'Authorial Purpose & Main Idea'
  },
  {
    id: 'comp-intro-2',
    chapterId: 'intro',
    type: 'true-false-correction',
    prompt: 'Evaluate this statement about Jonathan Swift’s life: "Swift was born in London in 1667, and in 1714 he moved to Ireland because everyone in England loved his new political ideas."',
    options: [
      'True — the statement is completely accurate according to the text.',
      'False — Swift was born in Dublin, Ireland (going to Trinity College), and returned to Ireland in 1714 after some people disliked his new ideas; he also criticized how unkind the English were in Ireland.',
      'False — Swift was born in Bristol in 1699 and wrote Gulliver’s Travels before going to university.',
      'False — Swift never lived or worked in London.'
    ],
    correctIndex: 1,
    explanationEn: 'Swift was born in Dublin in 1667, studied at Trinity College, worked in London, and went back to Ireland in 1714, publishing Gulliver’s Travels in 1726.',
    explanationEs: 'Swift nació en Dublín en 1667, estudió en el Trinity College, trabajó en Londres y regresó a Irlanda en 1714; publicó la obra en 1726.',
    skillTag: 'Biographical Detail Verification'
  },

  // PART 1 - CHAPTER 1
  {
    id: 'comp-p1c1-1',
    chapterId: 'p1-c1',
    type: 'reference-identification',
    prompt: 'Look at the underlined word in the quote from Part 1, Chapter 1. Who or what does "us" refer to?',
    quoteContext: '"In the strong winds, the ship hit something in the water, and broke. Six of us got a boat into the sea."',
    options: [
      'Gulliver and his four older brothers in the north of England',
      'Gulliver and five other surviving seamen from the ship Antelope',
      'The forty little men who walked up onto Gulliver’s body',
      'The twelve crew members who had already died from bad food'
    ],
    correctIndex: 1,
    explanationEn: '"Six of us" refers to Gulliver and five other sailors from the wrecked ship Antelope who escaped into a lifeboat before it overturned.',
    explanationEs: '"Six of us" se refiere a Gulliver y otros cinco marineros del barco naufragado Antelope.',
    skillTag: 'Pronoun Reference (Worksheet 1a)'
  },
  {
    id: 'comp-p1c1-2',
    chapterId: 'p1-c1',
    type: 'reference-identification',
    prompt: 'In the sentence below, what does the pronoun "They" refer to?',
    quoteContext: '"They were everywhere — round my arms, my feet and through my long hair!"',
    options: [
      'Thousands of strings used by the Lilliputians to tie Gulliver to the ground',
      'The arrows shot at Gulliver’s face and hands',
      'The fifteen hundred horses belonging to the King',
      'The small cups of milk and loaves of bread'
    ],
    correctIndex: 0,
    explanationEn: 'When Gulliver woke up after nine hours of sleep, he found thousands of thin strings tying his arms, feet, and long hair to the ground.',
    explanationEs: 'Al despertar, Gulliver descubrió miles de cuerdas ("strings") atando sus brazos, pies y cabello al suelo.',
    skillTag: 'Pronoun Reference (Worksheet 1b)'
  },
  {
    id: 'comp-p1c1-3',
    chapterId: 'p1-c1',
    type: 'causal-why',
    prompt: 'Why did Gulliver sleep for about nine hours a second time after eating the King’s food and drinking the milk?',
    options: [
      'Because the Lilliputians had put a sleeping medicine in his food',
      'Because he had just swum another kilometre across the sea',
      'Because the inside of the old church was completely dark',
      'Because the King ordered him to close his eyes during the speech'
    ],
    correctIndex: 0,
    explanationEn: 'As Gulliver later learned ("There was something in my food, they told me later"), the Lilliputians drugged his meal so 900 men could load him onto the wooden platform safely.',
    explanationEs: 'Los liliputienses pusieron algo en su comida para dormirlo y así poder subirlo a la plataforma de madera con 900 hombres.',
    skillTag: 'Cause & Effect (Worksheet 4c)'
  },
  {
    id: 'comp-p1c1-4',
    chapterId: 'p1-c1',
    type: 'causal-why',
    prompt: 'Why did the Lilliputians build a wooden table next to Gulliver’s head?',
    options: [
      'So that an important older official in a long coat could stand on it and speak to Gulliver',
      'So that Gulliver could sit at the table to write a letter to the King',
      'To protect the King’s horses from the hot sun',
      'To block the door of the old church'
    ],
    correctIndex: 0,
    explanationEn: 'They built the wooden platform/table so four men—led by an older official—could stand at eye/ear level and communicate with Gulliver.',
    explanationEs: 'Construyeron la mesa de madera para que cuatro hombres, encabezados por un noble anciano, pudieran hablar con Gulliver de cerca.',
    skillTag: 'Detail & Correction (Progress Test 1c)'
  },

  // PART 1 - CHAPTER 2
  {
    id: 'comp-p1c2-1',
    chapterId: 'p1-c2',
    type: 'causal-why',
    prompt: 'When the King and his advisers debated killing Gulliver while he slept, why did one adviser argue against killing him?',
    options: [
      'Because Gulliver’s dead body was far too huge for them to move or dispose of',
      'Because Gulliver had already given them his guns and sword',
      'Because the Queen wanted Gulliver to work in her palace kitchen',
      'Because Gulliver spoke their language fluently from his first day'
    ],
    correctIndex: 0,
    explanationEn: 'His friend replied: "No, what can we do with his dead body? It is too big." Shortly after, they also learned how mercifully Gulliver treated the six men who shot arrows at him.',
    explanationEs: 'Uno de los consejeros señaló que no sabrían qué hacer con un cadáver tan gigantesco.',
    skillTag: 'Causal Reasoning (Worksheet 3)'
  },
  {
    id: 'comp-p1c2-2',
    chapterId: 'p1-c2',
    type: 'multiple-choice',
    prompt: 'Which two items did the King demand that Gulliver hand over after two officials searched inside his clothes?',
    options: [
      'His notebook and his eye-glasses',
      'His sword and his guns',
      'His money-bag and his shoes',
      'His coat and his hat'
    ],
    correctIndex: 1,
    explanationEn: 'Although the inspectors took notes on his notebook, glasses, and money-bag, the King specifically ordered Gulliver to hand over his sword and his guns before granting him freedom under the seven Rules.',
    explanationEs: 'Aunque anotaron su libreta, gafas y bolsa de monedas, el rey le exigió entregar su espada ("sword") y sus armas de fuego ("guns").',
    skillTag: 'Gap-Fill Recall (Worksheet 2)'
  },
  {
    id: 'comp-p1c2-3',
    chapterId: 'p1-c2',
    type: 'multiple-choice',
    prompt: 'How did the King’s mathematicians calculate that Gulliver should receive food equivalent to 1,728 Lilliputians?',
    options: [
      'Because there were 1,728 soldiers guarding his church door',
      'Because Gulliver was 12 times as tall as a Lilliputian, so his volume and weight equalled 12 × 12 × 12 (1,728)',
      'Because Gulliver stayed in Lilliput for 1,728 days',
      'Because 600 beds multiplied by 3 meals equalled 1,728'
    ],
    correctIndex: 1,
    explanationEn: 'Since Gulliver was 12 times taller than a Lilliputian in every dimension, his three-dimensional body volume was 12 × 12 × 12 = 1,728 times larger.',
    explanationEs: 'Como medía 12 veces la altura de un liliputiense, su volumen corporal en tres dimensiones equivalía a 12 × 12 × 12 = 1.728 personas.',
    skillTag: 'Quantitative Detail'
  },

  // PART 1 - CHAPTER 3
  {
    id: 'comp-p1c3-1',
    chapterId: 'p1-c3',
    type: 'causal-why',
    prompt: 'According to Reldresal, what caused the bitter war between Lilliput and the Island of Blefuscu?',
    options: [
      'A royal law forcing everyone to break boiled eggs at the little end after the King’s grandfather cut his finger on the big end',
      'A dispute over who owned the forty largest merchant ships in the South Seas',
      'A disagreement about whether to build a wall around the royal garden',
      'Gulliver’s refusal to pay taxes on the food he ate'
    ],
    correctIndex: 0,
    explanationEn: 'When the present King’s grandfather was a boy, he cut his finger opening an egg at the big end, prompting his father to outlaw Big-endianism; rebels fled to Blefuscu.',
    explanationEs: 'El abuelo del rey se cortó un dedo al abrir un huevo por el extremo grande, lo que llevó a prohibir esa costumbre y desencadenó el exilio de los Big-enders a Blefuscu.',
    skillTag: 'Plot & Satire Analysis (Worksheet 4d)'
  },
  {
    id: 'comp-p1c3-2',
    chapterId: 'p1-c3',
    type: 'reference-identification',
    prompt: 'When Gulliver tells the King of Lilliput, "No, I won’t help you with that. Don’t kill those people — it’s wrong," what does "that" refer to?',
    quoteContext: '"No, I won’t help you with that," I said. "Don’t kill those people — it’s wrong."',
    options: [
      'Pulling the first forty warships from Blefuscu to Lilliput',
      'Returning to Blefuscu to seize all remaining ships, enslave its people as servants, and kill the Big-enders so the King can rule the world',
      'Signing the peace treaty with the six ambassadors from Blefuscu',
      'Putting on his eye-glasses to protect his eyes from arrows'
    ],
    correctIndex: 1,
    explanationEn: 'Gulliver willingly neutralized Blefuscu’s invasion fleet of 40 ships, but refused the King’s tyrannical ambition to conquer Blefuscu completely and massacre the Big-enders.',
    explanationEs: 'Gulliver se negó a ayudar al rey en su ambición de capturar el resto de los barcos, esclavizar al país vecino y matar a los Big-enders.',
    skillTag: 'Pronoun Reference (Worksheet 1g)'
  },
  {
    id: 'comp-p1c3-3',
    chapterId: 'p1-c3',
    type: 'causal-why',
    prompt: 'Why did Gulliver decide to leave Lilliput and go to the Island of Blefuscu at the end of Chapter 3?',
    options: [
      'A friend warned him that the King’s men planned to blind him and starve him to death out of fear he might side with Blefuscu',
      'The church where he slept was destroyed by a storm',
      'The King of Blefuscu promised to pay him gold coins',
      'He wanted to capture six more warships for Lilliput'
    ],
    correctIndex: 0,
    explanationEn: 'A friend at court secretly warned Gulliver at night that the King’s advisers planned to blind him ("hurt your eyes") and give him no food until he died.',
    explanationEs: 'Un amigo le advirtió por la noche que los hombres del rey planeaban herir sus ojos y dejarlo morir de hambre.',
    skillTag: 'Plot Motivation'
  },

  // PART 1 - CHAPTER 4
  {
    id: 'comp-p1c4-1',
    chapterId: 'p1-c4',
    type: 'multiple-choice',
    prompt: 'How did the King of Blefuscu help Gulliver return home after Gulliver spotted an overturned real-sized boat in the sea?',
    options: [
      'He lent Gulliver 20 large ships and 2,000 men to help pull the boat to the beach, then provided food, supplies, and six tiny animals',
      'He ordered his soldiers to swim to England with Gulliver on their backs',
      'He asked the King of Lilliput to send 600 beds for the boat',
      'He gave Gulliver a map of Barbados and a compass'
    ],
    correctIndex: 0,
    explanationEn: 'Even though the King of Blefuscu wished Gulliver would stay, he generously sent 20 ships and 2,000 men to tow the boat ashore, plus food, men to prepare it, and six miniature animals.',
    explanationEs: 'El rey de Blefuscu envió 20 barcos y 2.000 hombres para remolcar el bote hasta la playa, además de víveres y seis animales diminutos.',
    skillTag: 'Comprehension Recall (Progress Test 2e)'
  },
  {
    id: 'comp-p1c4-2',
    chapterId: 'p1-c4',
    type: 'causal-why',
    prompt: 'How did Gulliver convince the sceptical sailors on the English ship that his story about Lilliput and Blefuscu was actually true?',
    options: [
      'He took six live miniature animals out of his hat and showed them to the crew',
      'He showed them the written Rules of the King of Lilliput',
      'He spoke to them in the Lilliputian language ("Hekinah degul")',
      'He showed them arrow wounds on his hands'
    ],
    correctIndex: 0,
    explanationEn: 'At first the crew thought Gulliver was delirious ("ill from your travels"), until he brought out the six tiny animals he carried in his hat.',
    explanationEs: 'Al principio los marineros creyeron que deliraba, hasta que Gulliver sacó de su sombrero los seis animales diminutos.',
    skillTag: 'Evidence & Resolution (Worksheet 1i & 3)'
  },

  // PART 2 - CHAPTER 1
  {
    id: 'comp-p2c1-1',
    chapterId: 'p2-c1',
    type: 'causal-why',
    prompt: 'Why did Gulliver and the other men leave their ship in a boat and land on the strange country (Brobdingnag)?',
    options: [
      'Because after weeks of strong winds, the ship had no clean water left and they needed to find a river',
      'Because the crew staged a mutiny and tied Gulliver to his bed',
      'Because they wanted to sell miniature cattle from Lilliput',
      'Because their ship hit a rock and sank immediately'
    ],
    correctIndex: 0,
    explanationEn: 'After weeks driven east by an angry wind near the Molucca Islands, they still had food on board but no clean drinking water.',
    explanationEs: 'Tras semanas empujados por el viento cerca de las islas Molucas, se habían quedado sin agua potable y bajaron a tierra buscando un río.',
    skillTag: 'Part II Reading Check (Worksheet 5a)'
  },
  {
    id: 'comp-p2c1-2',
    chapterId: 'p2-c1',
    type: 'multiple-choice',
    prompt: 'When the giant worker in the twelve-metre-high cornfield picked Gulliver up, what thought crossed Gulliver’s mind?',
    options: [
      'He remembered how people in England look at a small animal and sometimes throw it on the ground and step on it',
      'He planned to pull out his sword and kill all seven giant farm workers',
      'He thought he had returned to the Island of Blefuscu',
      'He believed the giant was Peter Williams from his old ship'
    ],
    correctIndex: 0,
    explanationEn: 'Gulliver reflected on the relativity of power: in England, humans look at a small creature the same way and sometimes crush it underfoot without a second thought.',
    explanationEs: 'Gulliver recordó cómo en Inglaterra las personas miran a un animal pequeño y a veces lo arrojan al suelo y lo pisan.',
    skillTag: 'Perspective & Empathy (Progress Test 3b)'
  },
  {
    id: 'comp-p2c1-3',
    chapterId: 'p2-c1',
    type: 'multiple-choice',
    prompt: 'How did the farmer’s nine-year-old daughter (Glumdalclitch) help Gulliver, and why did she later cry when the village head man visited?',
    options: [
      'She taught him the language and let him sleep safely in her doll’s house; she cried because her father planned to exhibit Gulliver on market days for money, risking injury to him',
      'She built a boat for him; she cried because the farmer’s cat ate his food',
      'She gave him a splacknuck; she cried because the Queen wanted to arrest her father',
      'She killed both giant rats on the bed; she cried because Gulliver refused to learn her language'
    ],
    correctIndex: 0,
    explanationEn: 'Glumdalclitch cared for Gulliver tirelessly and taught him Brobdingnagian words, calling him Grildrig. She wept when the village head man advised her greedy father to exhibit Gulliver in town for money.',
    explanationEs: 'Glumdalclitch le enseñó el idioma y lo protegió; lloró al descubrir el plan de su padre de exhibir a Gulliver por dinero en los pueblos.',
    skillTag: 'Character & Plot (Worksheet 5h-5i)'
  },

  // PART 2 - CHAPTER 2
  {
    id: 'comp-p2c2-1',
    chapterId: 'p2-c2',
    type: 'multiple-choice',
    prompt: 'After examining Gulliver for hours, what did the King of Brobdingnag’s learned men conclude that Gulliver was?',
    options: [
      'They concluded he was neither an animal nor a person, because he was smaller than the smallest person in the world, calling him "a Thing" and "a Mistake"',
      'They concluded he was a spy sent from the Island of Lilliput',
      'They concluded he was a young splacknuck that had learned to wear clothes',
      'They concluded he was a member of the English House of Lords'
    ],
    correctIndex: 0,
    explanationEn: 'Satirizing pedantic scholars who refuse to accept empirical reality when it contradicts their assumptions, the King’s men declared Gulliver "a Thing" and "a Mistake".',
    explanationEs: 'Los sabios del rey dictaminaron que no era ni un animal ni una persona por ser demasiado pequeño, clasificándolo como "una Cosa" ("a Thing") y "un Error" ("a Mistake").',
    skillTag: 'Detail Verification (Progress Test 3d)'
  },
  {
    id: 'comp-p2c2-2',
    chapterId: 'p2-c2',
    type: 'multiple-choice',
    prompt: 'How did the King of Brobdingnag react when Gulliver proudly offered to teach his workmen how to make gunpowder and sixty-metre cannons?',
    options: [
      'He was horrified, ordered Gulliver never to speak of such destructive weapons again on pain of death, and said a good farmer with fruit or vegetables helps his people far better than European politicians',
      'He eagerly accepted and offered Gulliver a fortune in gold to build thirty cannons',
      'He laughed and said his army already used gunpowder against neighbouring islands',
      'He asked the House of Commons to vote on Gulliver’s proposal'
    ],
    correctIndex: 0,
    explanationEn: 'The moral giant King was appalled by European warfare and gunpowder, commanding Gulliver never to mention it again and stating that a farmer growing food serves humanity far better than corrupt politicians and warmongers.',
    explanationEs: 'El rey se horrorizó, le prohibió volver a hablar de la pólvora bajo pena de muerte y afirmó que un buen agricultor ayuda mucho más a su pueblo que tales gobernantes.',
    skillTag: 'Thematic Climax & Satire'
  },

  // PART 2 - CHAPTER 3
  {
    id: 'comp-p2c3-1',
    chapterId: 'p2-c3',
    type: 'multiple-choice',
    prompt: 'Which sequence correctly orders the events of Gulliver’s departure from Brobdingnag in Part 2, Chapter 3?',
    options: [
      '1) Gulliver travelled south with the King and Queen -> 2) A boy carried his box to the sea while Gulliver slept -> 3) A giant seabird carried the box into the sky and fought two other birds -> 4) The box fell into the sea and was rescued by an English ship',
      '1) A giant seabird attacked the palace -> 2) Glumdalclitch put Gulliver in a boat -> 3) The farmer sold the box to an English captain -> 4) Gulliver swam back to England',
      '1) The King banished Gulliver for talking about gunpowder -> 2) Two rats carried his box to the beach -> 3) An English ship bombarded the coast -> 4) Gulliver gave the captain a giant sword',
      '1) Gulliver built a canoe -> 2) The boy dropped the box from a cliff -> 3) A whale swallowed the box -> 4) Peter Williams rescued him'
    ],
    correctIndex: 0,
    explanationEn: 'During a royal journey to the south coast, a page boy left Gulliver’s travelling box by the sea; an eagle snatched it up, dropped it during a mid-air fight with two other birds, and an English ship later hauled the floating box aboard.',
    explanationEs: 'Durante un viaje al sur, un muchacho llevó su caja junto al mar; una gran ave marina la alzó por losaires, la soltó al pelear con otras dos aves y finalmente un barco inglés lo rescató.',
    skillTag: 'Chronological Sequencing (Worksheet 6)'
  },
  {
    id: 'comp-p2c3-2',
    chapterId: 'p2-c3',
    type: 'causal-why',
    prompt: 'Why did Gulliver shout so loudly on the English ship and fail to see his wife and children properly when he first arrived home?',
    options: [
      'Because after two years among twenty-metre giants in Brobdingnag, he was used to shouting to be heard and constantly looking up at the sky to see people’s faces',
      'Because the seawater had damaged his eyes and ears inside the wooden box',
      'Because he thought his family had turned into Yahoos',
      'Because he had forgotten how to speak English'
    ],
    correctIndex: 0,
    explanationEn: 'Conditioned by two years in a land of giants, normal-sized humans now seemed tiny to Gulliver—as if he were back in Lilliput—so he habitually looked upward and shouted.',
    explanationEs: 'Tras dos años entre gigantes de veinte metros, Gulliver se había acostumbrado a gritar para ser oído y a mirar hacia el cielo para ver los rostros.',
    skillTag: 'Psychological Detail'
  },

  // PART 3 - CHAPTER 1
  {
    id: 'comp-p3c1-1',
    chapterId: 'p3-c1',
    type: 'causal-why',
    prompt: 'Why was recruiting replacement sailors in Barbados in 1710 a terrible mistake for Gulliver?',
    options: [
      'Because the new recruits and his crew mutinied, seized his ship to become pirates, tied him to his bed for months, and abandoned him on an unknown beach',
      'Because none of the men from Barbados knew how to sail a ship',
      'Because they steered the ship back to Lilliput instead of the Indies',
      'Because they sold all the ship’s food and clean water in Lisbon'
    ],
    correctIndex: 0,
    explanationEn: 'The recruits in Barbados staged a mutiny, locked Gulliver in his cabin to raid other vessels, and finally marooned him on the shore of the Houyhnhnms’ land in May 1711.',
    explanationEs: 'Los nuevos hombres se amotinaron junto con su tripulación, tomaron el barco para dedicarse a la piratería y finalmente abandonaron a Gulliver en una playa desconocida.',
    skillTag: 'Sentence Completion (Worksheet 9a)'
  },
  {
    id: 'comp-p3c1-2',
    chapterId: 'p3-c1',
    type: 'multiple-choice',
    prompt: 'What startling realization did Gulliver have when the grey horse’s servant untied one of the filthy Yahoos and stood it right next to him?',
    options: [
      'He realized that the ugly, hairy Yahoo had the exact same human anatomy—hands, feet, and body—as a man, differing only because Gulliver wore clothes and shoes',
      'He realized that the Yahoo was actually one of the mutineers from Barbados',
      'He realized that the Yahoos were the secret rulers of the island',
      'He realized that Yahoos loved to wash their hair and keep clean'
    ],
    correctIndex: 0,
    explanationEn: 'Standing side by side with the Yahoo, Gulliver saw with horror that beneath his shoes and clothes, his physical body and feet were identical to the brutish creature’s.',
    explanationEs: 'Al ser colocado junto al Yahoo, Gulliver comprendió con horror que aquella criatura sucia y salvaje tenía exactamente la misma anatomía humana que él, diferenciándose solo por la ropa y el calzado.',
    skillTag: 'Core Discovery (Worksheet 8)'
  },

  // PART 3 - CHAPTER 2
  {
    id: 'comp-p3c2-1',
    chapterId: 'p3-c2',
    type: 'causal-why',
    prompt: 'Why did the grey Houyhnhnm master call Gulliver’s statements "a mistake" when Gulliver said he arrived on a wooden ship and described European wars?',
    options: [
      'Because the Houyhnhnms have no word or concept for lying ("untrue"): they believe language exists solely to communicate truth, so saying what is not true defeats the purpose of speech',
      'Because Gulliver pronounced the Houyhnhnm words with a Portuguese accent',
      'Because the grey horse had already visited England and France himself',
      'Because the Houyhnhnms build their own ships out of iron rather than wood'
    ],
    correctIndex: 0,
    explanationEn: 'In the Houyhnhnms’ rational philosophy, language exists so the hearer can understand reality; therefore, an untrue statement is incomprehensible folly ("a mistake").',
    explanationEs: 'En la lengua de los Houyhnhnms no existe palabra para "mentira" o "falso": consideran que el lenguaje existe únicamente para transmitir la verdad y que decir lo que no es cierto carece de sentido.',
    skillTag: 'Philosophical Concept'
  },
  {
    id: 'comp-p3c2-2',
    chapterId: 'p3-c2',
    type: 'multiple-choice',
    prompt: 'Why did the grey horse consider European wars even worse than the fights among the island’s Yahoos?',
    options: [
      'Because island Yahoos do not think and only fight instinctively with their teeth, whereas humans claim to possess reason ("can think") yet invent guns and gunpowder to slaughter millions',
      'Because European wars lasted less than four years',
      'Because Europeans used horses to pull farm carts instead of riding them',
      'Because European soldiers did not wear clean clothes'
    ],
    correctIndex: 0,
    explanationEn: 'The master horse pointed out that while brutish Yahoos fight without reason, creatures capable of thought who deliberately engineer mass murder are morally far worse.',
    explanationEs: 'El caballo señaló que los Yahoos de la isla no piensan, pero que unas criaturas dotadas de razón que inventan cañones y pólvora para matar a millones son moralmente mucho peores.',
    skillTag: 'Satirical Argument (Worksheet 8 & 10e)'
  },

  // PART 3 - CHAPTER 3
  {
    id: 'comp-p3c3-1',
    chapterId: 'p3-c3',
    type: 'causal-why',
    prompt: 'Why did the quadrennial Meeting of the Houyhnhnms order the grey horse to send Gulliver away from their island?',
    options: [
      'Because although Gulliver could learn and was better than a brute Yahoo, he was not a Houyhnhnm, and they feared he might one day lead the island’s Yahoos in a rebellion against them',
      'Because Gulliver stole horse-food and milk from the young red-brown servant',
      'Because Gulliver wanted to return to England immediately to see his family',
      'Because a Portuguese warship arrived on the beach looking for Gulliver'
    ],
    correctIndex: 0,
    explanationEn: 'The Assembly feared that because Gulliver possessed intelligence alongside a Yahoo body, he might eventually organize the unruly Yahoos to fight against the Houyhnhnms.',
    explanationEs: 'La Asamblea de los Houyhnhnms temía que, al tener inteligencia, Gulliver pudiera algún día organizar a los Yahoos de la isla para rebelarse contra ellos.',
    skillTag: 'Plot Resolution (Progress Test 5c)'
  },
  {
    id: 'comp-p3c3-2',
    chapterId: 'p3-c3',
    type: 'multiple-choice',
    prompt: 'How did Gulliver behave after returning to England via Lisbon at the end of the book?',
    options: [
      'He viewed human beings—including his own family and countrymen—as Yahoos, bought two horses, and conversed with them every day as his true friends',
      'He became a member of the House of Commons to reform English laws',
      'He bought another ship to conquer the Island of Blefuscu',
      'He opened a museum displaying the animals from Brobdingnag'
    ],
    correctIndex: 0,
    explanationEn: 'Deeply alienated from humanity, Gulliver saw human vanity and cruelty as Yahoo-like; he bought two horses and spent hours speaking with them daily in memory of the noble Houyhnhnms.',
    explanationEs: 'Desencantado con la humanidad, a la que veía igual que a los Yahoos, Gulliver compró dos caballos con los que conversaba a diario recordando a los nobles Houyhnhnms.',
    skillTag: 'Ending & Character Transformation'
  }
];
