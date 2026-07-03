import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlashCards, deleteFlashCard } from "../../redux/flashCardSlice.js";
import Navbar from "../common/Navbar";
import Layout from "../common/Layout";
import Spinner from "../common/Spinner";
import EmptyState from "../common/EmptyState";
import Alert from "../common/Alert";
import { PlusIcon, TrashIcon, CardsIcon } from "../common/Icons";
import { Link } from "react-router-dom";
import "./fcStyle.css";

export default function FlashCards() {
  const dispatch = useDispatch();
  const { flashcards, status, error } = useSelector((state) => state.flashcards);
  const [flippedIds, setFlippedIds] = useState(new Set());

  useEffect(() => {
    dispatch(fetchFlashCards());
  }, [dispatch]);

  const toggleFlip = (id) => {
    setFlippedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Delete this flashcard? This can't be undone.")) {
      dispatch(deleteFlashCard(id));
    }
  };

  return (
    <Layout>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">Flashcards</h1>
            <p className="text-sm text-slate-500 mt-1">Click a card to flip it.</p>
          </div>
          <Link
            to="/addflashcards"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Flashcard
          </Link>
        </div>

        {status === "loading" ? (
          <div className="flex justify-center py-20 text-slate-500">
            <Spinner className="w-6 h-6" />
          </div>
        ) : error ? (
          <Alert variant="error">{error}</Alert>
        ) : flashcards.length === 0 ? (
          <EmptyState
            icon={CardsIcon}
            title="No flashcards yet"
            description="Add your first flashcard to start studying."
            actionTo="/addflashcards"
            actionLabel="Add Flashcard"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {flashcards.map((card) => {
              const flipped = flippedIds.has(card._id);
              return (
                <div key={card._id} className="relative perspective-1000 h-44">
                  <button
                    onClick={(e) => handleDelete(e, card._id)}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/30 text-white/80 hover:text-red-400 hover:bg-black/50 transition-colors"
                    aria-label="Delete flashcard"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  <div
                    className="relative w-full h-full flip-card cursor-pointer transition-transform duration-500"
                    style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                    onClick={() => toggleFlip(card._id)}
                  >
                    <div
                      className={`absolute inset-0 backface-hidden rounded-xl p-5 flex flex-col items-center justify-center text-center gap-2 border border-black/5 ${card.bgColor} ${card.color}`}
                    >
                      <span className="text-[10px] uppercase tracking-wide opacity-60 absolute top-3 left-4">
                        Question
                      </span>
                      <p className="font-medium">{card.question}</p>
                    </div>
                    <div
                      className={`absolute inset-0 backface-hidden rounded-xl p-5 flex flex-col items-center justify-center text-center gap-2 border border-black/5 ${card.bgColor} ${card.color}`}
                      style={{ transform: "rotateY(180deg)" }}
                    >
                      <span className="text-[10px] uppercase tracking-wide opacity-60 absolute top-3 left-4">
                        Answer
                      </span>
                      <p className="font-medium">{card.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
