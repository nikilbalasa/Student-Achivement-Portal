import { STATUS_COLORS, STATUS_LABELS } from "../utils/constants";

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        STATUS_COLORS[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
};

export default StatusBadge;

