var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

var { RELATIONSHIPS_IN_GRADE } =  require('../helpers/list_model');

var Grades = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.ObjectId, 
        auto: true 
    },
    name: {
        type: String,
        required: true,
        unique: true
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
    activated:{
        type: Boolean,
        required: true,
        default: true
    }
});

Grades.pre('findOneAndDelete', async function (next) {
    try{
        var id = this._conditions._id;
        const deleteRelationships = RELATIONSHIPS_IN_GRADE.map(item => {
            return new Promise((resolve, reject) => item.findOneAndRemove({'relationships.grade_id': id}).deleteMany().exec((err, response) => {
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

module.exports = mongoose.model('grades', Grades, 'grades');
