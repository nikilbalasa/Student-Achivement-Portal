import { FaGraduationCap, FaFutbol, FaMusic, FaLightbulb, FaUsers, FaList } from "react-icons/fa";

const categories = [
  { id: "all", label: "All", icon: FaList },
  { id: "academic", label: "Academics", icon: FaGraduationCap },
  { id: "sports", label: "Sports", icon: FaFutbol },
  { id: "cultural", label: "Cultural", icon: FaMusic },
  { id: "technical", label: "Innovation", icon: FaLightbulb },
  { id: "leadership", label: "Leadership", icon: FaUsers },
];

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`relative px-6 py-3 rounded-lg font-semibold transition-all duration-500 transform ${
              isActive
                ? "text-white scale-105"
                : "text-blue-200 hover:text-white hover:scale-105"
            }`}
          >
            {/* Background gradient for active state */}
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-20 animate-pulse"></div>
            )}

            {/* Content */}
            <div className="relative flex items-center space-x-2">
              <Icon className="text-lg" />
              <span>{category.label}</span>
            </div>

            {/* Active underline */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500 ${
                isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
            ></div>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;

