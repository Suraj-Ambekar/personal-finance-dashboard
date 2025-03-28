export const Progress = ({ value, max }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0; // Prevent NaN issues

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div
        className="bg-blue-500 h-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};
