var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

var Chapter = require('./chapter.model');
var Lesson = require('./lesson.model');
var Theory = require('./theory.model');
var TypeOfLesson = require('./type_of_lesson.model');
var Question = require('./question.model');
var Answer = require('./answer.model');
var Explain = require('./explain.model');
var Document = require('./document.model');

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
        const deleteRelationships = [
            new Promise((resolve, reject) => Chapter.findOneAndRemove({'relationships.grade_id': id}).deleteMany().exec((err, response) => {
                if(err) reject(err);
                else resolve(response);
            })),
            new Promise((resolve, reject) => Lesson.findOneAndRemove({'relationships.grade_id': id}).deleteMany().exec((err, response) => {
                if(err) reject(err);
                else resolve(response);
            })),
            new Promise((resolve, reject) => Theory.findOneAndRemove({'relationships.grade_id': id}).deleteMany().exec((err, response) => {
                if(err) reject(err);
                else resolve(response);
            })),
            new Promise((resolve, reject) => TypeOfLesson.findOneAndRemove({'relationships.grade_id': id}).deleteMany().exec((err, response) => {
                if(err) reject(err);
                else resolve(response);
            })),
            new Promise((resolve, reject) => Question.findOneAndRemove({'relationships.grade_id': id}).deleteMany().exec((err, response) => {
                if(err) reject(err);
                else resolve(response);
            })),
            new Promise((resolve, reject) => Answer.findOneAndRemove({'relationships.grade_id': id}).deleteMany().exec((err, response) => {
                if(err) reject(err);
                else resolve(response);
            })),
            new Promise((resolve, reject) => Explain.findOneAndRemove({'relationships.grade_id': id}).deleteMany().exec((err, response) => {
                if(err) reject(err);
                else resolve(response);
            })),
            new Promise((resolve, reject) => Document.findOneAndRemove({'relationships.grade_id': id}).deleteMany().exec((err, response) => {
                if(err) reject(err);
                else resolve(response);
            })),
        ];
        await Promise.all(deleteRelationships)
            .then((result) => next())
            .catch(error => {
                return next(new Error(`Error in promises ${error}`));
            });
        console.log( 2);

    } catch (err) {
        next(err);
    }
    
});

module.exports = mongoose.model('grades', Grades, 'grades');
