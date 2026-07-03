import { Link } from "react-router-dom";

export default function EmptyState({ icon: Icon, title, description, actionTo, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-500">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-200 mb-1">{title}</h3>
      {description && <p className="text-slate-500 max-w-sm mb-6 text-sm">{description}</p>}
      {actionTo && (
        <Link
          to={actionTo}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium text-sm transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
