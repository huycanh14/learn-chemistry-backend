var Lesson = require('../models/lesson.model');

const { RELATIONSHIPS_IN_LESSON } =  require('../helpers/list_model');

var getCountInRelationships = async(req, res) => {
    /**
     * get count item in relationships: answer, document, explain, grade, lesson, question, theory, type_of_lesson
     * return count
     */  

    try {
        var id = req.query.lesson_id;
        var data = [];
        const listRelationships = RELATIONSHIPS_IN_LESSON.map(item => {
            return new Promise((resolve, reject) => item.countDocuments({'relationships.lesson_id': id}, (err, response) => {
                if(err) reject(err);
                else resolve(`${item.modelName} : ${response}`);
            }));
        });
        await Promise.all(listRelationships)
            .then(result =>{
                data = result;
            })
            .catch(error => {
                return status(400).json({message: new Error(error)})
            });
        return res.status(200).json({data: data});
    } catch(err){
        return res.status(400).json({ message: 'Bad request!', error: err.message });
    }
};

const createLesson = async(req, res)  => {
    /**
     *  Step 1: get information of new lesson from the client via the body
     *  Step 2: create a new lesson
     *  >>> if create success => return status(200) and data request
     *  >>> else return status (400) , message: 'Bad request' and error
     *  
    */ 
    try {
        let lesson = new Lesson({
            lesson_number: req.body.lesson_number,
            title: req.body.title,
            description: req.body.description,
            relationships: {
                grade_id: req.body.grade_id,
                chapter_id: req.body.chapter_id
            },
            created_at: req.body.created_at,
            updated_at: req.body.updated_at,
            activated: req.body.activated
        });
        lesson.save((err, response) => {
            if(err) return res.status(400).json({message: err});
            else {
                response = JSON.parse(JSON.stringify(response));
                return res.status(200).json({'data': response});
            }
        });

    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};

const selectLessons = async(req, res)  => {
    /**
     * if req.query.page
     * >>> const limit = 10, offset = 0 => offset = (req.query.page - 1) * 10
     * >>> get key_word = req.query.key_work => select title, description by key_work
     * >>> get activated
     * >> get chapter_id by req.query.chapter_id
     * >>> find 
     * else if req.query.get_count == 1
     * >>> if req.query.chapter_id => get total count by chapter id
     * >>> else => get total count
     * else if req.query.relationships == 1 and req.query.lesson_id => get count in relationships
     * else return status(400) and message: 'Not query!'
     */
    try {
        let query = [];
        let key_word = "";

        offset = (req.query.page - 1) * 10;

        if (req.query.key_word) key_word = req.query.key_word;
        query = [
            {
                $or: [
                    {'': {$regex: key_word, $options: 'is'}},
                    {'description': {$regex: key_word, $options: 'is'}},
                ]
            }
        ];title
        if (req.query.activated) query.push({'activated': req.query.activated});
        if (req.query.chapter_id) query.push({'relationships.chapter_id': req.query.chapter_id});

        if(req.query.page) {

            let limit = 10;
            let offset = 10;
        
            let sort = {
                created_at: 1
            };
            if(req.query.sort_created_at === 'asc') sort = {created_at: 1};
            else if(req.query.sort_created_at === 'desc') sort = {created_at: -1};
            else if(req.query.sort_title === 'asc') sort = {title: 1};
            else if(req.query.sort_title === 'desc') sort = {title: -1};
            else if(req.query.sort_description === 'asc') sort = {description: 1};
            else if(req.query.sort_description === 'desc') sort = {description: -1};

            await Lesson.find({
                $and: query
            }, null, {limit: limit, skip: offset, sort: sort}, (err, response) => {
                if (err) res.status(400).json({'message': err});
                else res.status(200).json({'data': response});
            });

        } else if(req.query.get_count == 1 ){
            await Lesson.countDocuments({$and: query}, (err, response) => {
                if (err) {
                    return res.status(400).json({'message': err});
                } else {
                    return res.status(200).json({'count': response});
                }
            });

        } else if (req.query.relationships == 1 && req.query.lesson_id) {
            getCountInRelationships(req, res);

        } else return req.status(400).json({'message': 'Not query!'});
    } catch (err) {
        return res.status(400).json({message: 'Bad request!', error: err.message});
    }
};

const getLesson = async(req, res) => {
    /**
     * Step 1: get id lesson from params
     * Step 2: get lesson by id
    */ 
    try {
        await Lesson.findById(req.params.id).exec((err, response) => {
            if(err) return res.status(400).json({'message': err});
            else return res.status(200).json({'data': response});
        });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};

const updateLesson = async(req, res) => {
    /**
     *  Step 1: get id lesson from params
     *  Step 2: findByIdAndUpdate set lesson = req.body
    */ 
    try {
        req.body.updated_at = req.body.updated_at ? req.body.updated_at : new Date();
        await Lesson.findByIdAndUpdate(req.params.id, {$set: req.body},{new: true})
            .exec( (err, response) => {
                if(err) return res.status(400).json({message: err});
                else return res.status(200).json({data: response});
            });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};

const deleteLesson = async(req, res) => {
    /**
     * Step 1: get id lesson from params
     * Step 2: findByIdAndDelete set lesson = req.body
     */ 
    try {
        await Lesson.findByIdAndDelete(req.params.id).exec( (err) => {
            if(err) return res.status(400).json({message: err.message});
            else {
                return res.status(200).json({message: 'Delete successful!'});
            }
        });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};

const LessonController = {
    createLesson, selectLessons, getLesson, updateLesson, deleteLesson
};

module.exports = LessonController;