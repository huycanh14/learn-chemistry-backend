var mongoose = require("mongoose")
mongoose.set('useCreateIndex', true);

const grade_level =  new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    created_at: {
        type: Number,
        required: true
    },
    updated_at: {
        type: Number,
        required: true
    },
    activated: {
        type: Boolean,
        required: true,
        default: true
    }
})

module.exports = mongoose.model("grade_level", grade_level, "grade_level");
