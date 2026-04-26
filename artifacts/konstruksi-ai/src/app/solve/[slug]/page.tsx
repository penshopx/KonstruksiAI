'use client';

import { useState, useMemo } from 'react';
import Link from '@/shims/next-link';
import { useParams } from '@/shims/next-navigation';
import { 
  getProblemBySlug, 
  getDifficultyColor, 
  getDifficultyLabel,
  getCategoryLabel,
  type Problem
} from '@/lib/solve';
import { 
  Code2, 
  Trophy, 
  Clock, 
  Target, 
  ChevronLeft,
  CheckCircle,
  Circle,
  Lightbulb,
  BookOpen,
  Send,
  RefreshCw,
  ThumbsUp,
  MessageSquare,
  Award,
  AlertCircle
} from 'lucide-react';

export default function ProblemSolverPage() {
  const params = useParams();
  const slug = params.slug as string;
  const problem = getProblemBySlug(slug);

  const [activeTab, setActiveTab] = useState<'problem' | 'solution' | 'discussions'>('problem');
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHints, setShowHints] = useState<number[]>([]);
  const [liked, setLiked] = useState(false);

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Problem Tidak Ditemukan</h1>
          <p className="text-slate-400 mb-4">Maaf, problem yang Anda cari tidak tersedia.</p>
          <Link href="/solve" className="text-blue-400 hover:underline">
            Kembali ke Problem Database
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!answer.trim()) return;
    
    setSubmitted(true);
    // Simple validation - in real app would be more sophisticated
    const correctAnswer = problem.testCases[0]?.expectedOutput.toLowerCase();
    const userAnswer = answer.toLowerCase();
    setIsCorrect(userAnswer.includes(correctAnswer || ''));
  };

  const handleReset = () => {
    setAnswer('');
    setSubmitted(false);
    setIsCorrect(null);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/solve" 
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Kembali</span>
              </Link>
              <div className="h-6 w-px bg-white/10" />
              <span className="text-slate-400 text-sm">{problem.id}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  liked ? 'bg-pink-500/20 text-pink-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-pink-400' : ''}`} />
                <span className="hidden sm:inline">{liked ? 'Liked' : 'Like'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Problem Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`${getDifficultyColor(problem.difficulty)} px-3 py-1 rounded-full text-sm font-semibold`}>
              {getDifficultyLabel(problem.difficulty)}
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">
              {getCategoryLabel(problem.category)}
            </span>
            <span className="flex items-center gap-1 text-yellow-400 text-sm">
              <Trophy className="w-4 h-4" />
              {problem.points} points
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{problem.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Est. {problem.estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {problem.acceptanceRate}% success rate
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              {problem.solvedCount} solved
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {[
              { id: 'problem', label: 'Problem', icon: Code2 },
              { id: 'solution', label: 'Solution', icon: BookOpen },
              { id: 'discussions', label: 'Discussions', icon: MessageSquare }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'problem' && (
              <ProblemTab 
                problem={problem} 
                answer={answer}
                setAnswer={setAnswer}
                submitted={submitted}
                isCorrect={isCorrect}
                onSubmit={handleSubmit}
                onReset={handleReset}
                showHints={showHints}
                setShowHints={setShowHints}
              />
            )}
            {activeTab === 'solution' && <SolutionTab problem={problem} />}
            {activeTab === 'discussions' && <DiscussionsTab problem={problem} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <div className="bg-slate-900 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-slate-900 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Prerequisites
              </h3>
              <ul className="space-y-2">
                {problem.prerequisites.map((prereq, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-400 text-sm">
                    <Circle className="w-3 h-3" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Problems */}
            <div className="bg-slate-900 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-4">Related Problems</h3>
              <div className="space-y-3">
                {problem.relatedProblems.slice(0, 3).map((relatedId) => (
                  <Link
                    key={relatedId}
                    href={`/solve/${relatedId}`}
                    className="block p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <span className="text-slate-300 text-sm">{relatedId}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ============ PROBLEM TAB ============
function ProblemTab({ 
  problem, 
  answer, 
  setAnswer, 
  submitted, 
  isCorrect, 
  onSubmit, 
  onReset,
  showHints,
  setShowHints
}: { 
  problem: Problem;
  answer: string;
  setAnswer: (a: string) => void;
  submitted: boolean;
  isCorrect: boolean | null;
  onSubmit: () => void;
  onReset: () => void;
  showHints: number[];
  setShowHints: (h: number[]) => void;
}) {
  const toggleHint = (index: number) => {
    if (showHints.includes(index)) {
      setShowHints(showHints.filter(i => i !== index));
    } else {
      setShowHints([...showHints, index]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Problem Description */}
      <div className="bg-slate-900 rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">Description</h2>
        <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
          {problem.description}
        </div>
      </div>

      {/* Test Case */}
      <div className="bg-slate-900 rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">Example</h2>
        {problem.testCases.map((testCase, i) => (
          <div key={i} className="space-y-4">
            <div className="bg-slate-950 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Input:</p>
              <p className="text-green-400 font-mono">{testCase.input}</p>
            </div>
            <div className="bg-slate-950 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Expected Output:</p>
              <p className="text-blue-400 font-mono">{testCase.expectedOutput}</p>
            </div>
            {testCase.explanation && (
              <div className="text-slate-400 text-sm">
                <strong className="text-slate-300">Explanation:</strong> {testCase.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hints */}
      <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Hints
          </h2>
        </div>
        <div className="divide-y divide-white/10">
          {problem.hints.map((hint, i) => (
            <div key={i}>
              <button
                onClick={() => toggleHint(i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-slate-300">Hint {i + 1}</span>
                <span className="text-slate-500 text-sm">
                  {showHints.includes(i) ? 'Hide' : 'Show'}
                </span>
              </button>
              {showHints.includes(i) && (
                <div className="px-6 pb-4">
                  <p className="text-slate-400">{hint}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Answer Input */}
      <div className="bg-slate-900 rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">Your Answer</h2>
        
        {submitted && (
          <div className={`mb-4 p-4 rounded-lg ${
            isCorrect ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'
          }`}>
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Correct!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-semibold">Incorrect. Try again!</span>
                </>
              )}
            </div>
          </div>
        )}

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer here..."
          rows={6}
          className="w-full bg-slate-950 border border-white/10 rounded-lg p-4 text-slate-300 placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="flex gap-4 mt-4">
          {!submitted ? (
            <button
              onClick={onSubmit}
              disabled={!answer.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Answer
            </button>
          ) : (
            <button
              onClick={onReset}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ SOLUTION TAB ============
function SolutionTab({ problem }: { problem: Problem }) {
  if (problem.solutions.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Solutions Yet</h3>
        <p className="text-slate-400">Be the first to provide a solution!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {problem.solutions.map((solution) => (
        <div key={solution.id} className="bg-slate-900 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {solution.authorAvatar || solution.author.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium">{solution.author}</p>
                <p className="text-slate-400 text-sm">
                  {solution.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                solution.isAccepted 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {solution.isAccepted ? 'Accepted' : 'Community'}
              </span>
              <button className="flex items-center gap-1 text-slate-400 hover:text-white">
                <ThumbsUp className="w-4 h-4" />
                {solution.votes}
              </button>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-slate-300">
              {solution.content}
            </div>
          </div>

          {solution.comments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-white font-medium mb-4">Comments</h4>
              <div className="space-y-4">
                {solution.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 text-sm">
                      {comment.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm">{comment.content}</p>
                      <p className="text-slate-500 text-xs">
                        {comment.author} • {comment.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============ DISCUSSIONS TAB ============
function DiscussionsTab({ problem }: { problem: Problem }) {
  return (
    <div className="text-center py-16">
      <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Start a Discussion</h3>
      <p className="text-slate-400 mb-6">Ask questions or share insights about this problem</p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
        New Discussion
      </button>
    </div>
  );
}
