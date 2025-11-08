import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";
import Loader from "./Loader";
import { FaTrophy, FaCheckCircle, FaClock, FaFire } from "react-icons/fa";
import toast from "react-hot-toast";
import { format } from "date-fns";

const Challenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await api.get("/gamification/challenges");
      setChallenges(response.data);
    } catch (error) {
      toast.error("Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      await api.post(`/gamification/challenges/${challengeId}/join`);
      toast.success("Joined challenge successfully!");
      fetchChallenges();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join challenge");
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const getProgressPercentage = (progress, target) => {
    return Math.min(100, (progress / target) * 100);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-soft p-6">
        <Loader />
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Active Challenges</h3>
        <div className="text-center py-8 text-gray-600">
          No active challenges at the moment. Check back soon!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex items-center space-x-2 mb-4">
        <FaFire className="text-orange-500" />
        <h3 className="text-xl font-bold text-gray-900">Active Challenges</h3>
      </div>
      <div className="space-y-4">
        {challenges.map((challenge) => {
          const progress = challenge.progress || 0;
          const progressPercentage = getProgressPercentage(progress, challenge.target);
          const isCompleted = challenge.completed;
          const isParticipant = progress > 0 || challenge.participants?.some(
            (p) => p.user?.toString() === user?.id || p.user === user?.id
          );

          return (
            <div
              key={challenge._id}
              className={`border-2 rounded-lg p-4 ${
                isCompleted
                  ? "bg-green-50 border-green-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-bold text-gray-900">
                      {challenge.title}
                    </h4>
                    {isCompleted && (
                      <FaCheckCircle className="text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {challenge.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>
                      <FaClock className="inline mr-1" />
                      {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                    </span>
                    {challenge.rewardPoints > 0 && (
                      <span className="text-primary-600 font-semibold">
                        {challenge.rewardPoints} points reward
                      </span>
                    )}
                  </div>
                </div>
                {challenge.badge && (
                  <div className="text-3xl">{challenge.badge.icon || "🏆"}</div>
                )}
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>
                    Progress: {progress} / {challenge.target}
                  </span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isCompleted
                        ? "bg-green-500"
                        : "bg-gradient-to-r from-blue-500 to-purple-500"
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {!isParticipant && !isCompleted && (
                <button
                  onClick={() => handleJoinChallenge(challenge._id)}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Join Challenge
                </button>
              )}

              {isCompleted && (
                <div className="text-sm text-green-600 font-semibold">
                  ✓ Challenge Completed!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Challenges;

