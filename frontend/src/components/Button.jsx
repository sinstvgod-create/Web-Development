import React from "react";

function Button({
  children,
  type = "button",
  className = "primary-btn",
  onClick,
  disabled = false
}) {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;