import CharacterAvatar from './CharacterAvatar';

const ALL_CHARACTERS = [
  'SpongeBob SquarePants',
  'Patrick Star',
  'Squidward Tentacles',
  'Sandy Cheeks',
  'Mr. Krabs',
  'Plankton',
  'Gary',
  'Pearl Krabs',
  'Mrs. Puff',
  'Larry the Lobster',
  'Karen',
  'Mermaid Man',
  'Barnacle Boy',
  'Flying Dutchman',
  'King Neptune',
  'Squilliam Fancyson',
  'Bubble Bass',
  'Man Ray',
  'Dirty Bubble',
  'Patchy the Pirate'
];

function CharacterGrid({ availableCharacters, takenCharacters, selectedCharacter, onSelect, isAdmin = false }) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
      {ALL_CHARACTERS.map((character) => {
        const isTaken = takenCharacters[character];
        const isSelected = selectedCharacter === character;
        const isAvailable = availableCharacters.includes(character);

        return (
          <button
            key={character}
            onClick={() => !isTaken && !isAdmin && onSelect(character)}
            disabled={isTaken || isAdmin}
            className={`character-card p-3 rounded-xl flex flex-col items-center transition-all ${
              isSelected
                ? 'selected bg-sponge-yellow/30'
                : isTaken
                ? 'taken bg-gray-600/50'
                : 'bg-ocean-blue/40 hover:bg-ocean-blue/60'
            } ${!isAdmin && !isTaken ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="mb-2">
              <CharacterAvatar character={character} size="lg" />
            </div>
            <span className={`text-xs md:text-sm text-center leading-tight ${
              isTaken ? 'text-gray-400' : 'text-white'
            }`}>
              {character.split(' ')[0]}
            </span>
            {isTaken && (
              <span className="text-xs text-coral mt-1 truncate max-w-full">
                {takenCharacters[character]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default CharacterGrid;
