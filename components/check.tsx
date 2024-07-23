const Check = ({ size = 24, className = "" }) => (
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
    className={`text-green-500 dark:text-green-400 ${className}`}
  >
    <path d="M20 6L9 17L4 12" />
  </svg>
);

export default function App() {
  return <Check />;
}
