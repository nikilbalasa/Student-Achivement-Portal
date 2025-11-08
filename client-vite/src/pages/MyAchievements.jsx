import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";
import AchievementCard from "../components/AchievementCard";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import { FaTrophy, FaPlusCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const MyAchievements = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await api.get("/achievements/me");
      setAchievements(response.data);
    } catch (error) {
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
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

  const handleEdit = (achievement) => {
    navigate(`/achievements/edit/${achievement._id}`);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Achievements</h1>
          <p className="text-gray-600">View and manage all your achievements</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <Sidebar />
          </div>

          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Achievements</h2>
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
                    onEdit={handleEdit}
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

export default MyAchievements;

