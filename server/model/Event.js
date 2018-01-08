const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    start: {type: Number, required: true},
    duration: {type: Number, required: true},
    title: {type: String, required: true},
    userId: {type: String, required: true},
});

module.exports = mongoose.model('Event' , eventSchema);
