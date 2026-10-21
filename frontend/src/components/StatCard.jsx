import React from "react";

function StatCard({
  label,
  value,
  unit,
  change,
  icon = "↗",
  positive = true
}) {
  return (
    <div className="stat-card">

      <div className="stat-card-top">

        <span className="stat-label">
          {label}
        </span>

        <div className="stat-icon">
          {icon}
        </div>

      </div>

      <div className="stat-value">

        <strong>
          {value}
        </strong>

        {unit && (
          <span>
            {unit}
          </span>
        )}

      </div>

      {change && (
        <div
          className={
            positive
              ? "stat-change positive"
              : "stat-change negative"
          }
        >
          {positive ? "↑" : "↓"} {change}
        </div>
      )}

    </div>
  );
}

export default StatCard;