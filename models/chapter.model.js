var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

var { RELATIONSHIPS_IN_CHAPTER } = require('../helpers/list_model');

const Chapters = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.ObjectId, 
        auto: true 
    },
    chapter_number: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    relationships: {
        grade_id: {
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

Chapters.pre('findOneAndDelete', async function (next) {
    try{
        var id = this._conditions._id;
        const deleteRelationships = RELATIONSHIPS_IN_CHAPTER.map(item => {
            return new Promise((resolve, reject) => item.findOneAndRemove({'relationships.chapter_id': id}).deleteMany().exec((err, response) => {
                if(err) reject(err);
                else resolve(response);
            }));
        });
        
        await Promise.all(deleteRelationships)
            .then((result) => next())
            .catch(error => {
                return next(new Error(`Error in promises ${error}`));
            });

    } catch (err) {
        next(err);
    }
    
});

module.exports = mongoose.model('chapters', Chapters, 'chapters');