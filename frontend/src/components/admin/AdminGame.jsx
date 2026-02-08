import { useState, useEffect } from 'react';
import CharacterAvatar from '../CharacterAvatar';

function AdminGame({ currentQuestion, questionResults, playerAnswers, lobbyData }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (timeLeft > 0 && !questionResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 0.1));
      }, 100);
      return () => clearInterval(timer);
    }
  }, [timeLeft, questionResults]);

  const timerPercentage = currentQuestion ? (timeLeft / currentQuestion.timeLimit) * 100 : 0;
  const timerColor = timerPercentage > 50 ? 'bg-green-500' : timerPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500';

  const totalPlayers = lobbyData.players.filter(p => !p.isAdmin && p.character).length;
  const answeredCount = playerAnswers.length;

  // Build leaderboard from results or current state
  const leaderboard = questionResults?.leaderboard || [];

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🎮</div>
          <p className="text-2xl text-sponge-yellow">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-ocean-dark/80 px-4 py-2 rounded-xl">
            <p className="text-white text-sm">Admin Monitor</p>
            <p className="text-sponge-yellow font-bold">🎮 Game in Progress</p>
          </div>
          
          <div className="bg-ocean-dark/80 px-4 py-2 rounded-xl">
            <p className="text-white text-sm">Question</p>
            <p className="text-sponge-yellow font-bold text-xl">
              {currentQuestion.questionNumber}/{currentQuestion.totalQuestions}
            </p>
          </div>

          <div className="bg-ocean-dark/80 px-4 py-2 rounded-xl">
            <p className="text-white text-sm">Answers</p>
            <p className="text-sponge-yellow font-bold text-xl">
              {answeredCount}/{totalPlayers}
            </p>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="bg-ocean-dark/60 rounded-full h-6 mb-6 overflow-hidden">
          <div
            className={`timer-bar h-full ${timerColor} rounded-full flex items-center justify-end pr-2`}
            style={{ 
              width: `${timerPercentage}%`,
              transitionDuration: '100ms'
            }}
          >
            <span className="text-white text-sm font-bold">{Math.ceil(timeLeft)}s</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question & Answers */}
          <div className="lg:col-span-2">
            {/* Question */}
            <div className="bg-ocean-dark/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border-2 border-sponge-yellow/50">
              <h2 className="text-2xl text-white text-center leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {currentQuestion.options.map((option, index) => {
                const answerCount = playerAnswers.filter(a => a.answerIndex === index).length;
                const isCorrect = questionResults && index === questionResults.correctAnswer;
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl text-white font-bold transition-all ${
                      questionResults
                        ? isCorrect
                          ? 'bg-green-500/80 border-2 border-green-400'
                          : 'bg-ocean-blue/40 opacity-60'
                        : 'bg-ocean-blue/60'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-red-600 text-white font-bold text-sm leading-none flex-shrink-0">
                          {['A', 'B', 'C', 'D'][index]}
                        </span>
                        {option}
                      </span>
                      <span className="bg-ocean-dark/50 px-2 py-1 rounded text-sm">
                        {answerCount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Answer Feed */}
            <div className="bg-ocean-dark/80 backdrop-blur-sm rounded-2xl p-4 border-2 border-sponge-yellow/50">
              <h3 className="text-sponge-yellow mb-3">Live Answers</h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {playerAnswers.length === 0 ? (
                  <p className="text-white/60 text-center py-4">Waiting for answers...</p>
                ) : (
                  playerAnswers.map((answer, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-ocean-blue/30 p-2 rounded-lg"
                    >
                      <CharacterAvatar character={answer.character} size="sm" />
                      <span className="text-white flex-1">{answer.playerName}</span>
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-red-600 text-white font-bold text-xs leading-none flex-shrink-0">
                        {['A', 'B', 'C', 'D'][answer.answerIndex]}
                      </span>
                      <span className="text-white/60 text-sm">
                        {(answer.answerTime / 1000).toFixed(1)}s
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard Sidebar */}
          <div className="bg-ocean-dark/80 backdrop-blur-sm rounded-2xl p-4 border-2 border-sponge-yellow/50 h-fit">
            <h3 className="text-sponge-yellow text-xl mb-4 text-center">Leaderboard</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {leaderboard.length === 0 ? (
                <p className="text-white/60 text-center py-4">Scores will appear after first question</p>
              ) : (
                leaderboard.map((player) => (
                  <div
                    key={player.socketId}
                    className="flex items-center gap-2 bg-ocean-blue/30 p-2 rounded-lg"
                  >
                    <span className="text-lg w-8">
                      {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
                    </span>
                    <CharacterAvatar character={player.character} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{player.name}</p>
                    </div>
                    <p className="text-sponge-yellow font-bold">{player.score}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Results Banner */}
        {questionResults && (
          <div className="mt-6 bg-green-500/20 border-2 border-green-500 rounded-2xl p-4 text-center">
            <p className="text-green-400 text-xl">
              ✅ Question Complete! Correct answer: {currentQuestion.options[questionResults.correctAnswer]}
            </p>
            <p className="text-white/80 mt-2">Next question coming up...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminGame;
