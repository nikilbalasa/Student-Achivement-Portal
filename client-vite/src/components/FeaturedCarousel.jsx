import { useState, useEffect } from "react";
import { FaTrophy, FaMedal, FaCrown } from "react-icons/fa";
import { format } from "date-fns";

const FeaturedCarousel = ({ achievers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (achievers.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % achievers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [achievers.length]);

  if (achievers.length === 0) return null;

  const currentAchiever = achievers[currentIndex];

  const getRankIcon = (index) => {
    if (index === 0) return <FaCrown className="text-yellow-400" />;
    if (index === 1) return <FaMedal className="text-gray-300" />;
    if (index === 2) return <FaMedal className="text-orange-400" />;
    return <FaTrophy className="text-blue-400" />;
  };

  const getRankColor = (index) => {
    if (index === 0) return "from-yellow-400/20 to-yellow-600/20";
    if (index === 1) return "from-gray-300/20 to-gray-500/20";
    if (index === 2) return "from-orange-400/20 to-orange-600/20";
    return "from-blue-400/20 to-blue-600/20";
  };

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="relative h-96 overflow-hidden rounded-2xl">
        {achievers.map((achiever, index) => {
          const isActive = index === currentIndex;
          const offset = index - currentIndex;
          const position = offset * 100;

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
              }`}
              style={{
                transform: `translateX(${position}%)`,
              }}
            >
              <div
                className={`h-full bg-gradient-to-br ${getRankColor(index)} backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8`}
              >
                {/* Photo Section */}
                <div className="relative group">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-yellow-400/50 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-600/30 animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-4xl md:text-5xl font-bold text-white">
                        {achiever.user?.name?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute -inset-2 bg-yellow-400/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -top-2 -right-2 text-3xl animate-float">
                    {getRankIcon(index)}
                  </div>
                </div>

                {/* Info Section */}
                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                    <h3 className="text-3xl md:text-4xl font-bold text-white">
                      {achiever.user?.name || "Unknown"}
                    </h3>
                    <span className="text-2xl">{getRankIcon(index)}</span>
                  </div>
                  <p className="text-blue-200 text-lg mb-2">
                    {achiever.user?.department || "N/A"}
                  </p>
                  {achiever.achievement && (
                    <div className="mt-4">
                      <p className="text-yellow-300 font-semibold text-lg mb-1">
                        {achiever.achievement.title}
                      </p>
                      {achiever.achievement.category && (
                        <span className="inline-block px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-sm mb-2">
                          {achiever.achievement.category.name}
                        </span>
                      )}
                      <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-blue-300 mt-2">
                        <span>Level {achiever.level}</span>
                        <span>•</span>
                        <span>{achiever.points} Points</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-3 mt-6">
        {achievers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-yellow-400"
                : "w-3 bg-blue-400/50 hover:bg-blue-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;

