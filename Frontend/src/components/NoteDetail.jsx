import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNoteById, updateNote, deleteNote, updateNoteGroup } from "../redux/noteSlice.js";
import { fetchGroups } from "../redux/groupSlice";
import Layout from "./common/Layout";
import Spinner from "./common/Spinner";
import { Select, Label } from "./common/FormField";
import RichTextEditor from "./common/RichTextEditor";
import { isRichTextEmpty } from "./common/richTextUtils";
import { ArrowLeftIcon, TrashIcon, CheckIcon } from "./common/Icons";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const note = useSelector((state) => state.notes.selectedNote);
  const noteStatus = useSelector((state) => state.notes.selectedNoteStatus);
  const noteError = useSelector((state) => state.notes.selectedNoteError);
  const groups = useSelector((state) => state.groups.groups);

  // Only edited fields live here; everything else falls back to the note.
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Guards against the editor's initial content load counting as an edit.
  const readyRef = useRef(false);
  const loadedIdRef = useRef(null);

  const noteReady = note && note._id === id;

  useEffect(() => {
    dispatch(fetchNoteById(id));
    dispatch(fetchGroups());
  }, [id, dispatch]);

  // Clear pending edits whenever a different note becomes active.
  useEffect(() => {
    if (noteReady && loadedIdRef.current !== note._id) {
      loadedIdRef.current = note._id;
      setEdits({});
      setSaveError(null);
      readyRef.current = false;
      const t = setTimeout(() => {
        readyRef.current = true;
      }, 0);
      return () => clearTimeout(t);
    }
  }, [noteReady, note]);

  const dirty = Object.keys(edits).length > 0;
  const displayName = "name" in edits ? edits.name : note?.name ?? "";
  const displayType = "type" in edits ? edits.type : note?.type ?? "";

  const setField = (name, value) => setEdits((prev) => ({ ...prev, [name]: value }));

  const handleDescriptionChange = (html) => {
    if (readyRef.current) setEdits((prev) => ({ ...prev, description: html }));
  };

  const handleGroupChange = (e) => {
    dispatch(updateNoteGroup({ id, groupId: e.target.value || null }));
  };

  const handleSave = async () => {
    const name = ("name" in edits ? edits.name : note.name).trim();
    const type = ("type" in edits ? edits.type : note.type).trim();
    const description = "description" in edits ? edits.description : note.description;

    if (!name || !type || isRichTextEmpty(description)) {
      setSaveError("Title, category, and description are required.");
      return;
    }
    setSaveError(null);
    setSaving(true);
    try {
      await dispatch(
        updateNote({
          id,
          data: { name, type, description, date: note.date, color: note.color, bgColor: note.bgColor },
        })
      ).unwrap();
      setEdits({});
    } catch (error) {
      setSaveError(error || "Failed to update note.");
    } finally {
      setSaving(false);
    }
  };

  // Ctrl/Cmd+S saves when there are unsaved changes.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !saving) handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const handleDelete = () => {
    if (window.confirm(`Delete "${note.name}"? This can't be undone.`)) {
      dispatch(deleteNote(id));
      navigate("/");
    }
  };

  if (noteStatus === "failed" && !noteReady) {
    return (
      <Layout center>
        <p className="text-slate-400 text-sm">{noteError || "Note not found."}</p>
      </Layout>
    );
  }

  if (!noteReady) {
    return (
      <Layout center>
        <Spinner className="w-6 h-6 text-slate-500" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <button
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100 transition-colors mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Notes
        </button>

        {/* Sticky save bar — appears on top when there are unsaved changes */}
        {dirty && (
          <div className="sticky top-4 z-20 mb-4 flex items-center justify-between gap-3 bg-slate-900/95 backdrop-blur border border-indigo-500/40 rounded-lg px-4 py-2.5 shadow-lg shadow-black/30">
            <span className="text-sm text-slate-300">You have unsaved changes</span>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Spinner className="w-4 h-4" /> : <CheckIcon className="w-4 h-4" />}
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}

        {/* Colored header shows the note's color */}
        <div className={`${note.bgColor} ${note.color} rounded-xl px-5 py-4 mb-4`}>
          <input
            value={displayName}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Untitled note"
            aria-label="Note title"
            className={`w-full bg-transparent text-2xl font-semibold focus:outline-none ${note.color} placeholder:text-current placeholder:opacity-50`}
          />
          <div className="flex items-center gap-2 mt-1 text-sm opacity-80">
            <span>Category:</span>
            <input
              value={displayType}
              onChange={(e) => setField("type", e.target.value)}
              placeholder="Category"
              aria-label="Note category"
              className={`bg-transparent font-medium focus:outline-none border-b border-current/30 focus:border-current ${note.color} placeholder:text-current placeholder:opacity-50`}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5">
          <div className="max-w-xs">
            <Select id="note-group" label="Group" value={note.groupId || ""} onChange={handleGroupChange}>
              <option value="">Ungrouped</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                  {group.archived ? " (archived)" : ""}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="note-content">Content</Label>
            <RichTextEditor
              key={note._id}
              value={note.description}
              onChange={handleDescriptionChange}
              placeholder="Write your note — format text, add headings, lists, links…"
            />
          </div>

          {saveError && <p className="text-red-400 text-sm">{saveError}</p>}

          <div className="pt-2 border-t border-slate-800">
            <button
              className="flex items-center gap-1.5 px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors"
              onClick={handleDelete}
            >
              <TrashIcon className="w-4 h-4" />
              Delete Note
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
