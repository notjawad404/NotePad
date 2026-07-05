const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        archived: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Group', GroupSchema);
