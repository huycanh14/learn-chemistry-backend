var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Documents = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.ObjectId, 
        auto: true 
    },
    title: {
        type: String,
        required: true
    },
    link: {
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
    }
});

module.exports = mongoose.model('documents', Documents, 'documents');