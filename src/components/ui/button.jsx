export function Button({ children, className, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  );
}
