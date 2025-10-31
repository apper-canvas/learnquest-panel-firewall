import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import progressService from "@/services/api/progressService";

const MatchingNumbers = ({ onExit }) => {
  const [pairs, setPairs] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    generatePairs();
  }, []);

  const generatePairs = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const selectedNumbers = numbers.sort(() => Math.random() - 0.5).slice(0, 6);
    
    const numberCards = selectedNumbers.map(n => ({
      id: `num-${n}`,
      value: n,
      type: "number",
      display: n.toString()
    }));

    const visualCards = selectedNumbers.map(n => ({
      id: `vis-${n}`,
      value: n,
      type: "visual",
      display: "●".repeat(n)
    }));

    const allCards = [...numberCards, ...visualCards].sort(() => Math.random() - 0.5);
    setPairs(allCards);
  };

  const handleCardClick = async (card) => {
    if (matchedPairs.includes(card.value)) return;
    if (selectedNumber?.id === card.id) return;

    if (!selectedNumber) {
      setSelectedNumber(card);
    } else {
      setAttempts(prev => prev + 1);
      
      if (selectedNumber.value === card.value && selectedNumber.type !== card.type) {
        setMatchedPairs(prev => [...prev, card.value]);
        const stars = 10;
        setScore(prev => prev + stars);
        await progressService.updateStars(stars);
        toast.success(`🎉 Perfect match! +${stars} stars!`);
        
        if (matchedPairs.length + 1 === 6) {
          const bonus = Math.max(30 - attempts * 2, 10);
          await progressService.updateStars(bonus);
          toast.success(`🌟 All matched! Bonus: ${bonus} stars!`);
          setTimeout(onExit, 2000);
        }
      } else {
        toast.error("Not a match! Try again.");
      }
      
      setTimeout(() => setSelectedNumber(null), 600);
    }
  };

  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display text-gray-800">
            Matching Numbers 🔢
          </h2>
          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-600">Matched: {matchedPairs.length}/6</p>
            <p className="text-lg font-bold text-primary">Score: {score} ⭐</p>
          </div>
          <p className="text-gray-600">Match numbers with their dot patterns!</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {pairs.map((card) => {
              const isMatched = matchedPairs.includes(card.value);
              const isSelected = selectedNumber?.id === card.id;
              
              return (
                <motion.div
                  key={card.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={!isMatched ? { scale: 1.05 } : {}}
                  whileTap={!isMatched ? { scale: 0.95 } : {}}
                  className={`
                    relative aspect-square rounded-xl shadow-card cursor-pointer
                    flex items-center justify-center text-3xl font-bold
                    transition-all duration-300
                    ${isMatched ? "bg-success text-white" : "bg-surface text-gray-800"}
                    ${isSelected ? "ring-4 ring-primary" : ""}
                    ${!isMatched && !isSelected ? "hover:shadow-lift" : ""}
                  `}
                  onClick={() => handleCardClick(card)}
                >
                  {isMatched ? (
                    <span className="text-4xl">✓</span>
                  ) : card.type === "number" ? (
                    <span>{card.display}</span>
                  ) : (
                    <div className="grid grid-cols-3 gap-1 text-primary text-xl">
                      {card.display.split("").map((dot, i) => (
                        <span key={i}>{dot}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => {
              setPairs([]);
              setMatchedPairs([]);
              setSelectedNumber(null);
              setAttempts(0);
              generatePairs();
            }}
          >
            New Game
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MatchingNumbers;