import CharacterAvatar from '../CharacterAvatar';
import CharacterGrid from '../CharacterGrid';

function AdminLobby({ lobbyData, playerCount, onStartGame, loading }) {
  const canStart = playerCount >= 2;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl text-sponge-yellow drop-shadow-lg mb-2">
            🎮 Admin Control Panel
          </h1>
          <p className="text-xl text-white/80">
            SpongeBob Trivia Game
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-ocean-dark/80 rounded-xl p-4 text-center border-2 border-sponge-yellow/50">
            <p className="text-3xl font-bold text-sponge-yellow">{playerCount}</p>
            <p className="text-white/80 text-sm">Players Ready</p>
          </div>
          <div className="bg-ocean-dark/80 rounded-xl p-4 text-center border-2 border-sponge-yellow/50">
            <p className="text-3xl font-bold text-sponge-yellow">20</p>
            <p className="text-white/80 text-sm">Max Players</p>
          </div>
          <div className="bg-ocean-dark/80 rounded-xl p-4 text-center border-2 border-sponge-yellow/50">
            <p className="text-3xl font-bold text-sponge-yellow">{lobbyData.availableCharacters.length}</p>
            <p className="text-white/80 text-sm">Available Characters</p>
          </div>
          <div className="bg-ocean-dark/80 rounded-xl p-4 text-center border-2 border-sponge-yellow/50">
            <p className="text-3xl font-bold text-sponge-yellow">{Object.keys(lobbyData.takenCharacters).length}</p>
            <p className="text-white/80 text-sm">Taken Characters</p>
          </div>
        </div>

        {/* Start Game Button */}
        <div className="text-center mb-8">
          <button
            onClick={onStartGame}
            disabled={!canStart || loading}
            className={`px-12 py-5 rounded-xl text-2xl font-bold transition-all ${
              canStart && !loading
                ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 cursor-pointer glow-yellow'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            {loading ? '⏳ Starting...' : '🚀 Start Game'}
          </button>
          {!canStart && (
            <p className="text-coral mt-3">Need at least 2 players to start</p>
          )}
        </div>

        {/* Connected Players */}
        <div className="bg-ocean-dark/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border-2 border-sponge-yellow/50">
          <h2 className="text-2xl text-sponge-yellow mb-4">
            Connected Players ({playerCount}/20)
          </h2>
          {playerCount === 0 ? (
            <p className="text-white/60 text-center py-8">
              No players connected yet. Share the game link!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lobbyData.players
                .filter(p => !p.isAdmin && p.character)
                .map((player) => (
                  <div
                    key={player.socketId}
                    className="bg-ocean-blue/40 rounded-xl p-4 flex items-center gap-3"
                  >
                    <CharacterAvatar character={player.character} size="lg" />
                    <div>
                      <p className="text-white font-bold">{player.name}</p>
                      <p className="text-white/60 text-sm">{player.character}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Character Availability */}
        <div className="bg-ocean-dark/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-sponge-yellow/50">
          <h2 className="text-2xl text-sponge-yellow mb-4">
            Character Availability
          </h2>
          <CharacterGrid
            availableCharacters={lobbyData.availableCharacters}
            takenCharacters={lobbyData.takenCharacters}
            selectedCharacter={null}
            onSelect={() => {}}
            isAdmin={true}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminLobby;
