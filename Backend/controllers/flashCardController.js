const FlashCard = require('../models/FlashCard');

exports.createFlashCard = async (req, res) => {
    try {
        const { username, question, answer, date, color, bgColor } = req.body;

        if (!question || !answer || !date || !color || !bgColor) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const flashCard = new FlashCard({
            username,
            question,
            answer,
            date: new Date(date),
            color,
            bgColor,
        });

        await flashCard.save();
        res.status(201).json(flashCard);
    } catch (error) {
        res.status(500).json({ message: 'Error saving flashcard', error: error.message });
    }
};

exports.getFlashCards = async (req, res) => {
    try {
        const flashCards = await FlashCard.find();
        res.status(200).json(flashCards);
    } catch (error) {
        res.status(500).json({ message: 'Error getting flashcards', error: error.message });
    }
};

exports.deleteFlashCard = async (req, res) => {
    try {
        const { id } = req.params;

        const flashCard = await FlashCard.findByIdAndDelete(id);
        if (!flashCard) {
            return res.status(404).json({ message: 'Flash Card not found' });
        }

        res.status(200).json({ message: 'Flash Card deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting flash card', error: error.message });
    }
};
