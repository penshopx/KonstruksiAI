'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  EXAM_SETS,
  calculateScore,
  getCategoryLabel,
  getLevelLabel,
  getLevelColor,
  type ExamSet,
  type ExamQuestion,
} from '@/lib/simulasi';
import {
  Play,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Target,
  AlertCircle,
  Trophy,
  Star,
  Filter,
} from 'lucide-react';

type ExamState = 'list' | 'intro' | 'exam' | 'result';

export default function SimulasiPage() {
  const [examState, setExamState] = useState<ExamState>('list');
  const [selectedExam, setSelectedExam] = useState<ExamSet | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const filteredExams = EXAM_SETS.filter(e =>
    filterLevel === 'all' || e.level === filterLevel
  );

  const handleFinishExam = useCallback(() => {
    setExamState('result');
  }, []);

  // Timer
  useEffect(() => {
    if (examState !== 'exam' || !selectedExam) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examState, selectedExam, handleFinishExam]);

  const startExam = (exam: ExamSet) => {
    setSelectedExam(exam);
    setExamState('intro');
  };

  const beginExam = () => {
    if (!selectedExam) return;
    setCurrentQuestion(0);
    setAnswers(new Array(selectedExam.questions.length).fill(-1));
    setTimeLeft(selectedExam.duration * 60);
    setStartTime(new Date());
    setShowExplanation(false);
    setExamState('exam');
  };

  const handleAnswer = (answerIndex: number) => {
    if (!selectedExam) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (!selectedExam) return;
    if (currentQuestion < selectedExam.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const resetExam = () => {
    setExamState('list');
    setSelectedExam(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setTimeLeft(0);
    setStartTime(null);
    setShowExplanation(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 300) return 'text-green-600';
    if (timeLeft > 60) return 'text-amber-600';
    return 'text-red-600';
  };

  if (examState === 'exam' && selectedExam) {
    const question = selectedExam.questions[currentQuestion];
    const answeredCount = answers.filter(a => a !== -1).length;

    return (
      <ExamInterface
        exam={selectedExam}
        question={question}
        currentQuestion={currentQuestion}
        totalQuestions={selectedExam.questions.length}
        answers={answers}
        timeLeft={timeLeft}
        showExplanation={showExplanation}
        answeredCount={answeredCount}
        formatTime={formatTime}
        getTimeColor={getTimeColor}
        onAnswer={handleAnswer}
        onNext={nextQuestion}
        onPrev={prevQuestion}
        onFinish={handleFinishExam}
        onToggleExplanation={() => setShowExplanation(!showExplanation)}
        onJumpTo={(i) => { setCurrentQuestion(i); setShowExplanation(false); }}
      />
    );
  }

  if (examState === 'result' && selectedExam && startTime) {
    const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
    const result = calculateScore(selectedExam.questions, answers);

    return (
      <ExamResult
        exam={selectedExam}
        result={result}
        answers={answers}
        timeSpent={timeSpent}
        onRetry={beginExam}
        onBack={resetExam}
      />
    );
  }

  if (examState === 'intro' && selectedExam) {
    return (
      <ExamIntro
        exam={selectedExam}
        onStart={beginExam}
        onBack={() => setExamState('list')}
      />
    );
  }

  // Exam List
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Target className="w-4 h-4 text-violet-200" />
            <span className="text-white/90 text-sm font-medium">Simulasi Uji Kompetensi SKK/SKKNI</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Simulasi
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-pink-200">
              Uji Kompetensi
            </span>
          </h1>

          <p className="text-lg md:text-xl text-violet-100 max-w-3xl mx-auto mb-10">
            Latihan soal ujian sertifikasi SKK/SKKNI untuk tenaga teknik konstruksi, energi, K3, dan manajemen proyek.
            Persiapkan diri Anda sebelum ujian resmi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: BookOpen, value: EXAM_SETS.length, label: 'Paket Ujian' },
              { icon: Target, value: EXAM_SETS.reduce((s, e) => s + e.questions.length, 0), label: 'Total Soal' },
              { icon: Clock, value: '60-90', label: 'Menit/Ujian' },
              { icon: Trophy, value: '70%', label: 'Nilai Lulus' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <stat.icon className="w-6 h-6 text-violet-200 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-violet-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter */}
        <div className="flex items-center gap-3 mb-8">
          <Filter className="w-5 h-5 text-slate-500" />
          <span className="text-slate-600 font-medium">Filter Level:</span>
          {['all', 'operator', 'teknisi', 'supervisor', 'ahli'].map(level => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterLevel === level
                  ? 'bg-violet-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300'
              }`}
            >
              {level === 'all' ? 'Semua' : getLevelLabel(level as ExamSet['level'])}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map(exam => (
            <ExamCard key={exam.id} exam={exam} onStart={() => startExam(exam)} />
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-16 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-8 border border-violet-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Star className="w-6 h-6 text-violet-600" />
            Tips Sukses Uji Kompetensi
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Pelajari Materi Bimtek',
                desc: 'Kuasai materi dari modul bimtek sebelum mengikuti simulasi ujian.',
              },
              {
                icon: RotateCcw,
                title: 'Latihan Berulang',
                desc: 'Ulangi simulasi ujian hingga mencapai nilai >80% secara konsisten.',
              },
              {
                icon: Clock,
                title: 'Manajemen Waktu',
                desc: 'Latih kecepatan menjawab soal agar tidak kehabisan waktu saat ujian.',
              },
              {
                icon: CheckCircle,
                title: 'Pahami Penjelasan',
                desc: 'Baca penjelasan setiap soal untuk memahami konsep yang benar.',
              },
              {
                icon: Target,
                title: 'Fokus pada Regulasi',
                desc: 'Hafal nomor dan isi regulasi utama yang sering muncul di ujian.',
              },
              {
                icon: Award,
                title: 'Daftar Ujian Resmi',
                desc: 'Setelah siap, daftar ujian SKK resmi di LSP yang terakreditasi BNSP.',
              },
            ].map((tip, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <tip.icon className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{tip.title}</h3>
                  <p className="text-sm text-slate-600">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ============ EXAM CARD ============
function ExamCard({ exam, onStart }: { exam: ExamSet; onStart: () => void }) {
  const colorMap: Record<string, string> = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    teal: 'bg-teal-500',
    cyan: 'bg-cyan-500',
  };

  const bgColor = colorMap[exam.color] || 'bg-slate-500';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-violet-300 hover:shadow-lg transition-all overflow-hidden group">
      <div className={`${bgColor} p-6 text-white`}>
        <div className="text-4xl mb-3">{exam.icon}</div>
        <h3 className="text-lg font-bold leading-tight">{exam.title}</h3>
        {exam.skkniCode && (
          <p className="text-white/70 text-xs mt-1 font-mono">{exam.skkniCode}</p>
        )}
      </div>

      <div className="p-6">
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{exam.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
            {getCategoryLabel(exam.category)}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(exam.level)}`}>
            {getLevelLabel(exam.level)}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5 text-center">
          <div className="bg-slate-50 rounded-lg p-2">
            <div className="font-bold text-slate-900">{exam.questions.length}</div>
            <div className="text-xs text-slate-500">Soal</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2">
            <div className="font-bold text-slate-900">{exam.duration}</div>
            <div className="text-xs text-slate-500">Menit</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2">
            <div className="font-bold text-slate-900">{exam.passingScore}%</div>
            <div className="text-xs text-slate-500">Lulus</div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 transition-colors"
        >
          <Play className="w-4 h-4" />
          Mulai Simulasi
        </button>
      </div>
    </div>
  );
}

// ============ EXAM INTRO ============
function ExamIntro({ exam, onStart, onBack }: { exam: ExamSet; onStart: () => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 text-sm">
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{exam.icon}</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{exam.title}</h1>
          <p className="text-slate-600">{exam.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { icon: BookOpen, label: 'Jumlah Soal', value: `${exam.questions.length} soal` },
            { icon: Clock, label: 'Waktu', value: `${exam.duration} menit` },
            { icon: Target, label: 'Nilai Lulus', value: `${exam.passingScore}%` },
            { icon: GraduationCap, label: 'Level', value: getLevelLabel(exam.level) },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <item.icon className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500">{item.label}</div>
                <div className="font-semibold text-slate-900">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">Petunjuk Ujian</h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Pilih satu jawaban yang paling tepat untuk setiap soal</li>
                <li>• Anda dapat menavigasi antar soal menggunakan tombol navigasi</li>
                <li>• Waktu akan berjalan otomatis setelah ujian dimulai</li>
                <li>• Ujian akan berakhir otomatis jika waktu habis</li>
                <li>• Nilai lulus minimal {exam.passingScore}%</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-violet-700 transition-colors"
        >
          <Play className="w-5 h-5" />
          Mulai Ujian Sekarang
        </button>
      </div>
    </div>
  );
}

// ============ EXAM INTERFACE ============
function ExamInterface({
  exam,
  question,
  currentQuestion,
  totalQuestions,
  answers,
  timeLeft,
  showExplanation,
  answeredCount,
  formatTime,
  getTimeColor,
  onAnswer,
  onNext,
  onPrev,
  onFinish,
  onToggleExplanation,
  onJumpTo,
}: {
  exam: ExamSet;
  question: ExamQuestion;
  currentQuestion: number;
  totalQuestions: number;
  answers: number[];
  timeLeft: number;
  showExplanation: boolean;
  answeredCount: number;
  formatTime: (s: number) => string;
  getTimeColor: () => string;
  onAnswer: (i: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
  onToggleExplanation: () => void;
  onJumpTo: (i: number) => void;
}) {
  const selectedAnswer = answers[currentQuestion];
  const isAnswered = selectedAnswer !== -1;
  const isCorrect = isAnswered && selectedAnswer === question.correctAnswer;

  const difficultyColor = {
    mudah: 'bg-green-100 text-green-700',
    sedang: 'bg-amber-100 text-amber-700',
    sulit: 'bg-red-100 text-red-700',
  }[question.difficulty];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">{exam.title}</span>
            <span className="text-slate-400">|</span>
            <span className="text-sm text-slate-500">
              Soal {currentQuestion + 1}/{totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">
              {answeredCount}/{totalQuestions} dijawab
            </div>
            <div className={`flex items-center gap-2 font-mono font-bold text-lg ${getTimeColor()}`}>
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={onFinish}
              className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-200">
          <div
            className="h-full bg-violet-600 transition-all"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-4 gap-6">
        {/* Question */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            {/* Question Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-violet-100 text-violet-700 text-sm font-bold px-3 py-1 rounded-full">
                Soal {currentQuestion + 1}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor}`}>
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                {question.topic}
              </span>
            </div>

            {/* Question Text */}
            <p className="text-lg text-slate-900 font-medium mb-6 leading-relaxed">
              {question.question}
            </p>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, i) => {
                let optionStyle = 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50';

                if (isAnswered) {
                  if (i === question.correctAnswer) {
                    optionStyle = 'border-green-500 bg-green-50';
                  } else if (i === selectedAnswer && i !== question.correctAnswer) {
                    optionStyle = 'border-red-500 bg-red-50';
                  } else {
                    optionStyle = 'border-slate-200 bg-slate-50 opacity-60';
                  }
                } else if (i === selectedAnswer) {
                  optionStyle = 'border-violet-500 bg-violet-50';
                }

                return (
                  <button
                    key={i}
                    onClick={() => !isAnswered && onAnswer(i)}
                    disabled={isAnswered}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${optionStyle} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      isAnswered && i === question.correctAnswer
                        ? 'bg-green-500 text-white'
                        : isAnswered && i === selectedAnswer && i !== question.correctAnswer
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-slate-800">{option}</span>
                    {isAnswered && i === question.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" />
                    )}
                    {isAnswered && i === selectedAnswer && i !== question.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Result Feedback */}
            {isAnswered && (
              <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${
                isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
                <span className="font-medium">
                  {isCorrect ? 'Jawaban Benar! 🎉' : 'Jawaban Salah'}
                </span>
              </div>
            )}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={onToggleExplanation}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-violet-600" />
                  Penjelasan
                </span>
                <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${showExplanation ? 'rotate-90' : ''}`} />
              </button>

              {showExplanation && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  <p className="text-slate-700 mt-4 leading-relaxed">{question.explanation}</p>
                  {question.reference && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                      <span className="font-medium">Referensi:</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded">{question.reference}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={onPrev}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Sebelumnya
            </button>

            {currentQuestion < (exam.questions.length - 1) ? (
              <button
                onClick={onNext}
                className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
              >
                Selanjutnya
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onFinish}
                className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                Selesai Ujian
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-20">
            <h3 className="font-semibold text-slate-900 mb-4">Navigasi Soal</h3>
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((_, i) => {
                let btnStyle = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                if (i === currentQuestion) btnStyle = 'bg-violet-600 text-white';
                else if (answers[i] !== -1) {
                  btnStyle = answers[i] === exam.questions[i].correctAnswer
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700';
                }

                return (
                  <button
                    key={i}
                    onClick={() => onJumpTo(i)}
                    className={`w-full aspect-square rounded-lg text-xs font-bold transition-colors ${btnStyle}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-violet-600 rounded" />
                <span className="text-slate-600">Soal aktif</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 rounded" />
                <span className="text-slate-600">Benar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 rounded" />
                <span className="text-slate-600">Salah</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-100 rounded" />
                <span className="text-slate-600">Belum dijawab</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ EXAM RESULT ============
function ExamResult({
  exam,
  result,
  answers,
  timeSpent,
  onRetry,
  onBack,
}: {
  exam: ExamSet;
  result: { score: number; correct: number; total: number };
  answers: number[];
  timeSpent: number;
  onRetry: () => void;
  onBack: () => void;
}) {
  const passed = result.score >= exam.passingScore;
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Result Card */}
        <div className={`rounded-2xl p-8 text-white text-center mb-8 ${
          passed
            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
            : 'bg-gradient-to-br from-red-500 to-rose-600'
        }`}>
          <div className="text-6xl mb-4">{passed ? '🏆' : '📚'}</div>
          <h1 className="text-3xl font-bold mb-2">
            {passed ? 'Selamat! Anda Lulus!' : 'Belum Lulus'}
          </h1>
          <p className="text-white/80 mb-6">
            {passed
              ? 'Anda telah memenuhi nilai minimum kelulusan.'
              : `Nilai minimum kelulusan adalah ${exam.passingScore}%. Terus berlatih!`}
          </p>

          <div className="text-7xl font-bold mb-2">{result.score}%</div>
          <div className="text-white/80">Nilai Anda</div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-2xl font-bold">{result.correct}</div>
              <div className="text-white/70 text-sm">Benar</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-2xl font-bold">{result.total - result.correct}</div>
              <div className="text-white/70 text-sm">Salah</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-2xl font-bold">{minutes}:{seconds.toString().padStart(2, '0')}</div>
              <div className="text-white/70 text-sm">Waktu</div>
            </div>
          </div>
        </div>

        {/* Review Answers */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Review Jawaban</h2>
          <div className="space-y-4">
            {exam.questions.map((q, i) => {
              const userAnswer = answers[i];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div key={q.id} className={`rounded-xl p-4 border-2 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {isCorrect
                        ? <CheckCircle className="w-4 h-4 text-white" />
                        : <XCircle className="w-4 h-4 text-white" />
                      }
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 mb-2">
                        <span className="text-slate-500 mr-2">Soal {i + 1}.</span>
                        {q.question}
                      </p>
                      {!isCorrect && (
                        <div className="space-y-1 text-sm">
                          <p className="text-red-700">
                            <span className="font-medium">Jawaban Anda:</span>{' '}
                            {userAnswer !== -1 ? q.options[userAnswer] : 'Tidak dijawab'}
                          </p>
                          <p className="text-green-700">
                            <span className="font-medium">Jawaban Benar:</span>{' '}
                            {q.options[q.correctAnswer]}
                          </p>
                        </div>
                      )}
                      <p className="text-slate-600 text-sm mt-2 italic">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 text-white py-4 rounded-xl font-bold hover:bg-violet-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Ulangi Ujian
          </button>
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Pilih Ujian Lain
          </button>
        </div>

        {/* Study Recommendation */}
        {!passed && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Rekomendasi Belajar
            </h3>
            <p className="text-blue-800 text-sm mb-3">
              Pelajari kembali materi yang belum dikuasai melalui modul Bimtek kami.
            </p>
            <Link
              href="/bimtek"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Buka Modul Bimtek
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
