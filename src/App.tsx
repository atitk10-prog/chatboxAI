/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Heart, RotateCcw, Sparkles, Brain, Volume2, HelpCircle, Send, MessageSquare, Trophy, Star, Target, ChevronRight } from 'lucide-react';
import { AIService, generateQuestions as aiGenerateQuestions } from './services/aiService';
import { vietnameseTTS } from './services/vietnameseTTS';
import { getRandomQuestions, checkAnswer, Question } from './services/questionBank';

// Highlight numbers (orange, bigger) and question part (blue) in AI messages
function formatQuestionText(text: string): React.ReactNode {
  // Split "Hỏi..." question at end
  const questionMatch = text.match(/(Hỏi\s.+\?)/);
  const parts: React.ReactNode[] = [];

  if (questionMatch && questionMatch.index !== undefined) {
    const before = text.substring(0, questionMatch.index);
    const question = questionMatch[1];

    parts.push(<React.Fragment key="before">{highlightNumbers(before)}</React.Fragment>);
    parts.push(
      <span key="question" className="block mt-2 text-indigo-700 font-extrabold text-xl md:text-2xl">
        {highlightNumbers(question)}
      </span>
    );
  } else {
    parts.push(<React.Fragment key="all">{highlightNumbers(text)}</React.Fragment>);
  }
  return <>{parts}</>;
}

function highlightNumbers(text: string): React.ReactNode {
  const parts = text.split(/(\d+)/g);
  return parts.map((part, i) =>
    /^\d+$/.test(part)
      ? <span key={i} className="text-orange-600 font-black text-2xl md:text-3xl mx-0.5">{part}</span>
      : <React.Fragment key={i}>{part}</React.Fragment>
  );
}

// ── Chủ đề có sẵn ─────────────────────────────────────────
const PRESET_TOPICS = [
  { id: 'forest', icon: '🌳', label: 'Rừng Xanh Kỳ Bí', desc: 'Bảng nhân 2, 3, 4', gradient: 'from-green-50 to-emerald-100', blob1: 'bg-green-300', blob2: 'bg-emerald-200', robotImg: '/robot_forest.png', transition: 'Tuyệt vời lắm! 🌳 Chúng mình sẽ bước vào Rừng Xanh Kỳ Bí, nơi có những chú muông thú đang cần Hiệp sĩ giúp đỡ! Mỗi con vật sẽ đưa ra một câu đố toán học. Trả lời đúng để giải cứu chúng nhé! 🐰🦌' },
  { id: 'space', icon: '🚀', label: 'Vũ Trụ Bao La', desc: 'Bảng nhân 5, 6, 7', gradient: 'from-indigo-100 to-purple-200', blob1: 'bg-purple-400', blob2: 'bg-blue-300', robotImg: '/robot_space.png', transition: 'Phiêu lưu nào! 🚀 Chúng mình sẽ bay vào Vũ Trụ Bao La! Các quái vật số đang chiếm lấy các hành tinh, Hiệp sĩ phải giải các câu đố toán học để đánh bại chúng! ⭐🧑‍🚀' },
  { id: 'castle', icon: '🏰', label: 'Lâu Đài Phép Thuật', desc: 'Bảng nhân 8, 9', gradient: 'from-pink-50 to-rose-100', blob1: 'bg-pink-300', blob2: 'bg-rose-200', robotImg: '/robot_castle.png', transition: 'Dũng cảm quá! 🏰 Chúng mình sẽ tiến vào Lâu Đài Phép Thuật, nơi Phù thủy đã bắt giữ các Hoàng tử và Công chúa! Giải đúng câu đố để phá bỏ lời nguyền nhé! ✨🧙' },
];

const DEFAULT_BG = { gradient: 'from-amber-50 to-orange-100', blob1: 'bg-yellow-300', blob2: 'bg-orange-300' };

// ── Typewriter Hook ────────────────────────────────────────
function useTypewriter(text: string, speed = 35, startDelay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    if (!text) return;

    let i = 0;
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// ── Types ──────────────────────────────────────────────────
interface GameState {
  currentStep: 'START' | 'SETUP' | 'READY' | 'PLAYING' | 'GAME_OVER' | 'WIN';
  setupPhase: number;
  selectedTopic: string;
  selectedTopicId: string;
  transitionMsg: string;
  customTopic: string;
  totalQuestions: number;
  bgGradient: string;
  bgBlob1: string;
  bgBlob2: string;
  robotImage: string;
  hearts: number;
  correctCount: number;
  messages: { role: 'ai' | 'user'; text: string }[];
  isListening: boolean;
  isSpeaking: boolean;
  aiResponse: any;
  inputText: string;
  isLoading: boolean;
  // Offline question bank
  questions: Question[];
  currentQIndex: number;
  feedback: 'correct' | 'wrong' | null;
}

const INITIAL_STATE: GameState = {
  currentStep: 'START',
  setupPhase: 0,
  selectedTopic: '',
  selectedTopicId: '',
  transitionMsg: '',
  customTopic: '',
  totalQuestions: 5,
  bgGradient: DEFAULT_BG.gradient,
  bgBlob1: DEFAULT_BG.blob1,
  bgBlob2: DEFAULT_BG.blob2,
  robotImage: '/robot.png',
  hearts: 3,
  correctCount: 0,
  messages: [],
  isListening: false,
  isSpeaking: false,
  aiResponse: null,
  inputText: '',
  isLoading: false,
  questions: [],
  currentQIndex: 0,
  feedback: null,
};

const GREETING_MSG = "Xin chào! Chào mừng đến với Thử Thách Cùng AI! Mình là Robot Thông Thái sẽ đồng hành cùng các bạn! 🎉";
const TOPIC_MSG = "Bây giờ các bạn hãy chọn một chủ đề bên dưới nhé! Hoặc có thể nhập một chủ đề bất kỳ mà các bạn thích!";
const CUSTOM_TRANSITION = "Tuyệt vời! 🌟 Chúng mình sẽ cùng khám phá chủ đề này nhé! Hiệp sĩ hãy sẵn sàng chiến đấu với những câu đố thú vị!";

// ── App ───────────────────────────────────────────────────
export default function App() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const stateRef = useRef<GameState>(state);
  const aiServiceRef = useRef<AIService | null>(null);
  const recognitionRef = useRef<any>(null);
  const handleUserMessageRef = useRef<(text: string) => void>(() => { });
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Luôn cập nhật stateRef theo state mới nhất
  useEffect(() => { stateRef.current = state; }, [state]);

  // Typewriter for setup messages
  const greeting = useTypewriter(state.setupPhase >= 1 ? GREETING_MSG : '', 30, 300);
  const topicIntro = useTypewriter(state.setupPhase >= 2 ? TOPIC_MSG : '', 25, 200);
  const transitionStory = useTypewriter(state.setupPhase >= 3 ? state.transitionMsg : '', 25, 200);

  // Auto-advance setup phases
  useEffect(() => {
    if (state.currentStep === 'SETUP' && state.setupPhase === 0) {
      setState(prev => ({ ...prev, setupPhase: 1 }));
    }
  }, [state.currentStep, state.setupPhase]);

  // Phase 1: Play greeting TTS immediately, advance to phase 2 when TTS finishes
  useEffect(() => {
    if (state.setupPhase === 1) {
      vietnameseTTS.stop(); // Dừng audio trước đó
      vietnameseTTS.speak(
        GREETING_MSG,
        () => setState(prev => ({ ...prev, isSpeaking: true })),
        () => {
          setState(prev => ({ ...prev, isSpeaking: false, setupPhase: 2 }));
        }
      );
    }
  }, [state.setupPhase]);

  // Phase 2: Play topic intro TTS immediately, no auto-advance (wait for user to pick topic)
  useEffect(() => {
    if (state.setupPhase === 2) {
      vietnameseTTS.stop();
      vietnameseTTS.speak(
        TOPIC_MSG,
        () => setState(prev => ({ ...prev, isSpeaking: true })),
        () => setState(prev => ({ ...prev, isSpeaking: false }))
      );
    }
  }, [state.setupPhase]);

  // Phase 3: Play transition story immediately
  useEffect(() => {
    if (state.setupPhase === 3 && state.transitionMsg) {
      vietnameseTTS.stop();
      vietnameseTTS.speak(
        state.transitionMsg,
        () => setState(prev => ({ ...prev, isSpeaking: true })),
        () => setState(prev => ({ ...prev, isSpeaking: false }))
      );
    }
  }, [state.setupPhase, state.transitionMsg]);

  // ── Speech Recognition ──
  // Keep ref updated so mic always calls latest handleUserMessage
  useEffect(() => {
    handleUserMessageRef.current = handleUserMessage;
  });

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'vi-VN';
      recognitionRef.current.onresult = (e: any) => handleUserMessageRef.current(e.results[0][0].transcript);
      recognitionRef.current.onend = () => setState(prev => ({ ...prev, isListening: false }));
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      vietnameseTTS.stop();
    };
  }, []);

  // ── TTS ──
  const playSpeech = (text: string) => {
    if (!text) return;
    // speak() already calls stop() internally before playing
    vietnameseTTS.speak(
      text,
      () => setState(prev => ({ ...prev, isSpeaking: true })),
      () => setState(prev => ({ ...prev, isSpeaking: false }))
    );
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  // ── Game Flow ──
  const goToSetup = () => {
    vietnameseTTS.stop();
    setState(prev => ({ ...prev, currentStep: 'SETUP', setupPhase: 0 }));
  };

  // Sound effects using Web Audio API
  const playSound = (type: 'correct' | 'wrong') => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.3;
      if (type === 'correct') {
        osc.frequency.value = 523; // C5
        osc.type = 'sine';
        osc.start();
        setTimeout(() => { osc.frequency.value = 659; }, 150); // E5
        setTimeout(() => { osc.frequency.value = 784; }, 300); // G5
        setTimeout(() => { osc.stop(); ctx.close(); }, 500);
      } else {
        osc.frequency.value = 200;
        osc.type = 'sawtooth';
        osc.start();
        setTimeout(() => { osc.frequency.value = 150; }, 200);
        setTimeout(() => { osc.stop(); ctx.close(); }, 400);
      }
    } catch { }
  };

  const selectPresetTopic = (topic: typeof PRESET_TOPICS[0]) => {
    vietnameseTTS.stop();
    setState(prev => ({
      ...prev,
      selectedTopic: `${topic.label} - ${topic.desc}`,
      selectedTopicId: topic.id,
      customTopic: '',
      bgGradient: topic.gradient,
      bgBlob1: topic.blob1,
      bgBlob2: topic.blob2,
      robotImage: topic.robotImg,
      transitionMsg: topic.transition,
      setupPhase: 3,
    }));
  };

  const handleStartGame = async () => {
    const hasCustomTopic = state.customTopic.trim().length > 0;
    const topic = hasCustomTopic ? state.customTopic.trim() : (state.selectedTopic || 'Bảng nhân 2, 3, 4');
    const topicId = hasCustomTopic ? 'custom' : (state.selectedTopicId || 'custom');
    vietnameseTTS.stop();

    let questions: Question[] = [];

    // Custom topic → always try AI generation first
    if (hasCustomTopic) {
      setState(prev => ({ ...prev, isLoading: true }));
      playSpeech('Đang tạo câu hỏi cho chủ đề mới, Hiệp sĩ chờ chút nhé!');
      try {
        const aiQuestions = await aiGenerateQuestions(state.customTopic.trim(), state.totalQuestions);
        if (aiQuestions.length > 0) {
          questions = aiQuestions as Question[];
          console.log('✅ AI generated', questions.length, 'questions for custom topic');
        } else {
          console.warn('⚠️ AI returned empty, falling back to offline bank');
        }
      } catch (e) {
        console.error('❌ AI generation error:', e);
      }
    }

    // Fallback to offline bank (for preset topics or AI failure)
    if (questions.length === 0) {
      questions = getRandomQuestions(topicId, state.totalQuestions);
    }

    setState(prev => ({
      ...prev,
      currentStep: 'READY',
      selectedTopicId: topicId,
      hearts: 3,
      correctCount: 0,
      messages: [],
      aiResponse: null,
      questions,
      currentQIndex: 0,
      feedback: null,
      isLoading: false,
    }));

    const readyMsg = `Chào mừng Hiệp sĩ! Chủ đề hôm nay là "${topic}", ${state.totalQuestions} câu thử thách. Hiệp sĩ đã sẵn sàng chưa?`;
    playSpeech(readyMsg);
  };

  const confirmReady = () => {
    vietnameseTTS.stop();
    const q = state.questions[0];
    if (!q) return;
    const msg = q.story;
    setState(prev => ({
      ...prev,
      currentStep: 'PLAYING',
      aiResponse: { message: msg, currentQuestionIndex: 1 },
      messages: [{ role: 'ai', text: msg }],
    }));
    playSpeech(msg);
  };

  const handleUserMessage = (text: string) => {
    if (!text.trim() || state.isLoading) return;
    vietnameseTTS.stop(); // Stop any current TTS
    const userText = text.trim();
    const currentQ = state.questions[state.currentQIndex];
    if (!currentQ) return;

    const isCorrect = checkAnswer(userText, currentQ.answer);

    // ── Tính toán response NGAY LẬP TỨC (trước setTimeout) ──
    // Snapshot state hiện tại để tránh race condition
    const curHearts = isCorrect ? state.hearts : state.hearts - 1;
    const nextIdx = isCorrect ? state.currentQIndex + 1 : state.currentQIndex;

    let praiseMsg = '';
    let questionMsg = '';
    let fullMsg = '';
    let newStep = 'PLAYING' as GameState['currentStep'];

    if (curHearts <= 0) {
      newStep = 'GAME_OVER';
      fullMsg = 'Ôi không! Hiệp sĩ đã hết tim rồi. Đừng buồn nhé, hãy ôn lại và quay lại sau!';
    } else if (isCorrect && nextIdx >= state.totalQuestions) {
      newStep = 'WIN';
      fullMsg = `Tuyệt vời! Hiệp sĩ đã hoàn thành tất cả ${state.totalQuestions} câu thử thách! Hiệp sĩ thật giỏi!`;
    } else if (isCorrect) {
      const nextQ = state.questions[nextIdx];
      const praises = [
        'Tuyệt vời! Đúng rồi! Chúc mừng Hiệp sĩ!',
        'Giỏi lắm Hiệp sĩ! Chúc mừng!',
        'Chính xác! Hiệp sĩ thông minh quá!',
        'Xuất sắc! Chúc mừng Hiệp sĩ!',
        'Đúng rồi! Hiệp sĩ giỏi quá!'
      ];
      praiseMsg = praises[Math.floor(Math.random() * praises.length)];
      questionMsg = nextQ.story;
      fullMsg = `${praiseMsg} Tiếp theo nào! ${questionMsg}`;
    } else {
      const hints = ['Thử tính lại nhé!', 'Gần đúng rồi, cố lên!', 'Hãy đếm lại cẩn thận nào!', 'Hiệp sĩ thử lần nữa nhé!'];
      const hint = hints[Math.floor(Math.random() * hints.length)];
      fullMsg = `Chưa đúng rồi! ${hint} ${currentQ.story}`;
    }

    // ── Cập nhật state ngay: user message + feedback animation ──
    setState(prev => {
      const newMessages = [...prev.messages, { role: 'user' as const, text: userText }];
      const newHearts = isCorrect ? prev.hearts : prev.hearts - 1;
      const newCorrect = isCorrect ? prev.correctCount + 1 : prev.correctCount;
      const newQIndex = isCorrect ? prev.currentQIndex + 1 : prev.currentQIndex;

      return { ...prev, messages: newMessages, inputText: '', hearts: Math.max(0, newHearts), correctCount: newCorrect, currentQIndex: newQIndex, feedback: isCorrect ? 'correct' : 'wrong', isLoading: true };
    });

    playSound(isCorrect ? 'correct' : 'wrong');

    // ── Sau 1.5s: hiển thị response + phát TTS ──
    // fullMsg/praiseMsg/questionMsg đã được tính TRƯỚC → không bị lẫn câu hỏi
    setTimeout(async () => {
      setState(prev => {
        const newMessages = [...prev.messages, { role: 'ai' as const, text: fullMsg }];
        return { ...prev, currentStep: newStep, aiResponse: { message: fullMsg, currentQuestionIndex: nextIdx + 1 }, messages: newMessages, feedback: null, isLoading: false };
      });

      // Phát TTS
      if (newStep === 'WIN') {
        await playVictoryFanfare();
        playSpeech(fullMsg);
      } else if (newStep === 'GAME_OVER') {
        await playSadSound();
        playSpeech(fullMsg);
      } else if (praiseMsg && questionMsg) {
        // Tách: đọc lời khen → đợi xong → đọc câu hỏi
        await vietnameseTTS.speakAsync(praiseMsg);
        await new Promise(r => setTimeout(r, 400));
        playSpeech(questionMsg);
      } else {
        playSpeech(fullMsg);
      }
    }, 1500);
  };

  // Victory celebration fanfare sound
  const playVictoryFanfare = (): Promise<void> => {
    return new Promise(resolve => {
      try {
        const ctx = new AudioContext();
        const notes = [523, 659, 784, 1047, 784, 1047]; // C5-E5-G5-C6-G5-C6
        const durations = [200, 200, 200, 300, 150, 500]; // ms
        let time = ctx.currentTime;

        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = i < 4 ? 'sine' : 'triangle';
          gain.gain.value = 0.3;
          gain.gain.exponentialRampToValueAtTime(0.01, time + durations[i] / 1000);
          osc.start(time);
          osc.stop(time + durations[i] / 1000);
          time += durations[i] / 1000 * 0.8; // slight overlap
        });

        setTimeout(() => { ctx.close(); resolve(); }, 1500);
      } catch { resolve(); }
    });
  };

  // Sad game over sound
  const playSadSound = (): Promise<void> => {
    return new Promise(resolve => {
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 400;
        osc.type = 'sine';
        gain.gain.value = 0.3;
        osc.start();
        osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
        setTimeout(() => { osc.stop(); ctx.close(); resolve(); }, 1200);
      } catch { resolve(); }
    });
  };

  const toggleListening = () => {
    if (state.isListening) { recognitionRef.current?.stop(); }
    else { vietnameseTTS.stop(); recognitionRef.current?.start(); setState(prev => ({ ...prev, isListening: true })); }
  };

  const handleHint = () => {
    if (state.hearts <= 0.5 || state.isLoading) return;
    const currentQ = state.questions[state.currentQIndex];
    if (!currentQ) return;
    const hintMsg = `Gợi ý nè! Đáp án nằm trong khoảng từ ${currentQ.answer - 5} đến ${currentQ.answer + 5} nhé!`;
    setState(prev => ({
      ...prev,
      hearts: prev.hearts - 0.5,
      messages: [...prev.messages, { role: 'ai', text: hintMsg }],
      aiResponse: { ...prev.aiResponse, message: hintMsg },
    }));
    playSpeech(hintMsg);
  };

  const resetGame = () => { vietnameseTTS.stop(); setState(INITIAL_STATE); };

  const getStarRating = () => {
    const ratio = state.correctCount / state.totalQuestions;
    if (ratio >= 0.8) return 3;
    if (ratio >= 0.5) return 2;
    return 1;
  };

  // canStart không cần nữa vì nút sẵn sàng chỉ hiện ở phase 3 sau khi chọn topic

  // ── RENDER ──────────────────────────────────────────────
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative bg-gradient-to-br ${state.bgGradient} transition-all duration-1000`}>
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className={`absolute top-10 left-10 w-64 h-64 ${state.bgBlob1} rounded-full blur-3xl animate-pulse transition-colors duration-1000`} />
        <div className={`absolute bottom-10 right-10 w-80 h-80 ${state.bgBlob2} rounded-full blur-3xl animate-pulse transition-colors duration-1000`} />
      </div>

      <AnimatePresence mode="wait">
        {/* ══════════ START SCREEN ══════════ */}
        {state.currentStep === 'START' && (
          <motion.div key="start" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.1 }}
            className="text-center space-y-8 glass-card p-12 max-w-lg w-full border-4 border-white shadow-2xl">
            <motion.div animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="inline-block">
              <img src={state.robotImage} alt="Robot" className="w-32 h-32 object-contain mx-auto rounded-full border-4 border-white shadow-xl bg-white/50" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-display text-indigo-900 leading-tight drop-shadow-sm">
              THỬ THÁCH <br /> <span className="text-orange-600">CÙNG AI</span>
            </h1>
            <p className="text-xl text-slate-600 font-semibold italic">"Gặp gỡ Robot Thông Thái và học toán thật vui!"</p>
            <button onClick={goToSetup} className="btn-primary text-2xl w-full flex items-center justify-center gap-3 py-6 shadow-indigo-200">
              <Sparkles className="w-8 h-8" /> BẮT ĐẦU NGAY
            </button>
          </motion.div>
        )}

        {/* ══════════ SETUP SCREEN — Conversational ══════════ */}
        {state.currentStep === 'SETUP' && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full max-w-2xl space-y-5">

            {/* Robot + Chat Bubbles */}
            <div className="flex items-start gap-4">
              {/* Robot Avatar */}
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="flex-shrink-0 relative">
                <img src={state.robotImage} alt="Robot" className="w-28 h-28 md:w-36 md:h-36 object-contain rounded-2xl shadow-xl border-3 border-white bg-white/50" />
                {state.isSpeaking && (
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}
                    className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full p-2 shadow-lg border-2 border-white">
                    <Volume2 className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </motion.div>

              {/* Chat Messages */}
              <div className="flex-1 space-y-3">
                {/* Greeting Bubble */}
                {state.setupPhase >= 1 && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-sm p-5 shadow-lg border border-white/50">
                      <p className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed">
                        {greeting.displayed}<span className={`${greeting.done ? 'hidden' : 'animate-pulse'}`}>|</span>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Topic Intro Bubble */}
                {state.setupPhase >= 2 && state.setupPhase < 3 && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-sm p-5 shadow-lg border border-white/50">
                      <p className="text-base md:text-lg font-semibold text-slate-700 leading-relaxed">
                        {topicIntro.displayed}<span className={`${topicIntro.done ? 'hidden' : 'animate-pulse'}`}>|</span>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Transition Story Bubble */}
                {state.setupPhase >= 3 && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                    <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-2xl rounded-tl-sm shadow-xl">
                      <div className="bg-white rounded-[14px] p-5">
                        <p className="text-base md:text-lg font-bold text-slate-800 leading-relaxed">
                          {transitionStory.displayed}<span className={`${transitionStory.done ? 'hidden' : 'animate-pulse'}`}>|</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Topic Buttons — appear after topicIntro done, HIDE when phase 3 */}
            {topicIntro.done && state.setupPhase < 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="glass-card p-6 border-2 border-white shadow-xl space-y-5">

                {/* 3 Preset Topic Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PRESET_TOPICS.map(topic => (
                    <button key={topic.id} onClick={() => selectPresetTopic(topic)}
                      className="p-4 rounded-2xl border-3 border-white/60 bg-white/70 hover:border-indigo-300 hover:shadow-lg hover:scale-[1.02] transition-all text-center space-y-1">
                      <div className="text-3xl">{topic.icon}</div>
                      <div className="font-bold text-sm text-slate-800">{topic.label}</div>
                      <div className="text-xs text-slate-500">{topic.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Custom Topic Input + Button */}
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">✏️ Hoặc nhập chủ đề riêng</p>
                  <div className="flex gap-2">
                    <input type="text" value={state.customTopic}
                      onChange={(e) => setState(prev => ({ ...prev, customTopic: e.target.value, selectedTopic: '', selectedTopicId: '' }))}
                      placeholder="Ví dụ: Phép chia 2 chữ số, Đo lường..."
                      className="flex-1 bg-white/80 border-2 border-white/60 rounded-xl px-4 py-3 font-semibold outline-none focus:border-indigo-400 transition" />
                    {state.customTopic.trim() && (
                      <button onClick={() => {
                        vietnameseTTS.stop();
                        setState(prev => ({
                          ...prev,
                          selectedTopic: prev.customTopic.trim(),
                          selectedTopicId: '',
                          bgGradient: DEFAULT_BG.gradient,
                          bgBlob1: DEFAULT_BG.blob1,
                          bgBlob2: DEFAULT_BG.blob2,
                          robotImage: '/robot_custom.png',
                          transitionMsg: CUSTOM_TRANSITION,
                          setupPhase: 3,
                        }));
                      }}
                        className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg">
                        <ChevronRight className="w-5 h-5" /> Chọn
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Slider + Start Button — appear after transition done */}
            {state.setupPhase >= 3 && transitionStory.done && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="glass-card p-6 border-2 border-white shadow-xl space-y-5">

                {/* Question Count Slider */}
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                    🎯 Chọn số thử thách: <span className="text-indigo-600 text-base">{state.totalQuestions}</span> câu
                  </p>
                  <input type="range" min={3} max={10} value={state.totalQuestions}
                    onChange={(e) => setState(prev => ({ ...prev, totalQuestions: parseInt(e.target.value) }))}
                    className="w-full h-3 bg-white/60 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                  <div className="flex justify-between text-xs font-bold text-slate-400 mt-1"><span>3 câu</span><span>10 câu</span></div>
                </div>

                {/* Start Button */}
                <button onClick={handleStartGame}
                  className="btn-primary text-xl w-full flex items-center justify-center gap-3 py-5">
                  <Target className="w-7 h-7" /> SẴN SÀNG THỬ THÁCH! 🚀
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ══════════ READY SCREEN ══════════ */}
        {state.currentStep === 'READY' && (
          <motion.div key="ready" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="text-center space-y-6 glass-card p-10 md:p-12 max-w-lg w-full border-4 border-white shadow-2xl">

            {/* Robot */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="inline-block">
              <img src={state.robotImage} alt="Robot" className="w-36 h-36 object-contain mx-auto rounded-full border-4 border-white shadow-xl bg-white/50" />
              {state.isSpeaking && (
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}
                  className="mx-auto mt-2 bg-indigo-600 rounded-full p-2 w-fit shadow-lg border-2 border-white">
                  <Volume2 className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </motion.div>

            {/* Message */}
            <div className="bg-white/80 rounded-2xl p-6 border border-white/50 shadow-lg">
              <p className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
                Chào mừng Hiệp sĩ! 🛡️<br />
                Chủ đề: <span className="text-indigo-600">{state.customTopic || state.selectedTopic}</span><br />
                <span className="text-orange-600">{state.totalQuestions} câu</span> thử thách từ dễ đến khó.<br />
                Hiệp sĩ đã sẵn sàng chưa? 💪
              </p>
            </div>

            {/* Ready Button */}
            <motion.button
              onClick={confirmReady}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="btn-primary text-2xl w-full flex items-center justify-center gap-3 py-6 shadow-indigo-200"
            >
              <Sparkles className="w-8 h-8" /> SẴN SÀNG! 🚀
            </motion.button>
          </motion.div>
        )}

        {/* ══════════ PLAYING SCREEN ══════════ */}
        {state.currentStep === 'PLAYING' && (
          <motion.div key="playing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl flex flex-col h-[90vh] space-y-4">

            {/* Header Stats */}
            <div className="flex justify-between items-center glass-card px-6 py-3 border-2 border-white">
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div key={i} animate={i < state.hearts ? { scale: [1, 1.2, 1] } : {}} transition={{ repeat: i < state.hearts ? Infinity : 0, duration: 2 }}>
                    <Heart className={`w-8 h-8 transition-all duration-500 ${i < Math.floor(state.hearts) ? 'text-red-500 fill-red-500 drop-shadow-md' : i < state.hearts ? 'text-red-300 fill-red-300' : 'text-slate-200 fill-slate-200'}`} />
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-1.5 shadow">
                  <Trophy className="w-4 h-4" /> {state.correctCount} đúng
                </div>
                <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-1.5 shadow">
                  <Brain className="w-4 h-4" /> Câu {state.aiResponse?.currentQuestionIndex || 1}/{state.totalQuestions}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="glass-card px-4 py-2 border-2 border-white">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Tiến trình</span>
                <div className="flex-1 h-3 bg-white/60 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((state.currentQIndex) / state.totalQuestions) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-xs font-bold text-indigo-600">{Math.round((state.currentQIndex / state.totalQuestions) * 100)}%</span>
              </div>
            </div>

            {/* Feedback Overlay */}
            <AnimatePresence>
              {state.feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none`}
                >
                  <div className={`text-8xl md:text-9xl font-display drop-shadow-2xl ${state.feedback === 'correct' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {state.feedback === 'correct' ? '✅' : '❌'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Area */}
            <div className="flex-1 glass-card p-4 flex flex-col relative overflow-hidden border-2 border-white shadow-inner">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1" style={{ maxHeight: '45vh' }}>
                {state.messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="flex items-start gap-3 max-w-[95%]">
                        <img src={state.robotImage} alt="Robot" className="w-12 h-12 rounded-full border-2 border-indigo-200 bg-white/50 flex-shrink-0 mt-1" />
                        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[3px] rounded-3xl shadow-xl flex-1">
                          <div className="bg-white rounded-[21px] px-5 py-4">
                            <p className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed">{formatQuestionText(msg.text)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {msg.role === 'user' && (
                      <div className="bg-emerald-500 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[50%] shadow">
                        <p className="text-sm font-semibold">{msg.text}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>
              {state.isLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="bg-white/90 rounded-2xl px-8 py-4 shadow-xl flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-3 h-3 bg-indigo-600 rounded-full" />
                      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-3 h-3 bg-purple-500 rounded-full" />
                      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-3 h-3 bg-pink-500 rounded-full" />
                    </div>
                    <span className="text-sm font-bold text-slate-600">Robot đang suy nghĩ...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="space-y-3">
              {/* Text Input + Send */}
              <div className="flex gap-2 glass-card p-2 border-2 border-white shadow-lg">
                <input type="text" value={state.inputText}
                  onChange={(e) => setState(prev => ({ ...prev, inputText: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleUserMessage(state.inputText)}
                  placeholder="Nhập đáp án số hoặc nói..." className="flex-1 bg-transparent px-4 py-3 outline-none font-semibold text-xl" disabled={state.isLoading} />
                <button onClick={() => handleUserMessage(state.inputText)} disabled={!state.inputText.trim() || state.isLoading}
                  className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50">
                  <Send className="w-6 h-6" />
                </button>
              </div>

              {/* Numpad */}
              <div className="glass-card p-3 border-2 border-white shadow-lg">
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
                    <button key={n} onClick={() => setState(prev => ({ ...prev, inputText: prev.inputText + String(n) }))}
                      disabled={state.isLoading}
                      className="bg-white/80 hover:bg-indigo-100 border-2 border-white/60 rounded-xl py-3 text-xl font-bold text-slate-800 transition hover:scale-105 active:scale-95 disabled:opacity-50">
                      {n}
                    </button>
                  ))}
                  <button onClick={() => setState(prev => ({ ...prev, inputText: prev.inputText.slice(0, -1) }))}
                    className="bg-red-100 hover:bg-red-200 border-2 border-red-200/60 rounded-xl py-3 text-sm font-bold text-red-600 transition">
                    ⌫ Xoá
                  </button>
                  <button onClick={() => handleUserMessage(state.inputText)}
                    disabled={!state.inputText.trim() || state.isLoading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 text-sm font-bold transition disabled:opacity-50">
                    ✓ Gửi
                  </button>
                </div>
              </div>

              {/* Mic + Hint */}
              <div className="flex gap-3 items-center justify-center">
                <button onClick={handleHint} disabled={state.hearts <= 0.5 || state.isLoading}
                  className="btn-secondary bg-amber-500 hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2 py-3 px-5 shadow-amber-200">
                  <HelpCircle className="w-5 h-5" /><span className="text-xs font-bold">Gợi ý (-0.5 ❤️)</span>
                </button>
                <button onClick={toggleListening} disabled={state.isLoading}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border-4 border-white ${state.isListening ? 'bg-red-500 mic-active scale-110' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                  {state.isListening ? <Mic className="w-7 h-7 text-white" /> : <MicOff className="w-7 h-7 text-white opacity-80" />}
                </button>
                {state.isListening && (
                  <div className="bg-white/80 rounded-xl px-4 py-2 border-2 border-indigo-100">
                    <p className="text-xs font-bold text-indigo-600 animate-pulse flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Đang nghe...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════════ RESULT SCREEN ══════════ */}
        {(state.currentStep === 'GAME_OVER' || state.currentStep === 'WIN') && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 glass-card p-10 md:p-12 max-w-lg w-full border-4 border-white shadow-2xl relative overflow-hidden">

            {/* Confetti animation for WIN */}
            {state.currentStep === 'WIN' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {['🎉', '⭐', '🎊', '✨', '🏆', '🌟', '💫', '🎈'].map((emoji, i) => (
                  <motion.div key={i}
                    initial={{ y: -50, x: Math.random() * 300 - 150, opacity: 1 }}
                    animate={{ y: 500, x: Math.random() * 100 - 50, opacity: 0, rotate: 360 }}
                    transition={{ duration: 3 + Math.random() * 2, delay: i * 0.3, repeat: Infinity }}
                    className="absolute text-3xl" style={{ left: `${10 + i * 12}%` }}>
                    {emoji}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Victory image + themed message */}
            <div className="relative z-10">
              {state.currentStep === 'WIN' ? (
                <motion.img
                  src={
                    state.selectedTopicId === 'forest' ? '/victory_forest.png' :
                      state.selectedTopicId === 'space' ? '/victory_space.png' :
                        state.selectedTopicId === 'castle' ? '/victory_castle.png' :
                          '/victory_custom.png'
                  }
                  alt="Victory"
                  animate={{ scale: [1, 1.05, 1], y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="w-48 h-48 mx-auto rounded-3xl shadow-2xl border-4 border-amber-300 object-cover"
                  style={{ boxShadow: '0 0 30px rgba(251, 191, 36, 0.5)' }}
                />
              ) : (
                <motion.img src={state.robotImage} alt="Robot" className="w-32 h-32 mx-auto rounded-2xl shadow-xl border-4 border-white bg-white/50" />
              )}
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl mt-3">
                {state.currentStep === 'WIN' ? '🏆' : '😿'}
              </motion.div>
            </div>

            <h1 className={`text-4xl md:text-5xl font-display leading-tight drop-shadow-sm ${state.currentStep === 'WIN' ? 'text-emerald-600' : 'text-red-600'}`}>
              {state.currentStep === 'WIN' ? 'CHIẾN THẮNG!' : 'GAME OVER'}
            </h1>

            {/* Themed victory message */}
            {state.currentStep === 'WIN' && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-2xl border-2 border-amber-200 shadow-lg">
                <p className="text-lg font-bold text-amber-800 leading-relaxed">
                  {state.selectedTopicId === 'forest' && '🌳 Hiệp sĩ Toán Học đã dũng cảm vượt qua mọi thử thách và giải cứu thành công tất cả muông thú trong Rừng Xanh Kỳ Bí! Các chú thỏ, nai, bướm đều rất vui mừng và nhảy múa ăn mừng! Cảm ơn Hiệp sĩ thông thái, khu rừng đã trở lại bình yên! 🐰🦌🦋'}
                  {state.selectedTopicId === 'space' && '🚀 Hiệp sĩ Toán Học đã anh dũng chiến đấu và đánh bại tất cả quái vật vũ trụ, giải phóng thành công các hành tinh bị chiếm đóng! Cả vũ trụ đang reo hò và bắn pháo hoa ăn mừng chiến thắng vĩ đại của Hiệp sĩ! Các hành tinh xin cảm ơn Hiệp sĩ rất nhiều! 🌍⭐🎆'}
                  {state.selectedTopicId === 'castle' && '🏰 Hiệp sĩ Toán Học đã phá bỏ mọi lời nguyền của phù thủy và giải cứu toàn bộ Vương quốc! Nhà vua vô cùng biết ơn và long trọng phong tặng Hiệp sĩ danh hiệu Tướng quân Toán học! Toàn thể vương quốc hân hoan chào đón người anh hùng! 👑🗡️✨'}
                  {(!state.selectedTopicId || state.selectedTopicId === 'custom') && '🌟 Robot Thông Thái vô cùng tự hào về Hiệp sĩ! Hiệp sĩ đã xuất sắc vượt qua tất cả các thử thách và chứng minh mình là một bậc thầy Toán học thực thụ! Xin chúc mừng Hiệp sĩ, chúng mình sẽ cùng nhau chinh phục nhiều thử thách hơn nữa nhé! 🧠💪🎉'}
                </p>
              </div>
            )}

            {/* Stars */}
            <div className="flex justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0, rotate: -180 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: i * 0.3, type: 'spring' }}>
                  <Star className={`w-12 h-12 ${i < getStarRating() ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg' : 'text-slate-200 fill-slate-200'}`} />
                </motion.div>
              ))}
            </div>
            {/* Score */}
            <div className="bg-white/60 rounded-2xl p-5 border border-white/30 space-y-3">
              <div className="flex justify-between items-center"><span className="font-bold text-slate-600">📊 Câu đúng</span><span className="text-2xl font-display text-indigo-600">{state.correctCount}/{state.totalQuestions}</span></div>
              <div className="flex justify-between items-center"><span className="font-bold text-slate-600">❤️ Tim còn lại</span><span className="text-2xl font-display text-red-500">{state.hearts}/3</span></div>
              <div className="flex justify-between items-center"><span className="font-bold text-slate-600">⭐ Đánh giá</span><span className="text-lg font-bold text-amber-600">{getStarRating() === 3 ? 'Xuất sắc!' : getStarRating() === 2 ? 'Giỏi lắm!' : 'Cần cố gắng!'}</span></div>
            </div>
            <button onClick={resetGame} className="btn-primary text-xl w-full flex items-center justify-center gap-3 py-5">
              <RotateCcw className="w-7 h-7" /> CHƠI LẠI
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 text-slate-500 text-sm font-bold tracking-widest uppercase">🚀 Thử thách cùng AI - EdTech 2026</div>
    </div>
  );
}
