import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";
import AchievementCard from "../components/AchievementCard";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import LevelProgress from "../components/LevelProgress";
import { FaTrophy, FaPlusCircle, FaClock, FaCheckCircle, FaTimesCircle, FaCoins, FaMedal } from "react-icons/fa";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gamificationStats, setGamificationStats] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchAchievements();
    fetchGamificationStats();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await api.get("/achievements/me");
      const data = response.data;
      setAchievements(data);
      setStats({
        total: data.length,
        pending: data.filter((a) => a.status === "pending").length,
        approved: data.filter((a) => a.status === "approved").length,
        rejected: data.filter((a) => a.status === "rejected").length,
      });
    } catch (error) {
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  const fetchGamificationStats = async () => {
    try {
      const response = await api.get("/gamification/stats");
      setGamificationStats(response.data);
    } catch (error) {
      // Gamification stats might not be available yet
      console.error("Failed to load gamification stats:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this achievement?")) return;

    try {
      await api.delete(`/achievements/${id}`);
      toast.success("Achievement deleted successfully");
      fetchAchievements();
    } catch (error) {
      toast.error("Failed to delete achievement");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Gamification Overview */}
        {gamificationStats && (
          <div className="mb-8">
            <LevelProgress
              level={gamificationStats.currentLevel}
              totalPoints={gamificationStats.totalPoints}
              pointsToNextLevel={gamificationStats.pointsToNextLevel}
            />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Achievements</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <FaTrophy className="text-4xl text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
              </div>
              <FaClock className="text-4xl text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</p>
              </div>
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {gamificationStats ? "Points" : "Rejected"}
                </p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {gamificationStats ? gamificationStats.totalPoints : stats.rejected}
                </p>
              </div>
              {gamificationStats ? (
                <FaCoins className="text-4xl text-yellow-500" />
              ) : (
                <FaTimesCircle className="text-4xl text-red-500" />
              )}
            </div>
          </div>
        </div>

        {/* Quick Gamification Link */}
        {gamificationStats && (
          <div className="mb-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-soft p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Level Up Your Achievements!</h3>
                <p className="text-purple-100">
                  View your badges, challenges, and leaderboard rankings
                </p>
              </div>
              <Link
                to="/gamification"
                className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                View Gamification
              </Link>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <Sidebar />
          </div>

          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Achievements</h2>
              <Link
                to="/achievements/add"
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FaPlusCircle />
                <span>Add Achievement</span>
              </Link>
            </div>

            {achievements.length === 0 ? (
              <div className="bg-white rounded-xl shadow-soft p-12 text-center">
                <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No achievements yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start tracking your achievements by adding your first one!
                </p>
                <Link
                  to="/achievements/add"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FaPlusCircle />
                  <span>Add Your First Achievement</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {achievements.map((achievement) => (
                  <AchievementCard
                    key={achievement._id}
                    achievement={achievement}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
