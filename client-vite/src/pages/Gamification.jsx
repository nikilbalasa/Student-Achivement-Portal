import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import LevelProgress from "../components/LevelProgress";
import BadgeCollection from "../components/BadgeCollection";
import Leaderboard from "../components/Leaderboard";
import Challenges from "../components/Challenges";
import { FaCoins, FaTrophy, FaChartLine } from "react-icons/fa";
import toast from "react-hot-toast";

const Gamification = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/gamification/stats");
      setStats(response.data);
    } catch (error) {
      toast.error("Failed to load gamification stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600">No gamification data available</p>
          </div>
        </div>
      </div>
    );
  }

  const LEVEL_THRESHOLDS = [
    0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000, 15000, 20000, 30000, 40000, 50000
  ];
  
  const currentLevelThreshold = LEVEL_THRESHOLDS[stats.currentLevel - 1] || 0;
  const currentLevelPoints = stats.totalPoints - currentLevelThreshold;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gamification</h1>
          <p className="text-gray-600">Track your progress, earn badges, and climb the leaderboards!</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <Sidebar />
          </div>

          <div className="lg:w-3/4">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Points</p>
                    <p className="text-3xl font-bold text-primary-600 mt-2">
                      {stats.totalPoints}
                    </p>
                  </div>
                  <FaCoins className="text-4xl text-yellow-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Current Level</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">
                      {stats.currentLevel}
                    </p>
                  </div>
                  <FaTrophy className="text-4xl text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Badges Earned</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {stats.badges?.length || 0}
                    </p>
                  </div>
                  <FaChartLine className="text-4xl text-green-500" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "badges", label: "Badges" },
                    { id: "leaderboard", label: "Leaderboard" },
                    { id: "challenges", label: "Challenges" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-primary-500 text-primary-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "overview" && (
                <>
                  <LevelProgress
                    level={stats.currentLevel}
                    totalPoints={stats.totalPoints}
                    pointsToNextLevel={stats.pointsToNextLevel}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BadgeCollection badges={stats.badges || []} />
                    <Leaderboard type="global" />
                  </div>
                </>
              )}

              {activeTab === "badges" && (
                <BadgeCollection badges={stats.badges || []} />
              )}

              {activeTab === "leaderboard" && (
                <div className="space-y-6">
                  <Leaderboard type="global" />
                  {user?.department && (
                    <Leaderboard type="department" value={user.department} />
                  )}
                </div>
              )}

              {activeTab === "challenges" && <Challenges />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gamification;

