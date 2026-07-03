export default function Layout({ children, center = false }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {center ? (
        <div className="min-h-screen flex items-center justify-center p-4">{children}</div>
      ) : (
        children
      )}
    </div>
  );
}
