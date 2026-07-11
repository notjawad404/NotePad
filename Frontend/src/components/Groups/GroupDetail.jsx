import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotes, deleteNote, updateNoteGroup } from "../../redux/noteSlice";
import { fetchGroups } from "../../redux/groupSlice";
import Navbar from "../common/Navbar";
import Layout from "../common/Layout";
import Spinner from "../common/Spinner";
import EmptyState from "../common/EmptyState";
import NoteCard from "../common/NoteCard";
import { ArrowLeftIcon, FolderIcon, PlusIcon, NoteIcon } from "../common/Icons";

export default function GroupDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const notes = useSelector((state) => state.notes.notes);
  const notesStatus = useSelector((state) => state.notes.status);
  const groups = useSelector((state) => state.groups.groups);
  const groupsStatus = useSelector((state) => state.groups.status);

  const group = groups.find((g) => g._id === id);
  const groupNotes = notes.filter((note) => note.groupId === id);

  useEffect(() => {
    dispatch(fetchGroups());
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleDelete = (note) => {
    if (window.confirm(`Delete "${note.name}"? This can't be undone.`)) {
      dispatch(deleteNote(note._id));
    }
  };

  const handleRemoveFromGroup = (note) => {
    dispatch(updateNoteGroup({ id: note._id, groupId: null }));
  };

  const loading =
    (notesStatus === "loading" || groupsStatus === "loading") && notes.length === 0;

  // Group not found (e.g. deleted) once data has loaded.
  if (!group && groupsStatus === "succeeded") {
    return (
      <Layout>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link
            to="/groups"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100 transition-colors mb-6 w-fit"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Groups
          </Link>
          <EmptyState
            icon={FolderIcon}
            title="Group not found"
            description="This group may have been deleted."
            actionTo="/groups"
            actionLabel="Back to Groups"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          to="/groups"
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100 transition-colors mb-6 w-fit"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Groups
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
              <FolderIcon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-slate-100 truncate">
                  {group ? group.name : "Group"}
                </h1>
                {group?.archived && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                    Archived
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">
                {groupNotes.length} note{groupNotes.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <Link
            to={`/addnotes?group=${id}`}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Note
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-slate-500">
            <Spinner className="w-6 h-6" />
          </div>
        ) : groupNotes.length === 0 ? (
          <EmptyState
            icon={NoteIcon}
            title="No notes in this group yet"
            description="Add a note to this group, or move existing notes here from a note's detail page."
            actionTo={`/addnotes?group=${id}`}
            actionLabel="Add Note"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleDelete}
                onRemoveFromGroup={handleRemoveFromGroup}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
