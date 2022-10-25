const express = require('express')
const router = express.Router();
const { addWishes, getAll, addWish, deleteWish, deleteAll } = require('../controllers/wishController');
const { authCheck } = require('../middleware/checkAuth')

router
    .route('/')
    .get(authCheck, getAll)
    .post(authCheck, addWishes)
    .delete(authCheck, deleteAll)

router
    .route('/:id')
    .post(authCheck, addWish)
    .delete(authCheck, deleteWish)

module.exports = router;