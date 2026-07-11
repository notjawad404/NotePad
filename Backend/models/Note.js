const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    // Rendered rich-text HTML for display.
    description: { type: String, required: true },
    // Structured rich-text document (ProseMirror/TipTap JSON). Canonical
    // "document" representation; null for legacy plain-text notes.
    descriptionDoc: { type: mongoose.Schema.Types.Mixed, default: null },
    color: { type: String, required: true },
    bgColor: { type: String, required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Notes', NotesSchema);