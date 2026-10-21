import React from "react";

function Card({
  children,
  className = "",
  title,
  subtitle
}) {
  return (
    <div className={`dashboard-card ${className}`}>
      {(title || subtitle) && (
        <div className="card-header">
          <div>
            {title && (
              <h3>{title}</h3>
            )}

            {subtitle && (
              <p>{subtitle}</p>
            )}
          </div>
        </div>
      )}

      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default Card;