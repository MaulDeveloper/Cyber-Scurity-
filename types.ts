
export enum GameMode {
  MENU = 'MENU',
  QUIZ = 'QUIZ',
  PHISHING = 'PHISHING',
  TERMINAL = 'TERMINAL',
  PROFILE = 'PROFILE'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface PhishingEmail {
  sender: string;
  subject: string;
  body: string;
  isPhishing: boolean;
  clues: string[];
  explanation: string;
}

export interface TerminalScenario {
  id: number;
  title: string;
  description: string;
  systemMessage: string[]; // Initial logs/messages shown
  fileSystem: Record<string, string>; // Virtual files: { "secret.txt": "content" }
  solution: string; // The flag to verify
  hint: string;
  isInteractive?: boolean; // true for levels 1-3 (custom logic), false for AI levels (generic CTF)
}

export interface GameStats {
  score: number;
  level: number;
  streak: number;
  xp: number;
}
