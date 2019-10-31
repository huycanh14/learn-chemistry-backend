var mongoose = require("mongoose")
mongoose.set('useCreateIndex', true);

const theory = new mongoose.Schema({
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
})

module.exports = mongoose.model("theories", theory, "theories");
