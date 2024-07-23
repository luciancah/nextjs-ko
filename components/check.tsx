import React from "react";

const Check = ({ size = 24, className = "" }) => {
  const styles = {
    icon: {
      color: "#10B981",
    },
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={styles.icon}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
};

export default function App() {
  return <Check />;
}
