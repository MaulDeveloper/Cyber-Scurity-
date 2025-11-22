import React, { useState } from 'react';
import { GameMode, GameStats } from './types';
import QuizModule from './components/QuizModule';
import PhishingModule from './components/PhishingModule';
import TerminalModule from './components/TerminalModule';
import DeveloperProfile from './components/DeveloperProfile';
import { Shield, BookOpen, Terminal, LogOut, Award, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.MENU);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    level: 1,
    streak: 0,
    xp: 0
  });

  const updateScore = (points: number) => {
    setStats(prev => {
      const newScore = prev.score + points;
      const newXp = prev.xp + points;
      const newLevel = Math.floor(newXp / 500) + 1;
      return { ...prev, score: newScore, xp: newXp, level: newLevel };
    });
  };

  const renderMenu = () => (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10 py-16 md:py-24">
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyber-accent/10 blur-[100px] rounded-full -z-10"></div>
        <div className="inline-block mb-6 relative group">
           <div className="absolute inset-0 bg-cyber-accent blur-xl opacity-20 rounded-full animate-pulse-fast group-hover:opacity-40 transition-opacity"></div>
           <Shield className="w-24 h-24 md:w-32 md:h-32 text-cyber-accent relative z-10 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 font-sans bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          CYBER<span className="text-cyber-accent">GUARD</span>
        </h1>
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-gray-800"></span>
          <p className="text-gray-400 text-sm md:text-base tracking-[0.3em] font-mono uppercase text-center">Academy Training Protocol</p>
          <span className="h-px w-12 bg-gray-800"></span>
        </div>
      </div>

      {/* Game Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
        <button 
          onClick={() => setMode(GameMode.QUIZ)}
          className="group relative bg-cyber-panel/80 backdrop-blur border border-gray-800 hover:border-cyber-accent p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,240,255,0.2)] overflow-hidden text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-14 h-14 bg-gray-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyber-accent/10 transition-colors border border-gray-800 group-hover:border-cyber-accent/30">
            <BookOpen className="w-7 h-7 text-gray-400 group-hover:text-cyber-accent transition-colors" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyber-accent transition-colors">Teori & Kuis</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Uji pengetahuan dasar keamanan siber dengan soal yang dihasilkan AI.</p>
        </button>

        <button 
          onClick={() => setMode(GameMode.PHISHING)}
          className="group relative bg-cyber-panel/80 backdrop-blur border border-gray-800 hover:border-cyber-danger p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(255,0,60,0.2)] overflow-hidden text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-danger/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-14 h-14 bg-gray-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyber-danger/10 transition-colors border border-gray-800 group-hover:border-cyber-danger/30">
            <BrainCircuit className="w-7 h-7 text-gray-400 group-hover:text-cyber-danger transition-colors" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyber-danger transition-colors">Phishing Lab</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Analisis email mencurigakan dan deteksi ancaman social engineering.</p>
        </button>

        <button 
          onClick={() => setMode(GameMode.TERMINAL)}
          className="group relative bg-cyber-panel/80 backdrop-blur border border-gray-800 hover:border-cyber-success p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,255,159,0.2)] overflow-hidden text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-14 h-14 bg-gray-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyber-success/10 transition-colors border border-gray-800 group-hover:border-cyber-success/30">
            <Terminal className="w-7 h-7 text-gray-400 group-hover:text-cyber-success transition-colors" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyber-success transition-colors">Terminal Ops</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Simulasi command line. Dekripsi hash dan perbaiki kerentanan.</p>
        </button>
      </div>

      {/* Embedded Developer Profile */}
      <div className="w-full max-w-6xl mb-16">
        <div className="flex items-center gap-4 mb-6 px-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-800"></div>
          <span className="text-gray-500 font-mono text-xs tracking-widest uppercase">Developer Dossier</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-800"></div>
        </div>
        <DeveloperProfile />
      </div>

      {/* Footer / Stats */}
      <div className="flex flex-col items-center gap-8 text-gray-500 font-mono text-sm w-full max-w-4xl">
        <div className="flex items-center justify-center gap-8 md:gap-16 border-t border-gray-800/50 pt-8 w-full">
          <div className="flex flex-col items-center gap-1">
             <span className="text-white text-2xl font-bold">{stats.level}</span>
             <span className="text-[10px] tracking-widest opacity-60">CURRENT LEVEL</span>
          </div>
          <div className="h-8 w-px bg-gray-800"></div>
          <div className="flex flex-col items-center gap-1">
             <span className="text-cyber-accent text-2xl font-bold drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">{stats.score}</span>
             <span className="text-[10px] tracking-widest opacity-60">TOTAL SCORE</span>
          </div>
          <div className="h-8 w-px bg-gray-800"></div>
          <div className="flex flex-col items-center gap-1">
             <span className="text-white text-2xl font-bold">{stats.xp}</span>
             <span className="text-[10px] tracking-widest opacity-60">EXPERIENCE</span>
          </div>
        </div>
        
        <div className="text-[10px] text-gray-700 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-900 rounded-full animate-pulse"></div>
          SYSTEM_V 1.0.4 // CONNECTED TO SECURE SERVER
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050508] text-gray-200 font-sans selection:bg-cyber-accent selection:text-black overflow-x-hidden">
      {/* Background Grid Animation */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,#13131f,transparent)] pointer-events-none z-0"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#050508]/80 backdrop-blur-md border-b border-gray-800 z-50 flex items-center justify-between px-6 transition-all duration-300">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setMode(GameMode.MENU)}>
          <Shield className="text-cyber-accent w-6 h-6" />
          <span className="font-bold tracking-wider text-white">CYBER<span className="text-cyber-accent">GUARD</span></span>
        </div>
        
        {mode !== GameMode.MENU && (
          <div className="flex items-center gap-4 md:gap-6 font-mono text-sm">
            <div className="flex items-center gap-2 text-cyber-warning bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
               <Award className="w-4 h-4" />
               <span>{stats.score} PTS</span>
            </div>
            <button 
              onClick={() => setMode(GameMode.MENU)}
              className="hover:text-white text-gray-500 transition-colors flex items-center gap-2 hover:bg-gray-800 px-3 py-1 rounded-lg"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden md:inline">EXIT TASK</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 relative z-10 px-4 md:px-8">
        {mode === GameMode.MENU && renderMenu()}
        
        {mode === GameMode.QUIZ && (
          <div className="animate-fade-in-up">
            <QuizModule 
              onComplete={updateScore} 
              onBack={() => setMode(GameMode.MENU)} 
            />
          </div>
        )}

        {mode === GameMode.PHISHING && (
          <div className="animate-fade-in-up">
             <PhishingModule 
               onComplete={updateScore}
               onBack={() => setMode(GameMode.MENU)}
             />
          </div>
        )}

        {mode === GameMode.TERMINAL && (
          <div className="animate-fade-in-up">
            <TerminalModule 
              onComplete={updateScore}
              onBack={() => setMode(GameMode.MENU)}
            />
          </div>
        )}
        
        {/* Fallback in case of lingering state */}
        {mode === GameMode.PROFILE && (
          <div className="animate-fade-in-up mt-16">
            <DeveloperProfile onBack={() => setMode(GameMode.MENU)} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;