import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import progressService from "@/services/api/progressService";

const SolvingPuzzles = ({ onExit }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [puzzle, setPuzzle] = useState(null);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);

  const levels = [
    {
      level: 1,
      difficulty: "Easy",
      icon: "🟢",
      puzzles: [
        { question: "? + 3 = 5", answer: 2 },
        { question: "4 + ? = 7", answer: 3 },
        { question: "? + 2 = 6", answer: 4 }
      ]
    },
    {
      level: 2,
      difficulty: "Medium",
      icon: "🟡",
      puzzles: [
        { question: "? - 3 = 4", answer: 7 },
        { question: "10 - ? = 6", answer: 4 },
        { question: "? - 5 = 3", answer: 8 }
      ]
    },
    {
      level: 3,
      difficulty: "Hard",
      icon: "🟠",
      puzzles: [
        { question: "? × 2 = 8", answer: 4 },
        { question: "3 × ? = 12", answer: 4 },
        { question: "? × 4 = 16", answer: 4 }
      ]
    },
    {
      level: 4,
      difficulty: "Expert",
      icon: "🔴",
      puzzles: [
        { question: "12 ÷ ? = 3", answer: 4 },
        { question: "? ÷ 2 = 5", answer: 10 },
        { question: "15 ÷ ? = 5", answer: 3 }
      ]
    },
    {
      level: 5,
      difficulty: "Master",
      icon: "🟣",
      puzzles: [
        { question: "(? + 3) × 2 = 10", answer: 2 },
        { question: "(8 - ?) × 2 = 6", answer: 5 },
        { question: "(? × 2) + 3 = 11", answer: 4 }
      ]
    }
  ];

  useEffect(() => {
    if (currentLevel) {
      generatePuzzle(currentLevel);
    }
  }, [currentLevel]);

  const generatePuzzle = (level) => {
    const levelData = levels[level - 1];
    const randomPuzzle = levelData.puzzles[Math.floor(Math.random() * levelData.puzzles.length)];
    setPuzzle(randomPuzzle);
    setAnswer("");
  };

  const handleSubmit = async () => {
    if (!answer) {
      toast.error("Please enter your answer!");
      return;
    }

    const userAnswer = parseInt(answer);
    
    if (userAnswer === puzzle.answer) {
      const stars = 10 + (currentLevel * 5);
      setScore(prev => prev + stars);
      await progressService.updateStars(stars);
      toast.success(`🎉 Correct! +${stars} stars!`);
      
      if (currentLevel < 5 && !unlockedLevels.includes(currentLevel + 1)) {
        setUnlockedLevels(prev => [...prev, currentLevel + 1]);
        toast.success(`🔓 Level ${currentLevel + 1} unlocked!`);
      }
      
      setTimeout(() => {
        if (currentLevel < 5) {
          generatePuzzle(currentLevel);
        } else {
          toast.success("🏆 You've mastered all levels!");
          setTimeout(onExit, 2000);
        }
      }, 1500);
    } else {
      toast.error(`Not quite! The answer was ${puzzle.answer}`);
      setTimeout(() => {
        generatePuzzle(currentLevel);
      }, 2000);
    }
  };

  const selectLevel = (level) => {
    if (unlockedLevels.includes(level)) {
      setCurrentLevel(level);
    } else {
      toast.info("Complete previous levels to unlock!");
    }
  };

  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display text-gray-800">
            Solving Puzzles 🧩
          </h2>
          <p className="text-lg font-bold text-primary">Total Score: {score} ⭐</p>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {levels.map((level) => {
            const isUnlocked = unlockedLevels.includes(level.level);
            const isCurrent = currentLevel === level.level;
            
            return (
              <motion.button
                key={level.level}
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                className={`
                  relative aspect-square rounded-xl shadow-card
                  flex flex-col items-center justify-center p-2
                  transition-all duration-300
                  ${isCurrent ? "ring-4 ring-primary bg-primary/10" : ""}
                  ${isUnlocked ? "bg-surface cursor-pointer hover:shadow-lift" : "bg-gray-200 cursor-not-allowed opacity-50"}
                `}
                onClick={() => selectLevel(level.level)}
                disabled={!isUnlocked}
              >
                <div className="text-3xl mb-1">{level.icon}</div>
                <div className="text-sm font-bold">{level.level}</div>
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ApperIcon name="Lock" size={24} className="text-gray-400" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {puzzle && (
          <AnimatePresence mode="wait">
            <motion.div
              key={puzzle.question}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Level {currentLevel} - {levels[currentLevel - 1].difficulty}
                </p>
                <p className="text-4xl font-display text-gray-800 mb-4">
                  {puzzle.question}
                </p>
                <p className="text-gray-600">Find the missing number!</p>
              </div>

              <div className="flex gap-4 items-center justify-center">
                <input
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="?"
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-3xl font-bold w-32 focus:outline-none focus:border-primary"
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                />
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!answer}
                  className="px-8 py-3"
                >
                  Check Answer
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </Card>
  );
};

export default SolvingPuzzles;