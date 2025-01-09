import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlashCards, deleteFlashCard } from "../../redux/flashCardSlice.js";
import Navbar from "../common/Navbar";

export default function FlashCards() {
  const dispatch = useDispatch();
  const { flashcards, status, error } = useSelector((state) => state.flashcards);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFlashCards());
    }
  }, [status, dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteFlashCard(id));
  };

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <Navbar />
      <div className="flex justify-center flex-col mt-10">
        <h1 className="text-center font-bold text-4xl mb-6">Flash Cards</h1>
        {status === "loading" ? (
          <div className="text-center text-xl">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-xl">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
            {flashcards.map((card, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105 bg-white text-black`}
              >
                <div className="relative h-40 flex justify-center items-center">
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                    {card.question}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    {card.answer}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(card._id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded shadow-lg"
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
