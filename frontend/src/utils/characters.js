// Character emoji mapping
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

export function getCharacterEmoji(character) {
  return CHARACTER_EMOJIS[character] || '❓';
}

export const ALL_CHARACTERS = Object.keys(CHARACTER_EMOJIS);
