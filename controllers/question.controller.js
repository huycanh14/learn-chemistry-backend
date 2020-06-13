var Question = require('../models/question.model');
const { RELATIONSHIPS_IN_QUESTION } =  require('../helpers/list_model');

var getCountInRelationships = async(req, res) => {
    /**
     * get count item in relationships: answer, explain
     * return count
     */  

    try {
        var id = req.body.chapter_id;
        var data = [];
        const listRelationships = RELATIONSHIPS_IN_QUESTION.map(item => {
            return new Promise((resolve, reject) => item.countDocuments({'relationships.question_id': id}, (err, response) => {
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

const createQuestion = async(req, res) => {
    /**
     * Step 1: get information of new question from the client via the body
     * >>> Check is_chapter true => is_assignment and is_example false
     * >>> Check is_assignment true => is_chapter and is_example false
     * >>> Check is_example true => is_assignment and is_chapter false
     * Step 2: create new question
     * >>> if create success => return status(200) and data request
     * >>> else return status (400) , message: 'Bad request' and error
    **/
    try {
        let chapter = req.body.is_chapter;
        let assignment = req.body.is_assignment;
        let example = req.body.is_example;
        if (chapter == 'true' && assignment == 'true'){
            return res.status(400).json({message: '3 values:is_chapter, is_assignment, is_example only have one value to be a true'});
        } else if( assignment == 'true' && example == 'true'){
            return res.status(400).json({message: '3 values:is_chapter, is_assignment, is_example only have one value to be a true'});
        } else if(chapter == 'true' && example == 'true'){
            return res.status(400).json({message: '3 values:is_chapter, is_assignment, is_example only have one value to be a true'});
        } else if(chapter == 'false' && assignment == 'false' && example == 'false'){
            return res.status(400).json({message: '3 values:is_chapter, is_assignment, is_example only have one value to be a true'});
        }
        else {
            let question = new Question({
                content: req.body.content,
                is_chapter: chapter,
                is_assignment: assignment,
                is_example: example,
                relationships: {
                    grade_id: req.body.grade_id,
                    chapter_id: req.body.chapter_id,
                    lesson_id: req.body.lesson_id,
                    example_id: req.body.example_id,
                },
                created_at: req.body.created_at,
                updated_at: req.body.updated_at,
                activated: req.body.activated
            });
            question.save((err, response) => {
                if(err) return res.status(400).json({message: err});
                else {
                    response = JSON.parse(JSON.stringify(response));
                    return res.status(200).json({'data': response});
                }
            });
        }
        
    } catch (err) {
        return res.status(400).json({ message: 'Bad request', error: err.message});
    }
};

const selectQuestions = async(req, res) => {
    /**
     * if req.query.page
     * >>> const limit = 10, offset = 0 => offset = (req.query.page - 1) * 10
     * >>> get key_word = req.body.key_work => select content by key_work
     * >>> get activated
     * >>> get chapter_id by req.body.chapter_id
     * >>> get lesson_id by req.body.lesson_id
     * >>> get example_id by req.body.example_id //example_id is type_of_lesson id
     * >>>> find 
     * else if req.query.get_count == 1 => get total count
     * else if req.query.relationships == 1 and req.body.question_id => get count in relationships
     * else return status(400) and message: 'Not query!'
     */
    try {
        if (req.query.page) {
            let limit = 10;
            let offset = 10;
            let query = [];
            offset = (req.query.page - 1) * 10;
            let key_word = "";
            if (req.body.key_word) key_word = req.body.key_word;
            query = [
                {
                    $or: [
                        {'content': {$regex: key_word, $options: 'is'}},
                    ]
                }
            ];
            if (req.body.activated) query.push({'activated': req.body.activated});
            if (req.body.chapter_id) query.push({'relationships.chapter_id': req.body.chapter_id});
            if (req.body.lesson_id) query.push({'relationships.lesson_id': req.body.lesson_id});
            if (req.body.example_id) query.push({'relationships.example_id': req.body.example_id});
            await Question.find({
                $and: query
            }, null, {limit: limit, skip: offset}, (err, response) => {
                if (err) res.status(400).json({'message': err});
                else res.status(200).json({'data': response});
            });

        } else if(req.query.get_count == 1) {
            await Question.countDocuments({}, (err, response) => {
                if (err) {
                    return res.status(400).json({'message': err});
                } else {
                    return res.status(200).json({'count': response});
                }
            });

        } else if(req.query.relationships == 1) {
            getCountInRelationships(req, res);

        } else return status(400).json({message: 'Not query!'});

    } catch (err) {
        return res.status(400).json({ message: 'Bad request', error: err.message});
    }
    
};

const getQuestion = async(req, res) => {
    /**
     *  Step 1: get id question from params
     *  Step 2: get question by id
     */
    try {
        await Question.findById(req.params.id).exec((err, response) => {
            if(err) return res.status(400).json({'message': err});
            else return res.status(200).json({'data': response});
        });
    } catch(err){
        return res.status(400).json({message: 'Bad request!', error: err.message});
    }
};

const updateQuestion = async(req, res) => {
    /**
     * Step 1: get id question from params
     * Step 2: findByIdAndUpdate set question = req.body
     */ 
    try {
        let chapter = req.body.is_chapter;
        let assignment = req.body.is_assignment;
        let example = req.body.is_example;
        if (chapter == 'true' && assignment == 'true'){
            return res.status(400).json({message: '3 values:is_chapter, is_assignment, is_example only have one value to be a true'});
        } else if( assignment == 'true' && example == 'true'){
            return res.status(400).json({message: '3 values:is_chapter, is_assignment, is_example only have one value to be a true'});
        } else if(chapter == 'true' && example == 'true'){
            return res.status(400).json({message: '3 values:is_chapter, is_assignment, is_example only have one value to be a true'});
        } else if(chapter == 'false' && assignment == 'false' && example == 'false'){
            return res.status(400).json({message: '3 values:is_chapter, is_assignment, is_example only have one value to be a true'});
        } else {
            req.body.updated_at = req.body.updated_at ? req.body.updated_at : new Date();
            await Question.findByIdAndUpdate(req.params.id, {$set: req.body},{new: true})
            .exec( (err, response) => {
                if(err) return res.status(400).json({message: err});
                else return res.status(200).json({data: response});
            });
        }
        
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }

};

const deleteQuestion = async(req, res) => {
    /**
     * Step 1: get id question from params
     * Step 2: findByIdAndDelete set question = req.body
    */
    try {
        await Question.findByIdAndDelete(req.params.id).exec( (err) => {
            if(err) return res.status(400).json({message: err.message});
            else {
                return res.status(200).json({message: 'Delete successful!'});
            }
        });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
}

const QuestionController = {
    createQuestion, selectQuestions, getQuestion, updateQuestion, deleteQuestion
};

module.exports = QuestionController;
