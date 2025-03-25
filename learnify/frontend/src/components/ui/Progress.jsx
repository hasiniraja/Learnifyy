import React from "react";

export const Progress = ({ value, max = 100, color = "bg-blue-500" }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className={`${color} h-4 rounded-full`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default Progress;
