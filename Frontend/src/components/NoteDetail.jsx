import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNoteById, updateNote, deleteNote } from "../redux/noteSlice.js";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use selectedNote directly from state
  const note = useSelector((state) => state.notes.selectedNote);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
  });

  // Fetch note if not already fetched
  useEffect(() => {
    if (!note || note._id !== id) {
      dispatch(fetchNoteById(id)); // Fetch by ID if not present
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
    // Dispatch the update action with new formData
    dispatch(updateNote({ id, data: formData }));
    setEditMode(false);
    // Optional: Sync the local form data with the updated note
    setFormData({
      name: formData.name,
      description: formData.description,
      type: formData.type,
    });
  };

  const handleDelete = () => {
    dispatch(deleteNote(id));
    navigate("/");
  };

  // If note is still loading, show loading indicator
  if (!note || note._id !== id) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <button
          className="text-blue-400 underline mb-4"
          onClick={() => navigate("/")}
        >
          Back to Notes
        </button>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          {editMode ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleEditChange}
                className="w-full p-3 bg-gray-700 rounded-lg mb-4"
                placeholder="Title"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleEditChange}
                className="w-full p-3 bg-gray-700 rounded-lg mb-4"
                placeholder="Description"
              ></textarea>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleEditChange}
                className="w-full p-3 bg-gray-700 rounded-lg mb-4"
                placeholder="Category"
              />
              <div className="flex gap-4">
                <button
                  className="bg-green-600 px-4 py-2 rounded-lg"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-gray-600 px-4 py-2 rounded-lg"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-4">{note.name}</h1>
              <p className="text-lg mb-4">{note.description}</p>
              <p className="text-sm text-gray-400">Category: {note.type}</p>
              <div className="flex gap-4 mt-6">
                <button
                  className="bg-blue-600 px-4 py-2 rounded-lg"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 px-4 py-2 rounded-lg"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
