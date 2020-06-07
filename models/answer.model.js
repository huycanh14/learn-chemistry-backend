var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Answers = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.ObjectId, 
        auto: true 
    },
    content: {
        type: String,
        required: true
    },
    is_right: {
        type: String,
        required: true,
        default: false
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
            required: false,
        },
        question_id: { 
            type: String,
            required: true
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

module.exports = mongoose.model('answers', Answers, 'answers');
