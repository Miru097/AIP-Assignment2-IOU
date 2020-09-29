const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const RequestSchema = new Schema({
    creditor: {
        type: String,
        //required: true
    },
    favor: {
        type: Array,
        required: true
    },
    debtor: {
        type: Array,
        required: true
    },
    proof: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Request = mongoose.model('request', RequestSchema);