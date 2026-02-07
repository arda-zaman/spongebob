import { useState } from 'react';
import CharacterGrid from '../CharacterGrid';
import { getCharacterEmoji } from '../../utils/characters';

function PlayerLobby({ lobbyData, playerData, onJoinGame }) {
  const [name, setName] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const handleConfirm = () => {
    if (name.trim() && selectedCharacter) {
      onJoinGame(name.trim(), selectedCharacter);
    }
  };

  const handleCharacterSelect = (character) => {
    if (!lobbyData.takenCharacters[character]) {
      setSelectedCharacter(character);
    }
  };

  if (playerData.joined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-ocean-dark/80 backdrop-blur-sm rounded-3xl p-8 max-w-2xl w-full text-center shadow-2xl border-4 border-sponge-yellow">
          <h1 className="text-4xl text-sponge-yellow mb-6 drop-shadow-lg">
            🍍 Welcome, {playerData.name}!
          </h1>
          
          <div className="bg-ocean-blue/50 rounded-2xl p-6 mb-6">
            <div className="text-8xl mb-4">
              {getCharacterEmoji(playerData.character)}
            </div>
            <p className="text-2xl text-white">
              Playing as <span className="text-sponge-yellow">{playerData.character}</span>
            </p>
          </div>

          <div className="animate-pulse">
            <p className="text-xl text-seafoam">
              ⏳ Waiting for admin to start the game...
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-xl text-white mb-4">Players in Lobby:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {lobbyData.players
                .filter(p => !p.isAdmin && p.character)
                .map((player) => (
                  <div
                    key={player.socketId}
                    className="bg-ocean-blue/60 px-4 py-2 rounded-full flex items-center gap-2"
                  >
                    <span className="text-2xl">{getCharacterEmoji(player.character)}</span>
                    <span className="text-white">{player.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl text-sponge-yellow drop-shadow-lg mb-2">
            🍍 SpongeBob Trivia
          </h1>
          <p className="text-xl text-white/80">
            Choose your character and get ready!
          </p>
        </div>

        {/* Name Input */}
        <div className="bg-ocean-dark/80 backdrop-blur-sm rounded-2xl p-6 mb-6 max-w-md mx-auto border-2 border-sponge-yellow/50">
          <label className="block text-sponge-yellow text-xl mb-3">
            Enter Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name..."
            maxLength={20}
            className="w-full px-4 py-3 rounded-xl bg-ocean-blue/50 text-white text-lg placeholder-white/50 border-2 border-transparent focus:border-sponge-yellow focus:outline-none transition-all"
          />
        </div>

        {/* Character Selection */}
        <div className="bg-ocean-dark/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border-2 border-sponge-yellow/50">
          <h2 className="text-2xl text-sponge-yellow mb-4 text-center">
            Select Your Character
          </h2>
          <CharacterGrid
            availableCharacters={lobbyData.availableCharacters}
            takenCharacters={lobbyData.takenCharacters}
            selectedCharacter={selectedCharacter}
            onSelect={handleCharacterSelect}
          />
        </div>

        {/* Selected Character Preview & Confirm */}
        {selectedCharacter && (
          <div className="bg-ocean-dark/80 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto text-center border-2 border-sponge-yellow">
            <div className="text-6xl mb-3">
              {getCharacterEmoji(selectedCharacter)}
            </div>
            <p className="text-xl text-white mb-4">
              Selected: <span className="text-sponge-yellow">{selectedCharacter}</span>
            </p>
            <button
              onClick={handleConfirm}
              disabled={!name.trim()}
              className={`px-8 py-4 rounded-xl text-xl font-bold transition-all ${
                name.trim()
                  ? 'bg-sponge-yellow text-ocean-dark hover:bg-yellow-300 hover:scale-105 cursor-pointer'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              🎮 Confirm Selection
            </button>
          </div>
        )}

        {/* Players in Lobby */}
        {lobbyData.players.filter(p => !p.isAdmin && p.character).length > 0 && (
          <div className="mt-8 text-center">
            <h3 className="text-xl text-white mb-4">
              Players Ready ({lobbyData.players.filter(p => !p.isAdmin && p.character).length}/20)
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {lobbyData.players
                .filter(p => !p.isAdmin && p.character)
                .map((player) => (
                  <div
                    key={player.socketId}
                    className="bg-ocean-blue/60 px-4 py-2 rounded-full flex items-center gap-2"
                  >
                    <span className="text-2xl">{getCharacterEmoji(player.character)}</span>
                    <span className="text-white">{player.name}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerLobby;
