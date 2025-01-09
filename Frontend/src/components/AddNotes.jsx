import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNote } from "../redux/noteSlice";
import Navbar from "./common/Navbar";
import { useNavigate } from "react-router-dom";

export default function AddNotes() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.notes);

  const [noteName, setNoteName] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [noteCategory, setNoteCategory] = useState("");
  const [bgColor, setBgColor] = useState("bg-white");
  const [color, setColor] = useState("text-black");

  const colorOptions = [
    { bgColor: "bg-white", color: "text-black" },
    { bgColor: "bg-red-500", color: "text-white" },
    { bgColor: "bg-green-500", color: "text-white" },
    { bgColor: "bg-blue-500", color: "text-white" },
    { bgColor: "bg-yellow-500", color: "text-black" },
  ];

  const handleAddNote = () => {
    if (!noteName || !noteDescription || !noteCategory) {
      alert("All fields are required!");
      return;
    }

    const newNote = {
      username: "user123",
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
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-center text-4xl font-bold mb-8">Add Note</h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="noteName" className="block text-lg font-medium mb-2">
              Note Name
            </label>
            <input
              id="noteName"
              type="text"
              value={noteName}
              onChange={(e) => setNoteName(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter note name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="noteCategory" className="block text-lg font-medium mb-2">
              Note Category
            </label>
            <input
              id="noteCategory"
              type="text"
              value={noteCategory}
              onChange={(e) => setNoteCategory(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter note category"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="noteDescription" className="block text-lg font-medium mb-2">
              Note Description
            </label>
            <textarea
              id="noteDescription"
              value={noteDescription}
              onChange={(e) => setNoteDescription(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter note description"
              rows="4"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Choose Color</label>
            <div className="flex gap-3">
              {colorOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setBgColor(option.bgColor);
                    setColor(option.color);
                  }}
                  className={`w-10 h-10 rounded-full ${option.bgColor} ${option.color} focus:outline-none`}
                  aria-label={`Set background color to ${option.bgColor}`}
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-500 bg-gray-900 p-3 rounded-lg mb-4">{error}</p>
          )}
          {successMessage && (
            <p className="text-green-500 bg-gray-900 p-3 rounded-lg mb-4">{successMessage}</p>
          )}

          <button
            type="button"
            onClick={handleAddNote}
            className={`w-full py-3 bg-blue-500 text-lg font-bold rounded-lg hover:bg-blue-600 focus:outline-none ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Adding Note..." : "Add Note"}
          </button>
        </div>
      </div>
    </div>
  );
}
