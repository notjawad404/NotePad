const mongoose = require('mongoose');

const FlashCardSchema = new mongoose.Schema({
    username: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    date: { type: Date, required: true },
    color: { type: String, required: true },
    bgColor: { type: String, required: true },
});

module.exports = mongoose.model('FlashCard', FlashCardSchema);