import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../common/Navbar";

export default function FlashCards() {
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchFlashCards = async () => {
        try {
            const response = await axios.get("http://localhost:5000/flashcards");
            setFlashcards(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setError("Failed to fetch flashcards.");
            setLoading(false);
        }
    };
    useEffect(() => {
        
        fetchFlashCards();
    }, []);

    const deleteFlashCard = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/flashcards/${id}`);
            setFlashcards(flashcards.filter(card => card.id !== id));
            fetchFlashCards();
        } catch (error) {
            console.log(error);
            setError("Failed to delete flashcard."+ error.message);

        }
    };

    return (
        <div className="h-screen overflow-y-auto bg-blue-600 text-white">
            <Navbar />
            <div className="flex justify-center flex-col mt-10">
                <h1 className="text-center font-bold text-3xl mb-6">Flash Cards</h1>
                {loading ? (
                    <div className="text-center text-xl">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-500 text-xl">{error}</div>
                ) : (
                    <div className="flex flex-wrap justify-center">
                        {flashcards.map((card, index) => (
                            <div
                                key={index}
                                className={`group w-1/4 m-4 p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer ${card.bgColor} ${card.color}`}
                            >
                                <div className="relative h-40">
                                    <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                                        {card.question}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                        {card.answer}
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteFlashCard(card._id)}
                                    className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
