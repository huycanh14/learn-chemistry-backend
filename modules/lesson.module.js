let mongoose = require("mongoose");
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
        type: Number,
        required: true,
        default: 1
    }
})

modul.exports = mongoose.model("lessons", lesson, "lessons");