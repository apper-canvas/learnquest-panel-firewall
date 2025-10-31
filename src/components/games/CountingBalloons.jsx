import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import progressService from "@/services/api/progressService";

const CountingBalloons = ({ onExit }) => {
  const [balloonCount, setBalloonCount] = useState(0);
  const [targetCount, setTargetCount] = useState(0);
  const [balloons, setBalloons] = useState([]);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isChecking, setIsChecking] = useState(false);

  const colors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6BCF7F", "#FFA726"];

  useEffect(() => {
    generateNewRound();
  }, []);

  const generateNewRound = () => {
    const count = Math.floor(Math.random() * 10) + 1;
    setTargetCount(count);
    setBalloonCount(count);
    setAnswer("");
    setIsChecking(false);

    const newBalloons = Array.from({ length: count }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      popped: false
    }));
    setBalloons(newBalloons);
  };

  const handleBalloonClick = (id) => {
    setBalloons(prev => prev.map(b => 
      b.id === id ? { ...b, popped: true } : b
    ));
    setBalloonCount(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!answer) {
      toast.error("Please enter your answer!");
      return;
    }

    setIsChecking(true);
    const userAnswer = parseInt(answer);

    if (userAnswer === targetCount) {
      const stars = 10;
      setScore(prev => prev + stars);
      await progressService.updateStars(stars);
      toast.success(`🎉 Correct! You earned ${stars} stars!`);
      
      setTimeout(() => {
        if (round < 5) {
          setRound(prev => prev + 1);
          generateNewRound();
        } else {
          toast.success(`🌟 Game Complete! Total Score: ${score + stars} stars!`);
          setTimeout(onExit, 2000);
        }
      }, 1500);
    } else {
      toast.error(`Not quite! The correct answer was ${targetCount}`);
      setTimeout(() => {
        generateNewRound();
      }, 2000);
    }
  };

  const handleReset = () => {
    setBalloons(prev => prev.map(b => ({ ...b, popped: false })));
    setBalloonCount(targetCount);
  };

  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display text-gray-800">
            Counting Balloons 🎈
          </h2>
          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-600">Round {round}/5</p>
            <p className="text-lg font-bold text-primary">Score: {score} ⭐</p>
          </div>
        </div>

        <div className="relative bg-gradient-to-b from-blue-100 to-blue-50 rounded-xl p-8 h-96 overflow-hidden">
          <AnimatePresence>
            {balloons.map((balloon) => (
              !balloon.popped && (
                <motion.div
                  key={balloon.id}
                  initial={{ scale: 0, y: 100 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${balloon.x}%`,
                    top: `${balloon.y}%`
                  }}
                  onClick={() => handleBalloonClick(balloon.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div
                    className="w-16 h-20 rounded-full shadow-lg"
                    style={{ backgroundColor: balloon.color }}
                  />
                  <div
                    className="w-1 h-8 bg-gray-400 mx-auto"
                  />
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        <div className="text-center space-y-4">
          <p className="text-xl text-gray-700">
            {balloonCount > 0 ? "Click the balloons to pop them!" : "All balloons popped! How many were there?"}
          </p>
          
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={balloonCount === targetCount}
            >
              Reset Balloons
            </Button>
          </div>

          <div className="flex gap-4 items-center justify-center">
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter count"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg text-center text-2xl w-32 focus:outline-none focus:border-primary"
              disabled={isChecking}
              min="1"
              max="10"
            />
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isChecking || !answer}
            >
              Check Answer
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CountingBalloons;