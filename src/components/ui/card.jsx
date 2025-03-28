export function Card({ children, className }) {
  return (
    <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={`mt-4 space-y-4 ${className}`}>{children}</div>;
}
