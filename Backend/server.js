const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();



const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.log("Error Connecting to MongoDB: ", error.message);
});

// Notes Schema
const NotesSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    color: { type: String, required: true },
    bgColor: { type: String, required: true },
});

const Note = mongoose.model('Notes', NotesSchema);

app.post('/notes', async (req, res) => {
    try {
        const {username, name, description, type, date, color, bgColor } = req.body;
        console.log("Request Body: ", req.body); 

        // Validate that all required fields are present
        if (!name || !description || !type || !date || !color || !bgColor) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new note object
        const note = new Note({
            username,
            name,
            description,
            type,
            date: new Date(date),
            color,
            bgColor
        });

        // Save the note to the database
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ message: 'Error saving note', error: error.message });
    }
});

app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        console.error('Error getting notes:', error);
        res.status(500).json({ message: 'Error getting notes', error: error.message });
    }
});

app.delete('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await Note.findByIdAndDelete(id);
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Error deleting note', error: error.message });
    }
});

app.put('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, name, description, type, date, color, bgColor } = req.body;
        const note = await Note.findByIdAndUpdate(
            id,
            { username, name, description, type, date: new Date(date), color, bgColor },
            { new: true } // This option returns the updated document
        );
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(note);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: 'Error updating note', error: error.message });
    }
});


// Flash Cards

const FlashCardSchema = new mongoose.Schema({
    username: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    date: { type: Date, required: true },
    color: { type: String, required: true },
    bgColor: { type: String, required: true },
});

const FlashCard = mongoose.model('FlashCards', FlashCardSchema);

app.post('/flashcards', async (req, res) => {
    try {
        const {username, question, answer, date, color, bgColor } = req.body;
        console.log("Request Body: ", req.body); 

        // Validate that all required fields are present
        if (!question || !answer || !date || !color || !bgColor) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new note object
        const flashCard = new FlashCard({
            username,
            question,
            answer,
            date: new Date(date),
            color,
            bgColor
        });

        // Save the note to the database
        await flashCard.save();
        res.status(201).json(flashCard);
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ message: 'Error saving note', error: error.message });
    }
})

app.get('/flashcards', async (req, res) => {
    try {
        const flashCards = await FlashCard.find();
        res.status(200).json(flashCards);
    } catch (error) {
        console.error('Error getting flashcards:', error);
        res.status(500).json({ message: 'Error getting flashcards', error: error.message });
    }
})

app.delete('/flashcards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const flashCard = await FlashCard.findById(id);
        if (!flashCard) {
            return res.status(404).json({ message: 'Flash Card not found' });
        }
        await FlashCard.findByIdAndDelete(id);
        res.status(200).json({ message: 'Flash Card deleted successfully' });
    } catch (error) {
        console.error('Error deleting flash card:', error);
        res.status(500).json({ message: 'Error deleting flash card', error: error.message });
    }
}) 

app.listen(process.env.PORT, () => {
    console.log('Server has started on port', process.env.PORT);
});
