import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";
import { BACKEND_URL } from "../utils/config";
import { FaCheck, FaTimes, FaEye, FaFilter, FaUsers, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { format } from "date-fns";

const VerifyAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [facultyStats, setFacultyStats] = useState(null);
  const [showFacultyStats, setShowFacultyStats] = useState(false);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchFacultyStats();
    } else {
      fetchAchievements();
    }
  }, [user]);

  const fetchFacultyStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/analytics/faculty-stats");
      setFacultyStats(response.data);
      setShowFacultyStats(true);
    } catch (error) {
      toast.error("Failed to load faculty statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      const params = filter !== "all" ? { status: filter } : {};
      const response = await api.get("/achievements", { params });
      setAchievements(response.data);
    } catch (error) {
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      await api.post(`/achievements/${id}/verify`, {
        status,
        remarks: remarks || undefined,
      });
      toast.success(`Achievement ${status} successfully!`);
      setSelectedAchievement(null);
      setRemarks("");
      fetchAchievements();
    } catch (error) {
      toast.error("Failed to verify achievement");
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // If admin, show faculty enrollment overview (no approve/reject buttons)
  if (user?.role === "admin" && showFacultyStats) {
    const totalEnrollments = facultyStats?.facultyStats.reduce((sum, faculty) => sum + faculty.total, 0) || 0;
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Enrollment Overview</h1>
            <p className="text-gray-600">View overall enrollment statistics and faculty information</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <Sidebar />
            </div>

            <div className="lg:w-3/4">
              {facultyStats && (
                <>
                  {/* Overall Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-soft p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Total Faculty</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">{facultyStats.totalFaculty}</p>
                        </div>
                        <FaUsers className="text-4xl text-primary-600" />
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-soft p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Total Enrollments Verified</p>
                          <p className="text-3xl font-bold text-blue-600 mt-2">{totalEnrollments}</p>
                        </div>
                        <FaCheckCircle className="text-4xl text-blue-500" />
                      </div>
                    </div>
                  </div>

                  {/* Faculty List */}
                  <div className="bg-white rounded-xl shadow-soft p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Faculty Members</h2>
                    <div className="space-y-4">
                      {facultyStats.facultyStats.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-600 text-lg">No faculty members found</p>
                        </div>
                      ) : (
                        facultyStats.facultyStats.map((faculty) => (
                          <div
                            key={faculty.id}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{faculty.name}</h3>
                                <p className="text-gray-600 text-sm mt-1">{faculty.email}</p>
                                <p className="text-gray-500 text-sm mt-1">Department: {faculty.department}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Total Verifications</p>
                                <p className="text-2xl font-bold text-primary-600">{faculty.total}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Achievements</h1>
          <p className="text-gray-600">Review and verify student achievements</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <Sidebar />
          </div>

          <div className="lg:w-3/4">
            {/* Filter */}
            <div className="bg-white rounded-xl shadow-soft p-4 mb-6">
              <div className="flex items-center space-x-4">
                <FaFilter className="text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Achievements</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Achievements List */}
            {achievements.length === 0 ? (
              <div className="bg-white rounded-xl shadow-soft p-12 text-center">
                <p className="text-gray-600 text-lg">No achievements found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement._id}
                    className="bg-white rounded-xl shadow-soft p-6 card-hover"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {achievement.title}
                        </h3>
                        {achievement.description && (
                          <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>Date: {formatDate(achievement.date)}</span>
                          <span className="capitalize">Level: {achievement.level}</span>
                          {achievement.category && (
                            <span>Category: {achievement.category.name}</span>
                          )}
                          {achievement.department && (
                            <span>Dept: {achievement.department}</span>
                          )}
                        </div>
                        {achievement.student && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm">
                              <span className="font-semibold">Student:</span>{" "}
                              {achievement.student.name} ({achievement.student.email})
                            </p>
                          </div>
                        )}
                      </div>
                      <StatusBadge status={achievement.status} />
                    </div>

                    {achievement.proofUrl && (
                      <div className="mb-4">
                        <a
                          href={`${BACKEND_URL}${achievement.proofUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                        >
                          <FaEye />
                          <span>View Certificate</span>
                        </a>
                      </div>
                    )}

                    {achievement.status === "pending" && user?.role !== "admin" && (
                      <div className="flex space-x-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => {
                            setSelectedAchievement(achievement);
                            setSelectedAction("approved");
                          }}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <FaCheck />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAchievement(achievement);
                            setSelectedAction("rejected");
                          }}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <FaTimes />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    {achievement.remarks && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm">
                          <span className="font-semibold">Remarks:</span> {achievement.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Verification Modal */}
        {selectedAchievement && selectedAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-large p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedAction === "approved" ? "Approve Achievement" : "Reject Achievement"}
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  placeholder="Add any remarks or comments..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handleVerify(selectedAchievement._id, selectedAction);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
                    selectedAction === "approved"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setSelectedAchievement(null);
                    setSelectedAction(null);
                    setRemarks("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyAchievements;

