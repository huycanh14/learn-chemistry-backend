var mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const TypeOfLessons = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.ObjectId, 
        auto: true 
    },
    title :{
        type: String,
        required: true
    },
    content: {
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
        },
        lesson_id: {
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

TypeOfLessons.pre('findOneAndDelete', async function (next) {
    try{
        let { RELATIONSHIPS_IN_TYPE_OF_LESSON } =  require("../helpers/list_model");
        let id = this._conditions._id;
        const deleteRelationships = RELATIONSHIPS_IN_TYPE_OF_LESSON.map(item => {
            return new Promise((resolve, reject) => item.findOneAndRemove({'relationships.example_id': id}).deleteMany().exec((err, response) => {
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

module.exports = mongoose.model('type_of_lessons', TypeOfLessons, 'type_of_lessons');