const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
        default: 0,
    },
    offer: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    image: {
        type: String,
        required: true,
        unique: true,
    },
    f_price: {
        type: Number,
        min: 0,
        required: true,
        default: 0,
    },
    new_old: {
        type: String,
        enum: [ 'NEW', 'OLD' ],
        required: true,
        default: 'OLD',
    }
}, {
    timestamps: true,
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;