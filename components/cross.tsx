import React from 'react'

const Cross = ({ size = 24, className = '' }) => {
  const styles = {
    icon: {
      color: '#3d3d3d',
    },
  }

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
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  )
}

export default function App() {
  return <Cross />
}
