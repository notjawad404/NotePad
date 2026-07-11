const Group = require('../models/Group');
const Note = require('../models/Note');

exports.createGroup = async (req, res) => {
    try {
        const { name } = req.body;

        const group = new Group({
            username: req.user.username,
            name,
        });

        await group.save();
        res.status(201).json(group);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Error creating group', error: error.message });
    }
};

exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.find({ username: req.user.username }).sort({ createdAt: -1 });
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error getting groups:', error);
        res.status(500).json({ message: 'Error getting groups', error: error.message });
    }
};

exports.renameGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const group = await Group.findOneAndUpdate(
            { _id: id, username: req.user.username },
            { name },
            { new: true }
        );

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json(group);
    } catch (error) {
        console.error('Error renaming group:', error);
        res.status(500).json({ message: 'Error renaming group', error: error.message });
    }
};

exports.setGroupArchived = async (req, res) => {
    try {
        const { id } = req.params;
        const { archived } = req.body;

        const group = await Group.findOneAndUpdate(
            { _id: id, username: req.user.username },
            { archived },
            { new: true }
        );

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json(group);
    } catch (error) {
        console.error('Error archiving group:', error);
        res.status(500).json({ message: 'Error archiving group', error: error.message });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;

        const group = await Group.findOneAndDelete({ _id: id, username: req.user.username });
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Notes in a deleted group are unassigned rather than deleted.
        await Note.updateMany(
            { groupId: id, username: req.user.username },
            { groupId: null }
        );

        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: 'Error deleting group', error: error.message });
    }
};
