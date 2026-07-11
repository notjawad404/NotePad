const express = require('express');
const { body, param } = require('express-validator');
const {
    createGroup,
    getGroups,
    renameGroup,
    setGroupArchived,
    deleteGroup,
} = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(protect);

const groupNameValidation = [
    body('name').trim().notEmpty().withMessage('Group name is required').isLength({ max: 100 }).withMessage('Group name is too long'),
];

const archiveValidation = [
    body('archived').isBoolean().withMessage('archived must be a boolean').toBoolean(),
];

const idValidation = [param('id').isMongoId().withMessage('Invalid group id')];

router.post('/', groupNameValidation, validate, createGroup);
router.get('/', getGroups);
router.put('/:id', idValidation, groupNameValidation, validate, renameGroup);
router.patch('/:id/archive', idValidation, archiveValidation, validate, setGroupArchived);
router.delete('/:id', idValidation, validate, deleteGroup);

module.exports = router;
