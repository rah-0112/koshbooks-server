const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customer: {
        type: String,
        required: true,
        maxLength: 60,
    },
    address: {
        type: String,
        required: true,
        maxLength: 200,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        default: 0
    },
    method: {
        type: Number,
        required: true,
    },
},
    { timestamps: true }
);

const ordersModel = mongoose.model('Order', OrderSchema);
module.exports = ordersModel;