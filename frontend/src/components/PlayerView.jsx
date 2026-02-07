import { useState, useEffect } from 'react';
import PlayerLobby from './player/PlayerLobby';
import PlayerGame from './player/PlayerGame';
import PlayerLeaderboard from './player/PlayerLeaderboard';

function PlayerView({ socket }) {
  const [gameState, setGameState] = useState('LOBBY');
  const [lobbyData, setLobbyData] = useState({
    players: [],
    availableCharacters: [],
    takenCharacters: {}
  });
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionResults, setQuestionResults] = useState(null);
  const [finalLeaderboard, setFinalLeaderboard] = useState([]);
  const [playerData, setPlayerData] = useState({
    name: '',
    character: null,
    score: 0,
    joined: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    socket.on('lobby-updated', (data) => {
      setLobbyData(data);
    });

    socket.on('character-taken', (data) => {
      setError(`${data.character} is already taken by ${data.takenBy}`);
      setTimeout(() => setError(null), 3000);
    });

    socket.on('game-started', () => {
      setGameState('PLAYING');
      setQuestionResults(null);
    });

    socket.on('new-question', (data) => {
      setCurrentQuestion(data);
      setQuestionResults(null);
    });

    socket.on('question-results', (data) => {
      setQuestionResults(data);
      // Update player score from leaderboard
      const myData = data.leaderboard.find(p => p.socketId === socket.id);
      if (myData) {
        setPlayerData(prev => ({ ...prev, score: myData.score }));
      }
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
      setPlayerData(prev => ({
        ...prev,
        character: null,
        score: 0,
        joined: false
      }));
    });

    socket.on('error', (data) => {
      setError(data.message);
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      socket.off('lobby-updated');
      socket.off('character-taken');
      socket.off('game-started');
      socket.off('new-question');
      socket.off('question-results');
      socket.off('game-ended');
      socket.off('game-reset');
      socket.off('error');
    };
  }, [socket]);

  const handleJoinGame = (name, character) => {
    socket.emit('join-game', { name, character, isAdmin: false });
    setPlayerData(prev => ({ ...prev, name, character, joined: true }));
  };

  const handleAnswerSubmit = (answerIndex) => {
    if (!currentQuestion) return;
    
    socket.emit('answer-submitted', {
      questionId: currentQuestion.questionId,
      answerIndex,
      timestamp: Date.now()
    });
  };

  return (
    <div className="relative z-10">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {error}
        </div>
      )}

      {gameState === 'LOBBY' && (
        <PlayerLobby
          lobbyData={lobbyData}
          playerData={playerData}
          onJoinGame={handleJoinGame}
        />
      )}

      {gameState === 'PLAYING' && (
        <PlayerGame
          currentQuestion={currentQuestion}
          questionResults={questionResults}
          playerData={playerData}
          onAnswerSubmit={handleAnswerSubmit}
          leaderboard={questionResults?.leaderboard || []}
        />
      )}

      {gameState === 'FINISHED' && (
        <PlayerLeaderboard
          leaderboard={finalLeaderboard}
          playerData={playerData}
          socketId={socket.id}
        />
      )}
    </div>
  );
}

export default PlayerView;
