import { useState } from "react";
import { FaTrophy, FaEye, FaCalendar } from "react-icons/fa";
import { format } from "date-fns";

const HallOfFameCard = ({ achievement }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getLevelColor = (level) => {
    const colors = {
      college: "from-blue-500 to-cyan-500",
      department: "from-green-500 to-emerald-500",
      state: "from-purple-500 to-pink-500",
      national: "from-orange-500 to-red-500",
      international: "from-yellow-500 to-orange-500",
    };
    return colors[level] || colors.college;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 transition-all duration-500 transform ${
          isHovered ? "scale-105 shadow-2xl" : "scale-100 shadow-lg"
        }`}
      >
        {/* Glowing border effect */}
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r ${getLevelColor(
            achievement.level
          )} rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-500`}
        ></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Photo Section */}
          <div className="flex justify-center mb-4">
            <div className="relative group/photo">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400/50 shadow-xl group-hover/photo:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-600/30"></div>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                  <span className="text-3xl font-bold text-white">
                    {achievement.student?.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
              </div>
              {/* Light reflection effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          </div>

          {/* Name and Department */}
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-white mb-1">
              {achievement.student?.name || "Unknown"}
            </h3>
            <p className="text-blue-200 text-sm">
              {achievement.student?.department || "N/A"}
            </p>
          </div>

          {/* Achievement Title */}
          <div className="mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <FaTrophy className="text-yellow-400" />
              <h4 className="text-lg font-semibold text-white text-center line-clamp-2">
                {achievement.title}
              </h4>
            </div>
            {achievement.description && (
              <p className="text-blue-200 text-sm text-center line-clamp-2">
                {achievement.description}
              </p>
            )}
          </div>

          {/* Category Tag */}
          {achievement.category && (
            <div className="flex justify-center mb-4">
              <span className="inline-block px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-xs font-medium">
                {achievement.category.name}
              </span>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center justify-center space-x-2 text-blue-300 text-sm mb-4">
            <FaCalendar className="text-xs" />
            <span>{formatDate(achievement.date)}</span>
          </div>

          {/* View Details Button */}
          <button className="w-full relative overflow-hidden group/button">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transform -translate-x-full group-hover/button:translate-x-0 transition-transform duration-500"></div>
            <span className="relative flex items-center justify-center space-x-2 px-4 py-2 text-white font-semibold rounded-lg border border-white/20 group-hover/button:border-transparent transition-all duration-500">
              <FaEye />
              <span>View Details</span>
            </span>
          </button>
        </div>

        {/* Floating achievement badge */}
        {isHovered && (
          <div className="absolute -top-2 -right-2 text-3xl animate-float">
            <FaTrophy className="text-yellow-400 drop-shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default HallOfFameCard;

