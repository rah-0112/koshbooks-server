const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
    mail: {
        type: String,
        unique: true,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const feedbackModel = mongoose.model('Feedback', feedbackSchema);
module.exports = feedbackModel;