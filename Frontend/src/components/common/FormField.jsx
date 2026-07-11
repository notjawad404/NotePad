import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "./Icons";

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

export function PasswordInput({ id, label, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <input id={id} type={visible ? "text" : "password"} className={`${fieldClasses} pr-11`} {...props} />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-300 transition-colors"
        >
          {visible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
        </button>
      </div>
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

export function Select({ id, label, children, ...props }) {
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <select id={id} className={`${fieldClasses} appearance-none cursor-pointer`} {...props}>
        {children}
      </select>
    </div>
  );
}
