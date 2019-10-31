var mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const type_of_lesson = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    theorie_number: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    lesson_id: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required: true,
    },
    updated_at: {
        type: String,
        required: true
    },
    activated: {
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = mongoose.model("type_of_lessons", type_of_lesson, "type_of_lessons");
