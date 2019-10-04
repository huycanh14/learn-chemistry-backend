let mongoose = require("mongoose");
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
        type: Number,
        required: true,
        default: 1
    }
})

module.exports = mongoose.model("chapters", chapter, "chapters")