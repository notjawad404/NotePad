const Note = require('../models/Note');

exports.createNote = async (req, res) => {
    try{
        const { name, description, type, date, color, bgColor } = req.body;

        if(!name || !description || !type || !date || !color || !bgColor){
            return res.status(400).json({ message: 'All fields are required' });
        }

        const note = new Note({
            username: req.user.username,
            name,
            description,
            type,
            date: new Date(date),
            color,
            bgColor
        });

        await note.save();
        res.status(201).json(note);
    }
    catch(error){
        console.error('Error saving note:', error);
        res.status(200).json({ message: 'Error saving note', error: error.message });
    }
};

exports.getNotes = async (req, res) => {
    try{
        const notes = await Note.find({ username: req.user.username });
        res.status(200).json(notes);
    }
    catch(error){
        console.error('Error getting notes:', error);
        res.status(200).json({ message: 'Error getting notes', error: error.message });
    }
};

exports.getNoteById = async (req, res) => {
    try{
        const {id} = req.params;
        const note = await Note.findOne({ _id: id, username: req.user.username });
        if(!note) {
            return res.status(200).json({message: 'Note not found'});
        }
        res.status(200).json(note);
    }
    catch(error){
        res.status(200).json({ message: 'Error getting note', error: error.message });
    }
}

exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, type, date, color, bgColor } = req.body;

        const note = await Note.findOneAndUpdate(
            { _id: id, username: req.user.username },
            { name, description, type, date: new Date(date), color, bgColor },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(200).json({ message: 'Error updating note', error: error.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const note = await Note.findOneAndDelete({ _id: id, username: req.user.username });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(200).json({ message: 'Error deleting note', error: error.message });
    }
};