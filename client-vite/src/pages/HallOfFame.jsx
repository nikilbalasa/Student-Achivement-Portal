import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import Loader from "../components/Loader";
import FeaturedCarousel from "../components/FeaturedCarousel";
import AchievementCard from "../components/HallOfFameCard";
import CategoryFilter from "../components/CategoryFilter";
import { FaArrowLeft, FaTrophy, FaGraduationCap } from "react-icons/fa";
import { format } from "date-fns";
import toast from "react-hot-toast";

const HallOfFame = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0 });
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetchAchievers();
  }, [activeCategory, currentPage]);

  const fetchAchievers = async () => {
    try {
      if (currentPage === 1) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const params = {};
      if (activeCategory !== "all") {
        params.category = activeCategory;
      }
      params.page = currentPage;
      params.limit = pagination.limit;

      const response = await api.get("/hall-of-fame/achievers", { params });
      
      if (currentPage === 1) {
        setFeatured(response.data.featured || []);
        setAchievements(response.data.achievements || []);
      } else {
        setAchievements((prev) => [...prev, ...(response.data.achievements || [])]);
      }
      
      setPagination(response.data.pagination || pagination);
    } catch (error) {
      toast.error("Failed to load achievers");
      console.error(error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
    setAchievements([]);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const hasMore = currentPage * pagination.limit < pagination.total;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center space-x-2 text-sm text-blue-200 mb-8 animate-fade-in">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="text-blue-400">/</span>
          <span className="text-white font-medium">Hall of Fame</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-blue-900 to-navy-800 opacity-90"></div>
          <div className="absolute inset-0 animate-wave"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-hero-fade-up">
            <div className="inline-block mb-6">
              <FaGraduationCap className="text-7xl text-yellow-400 animate-float" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 animate-letter-spacing">
              🎓 Hall of Fame
            </h1>
            <div className="flex justify-center mb-6">
              <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 w-0 mx-auto animate-underline-expand"></div>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto animate-fade-in-delay">
              Celebrating Excellence and Achievement Across Our University
            </p>
          </div>
        </div>
      </section>

      {/* Featured Achievers Carousel */}
      {featured.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center animate-fade-in">
              Top Achievers
            </h2>
            <FeaturedCarousel achievers={featured} />
          </div>
        </section>
      )}

      {/* Category Filter Tabs */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {achievements.length === 0 ? (
            <div className="text-center py-20">
              <FaTrophy className="text-6xl text-blue-400 mx-auto mb-4 opacity-50" />
              <p className="text-xl text-blue-200">No achievements found in this category</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {achievements.map((achievement, index) => (
                  <div
                    key={achievement.id}
                    className="animate-stagger-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <AchievementCard achievement={achievement} />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed animate-gradient-slide"
                  >
                    {isLoadingMore ? (
                      <span className="flex items-center space-x-2">
                        <Loader size="sm" />
                        <span>Loading...</span>
                      </span>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Back to Landing Page */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-3 text-blue-200 hover:text-white transition-colors group animate-fade-in"
          >
            <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-lg font-medium">Back to Landing Page</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HallOfFame;

