import React, { useState, useEffect, useCallback } from 'react';
import { Shield, AlertCircle, CheckCircle2, XCircle, Cpu } from 'lucide-react';
import { generateQuizQuestion } from '../services/geminiService';
import { QuizQuestion } from '../types';

interface QuizModuleProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const QuizModule: React.FC<QuizModuleProps> = ({ onComplete, onBack }) => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setShowResult(false);
    setSelectedOption(null);
    
    const difficulty = streak > 2 ? 'Hard' : streak > 0 ? 'Medium' : 'Easy';
    const q = await generateQuizQuestion(difficulty);
    setQuestion(q);
    setLoading(false);
  }, [streak]);

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);

    const isCorrect = index === question?.correctIndex;
    if (isCorrect) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (selectedOption === question?.correctIndex) {
      onComplete(100 + (streak * 20)); // Bonus for streak
    } else {
      onComplete(10); // Pity points
    }
    fetchQuestion();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-cyber-accent">
        <Cpu className="w-16 h-16 animate-spin mb-4" />
        <p className="font-mono animate-pulse">DECRYPTING QUESTION DATA...</p>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-cyber-panel border border-gray-800 rounded-xl shadow-2xl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-accent/5 rounded-full blur-3xl -z-10"></div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-cyber-accent" />
          <span className="font-mono text-sm text-gray-400">MODE: KUIS TEORI</span>
        </div>
        <div className="flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full border border-gray-800">
          <span className={`w-2 h-2 rounded-full ${
            question.difficulty === 'Hard' ? 'bg-cyber-danger' : 
            question.difficulty === 'Medium' ? 'bg-cyber-warning' : 'bg-cyber-success'
          }`}></span>
          <span className="text-xs font-bold uppercase text-gray-300">{question.difficulty}</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6 leading-relaxed">
        {question.question}
      </h2>

      <div className="space-y-4 mb-8">
        {question.options.map((option, idx) => {
          let btnClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 flex justify-between items-center group ";
          
          if (showResult) {
            if (idx === question.correctIndex) {
              btnClass += "bg-cyber-success/10 border-cyber-success text-cyber-success";
            } else if (idx === selectedOption) {
              btnClass += "bg-cyber-danger/10 border-cyber-danger text-cyber-danger";
            } else {
              btnClass += "bg-gray-900/50 border-gray-800 text-gray-500 opacity-50";
            }
          } else {
            btnClass += "bg-gray-900/50 border-gray-700 hover:border-cyber-accent hover:bg-cyber-accent/5 text-gray-200 hover:text-white";
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={showResult}
              className={btnClass}
            >
              <span className="font-mono text-lg">{option}</span>
              {showResult && idx === question.correctIndex && <CheckCircle2 className="w-5 h-5" />}
              {showResult && idx === selectedOption && idx !== question.correctIndex && <XCircle className="w-5 h-5" />}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="bg-black/40 border border-gray-700 rounded-lg p-4 mb-6 animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
            <div>
              <h4 className="text-blue-400 font-bold mb-1">Analisis Keamanan</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-800">
        <button onClick={onBack} className="text-gray-500 hover:text-white text-sm font-mono transition-colors">
          [ ESC ] KEMBALI
        </button>
        {showResult && (
          <button
            onClick={handleNext}
            className="bg-cyber-accent text-black font-bold py-2 px-6 rounded shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all flex items-center gap-2"
          >
            LANJUT <span className="text-lg">→</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizModule;