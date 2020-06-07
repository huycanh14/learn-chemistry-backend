var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Lessons = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.ObjectId, 
        auto: true 
    },
    lesson_number: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    relationships: {
        grade_id: {
            type: String,
            required: true
        },
        chapter_id: {
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

module.exports = mongoose.model('lessons', Lessons, 'lessons');