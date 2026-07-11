const variants = {
  error: "bg-red-500/10 border-red-500/30 text-red-400",
  success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  info: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300",
};

export default function Alert({ variant = "error", children }) {
  if (!children) return null;
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm mb-4 ${variants[variant]}`} role="alert">
      {children}
    </div>
  );
}
