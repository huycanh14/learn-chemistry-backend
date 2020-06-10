const Grade = require('../models/grade.model');
const Chapter = require('../models/chapter.model');
const Lesson = require('../models/lesson.model');
const Theory = require('../models/theory.model');
const TypeOfLesson = require('../models/type_of_lesson.model');
const Question = require('../models/question.model');
const Answer = require('../models/answer.model');
const Explain = require('../models/explain.model');
const Document = require('../models/document.model');

const RELATIONSHIPS_IN_GRADE = [
    Chapter, Lesson, Theory, TypeOfLesson, Question, Answer, Explain, Document
];

const RELATIONSHIPS_IN_CHAPTER = [
    Lesson, Theory, TypeOfLesson, Question, Answer, Explain, Document
];

module.exports =  { RELATIONSHIPS_IN_GRADE: RELATIONSHIPS_IN_GRADE } 
module.exports =  { RELATIONSHIPS_IN_CHAPTER: RELATIONSHIPS_IN_CHAPTER }