const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    place: {
        type: String, 
        required: true,
        trim: true
    }, 
    zilla: {
        type: String,
        required: true,
        trim: true
    },
    upozilla: {type: String, require: true, trim: true}
});

module.exports = mongoose.model('location', locationSchema); 