const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const URL = 'mongodb+srv://jawad404:Jawad818@myhub.7k4rzfk.mongodb.net/?retryWrites=true&w=majority&appName=myhub';

mongoose.connect(URL, {
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
    name: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    color: { type: String, required: true },
    bgColor: { type: String, required: true },
});

const Note = mongoose.model('Note', NotesSchema);

app.post('/notes', async (req, res) => {
    try {
        const { name, description, type, date, color, bgColor } = req.body;
        console.log("Request Body: ", req.body); // Log request body for debugging

        // Validate that all required fields are present
        if (!name || !description || !type || !date || !color || !bgColor) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new note object
        const note = new Note({
            name,
            description,
            type,
            date: new Date(date), // Ensure date is a valid Date object
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
        const { name, description, type, date, color, bgColor } = req.body;
        const note = await Note.findByIdAndUpdate(
            id,
            { name, description, type, date: new Date(date), color, bgColor },
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

app.listen(5000, () => {
    console.log('Server has started on port 5000!');
});
