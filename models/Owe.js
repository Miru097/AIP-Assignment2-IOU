const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const OweSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Owe = mongoose.model('owe', OweSchema);