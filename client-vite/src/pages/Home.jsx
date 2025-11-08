import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaTrophy, FaChartLine, FaCheckCircle, FaUsers, FaAward, FaRocket } from "react-icons/fa";

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: FaTrophy,
      title: "Track Achievements",
      description: "Record all your academic, sports, technical, and cultural achievements in one place.",
    },
    {
      icon: FaCheckCircle,
      title: "Verified Records",
      description: "All achievements are verified by faculty and admin for authenticity.",
    },
    {
      icon: FaChartLine,
      title: "Analytics Dashboard",
      description: "View comprehensive analytics and insights about achievements across departments.",
    },
    {
      icon: FaAward,
      title: "Digital Portfolio",
      description: "Build your digital achievement portfolio for placements and audits.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-6">
              <FaRocket className="text-6xl text-yellow-300 animate-bounce" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Student Achievement Portal
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Track, showcase, and celebrate your academic excellence and achievements
            </p>
            {!user && (
              <div className="flex justify-center space-x-4">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg shadow-large"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-lg"
                >
                  Login
                </Link>
              </div>
            )}
            {user && (
              <div className="flex justify-center space-x-4">
                <Link
                  to={user.role === "student" ? "/dashboard" : "/admin/dashboard"}
                  className="inline-block px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg shadow-large"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/hall-of-fame"
                  className="inline-block px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-lg"
                >
                  View Hall of Fame
                </Link>
              </div>
            )}
            {!user && (
              <div className="mt-4">
                <Link
                  to="/hall-of-fame"
                  className="inline-block px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-lg"
                >
                  View Hall of Fame
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A comprehensive platform for managing and showcasing student achievements
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-soft card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Icon className="text-3xl text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <FaUsers className="text-5xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <FaTrophy className="text-5xl text-accent-600 mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-gray-900 mb-2">5000+</h3>
              <p className="text-gray-600">Achievements Recorded</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <FaCheckCircle className="text-5xl text-success-600 mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-gray-900 mb-2">95%</h3>
              <p className="text-gray-600">Verification Rate</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

