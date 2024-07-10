import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./common/Navbar";

const colorOptions = [
  { bgColor: "bg-white", color: "text-black" },
  { bgColor: "bg-red-500", color: "text-white" },
  { bgColor: "bg-green-500", color: "text-white" },
  { bgColor: "bg-blue-500", color: "text-white" },
  { bgColor: "bg-yellow-500", color: "text-black" },
];

export default function NotePad() {
  const [notes, setNotes] = useState([]);
  const [editNotes, setEditTask] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    date: "",
    type: "",
    color: "",
    bgColor: "",
  });
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/notes").then((response) => {
      const userNotes = response.data.filter(
        (note) => note.username === "user123"
      );
      console.log(userNotes);
      setNotes(userNotes);
    });
  }, []);

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
      console.log("Note deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const startEditingTask = (note) => {
    setEditTask(note._id);
    setEditFormData({
      name: note.name,
      description: note.description,
      date: note.date,
      type: note.type,
      color: note.color,
      bgColor: note.bgColor,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const submitEditTask = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/notes/${id}`,
        editFormData
      );
      setNotes(notes.map((note) => (note._id === id ? response.data : note)));
      setEditTask(null);
      console.log("Note updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchByName = (e) => {
    setSearchName(e.target.value);
  };

  const handleSearchByCategory = (e) => {
    setSearchCategory(e.target.value);
  };

  const handleColorClick = (bgColor) => {
    setSelectedColor(bgColor);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.name.toLowerCase().includes(searchName.toLowerCase()) &&
      note.type.toLowerCase().includes(searchCategory.toLowerCase()) &&
      (selectedColor ? note.bgColor === selectedColor : true)
  );

  return (
    <div className="notepadBg h-screen overflow-y-auto">
      <Navbar />
      <h1 className="text-white font-bold text-center py-4 text-3xl">
        NotePad
      </h1>

      <div className="w-full m-auto px-4 py-2 flex flex-row">
        <input
          type="text"
          value={searchName}
          onChange={handleSearchByName}
          placeholder="Search notes by name"
          className="block w-1/2 p-2 mb-4 mx-1 border rounded-xl"
        />

        <input
          type="text"
          value={searchCategory}
          onChange={handleSearchByCategory}
          placeholder="Search notes by category"
          className="block w-1/2 p-2 mb-4 mx-1 border rounded-xl"
        />

        <div className="w-full m-auto px-4 py-2 flex flex-row justify-end">
          <div
            className="bg-gray-500 w-8 h-8 rounded-full mx-2 cursor-pointer"
            onClick={() => handleColorClick("")}
          ></div>
          {colorOptions.map((option, index) => (
            <div
              key={index}
              className={`${option.bgColor} w-8 h-8 rounded-full ring-2 ring-black mx-2 cursor-pointer`}
              onClick={() => handleColorClick(option.bgColor)}
            ></div>
          ))}
        </div>
      </div>

      <div className="w-full m-auto px-4 py-2 rounded-xl">
        {filteredNotes.length === 0 ? (
          <div className="bg-green-400 w-full m-auto px-4 py-2">
            <p className="text-lg text-center">No notes available</p>
          </div>
        ) : (
          filteredNotes.map((note, index) => (
            <div
              key={index}
              className={`${note.bgColor} ${note.color} w-full mx-auto my-3 rounded-xl px-3`}
            >
              <div className="flex flex-col py-2">
                <div className="w-full">
                  <h3>
                    {index + 1}
                    {")"}{" "}
                    <span className="text-lg font-semibold">{note.name}</span>
                  </h3>
                  <textarea
                    name="description"
                    value={note.description}
                    disabled
                    className="block w-full h-40 p-2 mb-2 border rounded"
                    placeholder="Note Description"
                  ></textarea>
                </div>
                <div className="flex flex-row m-auto">
                  <button
                    className="bg-red-600 text-white p-2 m-2 rounded-full w-20 h-10"
                    onClick={() => startEditingTask(note)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white p-2 m-2 rounded-full w-20 h-10"
                    onClick={() => deleteTask(note._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {editNotes === note._id && (
                <div className="bg-white text-black p-4 m-4 rounded shadow-md">
                  <h2 className="text-xl font-bold mb-2">Edit Note</h2>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="block w-full p-2 mb-2 border rounded"
                    placeholder="Note Name"
                  />
                  <input
                    type="text"
                    name="type"
                    value={editFormData.type}
                    onChange={handleEditChange}
                    className="block w-full p-2 mb-2 border rounded"
                    placeholder="Note Type"
                  />
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    className="block w-full h-40 p-2 mb-2 border rounded"
                    placeholder="Note Description"
                  ></textarea>

                  <div className="flex flex-row justify-center mb-4">
                    {colorOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`${option.bgColor} ${
                          editFormData.bgColor === option.bgColor
                            ? " ring-8 ring-black"
                            : "ring-2 ring-black"
                        } w-8 h-8 rounded-full mx-2 cursor-pointer `}
                        onClick={() =>
                          setEditFormData({
                            ...editFormData,
                            bgColor: option.bgColor,
                            color: option.color,
                          })
                        }
                      ></div>
                    ))}
                  </div>
                  <button
                    className="bg-green-600 text-white p-2 rounded"
                    onClick={() => submitEditTask(note._id)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-red-600 text-white p-2 rounded ml-2"
                    onClick={() => setEditTask(null)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
