import { useState, useEffect } from 'react';
import AdminLobby from './admin/AdminLobby';
import AdminGame from './admin/AdminGame';
import AdminLeaderboard from './admin/AdminLeaderboard';

function AdminView({ socket }) {
  const [gameState, setGameState] = useState('LOBBY');
  const [lobbyData, setLobbyData] = useState({
    players: [],
    availableCharacters: [],
    takenCharacters: {}
  });
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionResults, setQuestionResults] = useState(null);
  const [finalLeaderboard, setFinalLeaderboard] = useState([]);
  const [playerAnswers, setPlayerAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Join as admin
    socket.emit('join-game', { name: 'Admin', character: null, isAdmin: true });

    socket.on('lobby-updated', (data) => {
      setLobbyData(data);
    });

    socket.on('game-started', () => {
      setGameState('PLAYING');
      setQuestionResults(null);
      setPlayerAnswers([]);
    });

    socket.on('new-question', (data) => {
      setCurrentQuestion(data);
      setQuestionResults(null);
      setPlayerAnswers([]);
    });

    socket.on('player-answered', (data) => {
      setPlayerAnswers(prev => [...prev, data]);
    });

    socket.on('question-results', (data) => {
      setQuestionResults(data);
    });

    socket.on('game-ended', (data) => {
      setGameState('FINISHED');
      setFinalLeaderboard(data.finalLeaderboard);
    });

    socket.on('game-reset', () => {
      setGameState('LOBBY');
      setCurrentQuestion(null);
      setQuestionResults(null);
      setFinalLeaderboard([]);
      setPlayerAnswers([]);
    });

    return () => {
      socket.off('lobby-updated');
      socket.off('game-started');
      socket.off('new-question');
      socket.off('player-answered');
      socket.off('question-results');
      socket.off('game-ended');
      socket.off('game-reset');
    };
  }, [socket]);

  const handleStartGame = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/start-game', {
        method: 'POST'
      });
      const data = await response.json();
      if (!data.success) {
        setError(data.message);
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError('Failed to start game');
      setTimeout(() => setError(null), 3000);
    }
    setLoading(false);
  };

  const handleResetGame = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/reset-game', {
        method: 'POST'
      });
      const data = await response.json();
      if (!data.success) {
        setError(data.message);
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError('Failed to reset game');
      setTimeout(() => setError(null), 3000);
    }
    setLoading(false);
  };

  const playerCount = lobbyData.players.filter(p => !p.isAdmin && p.character).length;
  const canStart = playerCount >= 2;

  return (
    <div className="relative z-10">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {error}
        </div>
      )}

      {/* Persistent Admin Control Bar */}
      <div className="sticky top-0 z-40 bg-ocean-dark/90 backdrop-blur-sm border-b-2 border-sponge-yellow/30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sponge-yellow font-bold text-sm uppercase tracking-wider">
              {gameState === 'LOBBY' ? '⏳ Lobby' : gameState === 'PLAYING' ? '🎮 In Game' : '🏆 Finished'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartGame}
              disabled={!canStart || loading}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                canStart && !loading
                  ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? '⏳ Starting...' : '🚀 Start Game'}
            </button>
            <button
              onClick={handleResetGame}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                !loading
                  ? 'bg-coral text-white hover:bg-red-500 hover:scale-105 cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? '⏳ Resetting...' : '🔄 Reset Game'}
            </button>
          </div>
        </div>
      </div>

      {gameState === 'LOBBY' && (
        <AdminLobby
          lobbyData={lobbyData}
          playerCount={playerCount}
          onStartGame={handleStartGame}
          loading={loading}
        />
      )}

      {gameState === 'PLAYING' && (
        <AdminGame
          currentQuestion={currentQuestion}
          questionResults={questionResults}
          playerAnswers={playerAnswers}
          lobbyData={lobbyData}
        />
      )}

      {gameState === 'FINISHED' && (
        <AdminLeaderboard
          leaderboard={finalLeaderboard}
          onResetGame={handleResetGame}
          loading={loading}
        />
      )}
    </div>
  );
}

export default AdminView;
