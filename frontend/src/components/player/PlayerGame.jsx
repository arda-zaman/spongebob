import { useState, useEffect } from 'react';
import CharacterAvatar from '../CharacterAvatar';

function PlayerGame({ currentQuestion, questionResults, playerData, onAnswerSubmit, leaderboard }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit);
      setSelectedAnswer(null);
      setAnswered(false);
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

  const handleAnswerClick = (index) => {
    if (answered || questionResults) return;
    
    setSelectedAnswer(index);
    setAnswered(true);
    onAnswerSubmit(index);
  };

  const getAnswerClass = (index) => {
    let classes = 'answer-option p-4 md:p-6 rounded-xl cursor-pointer text-lg md:text-xl text-white font-bold transition-all ';
    
    if (questionResults) {
      if (index === questionResults.correctAnswer) {
        classes += 'correct ';
      } else if (index === selectedAnswer && index !== questionResults.correctAnswer) {
        classes += 'incorrect ';
      } else {
        classes += 'bg-ocean-blue/60 opacity-50 ';
      }
    } else if (index === selectedAnswer) {
      classes += 'selected bg-sponge-yellow/80 text-ocean-dark ';
    } else if (answered) {
      classes += 'bg-ocean-blue/40 opacity-50 disabled ';
    } else {
      classes += 'bg-ocean-blue/60 hover:bg-ocean-blue/80 ';
    }
    
    return classes;
  };

  const timerPercentage = currentQuestion ? (timeLeft / currentQuestion.timeLimit) * 100 : 0;
  const timerColor = timerPercentage > 50 ? 'bg-green-500' : timerPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500';

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🍍</div>
          <p className="text-2xl text-sponge-yellow">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with score and character */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 bg-ocean-dark/80 px-4 py-2 rounded-xl">
            <CharacterAvatar character={playerData.character} size="md" />
            <div>
              <p className="text-white text-sm">{playerData.name}</p>
              <p className="text-sponge-yellow font-bold">Score: {playerData.score}</p>
            </div>
          </div>
          
          <div className="bg-ocean-dark/80 px-4 py-2 rounded-xl">
            <p className="text-white text-sm">Question</p>
            <p className="text-sponge-yellow font-bold text-xl">
              {currentQuestion.questionNumber}/{currentQuestion.totalQuestions}
            </p>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="bg-ocean-dark/60 rounded-full h-4 mb-6 overflow-hidden">
          <div
            className={`timer-bar h-full ${timerColor} rounded-full`}
            style={{ 
              width: `${timerPercentage}%`,
              transitionDuration: '100ms'
            }}
          />
        </div>

        {/* Question */}
        <div className="bg-ocean-dark/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-6 border-2 border-sponge-yellow/50">
          <h2 className="text-2xl md:text-3xl text-white text-center leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={answered || !!questionResults}
              className={getAnswerClass(index)}
            >
              <span className="mr-3 text-2xl">
                {['🅰️', '🅱️', '©️', '🅳'][index]}
              </span>
              {option}
            </button>
          ))}
        </div>

        {/* Results Feedback */}
        {questionResults && (
          <div className="bg-ocean-dark/80 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-sponge-yellow animate-pulse">
            {selectedAnswer === questionResults.correctAnswer ? (
              <div>
                <span className="text-6xl">🎉</span>
                <p className="text-2xl text-green-400 mt-2">Correct!</p>
              </div>
            ) : selectedAnswer !== null ? (
              <div>
                <span className="text-6xl">😅</span>
                <p className="text-2xl text-red-400 mt-2">Wrong!</p>
              </div>
            ) : (
              <div>
                <span className="text-6xl">⏰</span>
                <p className="text-2xl text-yellow-400 mt-2">Time's up!</p>
              </div>
            )}
            <p className="text-white mt-2">Next question coming up...</p>
          </div>
        )}

        {/* Mini Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-ocean-dark/90 rounded-xl p-4 w-48 hidden lg:block">
            <h3 className="text-sponge-yellow text-sm mb-3 text-center">Top 3</h3>
            {leaderboard.slice(0, 3).map((player, index) => (
              <div
                key={player.socketId}
                className="flex items-center gap-2 mb-2 text-sm"
              >
                <span className="text-lg">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </span>
                <CharacterAvatar character={player.character} size="xs" />
                <div className="flex-1 truncate">
                  <p className="text-white truncate">{player.name}</p>
                  <p className="text-sponge-yellow text-xs">{player.score} pts</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerGame;
