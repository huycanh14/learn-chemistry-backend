var mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const example_exercise = new mongoose.Schema({
    ex_exercise_number: {
        type: Number,
        required: true
    },
    type_of_lesson_id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required: true
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

module.exports = mongoose.model("example_exercise", example_exercise, "example_exercise");
