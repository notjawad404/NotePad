const FlashCard = require('../models/FlashCard');

exports.createFlashCard = async (req, res) => {
    try {
        const { question, answer, date, color, bgColor } = req.body;

        const flashCard = new FlashCard({
            username: req.user.username,
            question,
            answer,
            date: new Date(date),
            color,
            bgColor,
        });

        await flashCard.save();
        res.status(201).json(flashCard);
    } catch (error) {
        console.error('Error saving flashcard:', error);
        res.status(500).json({ message: 'Error saving flashcard', error: error.message });
    }
};

exports.getFlashCards = async (req, res) => {
    try {
        const flashCards = await FlashCard.find({ username: req.user.username });
        res.status(200).json(flashCards);
    } catch (error) {
        console.error('Error getting flashcards:', error);
        res.status(500).json({ message: 'Error getting flashcards', error: error.message });
    }
};

exports.deleteFlashCard = async (req, res) => {
    try {
        const { id } = req.params;

        const flashCard = await FlashCard.findOneAndDelete({ _id: id, username: req.user.username });
        if (!flashCard) {
            return res.status(404).json({ message: 'Flash Card not found' });
        }

        res.status(200).json({ message: 'Flash Card deleted successfully' });
    } catch (error) {
        console.error('Error deleting flash card:', error);
        res.status(500).json({ message: 'Error deleting flash card', error: error.message });
    }
};
