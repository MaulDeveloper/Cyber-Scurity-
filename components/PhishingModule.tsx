import React, { useState, useEffect, useCallback } from 'react';
import { Mail, ShieldAlert, ShieldCheck, Search, User, AlertTriangle } from 'lucide-react';
import { generatePhishingScenario } from '../services/geminiService';
import { PhishingEmail } from '../types';

interface PhishingModuleProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const PhishingModule: React.FC<PhishingModuleProps> = ({ onComplete, onBack }) => {
  const [email, setEmail] = useState<PhishingEmail | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzed, setAnalyzed] = useState(false);
  const [decision, setDecision] = useState<'LEGIT' | 'PHISHING' | null>(null);
  const [feedback, setFeedback] = useState('');

  const fetchEmail = useCallback(async () => {
    setLoading(true);
    setAnalyzed(false);
    setDecision(null);
    const data = await generatePhishingScenario();
    setEmail(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDecision = (userChoice: 'LEGIT' | 'PHISHING') => {
    if (analyzed || !email) return;
    
    setDecision(userChoice);
    setAnalyzed(true);
    
    const isCorrect = (userChoice === 'PHISHING' && email.isPhishing) || (userChoice === 'LEGIT' && !email.isPhishing);
    
    if (isCorrect) {
      setFeedback("KERJA BAGUS! Analisis Anda tepat.");
      onComplete(150);
    } else {
      setFeedback("PERINGATAN: Analisis salah. Sistem terkompromi.");
      onComplete(0);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-cyber-accent">
        <Search className="w-16 h-16 animate-bounce mb-4" />
        <p className="font-mono animate-pulse">SCANNING INCOMING TRAFFIC...</p>
      </div>
    );
  }

  if (!email) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-100 text-gray-900 rounded-t-lg overflow-hidden border-b-4 border-cyber-panel">
        {/* Fake Email Client Header */}
        <div className="bg-gray-800 text-gray-300 p-3 flex items-center gap-4 text-sm font-mono">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 text-center opacity-50">SecureMail Client v4.0</div>
        </div>

        {/* Email Metadata */}
        <div className="p-6 bg-white border-b border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{email.subject}</h3>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="text-gray-500" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">
                From: <span className="font-mono text-blue-600">{email.sender}</span>
              </p>
              <p className="text-xs text-gray-500">To: me@company.com</p>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="p-8 bg-white min-h-[300px] font-sans leading-relaxed whitespace-pre-wrap">
          {email.body}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col items-center gap-6">
        {!analyzed ? (
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
            <button
              onClick={() => handleDecision('LEGIT')}
              className="flex flex-col items-center p-6 bg-gray-900/50 border border-green-500/30 hover:bg-green-900/20 hover:border-green-500 rounded-xl transition-all group"
            >
              <ShieldCheck className="w-10 h-10 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-green-400">AMAN</span>
              <span className="text-xs text-gray-400 mt-1">Tidak ada ancaman</span>
            </button>
            
            <button
              onClick={() => handleDecision('PHISHING')}
              className="flex flex-col items-center p-6 bg-gray-900/50 border border-red-500/30 hover:bg-red-900/20 hover:border-red-500 rounded-xl transition-all group"
            >
              <ShieldAlert className="w-10 h-10 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-red-400">PHISHING</span>
              <span className="text-xs text-gray-400 mt-1">Lapor sebagai spam</span>
            </button>
          </div>
        ) : (
          <div className="w-full bg-cyber-panel border border-gray-700 rounded-xl p-6 animate-fade-in">
            <div className={`flex items-center gap-3 mb-4 text-xl font-bold ${
              (decision === 'PHISHING' && email.isPhishing) || (decision === 'LEGIT' && !email.isPhishing)
              ? 'text-cyber-success' 
              : 'text-cyber-danger'
            }`}>
              {(decision === 'PHISHING' && email.isPhishing) || (decision === 'LEGIT' && !email.isPhishing)
                ? <ShieldCheck className="w-8 h-8" />
                : <AlertTriangle className="w-8 h-8" />
              }
              {feedback}
            </div>

            <div className="space-y-4">
               <div className="bg-black/30 p-4 rounded border border-gray-800">
                <h4 className="text-cyber-accent font-mono text-sm mb-2">ANALYSIS REPORT:</h4>
                <p className="text-gray-300 mb-3">{email.explanation}</p>
                
                {email.isPhishing && (
                  <div>
                    <p className="text-sm text-red-400 font-bold mb-1">Indikator Ancaman:</p>
                    <ul className="list-disc list-inside text-sm text-gray-400 font-mono">
                      {email.clues.map((clue, i) => <li key={i}>{clue}</li>)}
                    </ul>
                  </div>
                )}
               </div>

               <div className="flex justify-end gap-4">
                 <button onClick={onBack} className="text-gray-500 hover:text-white px-4 py-2">KEMBALI</button>
                 <button onClick={fetchEmail} className="bg-cyber-accent text-black font-bold px-6 py-2 rounded hover:brightness-110">
                   KASUS BERIKUTNYA
                 </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhishingModule;