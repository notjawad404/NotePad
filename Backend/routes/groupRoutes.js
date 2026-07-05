const express = require('express');
const {
    createGroup,
    getGroups,
    renameGroup,
    setGroupArchived,
    deleteGroup,
} = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createGroup);
router.get('/', getGroups);
router.put('/:id', renameGroup);
router.patch('/:id/archive', setGroupArchived);
router.delete('/:id', deleteGroup);

module.exports = router;
