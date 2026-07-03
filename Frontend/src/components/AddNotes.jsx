import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNote } from "../redux/noteSlice";
import Navbar from "./common/Navbar";
import Layout from "./common/Layout";
import { TextInput, TextArea } from "./common/FormField";
import ColorPicker, { colorOptions } from "./common/ColorPicker";
import Alert from "./common/Alert";
import Spinner from "./common/Spinner";
import { useNavigate } from "react-router-dom";

export default function AddNotes() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error, successMessage } = useSelector((state) => state.notes);
  const loading = status === "loading";

  const [noteName, setNoteName] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [noteCategory, setNoteCategory] = useState("");
  const [bgColor, setBgColor] = useState(colorOptions[0].bgColor);
  const [color, setColor] = useState(colorOptions[0].color);
  const [formError, setFormError] = useState("");

  const handleAddNote = () => {
    if (!noteName || !noteDescription || !noteCategory) {
      setFormError("All fields are required!");
      return;
    }
    setFormError("");

    const newNote = {
      name: noteName,
      description: noteDescription,
      type: noteCategory,
      date: new Date().toISOString(),
      color,
      bgColor,
    };

    dispatch(addNote(newNote));
    setNoteName("");
    setNoteDescription("");
    setNoteCategory("");
    navigate("/");
  };

  return (
    <Layout>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-100 mb-6">Add Note</h1>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5">
          <TextInput
            id="noteName"
            label="Note Name"
            type="text"
            value={noteName}
            onChange={(e) => setNoteName(e.target.value)}
            placeholder="Enter note name"
          />

          <TextInput
            id="noteCategory"
            label="Note Category"
            type="text"
            value={noteCategory}
            onChange={(e) => setNoteCategory(e.target.value)}
            placeholder="Enter note category"
          />

          <TextArea
            id="noteDescription"
            label="Note Description"
            value={noteDescription}
            onChange={(e) => setNoteDescription(e.target.value)}
            placeholder="Enter note description"
            rows="4"
          />

          <ColorPicker
            value={bgColor}
            onChange={(option) => {
              setBgColor(option.bgColor);
              setColor(option.color);
            }}
          />

          <Alert variant="error">{formError || error}</Alert>
          <Alert variant="success">{successMessage}</Alert>

          <button
            type="button"
            onClick={handleAddNote}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && <Spinner className="w-4 h-4" />}
            {loading ? "Adding Note..." : "Add Note"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
