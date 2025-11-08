import { FaTrophy } from "react-icons/fa";

const RARITY_COLORS = {
  common: "bg-gray-100 border-gray-300 text-gray-700",
  uncommon: "bg-green-50 border-green-300 text-green-700",
  rare: "bg-blue-50 border-blue-300 text-blue-700",
  epic: "bg-purple-50 border-purple-300 text-purple-700",
  legendary: "bg-yellow-50 border-yellow-400 text-yellow-800",
};

const RARITY_NAMES = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

const BadgeCollection = ({ badges = [] }) => {
  if (badges.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Badges</h3>
        <div className="text-center py-8">
          <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No badges earned yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Complete achievements to unlock badges!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Badges ({badges.length})
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {badges.map((badge, index) => (
          <div
            key={badge._id || index}
            className={`relative border-2 rounded-lg p-4 text-center transition-transform hover:scale-105 ${RARITY_COLORS[badge.rarity] || RARITY_COLORS.common}`}
          >
            <div className="text-4xl mb-2">{badge.icon || "🏆"}</div>
            <p className="font-semibold text-sm mb-1">{badge.name}</p>
            <p className="text-xs opacity-75">
              {RARITY_NAMES[badge.rarity] || "Common"}
            </p>
            {badge.description && (
              <div className="absolute bottom-full left-0 right-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 z-10">
                {badge.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeCollection;

