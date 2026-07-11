import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroups,
  addGroup,
  renameGroup,
  setGroupArchived,
  deleteGroup,
  clearGroupMessages,
} from "../../redux/groupSlice";
import { fetchNotes, updateNoteGroup } from "../../redux/noteSlice";
import Navbar from "../common/Navbar";
import Layout from "../common/Layout";
import Spinner from "../common/Spinner";
import EmptyState from "../common/EmptyState";
import Alert from "../common/Alert";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  ArchiveIcon,
  CheckIcon,
  CloseIcon,
  SparklesIcon,
  ChevronRightIcon,
} from "../common/Icons";

export default function Groups() {
  const dispatch = useDispatch();
  const { groups, status, error, successMessage } = useSelector((state) => state.groups);
  const notes = useSelector((state) => state.notes.notes);

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [autoWorking, setAutoWorking] = useState(false);
  const [autoMessage, setAutoMessage] = useState("");

  useEffect(() => {
    dispatch(fetchGroups());
    dispatch(fetchNotes());
    return () => dispatch(clearGroupMessages());
  }, [dispatch]);

  // Auto-dismiss transient messages.
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => dispatch(clearGroupMessages()), 3000);
    return () => clearTimeout(t);
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (!autoMessage) return;
    const t = setTimeout(() => setAutoMessage(""), 5000);
    return () => clearTimeout(t);
  }, [autoMessage]);

  const activeGroups = groups.filter((group) => !group.archived);
  const archivedGroups = groups.filter((group) => group.archived);
  const noteCount = (groupId) => notes.filter((note) => note.groupId === groupId).length;

  const handleCreate = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const result = await dispatch(addGroup(name));
    if (addGroup.fulfilled.match(result)) setNewName("");
  };

  const startEdit = (group) => {
    setEditingId(group._id);
    setEditingName(group.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async (id) => {
    const name = editingName.trim();
    if (!name) return;
    const result = await dispatch(renameGroup({ id, name }));
    if (renameGroup.fulfilled.match(result)) cancelEdit();
  };

  const handleArchive = (group) =>
    dispatch(setGroupArchived({ id: group._id, archived: !group.archived }));

  const handleDelete = async (group) => {
    const count = noteCount(group._id);
    const message =
      count > 0
        ? `Delete "${group.name}"? Its ${count} note${count === 1 ? "" : "s"} will be moved to Ungrouped.`
        : `Delete "${group.name}"? This can't be undone.`;
    if (window.confirm(message)) {
      const result = await dispatch(deleteGroup(group._id));
      // Backend unassigns the group's notes; refresh so counts stay accurate.
      if (deleteGroup.fulfilled.match(result)) dispatch(fetchNotes());
    }
  };

  // Create a group for each distinct note category, then file ungrouped
  // notes into the group that matches their category.
  const handleAutoCreate = async () => {
    const categories = [...new Set(notes.map((n) => (n.type || "").trim()).filter(Boolean))];
    if (categories.length === 0) {
      setAutoMessage("No note categories found to create groups from.");
      return;
    }

    const existingNames = new Set(groups.map((g) => g.name.trim().toLowerCase()));
    const toCreate = categories.filter((c) => !existingNames.has(c.toLowerCase()));
    const ungrouped = notes.filter((n) => !n.groupId && (n.type || "").trim());

    const confirmMsg =
      toCreate.length > 0
        ? `Create ${toCreate.length} group${toCreate.length === 1 ? "" : "s"} from your note categories and file ungrouped notes into them?`
        : "All categories already have groups. File ungrouped notes into their category groups?";
    if (!window.confirm(confirmMsg)) return;

    setAutoWorking(true);
    dispatch(clearGroupMessages());
    setAutoMessage("");

    // Create missing groups sequentially to avoid duplicate-name races.
    const created = [];
    for (const name of toCreate) {
      const res = await dispatch(addGroup(name));
      if (addGroup.fulfilled.match(res)) created.push(res.payload);
    }

    const nameToId = {};
    [...groups, ...created].forEach((g) => {
      nameToId[g.name.trim().toLowerCase()] = g._id;
    });

    const assignments = ungrouped
      .map((note) => ({ note, gid: nameToId[note.type.trim().toLowerCase()] }))
      .filter((a) => a.gid);

    await Promise.all(
      assignments.map((a) => dispatch(updateNoteGroup({ id: a.note._id, groupId: a.gid })))
    );

    await dispatch(fetchNotes());
    dispatch(clearGroupMessages());
    setAutoWorking(false);

    if (created.length === 0 && assignments.length === 0) {
      setAutoMessage("Your notes are already organized into category groups.");
    } else {
      const parts = [];
      if (created.length) parts.push(`created ${created.length} group${created.length === 1 ? "" : "s"}`);
      if (assignments.length) parts.push(`organized ${assignments.length} note${assignments.length === 1 ? "" : "s"}`);
      setAutoMessage(`Done — ${parts.join(" and ")}.`);
    }
  };

  const renderGroupCard = (group) => {
    const isEditing = editingId === group._id;
    const count = noteCount(group._id);

    return (
      <div
        key={group._id}
        className={`bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 transition-colors hover:border-slate-700 ${
          group.archived ? "opacity-70" : ""
        }`}
      >
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit(group._id);
                if (e.key === "Escape") cancelEdit();
              }}
              autoFocus
              maxLength={100}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            />
            <div className="flex gap-2">
              <button
                onClick={() => saveEdit(group._id)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium transition-colors"
              >
                <CheckIcon className="w-3.5 h-3.5" /> Save
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-700 hover:bg-slate-800 rounded-lg text-xs font-medium transition-colors"
              >
                <CloseIcon className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to={`/groups/${group._id}`} className="group flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                <FolderIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-slate-100 text-sm font-medium truncate group-hover:text-white">
                    {group.name}
                  </h3>
                  {group.archived && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                      Archived
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {count} note{count === 1 ? "" : "s"}
                </p>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0 mt-1" />
            </Link>

            <div className="flex items-center gap-1 pt-3 border-t border-slate-800/70">
              <button
                onClick={() => startEdit(group)}
                className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
                aria-label={`Rename ${group.name}`}
                title="Rename"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleArchive(group)}
                className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
                aria-label={group.archived ? `Unarchive ${group.name}` : `Archive ${group.name}`}
                title={group.archived ? "Unarchive" : "Archive"}
              >
                <ArchiveIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(group)}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors ml-auto"
                aria-label={`Delete ${group.name}`}
                title="Delete"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">Groups</h1>
            <p className="text-slate-500 text-sm mt-1">
              Organize your notes into groups. Click a group to see its notes.
            </p>
          </div>
          <button
            onClick={handleAutoCreate}
            disabled={autoWorking}
            className="flex items-center gap-2 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Create a group for each note category and file ungrouped notes into them"
          >
            {autoWorking ? <Spinner className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4 text-indigo-400" />}
            {autoWorking ? "Organizing…" : "Auto-create from categories"}
          </button>
        </div>

        <form onSubmit={handleCreate} className="flex gap-3 my-6">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New group name"
            maxLength={100}
            className="flex-1 px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg placeholder-slate-500 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Create
          </button>
        </form>

        <Alert variant="error">{error}</Alert>
        <Alert variant="success">{successMessage}</Alert>
        <Alert variant="info">{autoMessage}</Alert>

        {status === "loading" && groups.length === 0 ? (
          <div className="flex justify-center py-20 text-slate-500">
            <Spinner className="w-6 h-6" />
          </div>
        ) : groups.length === 0 ? (
          <EmptyState
            icon={FolderIcon}
            title="No groups yet"
            description="Create a group above, or use “Auto-create from categories” to build groups from your notes."
          />
        ) : (
          <>
            {activeGroups.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeGroups.map(renderGroupCard)}
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-4">All your groups are archived.</p>
            )}

            {archivedGroups.length > 0 && (
              <div className="mt-8">
                <button
                  onClick={() => setShowArchived((v) => !v)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors mb-3"
                >
                  <ArchiveIcon className="w-4 h-4" />
                  Archived ({archivedGroups.length})
                  <ChevronRightIcon
                    className={`w-4 h-4 transition-transform ${showArchived ? "rotate-90" : ""}`}
                  />
                </button>
                {showArchived && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {archivedGroups.map(renderGroupCard)}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
