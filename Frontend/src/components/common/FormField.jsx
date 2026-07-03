export function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-400 mb-1.5">
      {children}
    </label>
  );
}

const fieldClasses =
  "w-full p-3 bg-slate-800/60 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 " +
  "focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 transition-colors";

export function TextInput({ id, label, ...props }) {
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <input id={id} className={fieldClasses} {...props} />
    </div>
  );
}

export function TextArea({ id, label, ...props }) {
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <textarea id={id} className={fieldClasses} {...props} />
    </div>
  );
}
