import CharacterAvatar from '../CharacterAvatar';

function AdminLeaderboard({ leaderboard, onResetGame, loading }) {
  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl text-sponge-yellow drop-shadow-lg mb-2">
            🏆 Game Over!
          </h1>
          <p className="text-xl text-white/80">
            Final Results
          </p>
        </div>

        {/* Podium */}
        <div className="flex justify-center items-end gap-4 mb-12 h-64">
          {/* 2nd Place */}
          {top3[1] && (
            <div className="flex flex-col items-center">
              <div className="mb-2 flex justify-center">
                <CharacterAvatar character={top3[1].character} size="xl" />
              </div>
              <p className="text-white text-sm mb-2 truncate max-w-24">{top3[1].name}</p>
              <div className="podium-2 w-24 md:w-32 rounded-t-lg flex flex-col items-center justify-start pt-4">
                <span className="text-4xl">🥈</span>
                <p className="text-white font-bold">{top3[1].score}</p>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {top3[0] && (
            <div className="flex flex-col items-center">
              <div className="mb-2 animate-bounce flex justify-center">
                <CharacterAvatar character={top3[0].character} size="2xl" />
              </div>
              <p className="text-sponge-yellow text-lg mb-2 truncate max-w-28">{top3[0].name}</p>
              <div className="podium-1 w-28 md:w-36 rounded-t-lg flex flex-col items-center justify-start pt-4">
                <span className="text-5xl">🥇</span>
                <p className="text-white font-bold text-xl">{top3[0].score}</p>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="flex flex-col items-center">
              <div className="mb-2 flex justify-center">
                <CharacterAvatar character={top3[2].character} size="xl" />
              </div>
              <p className="text-white text-sm mb-2 truncate max-w-24">{top3[2].name}</p>
              <div className="podium-3 w-24 md:w-32 rounded-t-lg flex flex-col items-center justify-start pt-4">
                <span className="text-4xl">🥉</span>
                <p className="text-white font-bold">{top3[2].score}</p>
              </div>
            </div>
          )}
        </div>

        {/* Reset Button */}
        <div className="text-center mb-8">
          <button
            onClick={onResetGame}
            disabled={loading}
            className={`px-12 py-5 rounded-xl text-2xl font-bold transition-all ${
              !loading
                ? 'bg-coral text-white hover:bg-red-500 hover:scale-105 cursor-pointer'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            {loading ? '⏳ Resetting...' : '🔄 Reset Game'}
          </button>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-ocean-dark/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-sponge-yellow/50">
          <h3 className="text-2xl text-sponge-yellow mb-4 text-center">Full Rankings</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {leaderboard.map((player) => (
              <div
                key={player.socketId}
                className="flex items-center gap-4 p-3 rounded-xl bg-ocean-blue/30"
              >
                <span className="text-2xl w-10 text-center">
                  {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
                </span>
                <CharacterAvatar character={player.character} size="md" />
                <div className="flex-1">
                  <p className="text-white font-bold">{player.name}</p>
                  <p className="text-white/60 text-sm">{player.character}</p>
                </div>
                <p className="text-sponge-yellow font-bold text-xl">{player.score}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-ocean-dark/80 rounded-xl p-4 text-center border-2 border-sponge-yellow/50">
            <p className="text-3xl font-bold text-sponge-yellow">{leaderboard.length}</p>
            <p className="text-white/80 text-sm">Total Players</p>
          </div>
          <div className="bg-ocean-dark/80 rounded-xl p-4 text-center border-2 border-sponge-yellow/50">
            <p className="text-3xl font-bold text-sponge-yellow">
              {top3[0]?.score || 0}
            </p>
            <p className="text-white/80 text-sm">Highest Score</p>
          </div>
          <div className="bg-ocean-dark/80 rounded-xl p-4 text-center border-2 border-sponge-yellow/50">
            <p className="text-3xl font-bold text-sponge-yellow">
              {leaderboard.length > 0 
                ? Math.round(leaderboard.reduce((sum, p) => sum + p.score, 0) / leaderboard.length)
                : 0
              }
            </p>
            <p className="text-white/80 text-sm">Average Score</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLeaderboard;
