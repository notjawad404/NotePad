const express = require('express');
const { createNote, getNotes, getNoteById, updateNote, deleteNote, updateNoteGroup } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.patch('/:id/group', updateNoteGroup);
router.delete('/:id', deleteNote);

module.exports = router;
