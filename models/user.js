const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: String,
    password: {
        type: String,
        required: true,
    },
    age: Number,
})

module.exports = model('User', userSchema);