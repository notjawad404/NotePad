import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addFlashCard } from "../../redux/flashCardSlice";
import Navbar from "../common/Navbar";




export default function AddFlashCards() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [cardQuestion, setCardQuestion] = useState(""); 
    const [cardAnswer, setCardAnswer] = useState("");
    const [bgColor, setBgColor] = useState("bg-white");
    const [color, setColor] = useState("text-black");
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

        const newFlashCard = { 
            username: "user123",
            question: cardQuestion, 
            answer: cardAnswer,
            date: new Date().toISOString(), 
            bgColor, 
            color 
        };

        try {
            await dispatch(addFlashCard(newFlashCard));

            setCardQuestion("");
            setCardAnswer("");
            setSuccess("Flash Card added successfully!");
            setError("");
            navigate("/flashcards");
            
        } catch (error) {
            setError("Failed to add flashcard.");
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
        <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-center text-4xl font-bold mb-8">Add Flash Card</h1>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <label htmlFor="cardQuestion" className="block text-lg font-medium mb-2">Card Question</label>
                        <input 
                            id="cardQuestion"
                            type="text" 
                            placeholder="Enter card question" 
                            value={cardQuestion} 
                            onChange={(e) => setCardQuestion(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="cardAnswer" className="block text-lg font-medium mb-2">Card Answer</label>
                        <textarea 
                            id="cardAnswer"
                            placeholder="Enter card answer" 
                            value={cardAnswer} 
                            onChange={(e) => setCardAnswer(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring focus:ring-blue-500"
                            rows="4"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Choose Color</label>
                        <div className="flex gap-3">
                            {colorOptions.map((option, index) => (
                                <button 
                                    key={index}
                                    onClick={() => { setBgColor(option.bgColor); setColor(option.color); }}
                                    className={`w-10 h-10 rounded-full ${option.bgColor} ${option.color} focus:outline-none`}
                                    aria-label={`Set background color to ${option.bgColor} and text color to ${option.color}`}
                                />
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-red-500 bg-gray-900 p-3 rounded-lg mb-4">{error}</p>}
                    {success && <p className="text-green-500 bg-gray-900 p-3 rounded-lg mb-4">{success}</p>}

                    <button 
                        type="button" 
                        onClick={handleAddCards} 
                        className={`w-full py-3 bg-green-500 text-lg font-bold rounded-lg hover:bg-green-600 focus:outline-none ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Adding Flash Card..." : "Add Flash Card"}
                    </button>
                </div>
            </div>
        </div>
    );
}
