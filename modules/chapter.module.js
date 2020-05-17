var mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const chapter = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    chapter_number: {
        type: String,
        required: true
    },
    description:{
        type: String
    },
    grade_level_id:{
        type: String,
        required: true
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

module.exports = mongoose.model("chapter", chapter, "chapter")