export interface ZeldaGame {
  id: string;
  title: string;
  year: number;
  platform: string;
  era: string;
  timeline: "adult" | "child" | "fallen" | "origin";
  rating: number;
  description: string;
  coverColor: string;
}

export interface ZeldaCharacter {
  id: string;
  name: string;
  role: string;
  description: string;
  spoilerInfo: string;
  color: string;
}

export interface ZeldaItem {
  id: string;
  name: string;
  rarity: "legendary" | "epic" | "rare" | "common";
  description: string;
  games: string[];
}

export interface TimelineBranch {
  name: string;
  games: string[];
  description: string;
}

export const ZELDA_GAMES: ZeldaGame[] = [
  {
    id: "skyward-sword",
    title: "Skyward Sword",
    year: 2011,
    platform: "Wii / Switch",
    era: "origin",
    timeline: "origin",
    rating: 9,
    description:
      "The origin of the legend. Link lives in Skyloft, a city floating above the clouds, until a mysterious tornado separates him from Zelda. The first game chronologically, establishing the eternal cycle of Ganon, Zelda, and Link.",
    coverColor: "#2d6a4f",
  },
  {
    id: "ocarina-of-time",
    title: "Ocarina of Time",
    year: 1998,
    platform: "N64 / 3DS",
    era: "n64",
    timeline: "origin",
    rating: 10,
    description:
      "The game that defined 3D action-adventure. Young Link must travel through time to defeat Ganondorf, wielding the legendary Ocarina to manipulate melodies that shape reality. The timeline splits at its conclusion.",
    coverColor: "#1a5c3a",
  },
  {
    id: "majoras-mask",
    title: "Majora's Mask",
    year: 2000,
    platform: "N64 / 3DS",
    era: "n64",
    timeline: "child",
    rating: 10,
    description:
      "A haunting sequel set in Termina, a parallel world threatened by a falling moon. Link has only 3 days to prevent apocalypse, reliving them endlessly. One of the darkest, most emotionally resonant games in the series.",
    coverColor: "#4a1942",
  },
  {
    id: "wind-waker",
    title: "The Wind Waker",
    year: 2002,
    platform: "GameCube / Wii U",
    era: "gamecube",
    timeline: "adult",
    rating: 9,
    description:
      "Centuries after Ganon's defeat, Hyrule is buried under a vast ocean. A young boy on Outset Island must sail the Great Sea to rescue his sister and confront a resurgent evil. Cel-shaded art that aged beautifully.",
    coverColor: "#1e3a5f",
  },
  {
    id: "twilight-princess",
    title: "Twilight Princess",
    year: 2006,
    platform: "Wii / GameCube",
    era: "gamecube",
    timeline: "child",
    rating: 9,
    description:
      "Hyrule is consumed by a realm of twilight. Link transforms into a wolf to traverse this shadowy world alongside the mysterious imp Midna. A dark, epic adventure with one of the most beloved companions in Zelda history.",
    coverColor: "#1a2040",
  },
  {
    id: "minish-cap",
    title: "The Minish Cap",
    year: 2004,
    platform: "GBA",
    era: "handheld",
    timeline: "child",
    rating: 8,
    description:
      "Link wears a magical talking cap named Ezlo that can shrink him to the size of the Minish, tiny creatures invisible to humans. A charming handheld adventure that reveals the origin of the Four Sword.",
    coverColor: "#3d6b21",
  },
  {
    id: "four-swords-adventures",
    title: "Four Swords Adventures",
    year: 2004,
    platform: "GBA / GameCube",
    era: "handheld",
    timeline: "child",
    rating: 7,
    description:
      "Link is split into four colored versions of himself to battle the dark Gerudo sorcerer Vaati. A unique multiplayer experience with a surprisingly dark narrative twist at the end.",
    coverColor: "#1e5c8c",
  },
  {
    id: "tri-force-heroes",
    title: "Tri Force Heroes",
    year: 2015,
    platform: "3DS",
    era: "handheld",
    timeline: "child",
    rating: 7,
    description:
      "Three Links must cooperate to solve puzzle-filled dungeons in the fashion-obsessed kingdom of Hytopia. A cooperative multiplayer adventure that emphasizes teamwork and creative problem-solving.",
    coverColor: "#5c3a1e",
  },
  {
    id: "a-link-to-the-past",
    title: "A Link to the Past",
    year: 1991,
    platform: "SNES / GBA",
    era: "classic",
    timeline: "fallen",
    rating: 10,
    description:
      "The definitive 2D Zelda. A young boy discovers he is descended from the Knights of Hyrule and must traverse both the Light World and the corrupted Dark World to defeat the Dark Wizard Agahnim and Ganon.",
    coverColor: "#2d1b69",
  },
  {
    id: "links-awakening",
    title: "Link's Awakening",
    year: 1993,
    platform: "GB / Switch",
    era: "handheld",
    timeline: "adult",
    rating: 9,
    description:
      "Shipwrecked on Koholint Island, Link must awaken the sleeping Wind Fish to escape. A dreamlike adventure full of Nintendo crossovers and a surprisingly emotional conclusion.",
    coverColor: "#1a4060",
  },
  {
    id: "oracle-of-ages",
    title: "Oracle of Ages",
    year: 2001,
    platform: "GBC",
    era: "handheld",
    timeline: "adult",
    rating: 8,
    description:
      "Link travels to Labrynna where he must use the Harp of Ages to manipulate time and rescue the Oracle of Ages, Nayru. A puzzle-focused companion game that can be linked with Oracle of Seasons.",
    coverColor: "#1a1a6e",
  },
  {
    id: "oracle-of-seasons",
    title: "Oracle of Seasons",
    year: 2001,
    platform: "GBC",
    era: "handheld",
    timeline: "adult",
    rating: 8,
    description:
      "Link arrives in Holodrum where the Oracle of Seasons, Din, has been kidnapped. Using the Rod of Seasons to shift between spring, summer, autumn, and winter, Link must restore balance to the land.",
    coverColor: "#5c2d0a",
  },
  {
    id: "a-link-between-worlds",
    title: "A Link Between Worlds",
    year: 2013,
    platform: "3DS",
    era: "handheld",
    timeline: "fallen",
    rating: 9,
    description:
      "A spiritual successor to A Link to the Past in the same overworld. Link gains the ability to merge into walls as a living painting to navigate dungeons and defeat the sorcerer Yuga, who kidnaps Sages.",
    coverColor: "#4a1942",
  },
  {
    id: "the-legend-of-zelda",
    title: "The Legend of Zelda",
    year: 1986,
    platform: "NES / Various",
    era: "classic",
    timeline: "fallen",
    rating: 9,
    description:
      "The original. Link explores Hyrule's nine dungeons to collect the Triforce of Wisdom and rescue Princess Zelda from Ganon. The game that launched a legend and defined the action-adventure genre.",
    coverColor: "#2d6a10",
  },
  {
    id: "zelda-ii",
    title: "Zelda II: The Adventure of Link",
    year: 1987,
    platform: "NES / Various",
    era: "classic",
    timeline: "fallen",
    rating: 7,
    description:
      "The black sheep of the series — a side-scrolling RPG where Link must place crystals in six palaces to awaken the sleeping princess Zelda. Notorious difficulty and XP systems make it unique in the franchise.",
    coverColor: "#6e1a1a",
  },
  {
    id: "phantom-hourglass",
    title: "Phantom Hourglass",
    year: 2007,
    platform: "DS",
    era: "handheld",
    timeline: "adult",
    rating: 8,
    description:
      "A direct sequel to Wind Waker. Link pursues the Ghost Ship across a phantom ocean, guided by the fairy Ciela. A touch-screen adventure that innovated DS controls for navigation and combat.",
    coverColor: "#1e4f6b",
  },
  {
    id: "spirit-tracks",
    title: "Spirit Tracks",
    year: 2009,
    platform: "DS",
    era: "handheld",
    timeline: "adult",
    rating: 8,
    description:
      "Set a century after Phantom Hourglass in New Hyrule. Link is a railroad engineer who must travel with Zelda's spirit (possessing Phantom Guardians) to restore the Tower of Spirits and defeat Malladus.",
    coverColor: "#1a3d5c",
  },
  {
    id: "breath-of-the-wild",
    title: "Breath of the Wild",
    year: 2017,
    platform: "Switch / Wii U",
    era: "switch",
    timeline: "fallen",
    rating: 10,
    description:
      "A revolution in open-world design. Link awakens after 100 years to a Hyrule devastated by Calamity Ganon. With total freedom to explore and a physics-driven world, BotW redefined what Zelda could be.",
    coverColor: "#1a5c3a",
  },
  {
    id: "tears-of-the-kingdom",
    title: "Tears of the Kingdom",
    year: 2023,
    platform: "Switch",
    era: "switch",
    timeline: "fallen",
    rating: 10,
    description:
      "The direct sequel to Breath of the Wild. Ancient ruins rise into the sky as Ganondorf is resurrected. Link gains new Sheikah-like abilities — Ultrahand, Fuse, Ascend, and Recall — to build, climb, and explore a vertical Hyrule.",
    coverColor: "#3a1a5c",
  },
];

export const ZELDA_CHARACTERS: ZeldaCharacter[] = [
  {
    id: "link",
    name: "Link",
    role: "Hero of Hyrule",
    description:
      "The eternal hero reincarnated across centuries. A courageous young man chosen by the Triforce of Courage to defend Hyrule. Though often silent, his resolve and compassion define him as Hyrule's greatest champion.",
    spoilerInfo:
      "In Breath of the Wild, Link is a former knight who sacrificed himself to protect Zelda and slept for 100 years while she held Calamity Ganon alone. His memories, scattered across Hyrule, reveal their bond.",
    color: "#2d6a4f",
  },
  {
    id: "zelda",
    name: "Princess Zelda",
    role: "Princess of Hyrule",
    description:
      "Bearer of the Triforce of Wisdom and the embodiment of the goddess Hylia reincarnated. Zelda is a scholar, leader, and powerful wielder of sacred magic who is instrumental in defeating Ganon in every era.",
    spoilerInfo:
      "In Tears of the Kingdom, Zelda sacrifices herself to become the Light Dragon, her body transformed over millennia to preserve the Master Sword. Link's quest ultimately restores her to human form.",
    color: "#5c3a1e",
  },
  {
    id: "ganondorf",
    name: "Ganondorf",
    role: "King of Evil",
    description:
      "The Gerudo King who obtained the Triforce of Power and transformed into Ganon, the Demon King. Driven by insatiable ambition and hatred for the gods, he has terrorized Hyrule across countless incarnations.",
    spoilerInfo:
      "In Tears of the Kingdom, Ganondorf is the ancient Gerudo King discovered beneath Hyrule Castle. He consumed a Secret Stone to become the Demon Dragon, requiring Link to fight him above the clouds.",
    color: "#4a1942",
  },
  {
    id: "midna",
    name: "Midna",
    role: "Twilight Princess",
    description:
      "The impish ruler of the Twilight Realm who accompanies Link throughout Twilight Princess. Sardonic and mysterious at first, she reveals a fierce loyalty and sacrifice that makes her one of the series' greatest characters.",
    spoilerInfo:
      "Midna was cursed into imp form by Zant, who usurped her throne. After Ganon's defeat she destroys the Mirror of Twilight to separate the two worlds, departing forever with the words 'See you later.'",
    color: "#1a2040",
  },
  {
    id: "sheik",
    name: "Sheik",
    role: "Sheikah Warrior",
    description:
      "A mysterious masked Sheikah who guides Link in Ocarina of Time, teaching him melodies and wisdom. Sheik appears at crucial moments throughout the Sacred Realm's temples, always vanishing before questions are answered.",
    spoilerInfo:
      "Sheik is Princess Zelda herself, transformed using the power of the Triforce of Wisdom to hide her identity from Ganondorf during the seven years Link slept. One of gaming's most iconic reveals.",
    color: "#1e3a5f",
  },
  {
    id: "impa",
    name: "Impa",
    role: "Sheikah Sage",
    description:
      "The loyal Sheikah guardian of the Royal Family of Hyrule. A powerful warrior and sage who appears across multiple eras, always serving as protector, teacher, and keeper of ancient secrets.",
    spoilerInfo:
      "In Skyward Sword, the ancient Impa Link meets in the past is revealed to be the same elderly woman who guided Zelda. She waited millennia for Link to complete his quest before finally fading away.",
    color: "#3d0a0a",
  },
  {
    id: "fi",
    name: "Fi",
    role: "Spirit of the Master Sword",
    description:
      "The spirit within the Goddess Sword, created by Hylia to guide her chosen hero. Analytical and formal, Fi speaks in probabilities and data, but her farewell at the end of Skyward Sword is deeply moving.",
    spoilerInfo:
      "After helping Link defeat Demise, Fi enters an eternal slumber within the Master Sword. She is implied to be the spirit Link senses throughout his adventures — the 'Master Sword' calling to him across time.",
    color: "#1a3d6b",
  },
  {
    id: "navi",
    name: "Navi",
    role: "Fairy Companion",
    description:
      "The fairy companion assigned to Link by the Great Deku Tree in Ocarina of Time. Navi guides Link, provides hints, and can lock onto enemies — her enthusiastic 'Hey! Listen!' became one of gaming's most famous catchphrases.",
    spoilerInfo:
      "At the end of Ocarina of Time, Navi silently departs while Link sleeps, suggesting her purpose was fulfilled. Link's search for her in Majora's Mask is implied to be the motivation for leaving Hyrule.",
    color: "#4dfff0",
  },
];

export const ZELDA_ITEMS: ZeldaItem[] = [
  {
    id: "master-sword",
    name: "Master Sword",
    rarity: "legendary",
    description:
      "The Blade of Evil's Bane and the only sword that can truly defeat Ganon. Forged by the goddess Hylia and empowered by the Triforce, only a true hero with a pure heart can wield it. It sleeps in the Korok Forest, waiting.",
    games: [
      "a-link-to-the-past",
      "ocarina-of-time",
      "wind-waker",
      "twilight-princess",
      "skyward-sword",
      "a-link-between-worlds",
      "breath-of-the-wild",
      "tears-of-the-kingdom",
    ],
  },
  {
    id: "triforce",
    name: "Triforce",
    rarity: "legendary",
    description:
      "The sacred relic left by the three goddesses — Din, Nayru, and Farore — when they departed Hyrule. Composed of three golden triangles representing Power, Wisdom, and Courage, it grants any wish to whoever grasps it.",
    games: [
      "the-legend-of-zelda",
      "zelda-ii",
      "a-link-to-the-past",
      "ocarina-of-time",
      "wind-waker",
      "twilight-princess",
      "breath-of-the-wild",
    ],
  },
  {
    id: "ocarina-of-time-item",
    name: "Ocarina of Time",
    rarity: "legendary",
    description:
      "An ancient instrument passed down through the Royal Family of Hyrule. When played with the proper melodies, it can warp time and space, open sacred seals, and even control the flow of time itself.",
    games: ["ocarina-of-time", "majoras-mask"],
  },
  {
    id: "hookshot",
    name: "Hookshot",
    rarity: "rare",
    description:
      "A retractable grappling hook that extends to latch onto targets, pulling Link toward them or dragging items back. An essential dungeon tool for crossing gaps, stunning enemies, and reaching otherwise inaccessible areas.",
    games: [
      "a-link-to-the-past",
      "links-awakening",
      "ocarina-of-time",
      "majoras-mask",
      "wind-waker",
      "twilight-princess",
      "phantom-hourglass",
    ],
  },
  {
    id: "sheikah-slate",
    name: "Sheikah Slate",
    rarity: "epic",
    description:
      "An ancient tablet created by the Sheikah that serves as Link's primary tool in the open world. Contains Magnesis, Stasis, Cryonis, Bombs, and the Camera rune, enabling creative interaction with the physics-driven environment.",
    games: ["breath-of-the-wild"],
  },
  {
    id: "ultrahand",
    name: "Ultrahand",
    rarity: "epic",
    description:
      "A power born from the ancient Zonai that allows Link to grab, move, rotate, and connect objects at a distance. Combined with Fuse and Ascend, it enables virtually unlimited building and problem-solving creativity.",
    games: ["tears-of-the-kingdom"],
  },
  {
    id: "bow-of-light",
    name: "Bow of Light",
    rarity: "legendary",
    description:
      "A sacred bow that fires arrows of pure light energy. Given to Link by Zelda at the final battle, its arrows of light are the only weapons capable of harming Calamity Ganon in his final, spectral form.",
    games: ["breath-of-the-wild"],
  },
  {
    id: "mirror-of-twilight",
    name: "Mirror of Twilight",
    rarity: "epic",
    description:
      "The only gateway between Hyrule and the Twilight Realm. Created by the sages and shattered by Midna at the end of Twilight Princess to forever seal the barrier between the two worlds.",
    games: ["twilight-princess"],
  },
  {
    id: "wind-waker-baton",
    name: "Wind Waker",
    rarity: "rare",
    description:
      "A baton passed down through the lineage of the ancient sage Molgera. When Link conducts with it, he can command the winds to change direction, call storms, and activate ancient Triforce pedestals across the Great Sea.",
    games: ["wind-waker", "phantom-hourglass"],
  },
  {
    id: "bombs",
    name: "Bombs",
    rarity: "common",
    description:
      "Explosive devices found throughout Hyrule. From the round classic bombs to the square Remote Bombs of the Sheikah Slate, they solve puzzles, destroy cracked walls, and damage enemies across the entire series.",
    games: [
      "the-legend-of-zelda",
      "a-link-to-the-past",
      "ocarina-of-time",
      "majoras-mask",
      "wind-waker",
      "twilight-princess",
      "breath-of-the-wild",
      "tears-of-the-kingdom",
    ],
  },
];

export const TIMELINE_BRANCHES: Record<string, TimelineBranch> = {
  origin: {
    name: "Before the Split",
    games: ["skyward-sword", "ocarina-of-time"],
    description:
      "The origin of the legend. Skyward Sword establishes the cycle of reincarnation and the first Triforce. Ocarina of Time is the fulcrum of all Zelda history — its three possible outcomes split into three separate timelines.",
  },
  adult: {
    name: "Adult / Hero Succeeds (Adult)",
    games: [
      "wind-waker",
      "phantom-hourglass",
      "spirit-tracks",
      "links-awakening",
      "oracle-of-ages",
      "oracle-of-seasons",
    ],
    description:
      "Adult Link defeats Ganondorf and is sent back to his childhood by Zelda. In this branch, the future without Link results in a great flood — the gods drown Hyrule to stop a resurgent Ganon, creating the Great Sea of Wind Waker.",
  },
  child: {
    name: "Child / Hero Succeeds (Child)",
    games: [
      "majoras-mask",
      "twilight-princess",
      "four-swords-adventures",
      "minish-cap",
      "tri-force-heroes",
    ],
    description:
      "Young Link is sent back to his childhood with knowledge of the future. He warns the Royal Family of Ganondorf's treachery, leading to the Gerudo King's execution. Majora's Mask follows immediately after Ocarina in this branch.",
  },
  fallen: {
    name: "Fallen Hero / Downfall Timeline",
    games: [
      "a-link-to-the-past",
      "a-link-between-worlds",
      "the-legend-of-zelda",
      "zelda-ii",
      "breath-of-the-wild",
      "tears-of-the-kingdom",
    ],
    description:
      "The most controversial branch — the timeline where Link fails to defeat Ganondorf in Ocarina of Time. Ganon seizes the Triforce, the sages seal him away, and the Imprisoning War begins. A Link to the Past follows centuries later.",
  },
};
