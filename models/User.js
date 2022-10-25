const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        default: 'Not specified'
    },
    birthdate: {
        type: String,
        required: true,
        default: 'Not specified'
    },
    mail: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'USER',
        enum: [ 'USER', 'ADMIN' ],
    },
}, {
    timestamps: true,
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (plaintext, callback) {
    return callback(null, bcrypt.compareSync(plaintext, this.password));
};

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;