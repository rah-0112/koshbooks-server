const Book = require('../models/Book');

const getAll = (req, res, next) => {
    Book.find()
        .then((books) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.status(200).send(books);
        },
            (err) => next(err))
        .catch((err) => next(err));
}

const getBook = (req, res, next) => {
    Book.findById(req.params.id)
        .then((book) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(book);
        },
            (err) => next(err))
        .catch((err) => next(err));
}

const addBook = (req, res, next) => {
    Book.create(req.body)
        .then((dish) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish);
        },
            (err) => next(err))
        .catch((err) => next(err));
}

const updateBook = (req, res, next) => {
    Book.findByIdAndUpdate(req.params.id, req.body)
        .then(() => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ messsage: "Updated" });
        },
            (err) => next(err))
        .catch((err) => next(err));
}

const deleteBook = (req, res, next) => {
    Book.findByIdAndDelete(req.params.id)
        .then(() => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ message: "Deleted" });
        },
            (err) => next(err))
        .catch((err) => next(err));
}

module.exports = {
    addBook,
    getAll,
    updateBook,
    deleteBook,
    getBook
}