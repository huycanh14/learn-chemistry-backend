var mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const TypeOfLessons = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.ObjectId, 
        auto: true 
    },
    title :{
        type: String,
        required: true
    },
    content: {
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
        },
        lesson_id: {
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

module.exports = mongoose.model('type_of_lessons', TypeOfLessons, 'type_of_lessons');