import { useState } from "react";
import axios from "axios";
import Navbar from "../common/Navbar";

export default function AddFlashCards() {
    const [cardQuestion, setCardQuestion] = useState(""); 
    const [cardAnswer, setCardAnswer] = useState("");
    const [bgColor, setBgColor] = useState("white");
    const [color, setColor] = useState("black");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleAddCards = async () => {
        if (!cardQuestion || !cardAnswer) {
            setError("All fields are required.");
            setSuccess("");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.post("http://localhost:5000/flashcards", {
                username: "user123",
                question: cardQuestion,
                answer: cardAnswer,
                date: new Date().toISOString(),
                color,
                bgColor
            });
            console.log(response.data);
            setCardQuestion("");
            setCardAnswer("");
            setSuccess("Flash Card added successfully!");
            setError("");
        } catch (error) {
            console.log(error);
            setError("Failed to add flash card.");
        } finally {
            setLoading(false);
        }
    };

    const colorOptions = [
        { bgColor: "bg-white", color: "text-black" },
        { bgColor: "bg-red-500", color: "text-white" },
        { bgColor: "bg-green-500", color: "text-white" },
        { bgColor: "bg-blue-500", color: "text-white" },
        { bgColor: "bg-yellow-500", color: "text-black" }
    ];

    return (

        <div className="h-screen overflow-y-auto bg-red-600 text-white">
            <Navbar/>
            <div className="flex justify-center flex-col mt-10">
                <h1 className="text-center font-bold text-3xl">Add Flash Card</h1>
                <label htmlFor="cardQuestion" className="w-1/2 m-auto text-lg text-white">
                    Card Question
                </label>
                <input 
                    id="cardQuestion"
                    type="text" 
                    placeholder="Note Name" 
                    value={cardQuestion} 
                    onChange={(e) => setCardQuestion(e.target.value)}
                    className="w-1/2 m-auto rounded-xl my-4 p-4 text-lg text-black"
                />

                <label htmlFor="cardAnswer" className="w-1/2 m-auto text-lg text-white">
                    Card Answer
                </label>
                <textarea 
                    id="cardAnswer"
                    placeholder="Note Description" 
                    value={cardAnswer} 
                    onChange={(e) => setCardAnswer(e.target.value)}
                    className="w-1/2 m-auto rounded-xl my-4 p-4 text-lg text-black"
                />

                <div className="colorButtons w-1/2 m-auto flex justify-around my-4">
                    {colorOptions.map((option, index) => (
                        <button 
                            key={index}
                            onClick={() => { setBgColor(option.bgColor); setColor(option.color); }}
                            className={`${option.bgColor} ${option.color} p-2 rounded-full w-10 h-10`}
                            aria-label={`Set background color to ${option.bgColor} and text color to ${option.color}`}
                        >

                        </button>
                    ))}
                </div>

                {error && <div className="w-1/2 mx-auto text-red-500 text-xl bg-white rounded-full p-2 my-2">{error}</div>}
                {success && <div className="w-1/2 mx-auto text-green-500 text-xl bg-white rounded-full p-2 my-2">{success}</div>}
                
                <button 
                    type="button" 
                    onClick={handleAddCards} 
                    className="w-1/5 m-auto bg-green-400 text-black text-lg p-2 font-semibold rounded-full hover:bg-black hover:text-green-400"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Note"}
                </button>
            </div>
        </div>
    );
}
