import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

function StoryModeGame({ challenge, onComplete }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const playAudio = () => {
    setIsPlayingAudio(true);
    
    // Simulate audio narration with realistic delay based on story length
    const narrationDuration = challenge.story.length * 30; // ~30ms per character
    
    setTimeout(() => {
      setIsPlayingAudio(false);
      setHasListened(true);
      toast.success('Story complete! Now answer the question.', {
        position: "top-center",
        autoClose: 2000
      });
      
      setTimeout(() => {
        setShowQuestion(true);
      }, 500);
    }, narrationDuration);
  };

  const handleOptionClick = (option) => {
    if (showFeedback) return;
    
    setSelectedOption(option);
    const correct = option === challenge.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      onComplete(correct);
    }, 2000);
  };

  return (
    <Card className="p-8">
      <div className="space-y-8">
        {!showQuestion ? (
          <>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-display text-gray-800">
                {challenge.question}
              </h2>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6">
              <p className="text-lg leading-relaxed text-gray-700">
                {challenge.story}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              {!hasListened ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={playAudio}
                    disabled={isPlayingAudio}
                    className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lift cursor-pointer disabled:opacity-50"
                  >
                    <ApperIcon 
                      name={isPlayingAudio ? "Loader2" : "Play"} 
                      size={40} 
                      className={`text-white ${isPlayingAudio ? 'animate-spin' : ''}`}
                    />
                  </motion.button>
                  <p className="text-gray-600 text-center">
                    {isPlayingAudio ? 'Listen carefully to the story...' : 'Click to hear the story narration'}
                  </p>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full">
                    <ApperIcon name="CheckCircle2" size={20} />
                    <span className="font-display">Story Complete!</span>
                  </div>
                  <p className="text-gray-600">Get ready for the question...</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="text-center space-y-4">
              <h3 className="text-xl font-display text-gray-800">
                {challenge.comprehensionQuestion}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenge.options.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionClick(option)}
                  disabled={showFeedback}
                  className={`p-4 rounded-xl text-lg transition-all ${
                    selectedOption === option
                      ? isCorrect
                        ? 'bg-success text-white shadow-lift'
                        : 'bg-error text-white shadow-lift'
                      : 'bg-surface hover:bg-gray-50 shadow-card text-gray-800'
                  } ${showFeedback && option === challenge.correctAnswer ? 'ring-4 ring-success' : ''}`}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`text-center p-4 rounded-xl ${
                    isCorrect ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  }`}
                >
                  <p className="text-xl font-display">
                    {isCorrect ? '🎉 Excellent comprehension!' : `❌ The correct answer is: ${challenge.correctAnswer}`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </Card>
  );
}

export default StoryModeGame;