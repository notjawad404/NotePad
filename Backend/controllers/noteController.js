const Note = require('../models/Note');
const Group = require('../models/Group');

exports.createNote = async (req, res) => {
    try{
        const { name, description, type, date, color, bgColor, groupId } = req.body;

        if (groupId) {
            const group = await Group.findOne({ _id: groupId, username: req.user.username });
            if (!group) {
                return res.status(400).json({ message: 'Invalid group' });
            }
        }

        const note = new Note({
            username: req.user.username,
            name,
            description,
            type,
            date: new Date(date),
            color,
            bgColor,
            groupId: groupId || null,
        });

        await note.save();
        res.status(201).json(note);
    }
    catch(error){
        console.error('Error saving note:', error);
        res.status(500).json({ message: 'Error saving note', error: error.message });
    }
};

exports.getNotes = async (req, res) => {
    try{
        const { groupId, unassigned } = req.query;

        const filter = { username: req.user.username };
        if (unassigned === true || unassigned === 'true') {
            filter.groupId = null;
        } else if (groupId) {
            filter.groupId = groupId;
        }

        const notes = await Note.find(filter);
        res.status(200).json(notes);
    }
    catch(error){
        console.error('Error getting notes:', error);
        res.status(500).json({ message: 'Error getting notes', error: error.message });
    }
};

exports.getNoteById = async (req, res) => {
    try{
        const {id} = req.params;
        const note = await Note.findOne({ _id: id, username: req.user.username });
        if(!note) {
            return res.status(404).json({message: 'Note not found'});
        }
        res.status(200).json(note);
    }
    catch(error){
        console.error('Error getting note:', error);
        res.status(500).json({ message: 'Error getting note', error: error.message });
    }
}

exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, type, date, color, bgColor } = req.body;

        const note = await Note.findOneAndUpdate(
            { _id: id, username: req.user.username },
            { name, description, type, date: new Date(date), color, bgColor },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(note);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: 'Error updating note', error: error.message });
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
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Error deleting note', error: error.message });
    }
};

exports.updateNoteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { groupId } = req.body;

        if (groupId) {
            const group = await Group.findOne({ _id: groupId, username: req.user.username });
            if (!group) {
                return res.status(400).json({ message: 'Invalid group' });
            }
        }

        const note = await Note.findOneAndUpdate(
            { _id: id, username: req.user.username },
            { groupId: groupId || null },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(note);
    } catch (error) {
        console.error('Error updating note group:', error);
        res.status(500).json({ message: 'Error updating note group', error: error.message });
    }
};
