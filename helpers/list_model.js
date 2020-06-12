
var Chapter = require('../models/chapter.model');
var Lesson = require('../models/lesson.model');
var Theory = require('../models/theory.model');
var TypeOfLesson = require('../models/type_of_lesson.model');
var Question = require('../models/question.model');
var Answer = require('../models/answer.model');
var Explain = require('../models/explain.model');
var Document = require('../models/document.model');

const RELATIONSHIPS_IN_GRADE = [
    Chapter, Lesson, Theory, TypeOfLesson, Question, Answer, Explain, Document
];

const RELATIONSHIPS_IN_CHAPTER = [
    Lesson, Theory, TypeOfLesson, Question, Answer, Explain, Document
];

const RELATIONSHIPS_IN_LESSON = [
    Theory, TypeOfLesson, Question, Answer, Explain
];

const RELATIONSHIPS_IN_TYPE_OF_LESSON = [
    Question, Answer, Explain
];

/**
 * exports.RELATIONSHIPS_IN_GRADE = [
    Chapter, Lesson, Theory, TypeOfLesson, Question, Answer, Explain, Document
];

exports.RELATIONSHIPS_IN_CHAPTER = [
    Lesson, Theory, TypeOfLesson, Question, Answer, Explain, Document
];

exports.RELATIONSHIPS_IN_LESSON = [
    Theory, TypeOfLesson, Question, Answer, Explain
];

exports.RELATIONSHIPS_IN_TYPE_OF_LESSON = [
    Question, Answer, Explain
];
 */
module.exports =  { 
    RELATIONSHIPS_IN_GRADE: RELATIONSHIPS_IN_GRADE,
    RELATIONSHIPS_IN_CHAPTER: RELATIONSHIPS_IN_CHAPTER,
    RELATIONSHIPS_IN_LESSON: RELATIONSHIPS_IN_LESSON,
    RELATIONSHIPS_IN_TYPE_OF_LESSON: RELATIONSHIPS_IN_TYPE_OF_LESSON,
};