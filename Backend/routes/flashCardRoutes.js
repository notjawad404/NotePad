const express = require('express');
const { createFlashCard, getFlashCards, deleteFlashCard } = require('../controllers/flashCardController');

const router = express.Router();

router.post('/', createFlashCard);
router.get('/', getFlashCards);
router.delete('/:id', deleteFlashCard);

module.exports = router;
