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
  ChevronLeft
} from 'lucide-react';

export const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Quiz taking states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

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

  const handleOptionClick = (option) => {
    // Prevent changing answer if already selected
    if (selectedAnswers[currentIndex]) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: option
    }));
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      // Build answers array matching the order of questions
      const answersArray = quiz.questions.map((_, i) => selectedAnswers[i] || null);
      
      const response = await axiosInstance.post(`/quizzes/${quizId}/submit`, { answers: answersArray });
      
      setResult(response.data); // { score, total }
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

  // Render Result Screen
  if (result) {
    const percentage = Math.round((result.score / result.total) * 100);
    return (
      <div className="min-h-screen bg-[#1a1a21] text-white flex flex-col items-center justify-center p-6">
        <div className="bg-[#22222a] border border-gray-800 rounded-2xl p-10 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-gray-400 mb-8">{quiz.title}</p>
          
          <div className="bg-[#1a1a21] rounded-xl p-6 mb-8 border border-gray-800/60">
            <div className="text-5xl font-black text-emerald-500 mb-2">{percentage}%</div>
            <p className="text-gray-300 font-medium">You scored {result.score} out of {result.total}</p>
          </div>
          
          <Link to="/quizzes" className="block w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors">
            Return to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  // Active Quiz View
  const currentQuestion = quiz.questions[currentIndex];
  const hasAnsweredCurrent = !!selectedAnswers[currentIndex];
  const selectedOption = selectedAnswers[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  return (
    <div className="min-h-screen bg-[#1a1a21] text-white flex flex-col">
      {/* Top Nav */}
      <header className="h-20 border-b border-gray-800 flex items-center px-8 bg-[#1a1a21]">
        <Link to="/quizzes" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Exit Quiz</span>
        </Link>
        <div className="mx-auto font-semibold tracking-wide text-gray-200">
          {quiz.title}
        </div>
        <div className="w-[100px]"></div> {/* Spacer for centering */}
      </header>
      
      {/* Quiz Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-12 flex flex-col">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between text-sm font-medium text-gray-400 mb-3">
            <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
            <span>{Math.round(((currentIndex) / quiz.questions.length) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2 bg-[#2a2a35] rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex) / quiz.questions.length) * 100}%` }}
            ></div>
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
                  // The correct answer is always highlighted green once they answer
                  styling = "bg-emerald-500/10 border-emerald-500 text-emerald-400 cursor-default";
                  Icon = <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
                } else if (isSelected && !isCorrect) {
                  // Unlucky pick, highlight it red
                  styling = "bg-red-500/10 border-red-500 text-red-400 cursor-default";
                  Icon = <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
                } else {
                  // Not picked and not true, just dim it
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
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-[#2a2a35] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          
          {hasAnsweredCurrent && !isLastQuestion && (
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-500/10"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
          
          {hasAnsweredCurrent && isLastQuestion && (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-purple-500/10 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Finish Quiz'} <Award className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
