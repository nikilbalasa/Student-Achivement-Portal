import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { FaTrophy, FaUsers, FaCheckCircle, FaClock, FaTimes, FaInfoCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { format } from "date-fns";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [categoryData, setCategoryData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [departmentDetails, setDepartmentDetails] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [achievementsRes, categoryRes, departmentRes, timelineRes] = await Promise.all([
        api.get("/achievements"),
        api.get("/analytics/categories"),
        api.get("/analytics/departments"),
        api.get("/analytics/timeline"),
      ]);

      const achievements = achievementsRes.data;
      setStats({
        total: achievements.length,
        pending: achievements.filter((a) => a.status === "pending").length,
        approved: achievements.filter((a) => a.status === "approved").length,
        rejected: achievements.filter((a) => a.status === "rejected").length,
      });

      setCategoryData(categoryRes.data);
      setDepartmentData(departmentRes.data);
      setTimelineData(timelineRes.data);
    } catch (error) {
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (categoryId) => {
    try {
      const response = await api.get(`/analytics/category/${categoryId}/details`);
      setCategoryDetails(response.data);
      setSelectedCategory(categoryId);
      setSelectedDepartment(null);
      setDepartmentDetails(null);
    } catch (error) {
      toast.error("Failed to load category details");
    }
  };

  const handleDepartmentClick = async (department) => {
    try {
      const response = await api.get(`/analytics/department/${encodeURIComponent(department)}/details`);
      setDepartmentDetails(response.data);
      setSelectedDepartment(department);
      setSelectedCategory(null);
      setCategoryDetails(null);
    } catch (error) {
      toast.error("Failed to load department details");
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

  const isAdmin = user?.role === "admin";
  const isFaculty = user?.role === "faculty";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isAdmin ? "Admin Dashboard" : "Analytics Dashboard"}
          </h1>
          <p className="text-gray-600">
            {isAdmin ? "Analytics and insights" : "View enrollment statistics and student information"}
          </p>
        </div>

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
                <p className="text-gray-600 text-sm font-medium">Pending Review</p>
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
                <p className="text-gray-600 text-sm font-medium">Departments</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {departmentData.length}
                </p>
              </div>
              <FaUsers className="text-4xl text-blue-500" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <Sidebar />
          </div>

          <div className="lg:w-3/4 space-y-8">
            {/* Category-wise Chart */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Achievements by Category (Click on a category to see details)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, count }) => `${name}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    onClick={(data, index, e) => {
                      if (data && categoryData[index]) {
                        handleCategoryClick(categoryData[index].categoryId);
                      }
                    }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Category List for Clicking */}
              <div className="mt-4 flex flex-wrap gap-2">
                {categoryData.map((category) => (
                  <button
                    key={category.categoryId}
                    onClick={() => handleCategoryClick(category.categoryId)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.categoryId
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
              
              {/* Category Details */}
              {categoryDetails && (
                <div className="mt-6 border-t pt-6">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {categoryData.find(c => c.categoryId === categoryDetails.categoryId)?.name || 'Category'} Details
                    </h4>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Enrolled</p>
                        <p className="text-2xl font-bold text-blue-600">{categoryDetails.enrolled}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Accepted</p>
                        <p className="text-2xl font-bold text-green-600">{categoryDetails.accepted}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Rejected</p>
                        <p className="text-2xl font-bold text-red-600">{categoryDetails.rejected}</p>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <h5 className="text-md font-semibold text-gray-800 mb-3">Student List:</h5>
                    {categoryDetails.achievements.length === 0 ? (
                      <p className="text-gray-500">No students enrolled in this category</p>
                    ) : (
                      <div className="space-y-3">
                        {categoryDetails.achievements.map((achievement) => (
                          <div key={achievement.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{achievement.title}</p>
                                {achievement.student && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">Student:</span> {achievement.student.name} 
                                    {achievement.student.enrollmentNumber && ` (${achievement.student.enrollmentNumber})`}
                                    {achievement.student.department && ` - ${achievement.student.department}`}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  Date: {formatDate(achievement.date)}
                                </p>
                              </div>
                              <StatusBadge status={achievement.status} />
                            </div>
                            {achievement.verifiedBy && (
                              <p className="text-xs text-gray-500 mt-2">
                                Verified by: {achievement.verifiedBy.name}
                                {achievement.verifiedAt && ` on ${formatDate(achievement.verifiedAt)}`}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setCategoryDetails(null);
                      setSelectedCategory(null);
                    }}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close Details
                  </button>
                </div>
              )}
            </div>

            {/* Department-wise Chart */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Achievements by Department (Click on a bar to see details)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    fill="#3b82f6" 
                    onClick={(data, index, e) => {
                      if (data && departmentData[index]) {
                        handleDepartmentClick(departmentData[index].department);
                      }
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Department List for Clicking */}
              <div className="mt-4 flex flex-wrap gap-2">
                {departmentData.map((dept, index) => (
                  <button
                    key={dept.department}
                    onClick={() => handleDepartmentClick(dept.department)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedDepartment === dept.department
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {dept.department} ({dept.count})
                  </button>
                ))}
              </div>
              
              {/* Department Details */}
              {departmentDetails && (
                <div className="mt-6 border-t pt-6">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {departmentDetails.department} Department Details
                    </h4>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Enrolled</p>
                        <p className="text-2xl font-bold text-blue-600">{departmentDetails.enrolled}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Accepted</p>
                        <p className="text-2xl font-bold text-green-600">{departmentDetails.accepted}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Rejected</p>
                        <p className="text-2xl font-bold text-red-600">{departmentDetails.rejected}</p>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <h5 className="text-md font-semibold text-gray-800 mb-3">Student List:</h5>
                    {departmentDetails.achievements.length === 0 ? (
                      <p className="text-gray-500">No students enrolled from this department</p>
                    ) : (
                      <div className="space-y-3">
                        {departmentDetails.achievements.map((achievement) => (
                          <div key={achievement.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{achievement.title}</p>
                                {achievement.student && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">Student:</span> {achievement.student.name} 
                                    {achievement.student.enrollmentNumber && ` (${achievement.student.enrollmentNumber})`}
                                  </p>
                                )}
                                {achievement.category && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">Category:</span> {achievement.category.name}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  Date: {formatDate(achievement.date)}
                                </p>
                              </div>
                              <StatusBadge status={achievement.status} />
                            </div>
                            {achievement.verifiedBy && (
                              <p className="text-xs text-gray-500 mt-2">
                                Verified by: {achievement.verifiedBy.name}
                                {achievement.verifiedAt && ` on ${formatDate(achievement.verifiedAt)}`}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setDepartmentDetails(null);
                      setSelectedDepartment(null);
                    }}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close Details
                  </button>
                </div>
              )}
            </div>

            {/* Timeline Chart */}
            {timelineData.length > 0 && (
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Achievement Timeline
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(value) => {
                        const months = [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ];
                        return months[value - 1] || value;
                      }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Achievements"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

