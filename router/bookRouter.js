const express = require('express')
const router = express.Router();
const { addBook, getAll, updateBook, deleteBook, getBook } = require('../controllers/bookController');
const { adminCheck, authCheck } = require('../middleware/checkAuth')

router
    .route('/')
    .get(getAll)
    .post(authCheck, adminCheck, addBook)

router
    .route('/:id')
    .get(authCheck, getBook)
    .patch(authCheck, adminCheck, updateBook)
    .delete(authCheck, adminCheck, deleteBook)

module.exports = router;