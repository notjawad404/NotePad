import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addFlashCard } from "../../redux/flashCardSlice";
import Navbar from "../common/Navbar";
import Layout from "../common/Layout";
import { TextInput, TextArea } from "../common/FormField";
import ColorPicker from "../common/ColorPicker";
import { colorOptions } from "../common/colorOptions";
import Alert from "../common/Alert";
import Spinner from "../common/Spinner";

export default function AddFlashCards() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cardQuestion, setCardQuestion] = useState("");
  const [cardAnswer, setCardAnswer] = useState("");
  const [bgColor, setBgColor] = useState(colorOptions[0].bgColor);
  const [color, setColor] = useState(colorOptions[0].color);
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
      question: cardQuestion,
      answer: cardAnswer,
      date: new Date().toISOString(),
      bgColor,
      color,
    };

    try {
      await dispatch(addFlashCard(newFlashCard));
      setCardQuestion("");
      setCardAnswer("");
      setSuccess("Flash Card added successfully!");
      navigate("/flashcards");
    } catch {
      setError("Failed to add flashcard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-100 mb-6">Add Flashcard</h1>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5">
          <TextInput
            id="cardQuestion"
            label="Card Question"
            type="text"
            placeholder="Enter card question"
            value={cardQuestion}
            onChange={(e) => setCardQuestion(e.target.value)}
          />

          <TextArea
            id="cardAnswer"
            label="Card Answer"
            placeholder="Enter card answer"
            value={cardAnswer}
            onChange={(e) => setCardAnswer(e.target.value)}
            rows="4"
          />

          <ColorPicker
            value={bgColor}
            onChange={(option) => {
              setBgColor(option.bgColor);
              setColor(option.color);
            }}
          />

          <Alert variant="error">{error}</Alert>
          <Alert variant="success">{success}</Alert>

          <button
            type="button"
            onClick={handleAddCards}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && <Spinner className="w-4 h-4" />}
            {loading ? "Adding Flash Card..." : "Add Flash Card"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
