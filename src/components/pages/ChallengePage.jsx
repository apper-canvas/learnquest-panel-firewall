import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import progressService from "@/services/api/progressService";
import achievementService from "@/services/api/achievementService";
import challengeService from "@/services/api/challengeService";
import sessionService from "@/services/api/sessionService";
import Button from "@/components/atoms/Button";
import ChallengeCard from "@/components/organisms/ChallengeCard";
import ResultsModal from "@/components/organisms/ResultsModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const ChallengePage = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
const [challenges, setChallenges] = useState([]);
  const [readingGameType, setReadingGameType] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [bonusStars, setBonusStars] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [sessionStart] = useState(Date.now());
  const [challengeTimes, setChallengeTimes] = useState([]);
const [showModeSelect, setShowModeSelect] = useState(false);
  const [showReadingGameSelect, setShowReadingGameSelect] = useState(false);
  const [achievements, setAchievements] = useState([]);
  
// Check if this is a timed challenge mode
  const isTimedMode = location.pathname.includes('/timed');
  
// Load challenges based on current mode
  const loadChallenges = async (options = {}) => {
    try {
      setLoading(true);
      
      // For reading challenges, check if we need game type selection
      if (subject === 'reading' && !readingGameType && !options.forceLoad && !isTimedMode) {
        setShowReadingGameSelect(true);
        setLoading(false);
        return;
      }
      
      // Check if we need to show mode selection (unless explicitly forcing load)
      if (!options.forceLoad && !isTimedMode && location.pathname === `/challenges/${subject}`) {
        setShowModeSelect(true);
        setLoading(false);
        return;
      }
      
      // Determine challenge type for reading games
      const challengeType = subject === 'reading' && readingGameType 
        ? `reading-${readingGameType}` 
        : subject;
      
      const data = await challengeService.getRandomByType(challengeType, 5);
      if (data.length === 0) {
        setError("No challenges available for this subject.");
      } else {
        setChallenges(data);
      }
    } catch (err) {
      setError(err.message || "Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    loadChallenges();
  }, [subject, location.pathname, readingGameType]);
const handleChallengeComplete = async (stars, correct, completionTime = null) => {
    let finalStars = stars;
    let timeBonus = 0;
    
    // Calculate time-based bonus for timed mode
    if (isTimedMode && completionTime !== null) {
      timeBonus = achievementService.calculateBonusStars(completionTime, 30);
      finalStars += timeBonus;
      setBonusStars(prev => prev + timeBonus);
      
      // Track completion time
      setChallengeTimes(prev => [...prev, completionTime]);
    }
    
    setTotalStars((prev) => prev + finalStars);
    if (correct) {
      setCorrectAnswers((prev) => prev + 1);
    }

    if (currentIndex < challenges.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 1600);
    } else {
      setTimeout(async () => {
const finalTotalStars = totalStars + finalStars;
        await progressService.updateStars(finalTotalStars);
        
        const duration = Math.floor((Date.now() - sessionStart) / 1000);
        const accuracy = Math.round(((correctAnswers + (correct ? 1 : 0)) / challenges.length) * 100);
        const averageTime = isTimedMode && challengeTimes.length > 0 
          ? [...challengeTimes, completionTime].reduce((a, b) => a + b, 0) / (challengeTimes.length + 1)
          : null;
        
        await sessionService.create({
          subject,
          challengesCompleted: challenges.length,
          starsEarned: finalTotalStars,
          accuracy,
          duration,
          isTimed: isTimedMode,
          averageTime,
          bonusStars: isTimedMode ? bonusStars + timeBonus : 0
        });

        // Check for new achievements
        if (isTimedMode) {
          const sessionData = {
            averageTime,
            accuracy,
            isTimed: true
          };
          const newAchievements = await achievementService.checkAchievements(sessionData);
          setAchievements(newAchievements);
          
          if (newAchievements.length > 0) {
            const achievementBonus = newAchievements.reduce((total, ach) => total + ach.bonusStars, 0);
            await progressService.updateStars(achievementBonus);
            toast.success(`🏆 Unlocked ${newAchievements.length} achievement${newAchievements.length > 1 ? 's' : ''}!`);
          }
        }

        setShowResults(true);
      }, 1600);
    }
  };

const handlePlayAgain = () => {
    setCurrentIndex(0);
    setTotalStars(0);
    setBonusStars(0);
    setCorrectAnswers(0);
    setShowResults(false);
    setChallengeTimes([]);
    setAchievements([]);
    loadChallenges();
};
  
const handleReadingGameSelect = (gameType) => {
    setShowReadingGameSelect(false);
    setReadingGameType(gameType);
  };

  const handleModeSelect = (timed = false) => {
    setShowModeSelect(false);
    if (timed) {
      navigate(`/challenges/${subject}/timed`);
    } else {
      // Load challenges for regular mode with forceLoad flag
      loadChallenges({ forceLoad: true });
    }
  };

  if (loading) return <Loading message="Loading challenges..." />;
  if (error) return <Error message={error} onRetry={loadChallenges} />;

  const currentChallenge = challenges[currentIndex];

return (
    <div className="max-w-4xl mx-auto">
      {showReadingGameSelect && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 py-12"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-display text-gray-800">
              Choose Reading Game
            </h2>
            <p className="text-gray-600 text-lg">
              Select which reading skill you'd like to practice
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-surface rounded-2xl p-6 shadow-card cursor-pointer border-2 border-transparent hover:border-primary/20"
              onClick={() => handleReadingGameSelect('phonics-matching')}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">🔤</span>
                </div>
                <h3 className="text-xl font-display text-gray-800">Phonics Matching</h3>
                <p className="text-gray-600">Match sounds to letters</p>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-surface rounded-2xl p-6 shadow-card cursor-pointer border-2 border-transparent hover:border-secondary/20"
              onClick={() => handleReadingGameSelect('phonics-rhyming')}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">🎵</span>
                </div>
                <h3 className="text-xl font-display text-gray-800">Rhyming Words</h3>
                <p className="text-gray-600">Find words that rhyme</p>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-surface rounded-2xl p-6 shadow-card cursor-pointer border-2 border-transparent hover:border-accent/20"
              onClick={() => handleReadingGameSelect('word-building')}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">🔨</span>
                </div>
                <h3 className="text-xl font-display text-gray-800">Word Building</h3>
                <p className="text-gray-600">Drag letters to form words</p>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-surface rounded-2xl p-6 shadow-card cursor-pointer border-2 border-transparent hover:border-success/20"
              onClick={() => handleReadingGameSelect('story-mode')}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">📖</span>
                </div>
                <h3 className="text-xl font-display text-gray-800">Story Mode</h3>
                <p className="text-gray-600">Read-along interactive stories</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
      
      {showModeSelect && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 py-12"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-display text-gray-800">
              Choose Challenge Mode
            </h2>
            <p className="text-gray-600 text-lg">
              Select how you'd like to practice {subject}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-surface rounded-2xl p-6 shadow-card cursor-pointer border-2 border-transparent hover:border-primary/20"
              onClick={() => handleModeSelect(false)}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-xl font-display text-gray-800">Regular Mode</h3>
                <p className="text-gray-600">Take your time and learn at your own pace</p>
                <Button variant="outline" className="w-full">
                  Start Regular Challenge
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-surface rounded-2xl p-6 shadow-card cursor-pointer border-2 border-transparent hover:border-accent/20"
              onClick={() => handleModeSelect(true)}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-xl font-display text-gray-800">Timed Mode</h3>
                <p className="text-gray-600">Race against time for bonus stars and achievements</p>
                <Button variant="primary" className="w-full">
                  Start Timed Challenge
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
      
      <AnimatePresence mode="wait">
        {!showResults && !showModeSelect && !showReadingGameSelect && currentChallenge && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <ChallengeCard
              challenge={currentChallenge}
              onComplete={handleChallengeComplete}
              challengeNumber={currentIndex + 1}
              totalChallenges={challenges.length}
              isTimedMode={isTimedMode}
              timerDuration={30}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showResults && (
        <ResultsModal
          totalStars={totalStars}
          bonusStars={bonusStars}
          correctAnswers={correctAnswers}
          totalChallenges={challenges.length}
          onPlayAgain={handlePlayAgain}
          subject={subject}
          isTimedMode={isTimedMode}
          averageTime={challengeTimes.length > 0 ? challengeTimes.reduce((a, b) => a + b, 0) / challengeTimes.length : null}
          achievements={achievements}
        />
      )}
    </div>
  );
};

export default ChallengePage;