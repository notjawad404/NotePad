const express = require('express');
const { body, param } = require('express-validator');
const { createNote, getNotes, getNoteById, updateNote, deleteNote, updateNoteGroup } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(protect);

const noteValidation = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 200 }).withMessage('Name is too long'),
    body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 5000 }).withMessage('Description is too long'),
    body('type').trim().notEmpty().withMessage('Type is required').isLength({ max: 50 }).withMessage('Type is too long'),
    body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid date'),
    body('color').trim().notEmpty().withMessage('Color is required'),
    body('bgColor').trim().notEmpty().withMessage('Background color is required'),
];

const idValidation = [param('id').isMongoId().withMessage('Invalid note id')];

router.post('/', noteValidation, validate, createNote);
router.get('/', getNotes);
router.get('/:id', idValidation, validate, getNoteById);
router.put('/:id', idValidation, noteValidation, validate, updateNote);
router.patch('/:id/group', idValidation, validate, updateNoteGroup);
router.delete('/:id', idValidation, validate, deleteNote);

module.exports = router;
