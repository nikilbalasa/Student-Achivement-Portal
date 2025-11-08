import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";
import Loader from "./Loader";
import { FaTrophy, FaMedal, FaAward, FaCrown } from "react-icons/fa";
import toast from "react-hot-toast";

const Leaderboard = ({ type = "global", value = null }) => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    fetchUserRank();
  }, [type, value]);

  const fetchLeaderboard = async () => {
    try {
      const params = { type };
      if (value) params.value = value;
      const response = await api.get("/gamification/leaderboard", { params });
      setLeaderboard(response.data);
    } catch (error) {
      toast.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRank = async () => {
    try {
      const params = { type };
      if (value) params.value = value;
      const response = await api.get("/gamification/rank", { params });
      setUserRank(response.data);
    } catch (error) {
      // User might not be on leaderboard yet
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaCrown className="text-yellow-500" />;
    if (rank === 2) return <FaMedal className="text-gray-400" />;
    if (rank === 3) return <FaMedal className="text-orange-600" />;
    return <FaAward className="text-blue-500" />;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "bg-yellow-50 border-yellow-300";
    if (rank === 2) return "bg-gray-50 border-gray-300";
    if (rank === 3) return "bg-orange-50 border-orange-300";
    return "bg-white border-gray-200";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-soft p-6">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Leaderboard
          {type === "department" && value && ` - ${value}`}
        </h3>
        {userRank && (
          <div className="text-sm text-gray-600">
            Your Rank: <span className="font-bold text-primary-600">#{userRank.rank}</span>
          </div>
        )}
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No rankings yet. Be the first to earn points!
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.slice(0, 10).map((entry, index) => {
            const isCurrentUser = entry.user?._id === user?.id;
            return (
              <div
                key={entry._id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  isCurrentUser
                    ? "bg-primary-50 border-primary-400"
                    : getRankColor(entry.rank)
                }`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center justify-center w-10">
                    {entry.rank <= 3 ? (
                      <div className="text-2xl">{getRankIcon(entry.rank)}</div>
                    ) : (
                      <span className="text-lg font-bold text-gray-600">
                        #{entry.rank}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        isCurrentUser ? "text-primary-700" : "text-gray-900"
                      }`}
                    >
                      {entry.user?.name || "Unknown"}
                      {isCurrentUser && " (You)"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {entry.user?.department || "N/A"} • Level {entry.level}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-primary-600">
                    {entry.totalPoints}
                  </p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

