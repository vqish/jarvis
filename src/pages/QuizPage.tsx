import React, { useState } from 'react';
import { useJarvis } from '../state/JarvisContext';
import { QuizQuestion } from '../types';
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

export const QuizPage: React.FC = () => {
  const { quizQuestions, subjects, recordQuizResult, setActiveTab } = useJarvis();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('sub-phys');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<QuizQuestion[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const subjectQuestions = quizQuestions.filter((q) => q.subjectId === selectedSubjectId);
  const activeQuestions = subjectQuestions.length > 0 ? subjectQuestions : quizQuestions;
  const currentQuestion = activeQuestions[currentQuestionIndex] || activeQuestions[0];

  const handleSelectOption = (index: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);

    if (selectedOption === currentQuestion.correctOptionIndex) {
      setScore((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => [...prev, currentQuestion]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < activeQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      const finalScore = selectedOption === currentQuestion.correctOptionIndex ? score + 1 : score;
      const total = activeQuestions.length;
      const pct = Math.round((finalScore / total) * 100);
      const weakTopics = wrongAnswers.map((w) => w.topicName);

      recordQuizResult(selectedSubjectId, currentQuestion.topicName, pct, total, weakTopics);
      setIsQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setWrongAnswers([]);
    setIsQuizCompleted(false);
  };

  const accuracyPct = Math.round((score / activeQuestions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-semibold mb-1">
            <Brain className="w-4 h-4" />
            <span>AI STUDY ENGINE QUIZ EVALUATION</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-100">
            Active Recall Quiz
          </h1>
        </div>

        {/* Subject Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Subject:</span>
          <select
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              handleRestart();
            }}
            className="px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!isQuizCompleted ? (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span>QUESTION {currentQuestionIndex + 1} OF {activeQuestions.length}</span>
            <span className="text-teal-400">CURRENT SCORE: {score}</span>
          </div>

          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {currentQuestion.topicName}
              </span>
              <h2 className="text-lg md:text-xl font-display font-semibold text-slate-100 leading-relaxed">
                {currentQuestion.questionText}
              </h2>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctOptionIndex;

                let optionStyles = 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700';
                if (isSelected && !isAnswerSubmitted) {
                  optionStyles = 'bg-teal-500/15 border-teal-500 text-teal-200 shadow-md shadow-teal-500/10';
                } else if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyles = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/20';
                  } else if (isSelected && !isCorrect) {
                    optionStyles = 'bg-red-950/80 border-red-500 text-red-200 shadow-md shadow-red-500/20';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${optionStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-800/80 flex items-center justify-center font-mono text-xs text-slate-300 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation when submitted */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-teal-400 font-mono font-semibold">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>CONCEPTUAL DERIVATION / EXPLANATION:</span>
                </div>
                <p className="leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null}
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
                >
                  <span>{currentQuestionIndex + 1 < activeQuestions.length ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Complete Screen */
        <div className="p-8 md:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 mx-auto shadow-[0_0_30px_rgba(20,184,166,0.3)]">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <div className="font-mono text-xs text-teal-400 uppercase font-semibold">
              Evaluation Complete
            </div>
            <h2 className="text-3xl font-display font-extrabold text-slate-100 mt-1">
              QUIZ COMPLETE
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-mono text-slate-400">FINAL SCORE</div>
              <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
                {score} / {activeQuestions.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-mono text-slate-400">ACCURACY</div>
              <div className="text-2xl font-bold font-mono text-teal-300 mt-1">
                {accuracyPct}%
              </div>
            </div>
          </div>

          {/* Weak Areas & Recommendations */}
          {wrongAnswers.length > 0 ? (
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-left max-w-md mx-auto space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>IDENTIFIED WEAK AREAS & RECOMMENDED REVISION:</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {wrongAnswers.map((w, idx) => (
                  <li key={idx}><strong>{w.topicName}</strong>: Review derivation proofs and formula sheet.</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono max-w-md mx-auto">
              ★ Perfect mastery demonstrated across all tested topics!
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs border border-slate-700 flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>

            <button
              onClick={() => setActiveTab('focus')}
              className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              Start Focus Session on Weak Topics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
