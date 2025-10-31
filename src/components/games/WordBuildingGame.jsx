import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reorder } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import { toast } from 'react-toastify';

function WordBuildingGame({ challenge, onComplete }) {
  const [availableLetters, setAvailableLetters] = useState(
    challenge.availableLetters.map((letter, index) => ({ id: `letter-${index}`, letter }))
  );
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleLetterClick = (letterObj) => {
    if (showFeedback) return;
    
    setSelectedLetters([...selectedLetters, letterObj]);
    setAvailableLetters(availableLetters.filter(l => l.id !== letterObj.id));
  };

  const handleRemoveLetter = (letterObj) => {
    if (showFeedback) return;
    
    setSelectedLetters(selectedLetters.filter(l => l.id !== letterObj.id));
    setAvailableLetters([...availableLetters, letterObj]);
  };

  const handleSubmit = () => {
    if (selectedLetters.length === 0) {
      toast.warning('Please select some letters first!');
      return;
    }

    const builtWord = selectedLetters.map(l => l.letter).join('');
    const correct = builtWord === challenge.targetWord;
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      onComplete(correct);
    }, 2000);
  };

  const handleClear = () => {
    if (showFeedback) return;
    
    setAvailableLetters(
      challenge.availableLetters.map((letter, index) => ({ id: `letter-${index}`, letter }))
    );
    setSelectedLetters([]);
  };

  return (
    <Card className="p-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-display text-gray-800">
            {challenge.question}
          </h2>
          
          <div className="text-8xl">
            {challenge.image}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Your Word:</p>
            <div className="min-h-[80px] p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center gap-2 flex-wrap">
              {selectedLetters.length === 0 ? (
                <span className="text-gray-400 text-lg">Drag letters here</span>
              ) : (
                selectedLetters.map((letterObj) => (
                  <motion.button
                    key={letterObj.id}
                    onClick={() => handleRemoveLetter(letterObj)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 bg-primary text-white rounded-xl text-2xl font-display shadow-card"
                  >
                    {letterObj.letter}
                  </motion.button>
                ))
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Available Letters:</p>
            <div className="flex flex-wrap gap-2 justify-center min-h-[80px]">
              {availableLetters.map((letterObj) => (
                <motion.button
                  key={letterObj.id}
                  onClick={() => handleLetterClick(letterObj)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={showFeedback}
                  className="w-14 h-14 bg-surface hover:bg-gray-50 rounded-xl text-2xl font-display shadow-card"
                >
                  {letterObj.letter}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleClear}
            variant="outline"
            className="flex-1"
            disabled={showFeedback || selectedLetters.length === 0}
          >
            Clear
          </Button>
          <Button
            onClick={handleSubmit}
            variant="primary"
            className="flex-1"
            disabled={showFeedback || selectedLetters.length === 0}
          >
            Check Answer
          </Button>
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
                {isCorrect ? '🎉 Perfect! You built the word!' : `❌ The word is "${challenge.targetWord}"`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

export default WordBuildingGame;