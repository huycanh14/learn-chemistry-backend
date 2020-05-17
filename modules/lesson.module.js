var mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const lesson = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lesson_number: {
        type: Number,
        required: true
    },
    chapter_id:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: false
    },
    created_at:{
        type: Number,
        required: true
    },
    updated_at:{
        type: Number,
        required: true
    },
    activated:{
        type: Boolean,
        required: true,
        default: true
    }
})

module.exports = mongoose.model("lesson", lesson, "lesson");