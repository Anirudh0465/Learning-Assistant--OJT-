import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utiles/axiosInstance';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Award,
  ChevronLeft,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';

export const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Quiz taking states
  const [activeLevel, setActiveLevel] = useState(null);
  const [levelResultMode, setLevelResultMode] = useState(false);
  const [levelScore, setLevelScore] = useState({ score: 0, total: 0 });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null); // the overall result from backend

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        
        const response = await axiosInstance.get(`/quizzes/${quizId}`);
        setQuiz(response.data);
      } catch (error) {
        console.error('Failed to fetch quiz', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, navigate]);

  const getLevelBounds = (level) => {
    if (!quiz) return { start: 0, end: 0 };
    const total = quiz.questions.length;
    const third = Math.floor(total / 3);
    if (level === 'easy') return { start: 0, end: third };
    if (level === 'medium') return { start: third, end: third * 2 };
    if (level === 'hard') return { start: third * 2, end: total };
    return { start: 0, end: total };
  };

  const handleStartLevel = (level) => {
    const { start } = getLevelBounds(level);
    setActiveLevel(level);
    setCurrentIndex(start);
    setLevelResultMode(false);
  };

  const handleOptionClick = (option) => {
    if (selectedAnswers[currentIndex]) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: option }));
  };

  const bounds = getLevelBounds(activeLevel);
  const isFirstInLevel = currentIndex === bounds.start;
  const isLastInLevel = currentIndex === bounds.end - 1;

  const handleNext = () => {
    if (!isLastInLevel) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishLevel();
    }
  };

  const handlePrev = () => {
    if (!isFirstInLevel) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const finishLevel = () => {
    // Calculate local score for this level
    let currentScore = 0;
    for (let i = bounds.start; i < bounds.end; i++) {
       if (selectedAnswers[i] === quiz.questions[i].correctAnswer) {
         currentScore++;
       }
    }
    setLevelScore({ score: currentScore, total: bounds.end - bounds.start });
    setLevelResultMode(true);
  };

  const handleSubmitOverall = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const answersArray = quiz.questions.map((_, i) => selectedAnswers[i] || null);
      const response = await axiosInstance.post(`/quizzes/${quizId}/submit`, { answers: answersArray });
      setResult(response.data); 
    } catch (error) {
      console.error('Failed to submit quiz', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a21] flex items-center justify-center text-emerald-500">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#1a1a21] flex flex-col items-center justify-center text-white">
        <p className="text-gray-400 mb-4">Quiz not found or failed to load.</p>
        <Link to="/quizzes" className="text-emerald-500 hover:underline">Go back to Quizzes</Link>
      </div>
    );
  }

  // 1. Overall Result View
  if (result) {
    const percentage = Math.round((result.score / result.total) * 100);
    return (
      <div className="min-h-screen bg-[#1a1a21] text-white flex flex-col items-center justify-center p-6">
        <div className="bg-[#22222a] border border-gray-800 rounded-2xl p-10 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Overall Quiz Completed!</h2>
          <p className="text-gray-400 mb-8">{quiz.title}</p>
          
          <div className="bg-[#1a1a21] rounded-xl p-6 mb-8 border border-gray-800/60">
            <div className="text-5xl font-black text-emerald-500 mb-2">{percentage}%</div>
            <p className="text-gray-300 font-medium">You scored {result.score} out of {result.total} across all levels</p>
          </div>
          
          <Link to="/quizzes" className="block w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors">
            Return to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  // 2. Level Selection View
  if (!activeLevel) {
    return (
      <div className="min-h-screen bg-[#1a1a21] text-white flex flex-col items-center p-6 md:p-12">
        <header className="w-full max-w-4xl flex items-center justify-between mb-12">
          <Link to="/quizzes" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Exit Quiz</span>
          </Link>
          <div className="font-semibold tracking-wide text-gray-200">
            {quiz.title}
          </div>
          <button 
             onClick={handleSubmitOverall}
             disabled={isSubmitting}
             className="px-5 py-2.5 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 transition-colors rounded-lg font-medium border border-purple-500/30 shadow-sm shadow-purple-500/5 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Overall Progress'}
          </button>
        </header>

        <div className="max-w-4xl w-full text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#f1f1f1]">Choose Your Difficulty</h1>
          <p className="text-gray-400 text-lg md:text-xl">Select a level below to test your knowledge.</p>
        </div>

        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => handleStartLevel('easy')}
            className="group flex flex-col items-center p-10 bg-[#22222a] border border-gray-800 rounded-3xl transition-all duration-300 hover:bg-[#2a2a35] hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Easy</h3>
            <p className="text-gray-400 text-center leading-relaxed">Gentle questions to warm you up.</p>
          </button>

          <button 
            onClick={() => handleStartLevel('medium')}
            className="group flex flex-col items-center p-10 bg-[#22222a] border border-gray-800 rounded-3xl transition-all duration-300 hover:bg-[#2a2a35] hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Medium</h3>
            <p className="text-gray-400 text-center leading-relaxed">Test your core understanding.</p>
          </button>

          <button 
            onClick={() => handleStartLevel('hard')}
            className="group flex flex-col items-center p-10 bg-[#22222a] border border-gray-800 rounded-3xl transition-all duration-300 hover:bg-[#2a2a35] hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Hard</h3>
            <p className="text-gray-400 text-center leading-relaxed">Challenge yourself with tough concepts.</p>
          </button>
        </div>
      </div>
    );
  }

  // 3. Level Result View
  if (levelResultMode) {
    const percentage = Math.round((levelScore.score / levelScore.total) * 100);
    return (
      <div className="min-h-screen bg-[#1a1a21] text-white flex flex-col items-center justify-center p-6">
        <div className="bg-[#22222a] border border-gray-800 rounded-2xl p-10 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2 capitalize">{activeLevel} Level Finished!</h2>
          
          <div className="bg-[#1a1a21] rounded-xl p-6 mb-8 mt-6 border border-gray-800/60">
            <div className="text-5xl font-black text-emerald-500 mb-2">{percentage}%</div>
            <p className="text-gray-300 font-medium">You scored {levelScore.score} out of {levelScore.total} on this level</p>
          </div>
          
          <div className="flex flex-col gap-3">
             {activeLevel === 'easy' && (
                <>
                  <button onClick={() => handleStartLevel('medium')} className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors">Take Medium Level</button>
                  <button onClick={() => setActiveLevel(null)} className="w-full py-3.5 bg-[#2a2a35] hover:bg-[#343442] text-gray-300 font-semibold rounded-xl transition-colors">Back to Levels</button>
                </>
             )}
             {activeLevel === 'medium' && (
                <div className="flex gap-3">
                  <button onClick={() => handleStartLevel('easy')} className="flex-1 py-3.5 bg-[#2a2a35] hover:bg-[#343442] text-emerald-400 font-semibold rounded-xl transition-colors text-sm">Previous (Easy)</button>
                  <button onClick={() => handleStartLevel('hard')} className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors text-sm">Next (Hard)</button>
                </div>
             )}
             {activeLevel === 'hard' && (
                <div className="flex gap-3">
                  <button onClick={() => handleStartLevel('easy')} className="flex-1 py-3.5 bg-[#2a2a35] hover:bg-[#343442] text-emerald-400 font-semibold rounded-xl transition-colors">Easy Level</button>
                  <button onClick={() => handleStartLevel('medium')} className="flex-1 py-3.5 bg-[#2a2a35] hover:bg-[#343442] text-blue-400 font-semibold rounded-xl transition-colors">Medium Level</button>
                </div>
             )}
             {(activeLevel === 'medium' || activeLevel === 'hard') && (
                <button onClick={() => setActiveLevel(null)} className="w-full py-3 mt-2 bg-transparent hover:bg-white/5 border border-gray-700 text-gray-400 font-medium rounded-xl transition-colors">View All Levels</button>
             )}
          </div>
        </div>
      </div>
    );
  }

  // 4. Active Quiz View
  const currentQuestion = quiz.questions[currentIndex];
  const hasAnsweredCurrent = !!selectedAnswers[currentIndex];
  const selectedOption = selectedAnswers[currentIndex];
  
  // To render the progress bar properly just for this level segment
  const levelQuestions = Array.from({ length: bounds.end - bounds.start }, (_, i) => bounds.start + i);
  const questionsAnsweredInLevel = levelQuestions.filter(idx => !!selectedAnswers[idx]).length;

  return (
    <div className="min-h-screen bg-[#1a1a21] text-white flex flex-col">
      <header className="h-20 border-b border-gray-800 flex items-center justify-between px-8 bg-[#1a1a21]">
        <button onClick={() => setActiveLevel(null)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Exit Level</span>
        </button>
        <div className="font-semibold tracking-wide text-gray-200 capitalize">
          {activeLevel} Level Challenge
        </div>
        <div className="w-[100px]"></div> {/* Spacer for centering */}
      </header>
      
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-12 flex flex-col">
        {/* Progress Bar Fragments */}
        <div className="mb-10">
          <div className="flex items-center justify-between text-sm font-medium text-gray-400 mb-3">
            <span>Question {currentIndex - bounds.start + 1} of {bounds.end - bounds.start}</span>
            <span>{questionsAnsweredInLevel} of {bounds.end - bounds.start} Answered</span>
          </div>
          <div className="flex gap-1 w-full h-2">
            {levelQuestions.map((globalIdx) => {
              const isAnswered = !!selectedAnswers[globalIdx];
              const isCurrent = globalIdx === currentIndex;
              
              let bgColor = "bg-[#2a2a35]";
              if (isAnswered) bgColor = "bg-emerald-500";
              else if (isCurrent) bgColor = "bg-gray-400";

              return (
                <div 
                  key={globalIdx}
                  onClick={() => setCurrentIndex(globalIdx)}
                  className={`flex-1 h-full rounded-full cursor-pointer transition-colors hover:bg-emerald-400/50 ${bgColor} ${isCurrent ? 'ring-2 ring-gray-400/50 ring-offset-[#1a1a21] ring-offset-2' : ''}`}
                  title={`Go to question ${globalIdx - bounds.start + 1}`}
                ></div>
              );
            })}
          </div>
        </div>
        
        {/* Question Card */}
        <div className="bg-[#22222a] border border-gray-800 rounded-2xl p-8 mb-8 flex-1 shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold leading-snug mb-8 text-[#f1f1f1]">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              
              let styling = "bg-[#1a1a21] border-gray-700 hover:border-gray-500 hover:bg-[#2a2a35] text-gray-300 cursor-pointer";
              let Icon = null;
              
              if (hasAnsweredCurrent) {
                if (isCorrect) {
                  styling = "bg-emerald-500/10 border-emerald-500 text-emerald-400 cursor-default";
                  Icon = <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
                } else if (isSelected && !isCorrect) {
                  styling = "bg-red-500/10 border-red-500 text-red-400 cursor-default";
                  Icon = <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
                } else {
                  styling = "bg-[#1a1a21] border-gray-800 text-gray-600 cursor-default opacity-50";
                }
              }

              return (
                <div 
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full text-left p-5 border-2 rounded-xl transition-all duration-200 flex items-center justify-between gap-4 ${styling}`}
                >
                  <span className="font-medium text-[15px]">{option}</span>
                  {Icon}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Navigation Bottom Nav */}
        <div className="flex items-center justify-between px-2 pt-2">
          <button 
            onClick={handlePrev}
            disabled={isFirstInLevel}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-[#2a2a35] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          
          <button 
            onClick={handleNext}
            className={`flex items-center gap-2 px-8 py-2.5 font-semibold rounded-lg transition-colors shadow-lg ${hasAnsweredCurrent ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10' : 'bg-[#2a2a35] hover:bg-[#343442] text-gray-300 shadow-none'}`}
          >
            {!isLastInLevel ? (hasAnsweredCurrent ? 'Next' : 'Skip') : 'Finish Level'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
