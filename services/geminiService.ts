import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, PhishingEmail, TerminalScenario } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateQuizQuestion = async (difficulty: string): Promise<QuizQuestion> => {
  try {
    const actualDifficulty = difficulty === 'Easy' ? 'Intermediate' : 'Expert/Advanced';
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Buatkan satu pertanyaan kuis pilihan ganda tentang Cyber Security dalam Bahasa Indonesia.
                 Tingkat kesulitan: ${actualDifficulty}.
                 Topik: Threat Hunting, Reverse Engineering, Network Forensics, Cryptography, Cloud Security, OWASP Top 10.
                 Pertanyaan harus berupa studi kasus singkat atau analisis teknis.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Array berisi tepat 4 pilihan jawaban"
            },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            difficulty: { type: Type.STRING }
          },
          required: ["question", "options", "correctIndex", "explanation", "difficulty"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return data as QuizQuestion;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return {
      question: "Dalam serangan 'SQL Injection' tipe 'Blind', bagaimana penyerang biasanya menyimpulkan struktur database?",
      options: ["Melakukan brute force username", "Mengukur respons waktu (Time-based) atau Boolean", "Mengunduh file .sql backup", "Sniffing jaringan"],
      correctIndex: 1,
      explanation: "Blind SQLi mengandalkan inferensi dari respons server (waktu atau true/false) karena tidak ada output data langsung.",
      difficulty: "Hard"
    };
  }
};

export const generatePhishingScenario = async (): Promise<PhishingEmail> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate a sophisticated Phishing or Legit email analysis task (Bahasa Indonesia).
                 Difficulty: EXPERT.
                 If Phishing: Use subtle domain typos, psychological triggers, or hidden payloads context.
                 If Legit: Use complex corporate jargon but valid headers.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sender: { type: Type.STRING },
            subject: { type: Type.STRING },
            body: { type: Type.STRING },
            isPhishing: { type: Type.BOOLEAN },
            clues: { type: Type.ARRAY, items: { type: Type.STRING } },
            explanation: { type: Type.STRING }
          },
          required: ["sender", "subject", "body", "isPhishing", "clues", "explanation"]
        }
      }
    });
    
    const data = JSON.parse(response.text || "{}");
    return data as PhishingEmail;
  } catch (error) {
    console.error("Error generating phishing:", error);
    return {
      sender: "security@g0ogle.com",
      subject: "Suspicious Activity",
      body: "Please reset your password immediately at bit.ly/secure-google.",
      isPhishing: true,
      clues: ["Domain spoofing (g0ogle)", "Shortened link"],
      explanation: "Classic phishing attempt using typosquatting and masked links."
    };
  }
};

export const generateTerminalChallenge = async (level: number): Promise<TerminalScenario> => {
  try {
    // Dynamic Difficulty Scaling (Levels 4 - 100)
    let difficultyContext = "Basic Linux commands & Clear text flags.";
    
    if (level >= 4 && level <= 10) {
      difficultyContext = "Beginner. The flag is inside a specific text file. Users need to use 'ls' and 'cat'. Decoy files present.";
    } 
    else if (level > 10 && level <= 25) {
      difficultyContext = "Intermediate. The flag is Base64 encoded (e.g., 'Q1RGe...'). Users need to find the string and use 'decode base64'. Clues in system logs.";
    } 
    else if (level > 25 && level <= 50) {
      difficultyContext = "Advanced. The flag is hidden in large log files (access.log, syslog). Users must use 'grep'. Flags might be encoded in Hex strings. Hidden files (dotfiles) used.";
    } 
    else if (level > 50 && level <= 75) {
      difficultyContext = "Expert. Cryptography puzzles (Caesar Cipher/ROT13 - simulated text). Steganography clues in text descriptions. SQL Injection logs analysis required to find the 'password' which is the flag.";
    } 
    else if (level > 75 && level <= 99) {
      difficultyContext = "Master Hacker. Complex multi-file logic. Obfuscated shell scripts. Network packet dumps (text representation). The flag requires combining parts from two different files.";
    } 
    else if (level === 100) {
      difficultyContext = "LEGENDARY / GOD MODE. The ultimate challenge. Extremely obscure. Requires deep analysis of 'kernel panic' logs and hex dumps. Multi-step decryption (Hex -> Base64 -> Flag).";
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Create a Terminal CTF (Capture The Flag) Level ${level}.
                 Context: ${difficultyContext}
                 Language: Bahasa Indonesia for Description/Title, but English for technical file contents/logs.
                 Task: Create a virtual file system where the user must find a specific flag (format: CTF{...}).
                 
                 Requirements:
                 1. 'fileSystem': A JSON object where keys are filenames and values are file content. 
                 2. Include at least 4-6 files (mix of system logs, readme, config files, and decoys).
                 3. 'solution': The exact flag string the user must find (e.g. CTF{H4CK3R_101}).
                 4. 'systemMessage': Initial terminal boot logs (3-4 lines) that set the mood/scenario.
                 
                 Constraints:
                 - If Level > 20, DO NOT put the flag in plain text. It MUST be encoded (Base64 or Hex).
                 - If Level > 50, the 'hint' should be cryptic (e.g. "The patterns in the logs speak in base 16").
                 - Ensure the solution is reachable using only: cat, ls, grep, decode (base64/hex).
                 
                 Example File System for Level 15: 
                 { "notes.txt": "admin pass is hidden in logs", "auth.log": "...(lots of lines)... User: admin Pass: [Base64 String] ..." }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            systemMessage: { type: Type.ARRAY, items: { type: Type.STRING } },
            fileSystem: { 
              type: Type.OBJECT, 
              description: "Map of filename to content string. keys are filenames.",
              additionalProperties: true 
            },
            solution: { type: Type.STRING, description: "The final flag e.g. CTF{...}" },
            hint: { type: Type.STRING }
          },
          required: ["title", "description", "fileSystem", "solution", "hint"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return { ...data, id: level, isInteractive: false };
  } catch (error) {
    console.error("Error generating terminal level:", error);
    return {
      id: level,
      title: "SYSTEM FAILURE",
      description: "AI Generation Failed. Connection interrupted.",
      systemMessage: ["CRITICAL ERROR: NODE_OFFLINE", "Rebooting..."],
      fileSystem: {
        "error.log": "Connection timed out. The flag is CTF{RETRY_LATER}"
      },
      solution: "CTF{RETRY_LATER}",
      hint: "Check error.log",
      isInteractive: false
    };
  }
};