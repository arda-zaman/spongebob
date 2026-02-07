// Character emoji mapping (fallback)
const CHARACTER_EMOJIS = {
  'SpongeBob SquarePants': '🧽',
  'Patrick Star': '⭐',
  'Squidward Tentacles': '🦑',
  'Sandy Cheeks': '🐿️',
  'Mr. Krabs': '🦀',
  'Plankton': '🦠',
  'Gary': '🐌',
  'Pearl Krabs': '🐋',
  'Mrs. Puff': '🐡',
  'Larry the Lobster': '🦞',
  'Karen': '🖥️',
  'Mermaid Man': '🧜‍♂️',
  'Barnacle Boy': '🦸‍♂️',
  'Flying Dutchman': '👻',
  'King Neptune': '🔱',
  'Squilliam Fancyson': '🎩',
  'Bubble Bass': '🐟',
  'Man Ray': '🦹‍♂️',
  'Dirty Bubble': '🫧',
  'Patchy the Pirate': '🏴‍☠️'
};

// Character images (local files in public/characters/)
const CHARACTER_IMAGES = {
  'SpongeBob SquarePants': '/characters/spongebob.webp',
  'Patrick Star': '/characters/patrick.svg',
  'Squidward Tentacles': '/characters/squidward.webp',
  'Sandy Cheeks': '/characters/sandy.webp',
  'Mr. Krabs': '/characters/mrkrabs.webp',
  'Plankton': '/characters/plankton.webp',
  'Gary': '/characters/gary.svg',
  'Pearl Krabs': '/characters/pearl.svg',
  'Mrs. Puff': '/characters/mrspuff.webp',
  'Larry the Lobster': '/characters/larry.webp',
  'Karen': '/characters/karen.svg',
  'Mermaid Man': '/characters/mermaidman.webp',
  'Barnacle Boy': '/characters/barnacleboy.webp',
  'Flying Dutchman': '/characters/flyingdutchman.webp',
  'King Neptune': '/characters/kingneptune.webp',
  'Squilliam Fancyson': '/characters/squilliam.webp',
  'Bubble Bass': '/characters/bubblebass.webp',
  'Man Ray': '/characters/manray.webp',
  'Dirty Bubble': '/characters/dirtybubble.webp',
  'Patchy the Pirate': '/characters/patchy.webp'
};

export function getCharacterEmoji(character) {
  return CHARACTER_EMOJIS[character] || '❓';
}

export function getCharacterImage(character) {
  return CHARACTER_IMAGES[character] || null;
}

export const ALL_CHARACTERS = Object.keys(CHARACTER_EMOJIS);
