import { CheckIcon } from "./Icons";

export const colorOptions = [
  { bgColor: "bg-white", color: "text-black", name: "White" },
  { bgColor: "bg-red-500", color: "text-white", name: "Red" },
  { bgColor: "bg-green-500", color: "text-white", name: "Green" },
  { bgColor: "bg-blue-500", color: "text-white", name: "Blue" },
  { bgColor: "bg-yellow-500", color: "text-black", name: "Yellow" },
];

export default function ColorPicker({ value, onChange, label = "Choose Color" }) {
  return (
    <div>
      <span className="block text-sm font-medium text-slate-400 mb-1.5">{label}</span>
      <div className="flex gap-3">
        {colorOptions.map((option) => {
          const selected = value === option.bgColor;
          return (
            <button
              key={option.bgColor}
              type="button"
              onClick={() => onChange(option)}
              className={`relative w-9 h-9 rounded-full ${option.bgColor} ${option.color} border border-white/10 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                selected ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900" : ""
              }`}
              aria-label={`Set color to ${option.name}`}
              aria-pressed={selected}
              title={option.name}
            >
              {selected && <CheckIcon className="w-4 h-4 absolute inset-0 m-auto" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
