var TypeOfLesson = require('../models/type_of_lesson.model');

const { RELATIONSHIPS_IN_TYPE_OF_LESSON } =  require('../helpers/list_model');

var getCountInRelationships = async(req, res) => {
    /**
     * get count item in relationships: answer, explain, question
     * return count
     */  

    try {
        var id = req.body.type_of_lesson_id;
        var data = [];
        const listRelationships = RELATIONSHIPS_IN_TYPE_OF_LESSON.map(item => {
            return new Promise((resolve, reject) => item.countDocuments({'relationships.example_id': id}, (err, response) => {
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

const createTypeOfLesson = async(req, res)  => {
    /**
     *  Step 1: get information of new type_of_lesson from the client via the body
     *  Step 2: create a new type_of_lesson
     *  >>> if create success => return status(200) and data request
     *  >>> else return status (400) , message: 'Bad request' and error
     *  
    */
    try {
        let type_of_lesson = new TypeOfLesson({
            title: req.body.title,
            content: req.body.content,
            relationships: {
                grade_id: req.body.grade_id,
                chapter_id: req.body.chapter_id,
                lesson_id: req.body.lesson_id
            },
            created_at: req.body.created_at,
            updated_at: req.body.updated_at,
            activated: req.body.activated
        });
        type_of_lesson.save((err, response) => {
            if(err) return res.status(400).json({message: err});
            else {
                response = JSON.parse(JSON.stringify(response));
                return res.status(200).json({'data': response});
            }
        });

    } catch (err) {
        return res.status(400).json({message: 'Bad request!', error: err.message});
    }
};

const selectTypeOfLessons = async(req, res) => {
    /**
     * if req.query.page
     * >>> const limit = 10, offset = 0 => offset = (req.query.page - 1) * 10
     * >>> get key_word = req.body.key_work => select title, content by key_work
     * >>> get activated
     * >> get lesson_id by req.body.lesson_id
     * >>> find 
     * else if req.query.get_count == 1
     * >>> if req.body.lesson_id => get total type_of_lesson by lesson id
     * >>> else => get total type_of_lesson
     * else if req.query.relationships == 1 and req.body.type_of_lesson_id => get count in relationships
     * else return status(400) and message: 'Not query!'
    */
    try {
        let limit = 10;
        let offset = 10;
        let query = [];
        if(req.query.page){
            offset = (req.query.page - 1) * 10;
            let key_word = "";
            if (req.body.key_word) key_word = req.body.key_word;
            query = [
                {
                    $or: [
                        {'title': {$regex: key_word, $options: 'is'}},
                        {'content': {$regex: key_word, $options: 'is'}},
                    ]
                }
            ];
            if (req.body.activated) query.push({'activated': req.body.activated});
            if (req.body.lesson_id) query.push({'relationships.lesson_id': req.body.lesson_id})
            await TypeOfLesson.find({
                $and: query
            }, null, {limit: limit, skip: offset}, (err, response) => {
                if (err) res.status(400).json({'message': err});
                else res.status(200).json({'data': response});
            });
        } else if (req.query.get_count == 1) {
            if(req.body.lesson_id){
                await TypeOfLesson.countDocuments({'relationships.lesson_id': req.body.lesson_id}, (err, response) => {
                    if (err) {
                        return res.status(400).json({'message': err});
                    } else {
                        return res.status(200).json({'count': response});
                    }
                });
            } else {
                await TypeOfLesson.countDocuments({}, (err, response) => {
                    if (err) {
                        return res.status(400).json({'message': err});
                    } else {
                        return res.status(200).json({'count': response});
                    }
                });
            }
        } else if (req.query.relationships == 1 && req.body.type_of_lesson_id){
            getCountInRelationships(req, res);
        } else return req.status(400).json({'message': 'Not query!'});
    } catch(err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message})
    }
};

const getTypeOfLesson = async(req, res) => {
    /**
     *  Step 1: get id type_of_lesson from params
     *  Step 2: get type_of_lesson by id
     */
    try {
        await TypeOfLesson.findById(req.params.id).exec((err, response) => {
            if(err) return res.status(400).json({'message': err});
            else return res.status(200).json({'data': response});
        });
    } catch(err){
        return res.status(400).json({message: 'Bad request!', error: err.message});
    }
};

const updateTypeOfLesson = async(req, res) => {
    /**
     * Step 1: get id type_of_lesson from params
     * Step 2: findByIdAndUpdate set type_of_lesson = req.body
     */ 
    try {
        req.body.updated_at = req.body.updated_at ? req.body.updated_at : new Date();
        await TypeOfLesson.findByIdAndUpdate(req.params.id, {$set: req.body},{new: true})
            .exec( (err, response) => {
                if(err) return res.status(400).json({message: err});
                else return res.status(200).json({data: response});
            });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};

const deleteTypeOfLesson = async(req, res) => {
    /**
     * Step 1: get id type_of_lesson from params
     * Step 2: findByIdAndDelete set type_of_lesson = req.body
    */
    try {
        await TypeOfLesson.findByIdAndDelete(req.params.id).exec( (err) => {
            if(err) return res.status(400).json({message: err.message});
            else {
                return res.status(200).json({message: 'Delete successful!'});
            }
        });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};

const TypeOfLessonController = {
    createTypeOfLesson, selectTypeOfLessons, getTypeOfLesson, updateTypeOfLesson, deleteTypeOfLesson
};

module.exports = TypeOfLessonController;