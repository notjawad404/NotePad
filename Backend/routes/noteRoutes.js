const express = require('express');
const { createNote, getNotes, getNoteById, updateNote, deleteNote } = require('../controllers/noteController');

const router = express.Router();

router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
