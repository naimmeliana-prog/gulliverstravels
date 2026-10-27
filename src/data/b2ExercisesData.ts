import { B2ExerciseItem } from '../types/study';

export const B2_EXERCISES: B2ExerciseItem[] = [
  // ==================== B2 GRAMMAR ====================
  {
    id: 'b2-gram-1',
    category: 'grammar',
    b2Topic: 'Third Conditional (Past Counterfactuals)',
    cefrDescriptor: 'Can express hypothetical past situations and their unrealized past consequences.',
    relatedChapterId: 'p1-c1',
    sentenceStem: 'If the Lilliputians ________ a sleeping potion in Gulliver’s food, nine hundred workmen ________ able to hoist him onto the wooden cart while he slept.',
    targetStructureHint: 'If + past perfect, would(n’t) have + past participle',
    options: [
      'hadn’t put / wouldn’t have been',
      'didn’t put / wouldn’t be',
      'haven’t put / won’t have been',
      'wouldn’t have put / hadn’t been'
    ],
    correctIndex: 0,
    explanationEn: 'In a Third Conditional sentence referring to an imaginary past event, use "If + past perfect (hadn’t put)" in the condition clause and "wouldn’t have + past participle (wouldn’t have been)" in the result clause.',
    explanationEs: 'En el Tercer Condicional (pasado irreal), usamos "If + Past Perfect (hadn’t put)" en la condición y "would(n’t) have + participio (wouldn’t have been)" en el resultado.'
  },
  {
    id: 'b2-gram-2',
    category: 'grammar',
    b2Topic: 'Causative Have / Get Something Done',
    cefrDescriptor: 'Can use causative constructions to indicate arrangements made through third-party workers.',
    relatedChapterId: 'p1-c2',
    sentenceStem: 'Seeing that Gulliver was sleeping on the cold stone floor of the church, the King of Lilliput ________ into a single giant mattress.',
    targetStructureHint: 'have + object + past participle',
    options: [
      'had 600 small beds joined together',
      'had joined together 600 small beds',
      'made 600 small beds to join',
      'got 600 small beds joining together'
    ],
    correctIndex: 0,
    explanationEn: 'The causative structure "have + object (600 small beds) + past participle (joined)" shows that the King arranged for his workmen to perform the action rather than doing it himself.',
    explanationEs: 'La estructura causativa "have + objeto + participio pasado" indica que el rey encargó la acción a sus obreros en lugar de hacerla él mismo.'
  },
  {
    id: 'b2-gram-3',
    category: 'grammar',
    b2Topic: 'Past Modals of Deduction',
    cefrDescriptor: 'Can speculate and make logical deductions about past events using modal verbs.',
    relatedChapterId: 'p1-c4',
    sentenceStem: 'When the English sailors first heard Gulliver’s account of tiny people, they laughed; however, once he pulled six live miniature cattle from his hat, they realized he ________ telling the truth all along.',
    targetStructureHint: 'must / might / can’t + have + past participle',
    options: [
      'must have been',
      'can’t have been',
      'shouldn’t have been',
      'needn’t have been'
    ],
    correctIndex: 0,
    explanationEn: '"Must have been" expresses a strong logical certainty about the past based on clear physical evidence (the miniature animals in his hat).',
    explanationEs: '"Must have been" expresa una deducción lógica casi segura sobre el pasado basada en pruebas evidentes (los animales diminutos).'
  },
  {
    id: 'b2-gram-4',
    category: 'grammar',
    b2Topic: 'Reporting Verbs & Verb Patterns',
    cefrDescriptor: 'Can summarize direct speech using advanced reporting verbs with accurate infinitive or gerund complements.',
    relatedChapterId: 'p1-c3',
    sentenceStem: 'Despite the King of Lilliput’s ambitious demands, Gulliver firmly refused ________ a free people into slavery, and later his friend warned him ________ in Lilliput.',
    targetStructureHint: 'refuse + to-infinitive / warn + someone + (not) to-infinitive',
    options: [
      'to reduce / not to remain',
      'reducing / to not remaining',
      'to reducing / against remain',
      'reduce / that he doesn’t remain'
    ],
    correctIndex: 0,
    explanationEn: 'At B2 level, "refuse" is followed by a "to-infinitive" (refused to reduce), and "warn" takes "object + not + to-infinitive" (warned him not to remain).',
    explanationEs: 'El verbo "refuse" va seguido de infinitivo con "to" (refused to reduce), y "warn" sigue el patrón "warn someone not to do something".'
  },
  {
    id: 'b2-gram-5',
    category: 'grammar',
    b2Topic: 'Negative Inversion for Dramatic Emphasis',
    cefrDescriptor: 'Can invert subject and auxiliary after negative or restrictive adverbials in formal/literary narrative.',
    relatedChapterId: 'p2-c1',
    sentenceStem: 'No sooner ________ the giant farmer’s baby than the infant grabbed Gulliver’s torso and stuffed his head straight into his open mouth.',
    targetStructureHint: 'No sooner + had + subject + past participle + than...',
    options: [
      'had Gulliver been shown to',
      'Gulliver had been shown to',
      'was Gulliver shown than',
      'did Gulliver show to'
    ],
    correctIndex: 0,
    explanationEn: 'When a sentence begins with the restrictive phrase "No sooner", subject-auxiliary inversion in the Past Perfect ("had Gulliver been shown") is required, paired with "than".',
    explanationEs: 'Al iniciar la oración con "No sooner", se invierte el auxiliar del Past Perfect y el sujeto ("had Gulliver been shown"), seguido de la conjunción "than".'
  },
  {
    id: 'b2-gram-6',
    category: 'grammar',
    b2Topic: 'Impersonal & Personal Passive Reporting Structures',
    cefrDescriptor: 'Can distance the writer from claims using passive reporting constructions.',
    relatedChapterId: 'p2-c2',
    sentenceStem: 'In the royal court of Lorbrulgrud, Gulliver was initially thought ________ an unplanned freak of nature, as he seemed far too small to survive on his own.',
    targetStructureHint: 'Subject + passive reporting verb + to-infinitive',
    options: [
      'to be',
      'being',
      'that he was',
      'to have been being'
    ],
    correctIndex: 0,
    explanationEn: 'In the personal passive construction ("Gulliver was thought..."), follow the passive reporting verb with a "to-infinitive" ("to be").',
    explanationEs: 'En la pasiva personal con verbos de opinión ("was thought"), el complemento verbal debe ir en infinitivo con "to" ("to be").'
  },
  {
    id: 'b2-gram-7',
    category: 'grammar',
    b2Topic: 'Mixed Conditionals (Past Action -> Present State)',
    cefrDescriptor: 'Can link a past counterfactual event to its ongoing present effect.',
    relatedChapterId: 'p2-c3',
    sentenceStem: 'If the page boy ________ Gulliver’s travelling box unattended on the seashore, Gulliver ________ back home in England with his family now.',
    targetStructureHint: 'If + past perfect (past), would(n’t) + base verb (present)',
    options: [
      'hadn’t left / wouldn’t be',
      'didn’t leave / wouldn’t have been',
      'hadn’t left / won’t be',
      'wouldn’t leave / hadn’t been'
    ],
    correctIndex: 0,
    explanationEn: 'This Mixed Conditional combines a past counterfactual condition ("If the boy hadn’t left...") with a present consequence ("Gulliver wouldn’t be back home... now").',
    explanationEs: 'Este Condicional Mixto combina una condición pasada irreal ("hadn’t left") con su consecuencia en el presente ("wouldn’t be ... now").'
  },
  {
    id: 'b2-gram-8',
    category: 'grammar',
    b2Topic: 'Expressing Past Regret (Wish / If only)',
    cefrDescriptor: 'Can express regret about past decisions using "wish" or "if only" + past perfect.',
    relatedChapterId: 'p3-c1',
    sentenceStem: 'Locked inside his cabin with his hands tied to the bed, Gulliver thought bitterly: "If only I ________ those replacement sailors in Barbados!"',
    targetStructureHint: 'If only / I wish + past perfect',
    options: [
      'had never recruited',
      'never recruited',
      'would never recruit',
      'haven’t recruited'
    ],
    correctIndex: 0,
    explanationEn: 'To express regret about something that already happened in the past, "I wish" or "If only" must be followed by the Past Perfect ("had never recruited").',
    explanationEs: 'Para expresar arrepentimiento sobre una acción pasada, "I wish" o "If only" van seguidos de Past Perfect ("had never recruited").'
  },
  {
    id: 'b2-gram-9',
    category: 'grammar',
    b2Topic: 'Formal Relative Clauses with Prepositions',
    cefrDescriptor: 'Can form complex relative clauses with fronted prepositions ("in which", "by whom", "for which").',
    relatedChapterId: 'p3-c2',
    sentenceStem: 'The quadrennial Council, ________ the heads of all Houyhnhnm families debated the nation’s most pressing matters, ultimately decreed that Gulliver must depart.',
    targetStructureHint: 'Preposition + which / where in non-defining relative clauses',
    options: [
      'at which',
      'which at',
      'in where',
      'that at'
    ],
    correctIndex: 0,
    explanationEn: 'In formal B2/C1 prose, the preposition precedes the relative pronoun "which" ("at which" = "where") after a comma in a non-defining relative clause.',
    explanationEs: 'En registro formal, la preposición se coloca delante del pronombre relativo "which" ("at which") dentro de una oración de relativo explicativa entre comas.'
  },
  {
    id: 'b2-gram-10',
    category: 'grammar',
    b2Topic: 'What-Cleft Sentences for Analytical Focus',
    cefrDescriptor: 'Can use cleft sentences ("What... was...") to highlight key satirical arguments.',
    relatedChapterId: 'p3-c3',
    sentenceStem: '________ the noble grey horse most about European warfare was that creatures endowed with reason used their intellect to engineer mass destruction.',
    targetStructureHint: 'What + verb phrase + singular form of "be"',
    options: [
      'What appalled',
      'That which appalled',
      'Which appalled',
      'It was what appalled'
    ],
    correctIndex: 0,
    explanationEn: 'A Wh-cleft sentence begins with "What + clause" functioning as the grammatical subject ("What appalled the noble grey horse most...") followed by "was".',
    explanationEs: 'Las oraciones hendidas con "What" ("What appalled... was...") permiten enfatizar la causa principal de una reacción.'
  },

  // ==================== B2 VOCABULARY ====================
  {
    id: 'b2-vocab-1',
    category: 'vocabulary',
    b2Topic: 'Phrasal Verbs in Narrative Context',
    cefrDescriptor: 'Can understand and use multi-word verbs accurately in travel and adventure narratives.',
    relatedChapterId: 'p1-c1',
    sentenceStem: 'Gulliver ________ from Bristol aboard the Antelope in May 1699, but after a violent storm ________ their lifeboat, he had to wade ashore alone.',
    targetStructureHint: 'Phrasal verbs meaning "begin a voyage" and "capsize"',
    options: [
      'set off / turned over',
      'put off / turned down',
      'took after / brought up',
      'called off / gave in'
    ],
    correctIndex: 0,
    explanationEn: '"Set off" means to start a journey, while "turn over" (used directly in Chapter 1: "the wind turned it over") means to capsize a boat.',
    explanationEs: '"Set off" significa partir de viaje y "turn over" significa volcar una embarcación en el agua.'
  },
  {
    id: 'b2-vocab-2',
    category: 'vocabulary',
    b2Topic: 'Word Formation: Prefixes & Adverbial Suffixes',
    cefrDescriptor: 'Can form negative adjectives and adverbs using prefixes (un-, dis-, in-) and suffixes (-ly).',
    relatedChapterId: 'p1-c3',
    sentenceStem: 'Once Gulliver rejected the King’s plan to subjugate Blefuscu, several court advisers began to speak about him ________, plotting his downfall behind closed doors.',
    targetStructureHint: 'Negative prefix + root + adverb suffix',
    options: [
      'unkindly',
      'inkindfully',
      'unkindness',
      'disKindly'
    ],
    correctIndex: 0,
    explanationEn: 'From the base adjective "kind", adding the negative prefix "un-" and adverbial suffix "-ly" forms "unkindly" ("some of the king’s friends began to talk about me unkindly").',
    explanationEs: 'A partir del adjetivo "kind", el prefijo negativo "un-" y el sufijo adverbial "-ly" forman "unkindly" (de forma hostil o maliciosa).'
  },
  {
    id: 'b2-vocab-3',
    category: 'vocabulary',
    b2Topic: 'Adjectives Ending in -ly (Grammar-Lexis Interface)',
    cefrDescriptor: 'Can distinguish adjectives ending in -ly from true adverbs of manner.',
    relatedChapterId: 'p3-c1',
    sentenceStem: 'When Gulliver first entered the Houyhnhnms’ house, the grey horse’s wife stared at him ________, immediately suspecting he was just another filthy Yahoo.',
    targetStructureHint: 'in a(n) + [-ly adjective] + way/manner',
    options: [
      'in an unfriendly way',
      'unfriendlily',
      'with unfriendly',
      'by an unfriendly manner'
    ],
    correctIndex: 0,
    explanationEn: '"Unfriendly" is an adjective, not an adverb! As seen in Part 3 Chapter 1 ("looked at me in an unfriendly way"), English uses the phrase "in an unfriendly way/manner".',
    explanationEs: '"Unfriendly" es un adjetivo a pesar de terminar en "-ly". Para usarlo como adverbio de modo se emplea la estructura "in an unfriendly way".'
  },
  {
    id: 'b2-vocab-4',
    category: 'vocabulary',
    b2Topic: 'Maritime & Mutiny Collocations',
    cefrDescriptor: 'Can use precise B2 nautical vocabulary to describe sea voyages and rebellions.',
    relatedChapterId: 'p3-c1',
    sentenceStem: 'After his original crew fell ill, the men Gulliver hired in Barbados ________ a mutiny, seized command of the vessel, and left him ________ on a desolate shore.',
    targetStructureHint: 'Collocations: [verb] a mutiny / leave someone [adjective]',
    options: [
      'staged / marooned',
      'made / drowned',
      'performed / anchored',
      'did / shipwrecked'
    ],
    correctIndex: 0,
    explanationEn: 'As highlighted in the Teacher’s Notes, sailors "stage a mutiny" (organizar un motín) and leave a victim "marooned" (abandonado en una isla o costa desierta).',
    explanationEs: 'Las colocaciones precisas de nivel B2 son "stage a mutiny" (amotinarse) y "leave someone marooned" (abandonado en una costa desconocida).'
  },
  {
    id: 'b2-vocab-5',
    category: 'vocabulary',
    b2Topic: 'British vs. American English Lexis in Literature',
    cefrDescriptor: 'Can recognize traditional British English meanings in historical and literary texts.',
    relatedChapterId: 'p2-c1',
    sentenceStem: 'Walking through Brobdingnag, Gulliver initially mistook the twelve-metre stalks of ________ for a dense forest of trees until he saw seven giant farmhands harvesting the grain.',
    targetStructureHint: 'Uncountable British English noun for cereal grain/wheat',
    options: [
      'corn',
      'corns',
      'timber',
      'bushes'
    ],
    correctIndex: 0,
    explanationEn: 'In British English (and throughout Part 2 Chapter 1), "corn" is an uncountable noun referring to cereal grain crops such as wheat or barley ("It’s corn, about twelve metres high").',
    explanationEs: 'En inglés británico, "corn" es un sustantivo incontable que designa el cereal o trigo en general (nunca se dice "corns" para el grano).'
  },
  {
    id: 'b2-vocab-6',
    category: 'vocabulary',
    b2Topic: 'Political & Parliamentary Vocabulary',
    cefrDescriptor: 'Can discuss government institutions, legislation, and political satire using accurate B2 lexis.',
    relatedChapterId: 'p2-c2',
    sentenceStem: 'Gulliver explained to the King of Brobdingnag that seats in the House of Lords were ________, passing from father to son, whereas members of the House of Commons were elected to ________ laws.',
    targetStructureHint: 'Adjective for family-inherited titles / verb for making laws',
    options: [
      'hereditary / pass',
      'inherited / do',
      'ancestral / invent',
      'customary / dictate'
    ],
    correctIndex: 0,
    explanationEn: 'A title passed from parent to child upon death is "hereditary", and a parliament or legislature "passes" (or "enacts") laws.',
    explanationEs: 'Un cargo que pasa de padres a hijos es "hereditary" (hereditario), y el Parlamento "passes laws" (aprueba leyes).'
  },
  {
    id: 'b2-vocab-7',
    category: 'vocabulary',
    b2Topic: 'Literary & Critical Analysis Terms',
    cefrDescriptor: 'Can use critical terminology to analyze themes, irony, and authorial intent.',
    relatedChapterId: 'intro',
    sentenceStem: 'Although children often read Gulliver’s Travels as an entertaining fantasy, Swift wrote it as a biting ________ designed to expose human vanity and political corruption through ________.',
    targetStructureHint: 'Literary genre + rhetorical device',
    options: [
      'satire / irony',
      'biography / metaphor',
      'tragedy / rhyme',
      'chronicle / flattery'
    ],
    correctIndex: 0,
    explanationEn: 'Gulliver’s Travels is a masterpiece of political and moral "satire" that uses "irony" and absurd contrasts in scale to expose human folly.',
    explanationEs: 'La obra es una "satire" (sátira) que emplea la "irony" (ironía) para exponer la vanidad humana y la corrupción política.'
  },
  {
    id: 'b2-vocab-8',
    category: 'vocabulary',
    b2Topic: 'Phrasal Verbs & Idiomatic Expressions with "Look"',
    cefrDescriptor: 'Can distinguish phrasal verbs formed from the root verb "look".',
    relatedChapterId: 'p2-c1',
    sentenceStem: 'Nine-year-old Glumdalclitch faithfully ________ Gulliver day and night in Brobdingnag, whereas the arrogant courtiers initially ________ him as a mere "splacknuck" or freak.',
    targetStructureHint: 'look [prep] = care for / look [prep] [prep] = despise',
    options: [
      'looked after / looked down on',
      'looked for / looked up to',
      'looked into / looked out for',
      'looked over / looked forward to'
    ],
    correctIndex: 0,
    explanationEn: '"Look after" means to take care of someone ("The girl looked after me every minute"), while "look down on" means to regard someone with a feeling of superiority.',
    explanationEs: '"Look after" significa cuidar de alguien, mientras que "look down on" significa menospreciar o mirar por encima del hombro.'
  },
  {
    id: 'b2-vocab-9',
    category: 'vocabulary',
    b2Topic: 'Confusable Words: Travel, Journey, Voyage, Trip',
    cefrDescriptor: 'Can select the exact travel noun required by collocation and context.',
    relatedChapterId: 'p1-c4',
    sentenceStem: 'When Gulliver boarded the English vessel after leaving Blefuscu, the sailors thought he was delirious from his ________ until he showed them the miniature cattle.',
    targetStructureHint: 'Plural noun referring to long experiences abroad ("ill from your ___")',
    options: [
      'travels',
      'voyages',
      'excursions',
      'commutes'
    ],
    correctIndex: 0,
    explanationEn: 'In Part 1 Chapter 4, the sailors tell Gulliver: "These things can’t be true. You’re ill from your travels." Plural "travels" refers to a person’s extended journeys abroad.',
    explanationEs: 'En plural, "travels" designa una serie prolongada de viajes por tierras lejanas ("ill from your travels" / "Gulliver’s Travels").'
  },
  {
    id: 'b2-vocab-10',
    category: 'vocabulary',
    b2Topic: 'Adjective + Preposition Collocations',
    cefrDescriptor: 'Can pair emotional and evaluative adjectives with their required prepositions.',
    relatedChapterId: 'p3-c3',
    sentenceStem: 'Upon returning to England, Gulliver had grown so accustomed ________ the peaceful rationality of the Houyhnhnms that he felt utterly disgusted ________ human pride and dishonesty.',
    targetStructureHint: 'accustomed [prep] / disgusted [prep]',
    options: [
      'to / by',
      'with / of',
      'for / at',
      'in / from'
    ],
    correctIndex: 0,
    explanationEn: 'At B2 level, "accustomed" takes the preposition "to" (+ noun/gerund), while "disgusted" collocates with "by" or "with" (never "of").',
    explanationEs: '"Accustomed" rige siempre la preposición "to" (acostumbrado a), y "disgusted" se construye con "by" o "with".'
  }
];
