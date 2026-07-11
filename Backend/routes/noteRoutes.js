const express = require('express');
const { body, param, query } = require('express-validator');
const { createNote, getNotes, getNoteById, updateNote, deleteNote, updateNoteGroup } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(protect);

const noteValidation = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 200 }).withMessage('Name is too long'),
    body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 100000 }).withMessage('Description is too long'),
    body('type').trim().notEmpty().withMessage('Type is required').isLength({ max: 50 }).withMessage('Type is too long'),
    body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid date'),
    body('color').trim().notEmpty().withMessage('Color is required'),
    body('bgColor').trim().notEmpty().withMessage('Background color is required'),
];

const groupIdBodyValidation = [
    body('groupId').optional({ values: 'falsy' }).isMongoId().withMessage('Invalid group id'),
];

const listNotesValidation = [
    query('groupId').optional({ values: 'falsy' }).isMongoId().withMessage('Invalid group id'),
    query('unassigned').optional().isBoolean().withMessage('unassigned must be a boolean').toBoolean(),
];

const idValidation = [param('id').isMongoId().withMessage('Invalid note id')];

router.post('/', noteValidation, groupIdBodyValidation, validate, createNote);
router.get('/', listNotesValidation, validate, getNotes);
router.get('/:id', idValidation, validate, getNoteById);
router.put('/:id', idValidation, noteValidation, validate, updateNote);
router.patch('/:id/group', idValidation, groupIdBodyValidation, validate, updateNoteGroup);
router.delete('/:id', idValidation, validate, deleteNote);

module.exports = router;
