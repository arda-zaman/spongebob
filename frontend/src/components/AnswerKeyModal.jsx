import { useState } from 'react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

function AnswerKeyModal({ answerKey }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!answerKey || answerKey.length === 0) return null;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-8 py-4 rounded-xl text-lg font-bold transition-all bg-ocean-blue text-white hover:bg-ocean-blue/80 hover:scale-105 cursor-pointer border-2 border-sponge-yellow/50"
      >
        📋 View All Answers
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            className="relative w-full max-w-3xl max-h-[85vh] bg-ocean-dark rounded-2xl border-2 border-sponge-yellow/60 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-sponge-yellow/30">
              <h2 className="text-2xl md:text-3xl font-bold text-sponge-yellow">
                📋 Answer Key
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {answerKey.map((q, index) => (
                <div
                  key={q.id}
                  className="bg-ocean-blue/30 rounded-xl p-5 border border-white/10"
                >
                  {/* Question Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sponge-yellow text-ocean-dark font-bold flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <p className="text-white font-medium text-base leading-relaxed">
                      {q.question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-11">
                    {q.options.map((option, optIndex) => {
                      const isCorrect = optIndex === q.correctAnswer;
                      return (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all ${
                            isCorrect
                              ? 'bg-green-500/30 border-2 border-green-400 text-green-200'
                              : 'bg-white/5 border border-white/10 text-white/60'
                          }`}
                        >
                          <span
                            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isCorrect
                                ? 'bg-green-400 text-ocean-dark'
                                : 'bg-white/10 text-white/40'
                            }`}
                          >
                            {OPTION_LABELS[optIndex]}
                          </span>
                          <span className="flex-1">{option}</span>
                          {isCorrect && <span className="text-green-400">✓</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-sponge-yellow/30 text-center">
              <p className="text-white/50 text-sm">
                {answerKey.length} questions · Correct answers highlighted in green
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AnswerKeyModal;
