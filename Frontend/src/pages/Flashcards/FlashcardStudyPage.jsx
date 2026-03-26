import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const FlashcardStudyPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3400/api/flashcards', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Filter cards belonging to this document
        const documentCards = res.data.filter(card => card.document === documentId);
        setFlashcards(documentCards);
      } catch (error) {
        console.error('Failed to fetch flashcards:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCards();
  }, [documentId]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, flashcards.length - 1));
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }, 150);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a21] flex items-center justify-center">
        <p className="text-emerald-400 font-medium">Loading Flashcards...</p>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-[#1a1a21] flex flex-col items-center justify-center text-white">
        <h2 className="text-xl font-semibold mb-4">No flashcards found</h2>
        <button onClick={() => navigate('/flashcards')} className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Sets
        </button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-[#1a1a21] text-white font-sans flex flex-col">
      {/* Header */}
      <header className="h-20 flex items-center px-8 border-b border-gray-800 bg-[#22222a] shrink-0">
        <button 
          onClick={() => navigate('/flashcards')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Flashcards</span>
        </button>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm font-medium text-gray-400">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Study Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-hidden">
        
        {/* Flashcard Container */}
        <div className="relative w-full max-w-3xl aspect-[3/2] [perspective:1000px] mb-12">
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full h-full cursor-pointer transition-all duration-500 shadow-2xl [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
          >
            {/* Front Card (Question) */}
            <div className="absolute inset-0 [backface-visibility:hidden] bg-[#22222a] border border-gray-700/50 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
              <span className="absolute top-6 left-6 text-sm font-bold tracking-wider text-emerald-500 uppercase">Question</span>
              <RotateCcw className="absolute top-6 right-6 w-5 h-5 text-gray-600" />
              <h2 className="text-3xl md:text-4xl font-semibold leading-relaxed text-gray-100 px-4">
                {currentCard.question}
              </h2>
            </div>

            {/* Back Card (Answer) */}
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#1a2f26] border border-emerald-500/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
              <span className="absolute top-6 left-6 text-sm font-bold tracking-wider text-emerald-400 uppercase">Answer</span>
              <RotateCcw className="absolute top-6 right-6 w-5 h-5 text-emerald-600/50" />
              <p className="text-xl md:text-2xl font-medium leading-relaxed text-emerald-50 text-wrap pl-6 pr-6 pt-4 pb-4 overflow-y-auto">
                {currentCard.answer}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-14 h-14 rounded-full bg-[#2a2a35] flex items-center justify-center text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-8 py-3.5 bg-[#22222a] border border-gray-700 hover:border-emerald-500/50 text-white font-medium rounded-xl transition-colors min-w-[160px]"
          >
            {isFlipped ? 'Show Question' : 'Show Answer'}
          </button>

          <button 
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
            className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>

      </main>
    </div>
  );
};

export default FlashcardStudyPage;
