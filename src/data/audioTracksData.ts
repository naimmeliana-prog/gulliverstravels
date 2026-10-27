export interface AudioTrackItem {
  id: string;
  trackNumber: number;
  chapterId: string;
  title: string;
  subLabel: string;
  openingCue: string;
  src: string;
}

export const AUDIO_TRACKS: AudioTrackItem[] = [
  {
    id: 'track-01',
    trackNumber: 1,
    chapterId: 'intro',
    title: 'Track 01 — Audiobook Title & Credits',
    subLabel: 'CD 1 · Opening Credits',
    openingCue: 'Gulliver’s Travels by Jonathan Swift (Penguin Readers Edition)',
    src: '/assets/aistudio/Track_01_1c68403d.mp3'
  },
  {
    id: 'track-02',
    trackNumber: 2,
    chapterId: 'p1-c1',
    title: 'Track 02 — Part 1, Chapter 1 (1/4)',
    subLabel: 'I Come to Lilliput · Part 1',
    openingCue: '“My father lived in the north of England, but he was not very rich...”',
    src: '/assets/aistudio/Track_02_275c9eae.mp3'
  },
  {
    id: 'track-03',
    trackNumber: 3,
    chapterId: 'p1-c1',
    title: 'Track 03 — Part 1, Chapter 1 (2/4)',
    subLabel: 'I Come to Lilliput · Part 2',
    openingCue: '“The sun was hot, and the light hurt my eyes...”',
    src: '/assets/aistudio/Track_03_c5232871.mp3'
  },
  {
    id: 'track-04',
    trackNumber: 4,
    chapterId: 'p1-c1',
    title: 'Track 04 — Part 1, Chapter 1 (3/4)',
    subLabel: 'I Come to Lilliput · Part 3',
    openingCue: '“One of the men on the table was older and larger than the other three...”',
    src: '/assets/aistudio/Track_04_239b973a.mp3'
  },
  {
    id: 'track-05',
    trackNumber: 5,
    chapterId: 'p1-c1',
    title: 'Track 05 — Part 1, Chapter 1 (4/4)',
    subLabel: 'I Come to Lilliput · Part 4',
    openingCue: '“‘The king wants to see me,’ I understood...”',
    src: '/assets/aistudio/Track_05_1731b286.mp3'
  },
  {
    id: 'track-06',
    trackNumber: 6,
    chapterId: 'p1-c2',
    title: 'Track 06 — Part 1, Chapter 2 (1/3)',
    subLabel: 'My Life in Lilliput · Part 1',
    openingCue: '“Early next day I came out of my house and looked round me...”',
    src: '/assets/aistudio/Track_06_e62d5c18.mp3'
  },
  {
    id: 'track-07',
    trackNumber: 7,
    chapterId: 'p1-c2',
    title: 'Track 07 — Part 1, Chapter 2 (2/3)',
    subLabel: 'My Life in Lilliput · Part 2',
    openingCue: '“At this time, I slept on the floor of the church or outside on the ground...”',
    src: '/assets/aistudio/Track_07_5c6c98dd.mp3'
  },
  {
    id: 'track-08',
    trackNumber: 8,
    chapterId: 'p1-c2',
    title: 'Track 08 — Part 1, Chapter 2 (3/3)',
    subLabel: 'My Life in Lilliput · Part 3',
    openingCue: '“‘Now give me those other strange things,’ he shouted...”',
    src: '/assets/aistudio/Track_08_c77da2b7.mp3'
  },
  {
    id: 'track-09',
    trackNumber: 9,
    chapterId: 'p1-c3',
    title: 'Track 09 — Part 1, Chapter 3 (1/3)',
    subLabel: 'I Make War on Blefuscu · Part 1',
    openingCue: '“Reldresal, a great man in Lilliput and a good friend of the king...”',
    src: '/assets/aistudio/Track_09_104dbd8a.mp3'
  },
  {
    id: 'track-10',
    trackNumber: 10,
    chapterId: 'p1-c3',
    title: 'Track 10 — Part 1, Chapter 3 (2/3)',
    subLabel: 'I Make War on Blefuscu · Part 2',
    openingCue: '“The king listened carefully to my words and he was very happy with my plan...”',
    src: '/assets/aistudio/Track_10_2b9e1701.mp3'
  },
  {
    id: 'track-11',
    trackNumber: 11,
    chapterId: 'p1-c3',
    title: 'Track 11 — Part 1, Chapter 3 (3/3)',
    subLabel: 'I Make War on Blefuscu · Part 3',
    openingCue: '“In the end, the men from Blefuscu and the men of Lilliput wrote their names...”',
    src: '/assets/aistudio/Track_11_6034a7dd.mp3'
  },
  {
    id: 'track-12',
    trackNumber: 12,
    chapterId: 'p1-c4',
    title: 'Track 12 — Part 1, Chapter 4 (Complete)',
    subLabel: 'I Come Home Again (From Blefuscu)',
    openingCue: '“Three days later, on the north-east of the island, I saw something in the sea...”',
    src: '/assets/aistudio/Track_12_44e0a554.mp3'
  },
  {
    id: 'track-13',
    trackNumber: 13,
    chapterId: 'p2-c1',
    title: 'Track 13 — Part 2, Chapter 1 (1/4)',
    subLabel: 'I Come to Brobdingnag · Part 1',
    openingCue: '“I was rich after my journey to Lilliput, and I bought a house in England...”',
    src: '/assets/aistudio/Track_13_3c4e583c.mp3'
  },
  {
    id: 'track-14',
    trackNumber: 14,
    chapterId: 'p2-c1',
    title: 'Track 14 — Part 2, Chapter 1 (2/4)',
    subLabel: 'I Come to Brobdingnag · Part 2',
    openingCue: '“A man heard me and looked round. Then this big man saw me in the corn...”',
    src: '/assets/aistudio/Track_14_c7cecd0e.mp3'
  },
  {
    id: 'track-15',
    trackNumber: 15,
    chapterId: 'p2-c1',
    title: 'Track 15 — Part 2, Chapter 1 (3/4)',
    subLabel: 'I Come to Brobdingnag · Part 3',
    openingCue: '“I was now very tired. The farmer’s wife took me to her room...”',
    src: '/assets/aistudio/Track_15_a48ff7e1.mp3'
  },
  {
    id: 'track-16',
    trackNumber: 16,
    chapterId: 'p2-c1',
    title: 'Track 16 — Part 2, Chapter 1 (4/4)',
    subLabel: 'I Come to Brobdingnag · Part 4',
    openingCue: '“The head man of a village came to the farmer’s house because he wanted to see me...”',
    src: '/assets/aistudio/Track_16_275389b9.mp3'
  },
  {
    id: 'track-17',
    trackNumber: 17,
    chapterId: 'p2-c2',
    title: 'Track 17 — Part 2, Chapter 2 (1/4)',
    subLabel: 'I Meet the King and Queen · Part 1',
    openingCue: '“I was very ill now. ‘I think he is going to die,’ said the farmer...”',
    src: '/assets/aistudio/Track_17_a8f304b2.mp3'
  },
  {
    id: 'track-18',
    trackNumber: 18,
    chapterId: 'p2-c2',
    title: 'Track 18 — Part 2, Chapter 2 (2/4)',
    subLabel: 'I Meet the King and Queen · Part 2',
    openingCue: '“I told him about England and the other countries of Europe...”',
    src: '/assets/aistudio/Track_18_668be6f9.mp3'
  },
  {
    id: 'track-19',
    trackNumber: 19,
    chapterId: 'p2-c2',
    title: 'Track 19 — Part 2, Chapter 2 (3/4)',
    subLabel: 'I Meet the King and Queen · Part 3',
    openingCue: '“The king was very interested. He often asked for me...”',
    src: '/assets/aistudio/Track_19_bb76b9d0.mp3'
  },
  {
    id: 'track-20',
    trackNumber: 20,
    chapterId: 'p2-c2',
    title: 'Track 20 — Part 2, Chapter 2 (4/4)',
    subLabel: 'I Meet the King and Queen · Part 4',
    openingCue: '“He did not understand my answers, so I told him other things about my country...”',
    src: '/assets/aistudio/Track_20_028dd56c.mp3'
  },
  {
    id: 'track-21',
    trackNumber: 21,
    chapterId: 'p2-c3',
    title: 'Track 21 — Part 2, Chapter 3 (1/2)',
    subLabel: 'I Come Home Again (Brobdingnag) · Part 1',
    openingCue: '“After two years in the country of Brobdingnag, the king and queen made a journey...”',
    src: '/assets/aistudio/Track_21_257ab7b4.mp3'
  },
  {
    id: 'track-22',
    trackNumber: 22,
    chapterId: 'p2-c3',
    title: 'Track 22 — Part 2, Chapter 3 (2/2)',
    subLabel: 'I Come Home Again (Brobdingnag) · Part 2',
    openingCue: '“One day, I heard a loud noise. Something pulled my box up about a metre...”',
    src: '/assets/aistudio/Track_22_82da39d4.mp3'
  },
  {
    id: 'track-23',
    trackNumber: 23,
    chapterId: 'p3-c1',
    title: 'Track 23 — Part 3, Chapter 1 (1/3)',
    subLabel: 'Houyhnhnms and Yahoos · Part 1 (CD 2)',
    openingCue: '“I stayed in England with my family for some months, but then I wanted to travel again...”',
    src: '/assets/aistudio/Track_23_20dab3dd.mp3'
  },
  {
    id: 'track-24',
    trackNumber: 24,
    chapterId: 'p3-c1',
    title: 'Track 24 — Part 3, Chapter 1 (2/3)',
    subLabel: 'Houyhnhnms and Yahoos · Part 2',
    openingCue: '“Suddenly the animals all ran away quickly. I left the tree and started on the road again...”',
    src: '/assets/aistudio/Track_24_1b97b249.mp3'
  },
  {
    id: 'track-25',
    trackNumber: 25,
    chapterId: 'p3-c1',
    title: 'Track 25 — Part 3, Chapter 1 (3/3)',
    subLabel: 'Houyhnhnms and Yahoos · Part 3',
    openingCue: '“But there were no people in the first room of the house — only horses...”',
    src: '/assets/aistudio/Track_25_d0a86e60.mp3'
  },
  {
    id: 'track-26',
    trackNumber: 26,
    chapterId: 'p3-c2',
    title: 'Track 26 — Part 3, Chapter 2 (1/2)',
    subLabel: 'The Life of the Houyhnhnms · Part 1',
    openingCue: '“I wanted to learn the language of these horses — the Houyhnhnms...”',
    src: '/assets/aistudio/Track_26_7c04b299.mp3'
  },
  {
    id: 'track-27',
    trackNumber: 27,
    chapterId: 'p3-c2',
    title: 'Track 27 — Part 3, Chapter 2 (2/2)',
    subLabel: 'The Life of the Houyhnhnms · Part 2',
    openingCue: '“‘How can you use them in that way?’ asked my owner angrily...”',
    src: '/assets/aistudio/Track_27_967334da.mp3'
  },
  {
    id: 'track-28',
    trackNumber: 28,
    chapterId: 'p3-c3',
    title: 'Track 28 — Part 3, Chapter 3 (1/2)',
    subLabel: 'I Come Home Again (Houyhnhnms) · Part 1',
    openingCue: '“Three years after I arrived in this country, the grey horse came back from a Meeting...”',
    src: '/assets/aistudio/Track_28_4a3baebb.mp3'
  },
  {
    id: 'track-29',
    trackNumber: 29,
    chapterId: 'p3-c3',
    title: 'Track 29 — Part 3, Chapter 3 (2/2)',
    subLabel: 'I Come Home Again (Houyhnhnms) · Part 2',
    openingCue: '“I was on the sea for many days. I wanted to go to India, but I could not find that country...”',
    src: '/assets/aistudio/Track_29_be837be1.mp3'
  }
];
