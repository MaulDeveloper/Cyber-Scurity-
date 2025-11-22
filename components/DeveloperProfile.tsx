import React from 'react';
import { Github, Linkedin, Terminal, Shield, Cpu, Mail, MapPin, Briefcase, Code2 } from 'lucide-react';

interface DeveloperProfileProps {
  onBack?: () => void;
}

const DeveloperProfile: React.FC<DeveloperProfileProps> = ({ onBack }) => {
  return (
    <div className="w-full bg-cyber-panel/80 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden relative group animate-fade-in">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyber-danger/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

        {/* Header Banner */}
        <div className="h-32 md:h-40 bg-gray-900 relative overflow-hidden border-b border-cyber-accent/30">
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyber-panel/90"></div>
          
          {/* Animated Elements */}
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="w-16 h-1 bg-cyber-accent/30 rounded-full overflow-hidden">
              <div className="w-full h-full bg-cyber-accent animate-pulse-fast origin-left scale-x-50"></div>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="px-6 pb-8 relative">
          
          {/* Identity Section: Avatar & Name */}
          {/* Uses negative margin to pull avatar up, but keeps it in flow to prevent overlap */}
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-12 mb-8 gap-6 relative z-10">
            
            {/* Avatar */}
            <div className="flex-shrink-0 relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-accent to-cyber-danger rounded-2xl opacity-75 blur group-hover:opacity-100 transition duration-500"></div>
              <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-2xl overflow-hidden border-4 border-cyber-panel bg-black shadow-2xl">
                <img 
                  src="https://files.catbox.moe/w64vs7.jpg" 
                  alt="Maulana Developer" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Scanline Effect on Image */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] pointer-events-none"></div>
              </div>
              {/* Online Indicator */}
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-cyber-panel rounded-full flex items-center justify-center z-20">
                 <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-cyber-panel"></div>
              </div>
            </div>

            {/* Name & Role */}
            <div className="flex-1 text-center md:text-left flex flex-col gap-2">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase font-sans mb-1 drop-shadow-lg">
                  Maulana <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent to-blue-500">Developer</span>
                </h1>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm">
                  <Terminal className="w-4 h-4 text-cyber-accent" />
                  <span className="font-mono text-xs md:text-sm text-gray-300 tracking-wide">FULL STACK SECURITY ENGINEER</span>
                </div>
              </div>
            </div>

            {/* Social Actions */}
            <div className="flex gap-3 mt-4 md:mt-0">
              <SocialButton icon={<Github className="w-5 h-5" />} label="GitHub" />
              <SocialButton icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
              <SocialButton icon={<Mail className="w-5 h-5" />} label="Email" />
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: About & Tech */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Biodata Card */}
              <div className="bg-gray-900/40 rounded-xl p-6 border border-white/5 hover:border-cyber-accent/30 transition-colors group/card">
                <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide font-mono">PROFESSIONAL SUMMARY</h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base text-left">
                  Pengembang perangkat lunak visioner dengan spesialisasi mendalam pada <span className="text-white font-semibold">Cyber Security</span> dan <span className="text-white font-semibold">Artificial Intelligence</span>. 
                  Berfokus pada penciptaan solusi teknologi yang tidak hanya fungsional tetapi juga aman dan edukatif. 
                  Memiliki hasrat tinggi dalam Ethical Hacking, Web Architecture, dan menjembatani kompleksitas teknologi modern bagi pemula.
                </p>
              </div>

              {/* Skills Matrix */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Code2 className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide font-mono">TECHNICAL ARSENAL</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SkillCard name="JavaScript / TypeScript" level={95} color="bg-yellow-400" icon="JS" />
                  <SkillCard name="React & Ecosystem" level={92} color="bg-cyan-400" icon="RC" />
                  <SkillCard name="Python & AI Ops" level={88} color="bg-blue-500" icon="PY" />
                  <SkillCard name="Cyber Security / CTF" level={90} color="bg-red-500" icon="SEC" />
                </div>
              </div>
            </div>

            {/* Right Column: Stats & Details */}
            <div className="space-y-6">
              
              {/* Status Panel */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black rounded-xl p-1 border border-gray-800">
                <div className="bg-black/50 rounded-lg p-5 space-y-5">
                  <h4 className="text-cyber-accent text-xs font-mono font-bold tracking-[0.2em] border-b border-gray-800 pb-2">
                    OPERATIONAL STATUS
                  </h4>
                  
                  <div className="flex items-center gap-3 text-sm font-mono">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300">Pemalang, Jawa Tengah</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm font-mono">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300">Security Clearance: <span className="text-cyber-success">L5</span></span>
                  </div>

                  <div className="pt-2">
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyber-accent to-blue-600 w-[85%] relative">
                         <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
                      <span>PROJECT CAPACITY</span>
                      <span>85% LOAD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hire Badge */}
              <div className="bg-cyber-success/5 border border-cyber-success/20 rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:bg-cyber-success/10 transition-colors">
                 <div className="flex items-center gap-3">
                   <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                   <span className="text-green-400 font-bold text-sm tracking-wide group-hover:text-green-300">AVAILABLE FOR HIRE</span>
                 </div>
                 <div className="text-gray-500 group-hover:text-white transition-colors">→</div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Strip */}
        {onBack && (
          <div className="border-t border-gray-800 bg-black/40 p-4 text-center">
            <button 
              onClick={onBack}
              className="text-xs font-mono text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto uppercase tracking-widest"
            >
              <span className="w-2 h-2 border border-gray-500 transform rotate-45"></span>
              Close Dossier
              <span className="w-2 h-2 border border-gray-500 transform rotate-45"></span>
            </button>
          </div>
        )}
    </div>
  );
};

// Sub-components for cleaner code

const SocialButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="p-3 bg-gray-800/50 hover:bg-cyber-accent hover:text-black text-gray-400 rounded-xl border border-gray-700 hover:border-cyber-accent transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] group" title={label}>
    {icon}
  </button>
);

const SkillCard = ({ name, level, color, icon }: { name: string, level: number, color: string, icon: string }) => (
  <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 flex items-center gap-4 hover:bg-gray-800 transition-colors">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold font-mono text-xs text-black ${color} shadow-[0_0_10px_rgba(0,0,0,0.3)]`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5 font-mono uppercase">
        <span>{name}</span>
        <span className="text-gray-500">{level}%</span>
      </div>
      <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${level}%` }}></div>
      </div>
    </div>
  </div>
);

export default DeveloperProfile;