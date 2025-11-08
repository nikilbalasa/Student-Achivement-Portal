import { FaTrophy, FaStar, FaCrown } from "react-icons/fa";

const LevelProgress = ({ level, totalPoints, pointsToNextLevel }) => {
  // Calculate current level threshold and next level threshold
  const LEVEL_THRESHOLDS = [
    0,      // Level 1
    100,    // Level 2
    250,    // Level 3
    500,    // Level 4
    1000,   // Level 5
    2000,   // Level 6
    3500,   // Level 7
    5000,   // Level 8
    7500,   // Level 9
    10000,  // Level 10
    15000,  // Level 11
    20000,  // Level 12
    30000,  // Level 13
    40000,  // Level 14
    50000,  // Level 15
  ];
  
  const currentLevelThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelThreshold = level < LEVEL_THRESHOLDS.length 
    ? LEVEL_THRESHOLDS[level] 
    : totalPoints;
  const currentLevelPoints = totalPoints - currentLevelThreshold;
  const pointsNeededForNext = nextLevelThreshold - currentLevelThreshold;
  
  const progressPercentage = pointsToNextLevel > 0 && pointsNeededForNext > 0
    ? ((currentLevelPoints / pointsNeededForNext) * 100)
    : pointsToNextLevel === 0 ? 100 : 0;

  const getLevelIcon = (level) => {
    if (level >= 10) return <FaCrown className="text-yellow-500" />;
    if (level >= 5) return <FaStar className="text-purple-500" />;
    return <FaTrophy className="text-blue-500" />;
  };

  const getLevelColor = (level) => {
    if (level >= 10) return "from-yellow-400 to-orange-500";
    if (level >= 5) return "from-purple-400 to-pink-500";
    return "from-blue-400 to-cyan-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">{getLevelIcon(level)}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Level {level}</h3>
            <p className="text-sm text-gray-600">Total Points: {totalPoints}</p>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress to Level {level + 1}</span>
          <span>{Math.max(0, currentLevelPoints)} / {pointsNeededForNext} points</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getLevelColor(level)} transition-all duration-500 ease-out`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {pointsToNextLevel > 0 ? (
        <p className="text-xs text-gray-500 mt-2">
          {pointsToNextLevel} points needed for next level
        </p>
      ) : (
        <p className="text-xs text-green-600 mt-2 font-semibold">
          🎉 Maximum level reached!
        </p>
      )}
    </div>
  );
};

export default LevelProgress;

