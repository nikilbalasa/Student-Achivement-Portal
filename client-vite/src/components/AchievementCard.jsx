import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaTrophy, FaMapMarkerAlt, FaFileAlt } from "react-icons/fa";
import StatusBadge from "./StatusBadge";
import { format } from "date-fns";
import { BACKEND_URL } from "../utils/config";

const AchievementCard = ({ achievement, onEdit, onDelete, showActions = true }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(achievement);
    } else {
      navigate(`/achievements/edit/${achievement._id}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 card-hover animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
          {achievement.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{achievement.description}</p>
          )}
        </div>
        <StatusBadge status={achievement.status} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FaCalendarAlt className="mr-2 text-primary-500" />
          <span>{formatDate(achievement.date)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FaTrophy className="mr-2 text-warning-500" />
          <span className="capitalize">{achievement.level}</span>
        </div>
        {achievement.category && (
          <div className="flex items-center text-sm text-gray-600">
            <FaMapMarkerAlt className="mr-2 text-accent-500" />
            <span>{achievement.category.name}</span>
          </div>
        )}
        {achievement.proofUrl && (
          <div className="flex items-center text-sm text-primary-600">
            <FaFileAlt className="mr-2" />
            <a
              href={`${BACKEND_URL}${achievement.proofUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              View Certificate
            </a>
          </div>
        )}
      </div>

      {showActions && achievement.status === "pending" && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={handleEdit}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Edit
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(achievement._id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AchievementCard;

