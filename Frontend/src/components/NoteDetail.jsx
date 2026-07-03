import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNoteById, updateNote, deleteNote } from "../redux/noteSlice.js";
import Layout from "./common/Layout";
import Spinner from "./common/Spinner";
import { TextInput, TextArea } from "./common/FormField";
import { ArrowLeftIcon, PencilIcon, TrashIcon } from "./common/Icons";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const note = useSelector((state) => state.notes.selectedNote);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
  });

  useEffect(() => {
    if (!note || note._id !== id) {
      dispatch(fetchNoteById(id));
    } else {
      setFormData({
        name: note.name,
        description: note.description,
        type: note.type,
      });
    }
  }, [note, id, dispatch]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    dispatch(updateNote({ id, data: formData }));
    setEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${note.name}"? This can't be undone.`)) {
      dispatch(deleteNote(id));
      navigate("/");
    }
  };

  if (!note || note._id !== id) {
    return (
      <Layout center>
        <Spinner className="w-6 h-6 text-slate-500" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        <button
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100 transition-colors mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Notes
        </button>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          {editMode ? (
            <div className="space-y-5">
              <TextInput
                id="edit-name"
                label="Title"
                name="name"
                value={formData.name}
                onChange={handleEditChange}
                placeholder="Title"
              />
              <TextArea
                id="edit-description"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleEditChange}
                placeholder="Description"
                rows="6"
              />
              <TextInput
                id="edit-type"
                label="Category"
                name="type"
                value={formData.type}
                onChange={handleEditChange}
                placeholder="Category"
              />
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl font-semibold text-slate-100">{note.name}</h1>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${note.bgColor} ${note.color}`}>
                  {note.type}
                </span>
              </div>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed mb-6">{note.description}</p>
              <div className="flex gap-3">
                <button
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => setEditMode(true)}
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </button>
                <button
                  className="flex items-center gap-1.5 px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors"
                  onClick={handleDelete}
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
