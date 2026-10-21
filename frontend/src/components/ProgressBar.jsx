import React from "react";

function ProgressBar({
  value = 0,
  max = 100,
  label,
  showPercentage = true
}) {
  const percentage = Math.min(
    100,
    Math.max(0, (value / max) * 100)
  );

  return (
    <div className="progress-wrapper">

      {label && (
        <div className="progress-label">
          <span>{label}</span>

          {showPercentage && (
            <span>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`
          }}
        />
      </div>

    </div>
  );
}

export default ProgressBar;