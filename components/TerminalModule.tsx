import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal, Lock, Unlock, Server, ShieldAlert, Cpu, Loader2, Trophy } from 'lucide-react';
import { generateTerminalChallenge } from '../services/geminiService';
import { TerminalScenario } from '../types';

interface TerminalModuleProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

// Hardcoded Tutorial Levels (1-3)
const TUTORIAL_LEVELS: Record<number, TerminalScenario> = {
  1: {
    id: 1,
    title: "LEVEL 1: LOG ANALYSIS",
    description: "Kredensial admin bocor di dalam log server. Temukan password admin.",
    systemMessage: [
      "CyberGuard OS v2.0 (Kernel 5.15)",
      "Analyzing /var/logs/access.log...",
      "Anomaly Detected in Auth Subsystem."
    ],
    fileSystem: {
      "readme.txt": "Admin baru saja mereset password kemarin. Cek server_access.log untuk jejaknya.",
      "server_access.log": `[2023-10-27 08:41:12] [INFO] Session started for user 'guest'
[2023-10-27 08:42:05] [WARN] Failed login attempt user 'admin'
[2023-10-27 08:44:00] [DEBUG] Env Var updated: DB_PASS='M4st3r_P4ssw0rd!'
[2023-10-27 08:45:22] [INFO] Service restarted
[2023-10-27 08:46:10] [INFO] Backup completed`
    },
    solution: "M4st3r_P4ssw0rd!",
    hint: "Gunakan 'cat server_access.log' atau 'grep password server_access.log'",
    isInteractive: false
  },
  2: {
    id: 2,
    title: "LEVEL 2: SQL INJECTION",
    description: "Portal login admin memiliki kerentanan. Masuk tanpa password.",
    systemMessage: ["Connected to Web Admin Portal", "Login Service: ACTIVE", "Protection: LOW"],
    fileSystem: {}, // Not used for interactive
    solution: "SQL_BYPASS",
    hint: "Gunakan logic 'OR' pada password. Contoh: 'admin' --",
    isInteractive: true
  },
  3: {
    id: 3,
    title: "LEVEL 3: REMOTE CODE EXECUTION",
    description: "Tool 'ping' rentan terhadap injeksi perintah. Baca file /root/flag.txt.",
    systemMessage: ["Network Diagnostic Tool v1.0", "Ping Service Ready."],
    fileSystem: {},
    solution: "CYBER{R00T_ACC3SS}",
    hint: "Gunakan delimiter ';' setelah IP. Contoh: 8.8.8.8; ls",
    isInteractive: true
  }
};

const TerminalModule: React.FC<TerminalModuleProps> = ({ onComplete, onBack }) => {
  const [level, setLevel] = useState(1);
  const [scenario, setScenario] = useState<TerminalScenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  // Initialize Level
  useEffect(() => {
    const initLevel = async () => {
      if (level > 100) {
        setGameComplete(true);
        return;
      }

      setLoading(true);
      setHistory([]); // Clear terminal for new level

      if (level <= 3) {
        setScenario(TUTORIAL_LEVELS[level]);
        setHistory(TUTORIAL_LEVELS[level].systemMessage);
        setLoading(false);
      } else {
        // Generate AI Level
        const data = await generateTerminalChallenge(level);
        setScenario(data);
        setHistory(data.systemMessage || ["Initializing CTF Environment...", "Mounting virtual file system..."]);
        setLoading(false);
      }
    };

    initLevel();
  }, [level]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !scenario) return;

    const rawInput = input;
    const args = rawInput.trim().split(/\s+/);
    const cmd = args[0].toLowerCase();
    const newHistory = [...history, `root@kali:~$ ${rawInput}`];

    // --- GLOBAL COMMANDS ---
    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } 
    else if (cmd === 'exit') {
      onBack();
      return;
    }
    else if (cmd === 'help') {
      const cmds = [
        "Available Commands:",
        "  ls                 - List directory contents",
        "  cat [file]         - Display file content",
        "  grep [key] [file]  - Search for pattern in file",
        "  verify [flag]      - Submit flag to complete level",
      ];
      if (level > 5) cmds.push("  decode base64 [str] - Decode Base64 string");
      if (level > 20) cmds.push("  decode hex [str]    - Decode Hex string");
      
      if (scenario.isInteractive) {
        if (level === 2) cmds.push("  login [u] [p]      - Login to portal");
        if (level === 3) cmds.push("  ping [ip]          - Network tool");
      }
      newHistory.push(...cmds);
    }

    // --- LOGIC BRANCHING ---

    // 1. CUSTOM INTERACTIVE LEVELS (2 & 3)
    else if (scenario.isInteractive) {
      if (level === 2) { // SQLi
        if (cmd === 'login') {
           const passArgs = args.slice(2).join(" ");
           if (passArgs.toLowerCase().includes("' or") || passArgs.includes("'='")) {
             newHistory.push(">> SQL INJECTION DETECTED. BYPASS SUCCESS.", ">> LEVEL COMPLETE.");
             finishLevel();
           } else {
             newHistory.push("Access Denied. Invalid credentials.");
           }
        } else {
          newHistory.push(`Command '${cmd}' not available. Use 'login'.`);
        }
      } 
      else if (level === 3) { // RCE
        if (cmd === 'ping') {
           const payload = rawInput.substring(5);
           if (payload.includes(';') || payload.includes('&&')) {
             if (payload.includes('cat') && payload.includes('flag')) {
               newHistory.push(`root@host:~/ # ${payload}`, scenario.solution, ">> ROOT ACCESS CONFIRMED.");
               finishLevel();
             } else {
               newHistory.push(`Ping executed. Try reading the flag file.`);
             }
           } else {
             newHistory.push("Ping 8.8.8.8: 64 bytes from 8.8.8.8: icmp_seq=1 ttl=116 time=14.2 ms");
           }
        } else {
          newHistory.push(`Command '${cmd}' restricted.`);
        }
      }
    }

    // 2. FILE SYSTEM CTF ENGINE (Level 1 & 4-100)
    else {
      if (cmd === 'ls') {
        const files = Object.keys(scenario.fileSystem || {});
        newHistory.push(files.length > 0 ? files.join("    ") : "(directory empty)");
      }
      else if (cmd === 'cat') {
        const filename = args[1];
        if (!filename) {
          newHistory.push("Usage: cat [filename]");
        } else if (scenario.fileSystem && scenario.fileSystem[filename]) {
           newHistory.push(`--- START OF ${filename} ---`);
           newHistory.push(scenario.fileSystem[filename]);
           newHistory.push(`--- END OF FILE ---`);
        } else {
           newHistory.push(`cat: ${filename}: No such file`);
        }
      }
      else if (cmd === 'grep') {
        const pattern = args[1];
        const filename = args[2];
        if (!pattern || !filename) {
           newHistory.push("Usage: grep [pattern] [filename]");
        } else if (scenario.fileSystem && scenario.fileSystem[filename]) {
          const content = scenario.fileSystem[filename];
          const matches = content.split('\n').filter(line => line.toLowerCase().includes(pattern.toLowerCase()));
          if (matches.length > 0) {
            newHistory.push(...matches);
          } else {
            newHistory.push("grep: No matches found.");
          }
        } else {
          newHistory.push(`grep: ${filename}: No such file`);
        }
      }
      else if (cmd === 'decode') {
         // decode base64/hex [string]
         const type = args[1];
         const payload = args[2];
         
         if (!type || !payload) {
            newHistory.push("Usage: decode [base64|hex] [string]");
         } else if (type === 'base64') {
            try {
              newHistory.push(`Decoded (Base64): ${atob(payload)}`);
            } catch (e) {
              newHistory.push("Error: Invalid Base64 string.");
            }
         } else if (type === 'hex') {
             try {
                let str = '';
                for (let i = 0; i < payload.length; i += 2) {
                    str += String.fromCharCode(parseInt(payload.substr(i, 2), 16));
                }
                newHistory.push(`Decoded (Hex): ${str}`);
             } catch (e) {
                newHistory.push("Error: Invalid Hex string.");
             }
         } else {
            newHistory.push("Unknown encoding type. Supported: base64, hex");
         }
      }
      else if (cmd === 'verify') {
        const userFlag = args[1];
        if (userFlag === scenario.solution) {
          newHistory.push(">> FLAG ACCEPTED. SYSTEM SECURED.", ">> UPLOADING TO SECURE SERVER...");
          finishLevel();
        } else {
          newHistory.push("Error: Invalid Flag. Access Denied.");
        }
      }
      else {
        newHistory.push(`bash: ${cmd}: command not found`);
      }
    }

    setHistory(newHistory);
    setInput('');
  };

  const finishLevel = () => {
    const bonus = level * 50; // Higher levels = massive XP
    onComplete(100 + bonus);
    
    if (level === 100) {
        setGameComplete(true);
    } else {
        setTimeout(() => {
          setLevel(l => l + 1);
        }, 1500);
    }
  };

  if (gameComplete) {
    return (
      <div className="w-full max-w-4xl mx-auto h-[650px] bg-black border border-cyber-accent rounded-lg flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyber-success/10 animate-pulse"></div>
        <Trophy className="w-32 h-32 text-yellow-400 mb-6 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]" />
        <h1 className="text-5xl font-black text-white mb-2 relative z-10">MISSION ACCOMPLISHED</h1>
        <p className="text-cyber-accent text-xl font-mono mb-8 relative z-10">YOU HAVE REACHED LEVEL 100. GOD MODE ACTIVATED.</p>
        <div className="bg-gray-900/80 border border-gray-700 p-6 rounded-xl max-w-lg relative z-10">
          <p className="text-gray-300 font-mono text-sm">
            "Selamat! Anda telah menyelesaikan seluruh tantangan CyberGuard Academy. 
            Kemampuan Anda dalam analisis log, kriptografi, dan eksploitasi sistem telah mencapai tingkat Master."
          </p>
        </div>
        <button 
          onClick={onBack}
          className="mt-10 px-8 py-3 bg-cyber-accent text-black font-bold rounded hover:bg-white transition-colors relative z-10"
        >
          KEMBALI KE MARKAS
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto h-[600px] bg-black border border-gray-800 rounded-lg flex flex-col items-center justify-center text-cyber-accent font-mono">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <div className="text-xl animate-pulse">INITIALIZING LEVEL {level} PROTOCOL...</div>
        <div className="text-sm text-gray-500 mt-2">Generating Neural Network Challenge ({Math.floor((level/100)*100)}%)</div>
      </div>
    );
  }

  if (!scenario) return null;

  return (
    <div className="w-full max-w-4xl mx-auto h-[650px] bg-black border-2 border-gray-800 rounded-lg shadow-2xl flex flex-col overflow-hidden font-mono text-sm md:text-base">
      {/* Header */}
      <div className="bg-gray-900 p-2 border-b border-gray-800 flex justify-between items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-gray-500 flex items-center gap-2">
          <Terminal size={16} /> 
          <span>root@kali:~/level_{level}</span>
          <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">MAX: 100</span>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-gray-900/50 p-4 border-b border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="border border-cyber-accent/30 p-3 rounded bg-cyber-accent/5 flex flex-col justify-between">
           <div className="flex justify-between items-start mb-2">
             <h4 className="text-cyber-accent text-xs font-bold uppercase tracking-wider">
               LEVEL {level}: {scenario.title}
             </h4>
             {level > 10 && <ShieldAlert className="text-red-500 w-4 h-4 animate-pulse" />}
           </div>
           <p className="text-white text-sm leading-tight">{scenario.description}</p>
         </div>
         
         <div className="border border-white/10 p-3 rounded flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-gray-800 opacity-20 group-hover:opacity-30 transition-opacity">
              <Cpu size={80} />
            </div>
            <h4 className="text-gray-400 text-xs uppercase mb-1 flex items-center gap-1">
              <Server size={12} /> System Hint
            </h4>
            <p className="text-yellow-400/90 text-xs md:text-sm italic">
              "{scenario.hint}"
            </p>
         </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent text-green-400 font-bold font-mono leading-relaxed">
        {history.map((line, i) => (
          <div key={i} className="mb-1 break-words whitespace-pre-wrap">
            {line}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleCommand} className="bg-gray-900 p-4 flex gap-2 items-center border-t border-gray-800">
        <span className="text-green-500 animate-pulse font-bold">root@kali:~#</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white font-mono placeholder-gray-700"
          placeholder="Type 'help' for commands..."
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default TerminalModule;