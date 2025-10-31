import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import React, { Suspense, lazy, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Home from "@/components/pages/Home";

const CountingBalloons = lazy(() => import("@/components/games/CountingBalloons"));
const MatchingNumbers = lazy(() => import("@/components/games/MatchingNumbers"));
const SolvingPuzzles = lazy(() => import("@/components/games/SolvingPuzzles"));

const MiniGames = () => {
  const navigate = useNavigate();
  const { subject } = useParams();
  const [selectedGame, setSelectedGame] = React.useState(null);

  const games = [
    {
      id: "counting-balloons",
      name: "Counting Balloons",
      icon: "🎈",
      description: "Pop balloons and count them all!",
      color: "primary",
      component: CountingBalloons
    },
    {
      id: "matching-numbers",
      name: "Matching Numbers",
      icon: "🔢",
      description: "Match numbers with their pictures!",
      color: "secondary",
      component: MatchingNumbers
    },
    {
      id: "solving-puzzles",
      name: "Solving Puzzles",
      icon: "🧩",
      description: "Solve puzzles to unlock new levels!",
      color: "accent",
      component: SolvingPuzzles
    }
  ];

  const suspenseFallback = (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-4">
        <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    </div>
  );

  if (selectedGame) {
    const GameComponent = selectedGame.component;
    return (
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => setSelectedGame(null)}
          className="mb-6"
        >
          <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
          Back to Games
        </Button>
        <Suspense fallback={suspenseFallback}>
          <GameComponent onExit={() => setSelectedGame(null)} />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
          Back to Home
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-display text-gray-800">
            Math Mini-Games 🎮
          </h1>
          <p className="text-gray-600 text-lg">
            Choose a fun game to practice your math skills!
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="cursor-pointer h-full hover:shadow-lift transition-shadow"
              onClick={() => setSelectedGame(game)}
            >
              <div className="text-center space-y-4 p-6">
                <div className="text-6xl">{game.icon}</div>
                <h3 className="text-xl font-display text-gray-800">
                  {game.name}
                </h3>
                <p className="text-gray-600">{game.description}</p>
                <Button
                  variant="primary"
                  className="w-full"
                >
                  Play Now
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MiniGames;