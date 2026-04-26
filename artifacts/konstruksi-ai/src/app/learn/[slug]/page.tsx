'use client';

import { useState, useMemo } from 'react';
import Link from '@/shims/next-link';
import { useParams } from '@/shims/next-navigation';
import { 
  getLearningPathBySlug, 
  getCategoryColor, 
  getLevelBadge,
  getCategoryLabel,
  getTotalLessons,
  type LearningPath,
  type LearningModule,
  type Lesson
} from '@/lib/learn';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  PlayCircle,
  FileText,
  Lightbulb,
  Award,
  Target,
  ArrowRight,
  BookOpenCheck
} from 'lucide-react';

export default function LearningPathPage() {
  const params = useParams();
  const slug = params.slug as string;
  const path = getLearningPathBySlug(slug);

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  if (!path) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Learning Path Tidak Ditemukan</h1>
          <p className="text-slate-500 mb-4">Maaf, learning path yang Anda cari tidak tersedia.</p>
          <Link href="/learn" className="text-blue-600 hover:underline">
            Kembali ke Daftar Learning Paths
          </Link>
        </div>
      </div>
    );
  }

  const activeModule = activeModuleId 
    ? path.modules.find(m => m.id === activeModuleId) 
    : null;
  const activeLesson = activeModule && activeLessonId
    ? activeModule.lessons.find(l => l.id === activeLessonId)
    : null;

  if (activeLesson) {
    return (
      <LessonPlayer 
        path={path} 
        module={activeModule!} 
        lesson={activeLesson}
        onBack={() => setActiveLessonId(null)}
        onComplete={() => {
          // Mark lesson as complete and move to next
          setActiveLessonId(null);
        }}
      />
    );
  }

  if (showQuiz && activeModule) {
    return (
      <QuizPlayer
        path={path}
        module={activeModule}
        onBack={() => setShowQuiz(false)}
        onComplete={() => {
          setShowQuiz(false);
          setActiveModuleId(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className={`bg-gradient-to-br ${getCategoryColor(path.category)}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/learn" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Learning Paths
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="text-6xl">{path.thumbnail}</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`${getLevelBadge(path.level).color} px-3 py-1 rounded-full text-xs font-semibold`}>
                  {getLevelBadge(path.level).text}
                </span>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {getCategoryLabel(path.category)}
                </span>
                <div className="flex items-center gap-1 text-white/90">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span className="text-sm font-medium">{path.rating}</span>
                  <span className="text-white/60">({path.reviewCount} ulasan)</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{path.title}</h1>
              <p className="text-blue-100 text-lg max-w-3xl">{path.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 mt-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{path.estimatedHours} jam total</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{path.modules.length} modul</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{path.enrolledCount.toLocaleString()} peserta</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                Mulai Belajar
              </button>
              <button className="bg-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors">
                Preview Gratis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Yang Akan Anda Pelajari
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {path.outcomes.map((outcome, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Prerequisites */}
            <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpenCheck className="w-5 h-5 text-orange-600" />
                Prasyarat
              </h2>
              <ul className="space-y-2">
                {path.prerequisites.map((prereq, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </section>

            {/* Modules */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Daftar Modul
              </h2>
              <div className="space-y-4">
                {path.modules.map((module, index) => (
                  <ModuleCard 
                    key={module.id} 
                    module={module} 
                    index={index}
                    isActive={activeModuleId === module.id}
                    onClick={() => setActiveModuleId(activeModuleId === module.id ? null : module.id)}
                    onStartLesson={(lessonId) => {
                      setActiveModuleId(module.id);
                      setActiveLessonId(lessonId);
                    }}
                    onStartQuiz={() => {
                      setActiveModuleId(module.id);
                      setShowQuiz(true);
                    }}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Certification */}
            {path.certificationAwarded && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-8 h-8 text-yellow-600" />
                  <h3 className="font-bold text-slate-900">Sertifikat Tersedia</h3>
                </div>
                <p className="text-slate-700 mb-4">
                  Selesaikan learning path ini untuk mendapatkan:
                </p>
                <div className="bg-white rounded-xl p-4 border border-yellow-200">
                  <p className="font-semibold text-slate-900">{path.certificationAwarded}</p>
                  <p className="text-sm text-slate-500 mt-1">Diterbitkan oleh KonstruksiAI</p>
                </div>
              </div>
            )}

            {/* Progress Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Progress Anda</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">0% Selesai</span>
                  <span className="text-slate-900 font-medium">0/{getTotalLessons(path)} pelajaran</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Daftar untuk melacak progress belajar Anda
              </p>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Instruktur</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  KAI
                </div>
                <div>
                  <p className="font-semibold text-slate-900">KonstruksiAI Team</p>
                  <p className="text-sm text-slate-500">Engineering Education Experts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ 
  module, 
  index, 
  isActive, 
  onClick,
  onStartLesson,
  onStartQuiz
}: { 
  module: LearningModule; 
  index: number; 
  isActive: boolean;
  onClick: () => void;
  onStartLesson: (lessonId: string) => void;
  onStartQuiz: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        onClick={onClick}
        className="w-full p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors"
      >
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-bold text-slate-900 mb-1">{module.title}</h3>
          <p className="text-sm text-slate-500 mb-2">{module.description}</p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {module.duration}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {module.lessons.length} pelajaran
            </span>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isActive ? 'rotate-90' : ''}`} />
      </button>

      {isActive && (
        <div className="border-t border-slate-100">
          <div className="p-6 space-y-3">
            {module.lessons.map((lesson, i) => (
              <button
                key={lesson.id}
                onClick={() => onStartLesson(lesson.id)}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors text-left group"
              >
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-white">
                  {lesson.type === 'video' ? (
                    <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  ) : lesson.type === 'interactive' ? (
                    <Lightbulb className="w-4 h-4 text-slate-400 group-hover:text-yellow-600" />
                  ) : lesson.type === 'practice' ? (
                    <Target className="w-4 h-4 text-slate-400 group-hover:text-green-600" />
                  ) : (
                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 group-hover:text-blue-700">{lesson.title}</p>
                  <p className="text-xs text-slate-500">{lesson.duration}</p>
                </div>
                <Circle className="w-5 h-5 text-slate-300" />
              </button>
            ))}

            {/* Quiz */}
            <button
              onClick={onStartQuiz}
              className="w-full flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 hover:border-yellow-300 transition-colors text-left mt-4"
            >
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <BookOpenCheck className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Quiz: {module.quiz.title}</p>
                <p className="text-xs text-slate-500">{module.quiz.questions.length} soal • {module.quiz.timeLimit} menit</p>
              </div>
              <ArrowRight className="w-5 h-5 text-yellow-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LessonPlayer({ 
  path, 
  module, 
  lesson, 
  onBack,
  onComplete 
}: { 
  path: LearningPath;
  module: LearningModule;
  lesson: Lesson;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Kembali ke Modul</span>
            </button>
            
            <div className="flex-1 mx-8 text-center">
              <p className="text-slate-400 text-sm">{path.title}</p>
              <p className="text-white font-medium">{module.title}</p>
            </div>
            
            <button
              onClick={() => {
                setIsCompleted(true);
                onComplete();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isCompleted 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {isCompleted ? 'Selesai' : 'Tandai Selesai'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {lesson.type === 'video' && <PlayCircle className="w-4 h-4" />}
              {lesson.type === 'reading' && <FileText className="w-4 h-4" />}
              {lesson.type === 'interactive' && <Lightbulb className="w-4 h-4" />}
              {lesson.type === 'practice' && <Target className="w-4 h-4" />}
              {lesson.type === 'video' ? 'Video' : lesson.type === 'reading' ? 'Bacaan' : lesson.type === 'interactive' ? 'Interaktif' : 'Latihan'}
            </span>
            <span className="text-slate-500 text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {lesson.duration}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">{lesson.title}</h1>

          {/* Content */}
          <div className="prose prose-slate prose-lg max-w-none">
            {lesson.type === 'video' ? (
              <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center mb-8">
                <div className="text-center">
                  <PlayCircle className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70">Video Player</p>
                  <p className="text-white/50 text-sm">{lesson.content}</p>
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                {lesson.content}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-200">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ChevronLeft className="w-5 h-5" />
              Pelajaran Sebelumnya
            </button>
            <button
              onClick={() => {
                setIsCompleted(true);
                onComplete();
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Pelajaran Selanjutnya
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizPlayer({
  path,
  module,
  onBack,
  onComplete
}: {
  path: LearningPath;
  module: LearningModule;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [answers, setAnswers] = useState<(string | number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);

  const quiz = module.quiz;
  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score += q.points;
      }
    });
    return score;
  };

  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  const score = calculateScore();
  const percentage = Math.round((score / totalPoints) * 100);
  const passed = percentage >= quiz.passingScore;

  if (showResults) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {passed ? (
                <CheckCircle className="w-12 h-12 text-green-600" />
              ) : (
                <Circle className="w-12 h-12 text-red-600" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {passed ? 'Selamat!' : 'Belum Lulus'}
            </h2>
            <p className="text-slate-600 mb-6">
              {passed 
                ? 'Anda telah berhasil menyelesaikan quiz ini.' 
                : 'Anda perlu belajar lebih banyak untuk lulus quiz ini.'}
            </p>

            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold text-slate-900 mb-2">{percentage}%</div>
              <p className="text-slate-500">{score} / {totalPoints} poin</p>
              <p className="text-sm text-slate-400 mt-1">Minimal lulus: {quiz.passingScore}%</p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={onComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
              >
                Kembali ke Modul
              </button>
              {!passed && (
                <button
                  onClick={() => {
                    setCurrentQuestion(0);
                    setSelectedAnswer(null);
                    setAnswers([]);
                    setShowResults(false);
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-8 py-3 rounded-xl font-medium transition-colors"
                >
                  Coba Lagi
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Kembali
          </button>
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">{quiz.title}</h1>
            <span className="text-slate-500">
              Soal {currentQuestion + 1} dari {quiz.questions.length}
            </span>
          </div>
          
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200">
          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
              {question.points} poin
            </span>
            <h2 className="text-xl font-medium text-slate-900">{question.question}</h2>
          </div>

          {/* Options */}
          {question.type === 'multiple_choice' && question.options && (
            <div className="space-y-3">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedAnswer(i)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedAnswer === i
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === i ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                    }`}>
                      {selectedAnswer === i && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-slate-700">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {question.type === 'fill_blank' && (
            <div className="space-y-4">
              <input
                type="text"
                value={selectedAnswer as string || ''}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder="Ketik jawaban Anda..."
                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {question.type === 'calculation' && (
            <div className="space-y-4">
              <input
                type="number"
                value={selectedAnswer as number || ''}
                onChange={(e) => setSelectedAnswer(parseFloat(e.target.value))}
                placeholder="Masukkan hasil perhitungan..."
                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleAnswer}
              disabled={selectedAnswer === null}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium transition-colors"
            >
              {currentQuestion < quiz.questions.length - 1 ? 'Selanjutnya' : 'Selesai'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
