import { Link } from "react-router-dom";
import { TrashIcon, FolderIcon, FolderMinusIcon } from "./Icons";

// Shared note card used by the notes list and the group detail page.
export default function NoteCard({ note, groupName, onDelete, onRemoveFromGroup }) {
  return (
    <div
      className={`${note.bgColor} ${note.color} p-5 rounded-xl flex flex-col justify-between border border-black/5 transition-transform hover:-translate-y-0.5`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold leading-snug">{note.name}</h3>
          <div className="flex items-center gap-1 shrink-0">
            {onRemoveFromGroup && (
              <button
                className="opacity-50 hover:opacity-100 transition-opacity"
                onClick={() => onRemoveFromGroup(note)}
                aria-label={`Remove ${note.name} from group`}
                title="Remove from group"
              >
                <FolderMinusIcon className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                className="opacity-50 hover:opacity-100 hover:text-red-500 transition-opacity"
                onClick={() => onDelete(note)}
                aria-label={`Delete ${note.name}`}
                title="Delete note"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm opacity-70 line-clamp-3 mb-4">
          {note.description.split("\n")[0]}
        </p>
      </div>
      <div className="flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-black/20">
            {note.type}
          </span>
          {groupName && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-black/10 flex items-center gap-1 max-w-[10rem]">
              <FolderIcon className="w-3 h-3 shrink-0" />
              <span className="truncate">{groupName}</span>
            </span>
          )}
        </div>
        <Link
          to={`/note/${note._id}`}
          className="text-sm font-medium underline underline-offset-2 opacity-90 hover:opacity-100 shrink-0"
        >
          Show More
        </Link>
      </div>
    </div>
  );
}
