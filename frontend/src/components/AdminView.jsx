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

  return (
    <div className="relative z-10">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {error}
        </div>
      )}

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
