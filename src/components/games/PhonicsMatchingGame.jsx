import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

function PhonicsMatchingGame({ challenge, onComplete }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const playSound = () => {
    setIsPlayingSound(true);
    // Simulate audio playback with delay
    setTimeout(() => {
      setIsPlayingSound(false);
      toast.info(`Sound: "${challenge.sound}"`, {
        position: "top-center",
        autoClose: 1500
      });
    }, 500);
  };

  const handleOptionClick = (option) => {
    if (showFeedback) return;
    
    setSelectedOption(option);
    const correct = option === challenge.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      onComplete(correct);
    }, 1500);
  };

  return (
    <Card className="p-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-display text-gray-800">
            {challenge.question}
          </h2>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playSound}
            disabled={isPlayingSound}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lift cursor-pointer"
          >
            <ApperIcon 
              name={isPlayingSound ? "Volume2" : "Volume2"} 
              size={40} 
              className="text-white"
            />
          </motion.button>
          
          <p className="text-gray-600">
            Click the speaker to hear the sound
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {challenge.options.map((option) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOptionClick(option)}
              disabled={showFeedback}
              className={`p-8 rounded-2xl text-3xl font-display transition-all ${
                selectedOption === option
                  ? isCorrect
                    ? 'bg-success text-white shadow-lift'
                    : 'bg-error text-white shadow-lift'
                  : 'bg-surface hover:bg-gray-50 shadow-card'
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
                {isCorrect ? '🎉 Correct! Great job!' : `❌ The correct answer is ${challenge.correctAnswer}`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

export default PhonicsMatchingGame;