import { useState } from "react";
import axios from "axios"; 

export default function AddNotes() {
    const [noteName, setNoteName] = useState(""); 
    const [noteDescription, setNoteDescription] = useState("");
    const [noteCategory, setNoteCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleAddNotes = () => {
        if (!noteName || !noteDescription || !noteCategory) {
            setError("All fields are required.");
            setSuccess("");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        axios.post("http://localhost:5000/notes", {
            name: noteName,
            description: noteDescription,
            type: noteCategory,
            date: new Date().toISOString(),
            color: "black",
            bgColor: "white"
        })
        .then((response) => {
            console.log(response.data);
            setNoteName("");
            setNoteDescription("");
            setNoteCategory("");
            setSuccess("Note added successfully!");
            setError("");

        })
        .catch((error) => {
            console.log(error);
            setError("Failed to add note.");
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return (
        <div className="h-screen overflow-y-auto bg-red-600 text-white">
            <div className="flex justify-center flex-col mt-10">
                <h1 className="text-center font-bold text-3xl">Add Note</h1>
                <input 
                    type="text" 
                    placeholder="Note Name" 
                    value={noteName} 
                    onChange={(e) => setNoteName(e.target.value)}
                    className="w-1/2 m-auto rounded-xl my-4 p-4 text-lg text-black"
                />
                <input 
                    type="text" 
                    placeholder="Note Category" 
                    value={noteCategory} 
                    onChange={(e) => setNoteCategory(e.target.value)}
                    className="w-1/2 m-auto rounded-xl my-4 p-4 text-lg text-black"
                />
                <textarea 
                    placeholder="Note Description" 
                    value={noteDescription} 
                    onChange={(e) => setNoteDescription(e.target.value)}
                    className="w-1/2 m-auto rounded-xl my-4 p-4 text-lg text-black"
                />

                {error && <div className="w-1/2 mx-auto text-red-500 text-xl bg-white rounded-full p-2 my-2">{error}</div>}
                {success && <div className="w-1/2 mx-auto text-green-500 text-xl bg-white rounded-full p-2 my-2">{success}</div>}
                
                <button 
                    type="button" 
                    onClick={handleAddNotes} 
                    className="w-1/5 m-auto bg-green-400 text-black text-lg p-2 font-semibold rounded-full hover:bg-black hover:text-green-400"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Note"}
                </button>
            </div>
        </div>
    );
}
