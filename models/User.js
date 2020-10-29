const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//https://blog.csdn.net/zccz14/article/details/51298545 mongoDB data schema
//Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    register_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('user', UserSchema);