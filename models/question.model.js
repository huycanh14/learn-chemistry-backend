var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Questions = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.ObjectId, 
        auto: true 
    },
    content: {
        type: String,
        required: true
    },
    is_chapter: {
        type: Boolean,
        required: true,
        default: false
    },
    is_assignment: {
        type: Boolean,
        required: true,
        default: false
    },
    is_example: {
        type: Boolean,
        required: true,
        default: true
    },
    relationships: {
        grade_id: {
            type: String,
            required: true
        },
        chapter_id: {
            type: String,
            required: true
        },
        lesson_id: {
            type: String,
            required: false
        },
        example_id: {
            type: String,
            required: false
        }
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
    activated: {
        type: Boolean,
        default: true
        // true => active, false => nonactive
    }
});

module.exports = mongoose.model('questions', Questions, 'questions');
