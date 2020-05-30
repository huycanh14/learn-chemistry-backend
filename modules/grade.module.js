var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Grades = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    created_at: {
        type: Number,
        required: true,
        default: Date.now()
    },
    updated_at: {
        type: Number,
        required: true,
        default: Date.now()
    },
    activated:{
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = mongoose.model('grades', Grades, 'grades');
