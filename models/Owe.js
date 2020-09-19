const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const OweSchema = new Schema({
    favor: {
        type: String,
        required: true
    },
    debtor: {
        type: String,
        required: true
    },
    creditor: {
        type: String,
        required: true
    },
    proof: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Owe = mongoose.model('owe', OweSchema);