const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    wishlist: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    } ]
}, {
    timestamps: true,
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;