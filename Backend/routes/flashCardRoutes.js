const express = require('express');
const { body, param } = require('express-validator');
const { createFlashCard, getFlashCards, deleteFlashCard } = require('../controllers/flashCardController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(protect);

const flashCardValidation = [
    body('question').trim().notEmpty().withMessage('Question is required').isLength({ max: 1000 }).withMessage('Question is too long'),
    body('answer').trim().notEmpty().withMessage('Answer is required').isLength({ max: 2000 }).withMessage('Answer is too long'),
    body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid date'),
    body('color').trim().notEmpty().withMessage('Color is required'),
    body('bgColor').trim().notEmpty().withMessage('Background color is required'),
];

const idValidation = [param('id').isMongoId().withMessage('Invalid flashcard id')];

router.post('/', flashCardValidation, validate, createFlashCard);
router.get('/', getFlashCards);
router.delete('/:id', idValidation, validate, deleteFlashCard);

module.exports = router;
