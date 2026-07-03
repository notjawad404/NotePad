const express = require('express');
const { createFlashCard, getFlashCards, deleteFlashCard } = require('../controllers/flashCardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createFlashCard);
router.get('/', getFlashCards);
router.delete('/:id', deleteFlashCard);

module.exports = router;
