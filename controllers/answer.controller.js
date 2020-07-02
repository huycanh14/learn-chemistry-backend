var Answer = require('../models/answer.model');

const createAnswer = async(req, res)  => {
    /**
     * Step 1: get information of new answer from the client via the body
     * Step 2: create new answer
     * >>> if create success => return status(200) and data request
     * >>> else return status (400) , message: 'Bad request' and error
    **/
    try {
        let answer = new Answer({
            content: req.body.content,
            is_right: req.body.is_right,
            relationships: {
                grade_id: req.body.grade_id,
                chapter_id: req.body.chapter_id,
                lesson_id: req.body.lesson_id,
                example_id: req.body.example_id,
                question_id: req.body.question_id
            },
            created_at: req.body.created_at,
            updated_at: req.body.updated_at,
            activated: req.body.activated
        });

        answer.save((err, response) => {
            if(err) return res.status(400).json({message: err});
            else {
                response = JSON.parse(JSON.stringify(response));
                return res.status(200).json({'data': response});
            }
        });
    } catch (err){
        return res.status(400).json({ message: 'Bad request', error: err.message});
    }
};

const selectAnswers = async(req, res) => {
    /**
     * if req.query.question_id
     * >>> get activated
     * >>> find answers by question_id
     * else if req.query.get_count == 1 => get total count
     * else return status(400) and message: 'Not query!'
     */
    try {
        let query = [];
        query.push({'relationships.question_id': req.query.question_id});
        if (req.query.activated) query.push({'activated': req.query.activated});
        if(req.query.question_id){
            
            await Answer.find({
                $and: query
            }, null, {}, (err, response) => {
                if (err) res.status(400).json({'message': err});
                else res.status(200).json({'data': response});
            });
        } else if (req.query.get_count == 1) {
            await Answer.countDocuments({$and: query}, (err, response) => {
                if (err) {
                    return res.status(400).json({'message': err});
                } else {
                    return res.status(200).json({'count': response});
                }
            });
        } else return req.status(400).json({'message': 'Not query!'});
    } catch (err) {
        return res.status(400).json({ message: 'Bad request', error: err.message});
    }
};

const getAnswer = async(req, res) => {
    /**
     *  Step 1: get id answer from params
     *  Step 2: get answer by id
     */
    try {
        await Answer.findById(req.params.id).exec((err, response) => {
            if(err) return res.status(400).json({'message': err});
            else return res.status(200).json({'data': response});
        });
    } catch(err){
        return res.status(400).json({message: 'Bad request!', error: err.message});
    }
};

const updateAnswer = async(req, res) => {
    /**
     * Step 1: get id answer from params
     * Step 2: findByIdAndUpdate set answer = req.body
     */ 
    try {
        req.body.updated_at = req.body.updated_at ? req.body.updated_at : new Date();
        await Answer.findByIdAndUpdate(req.params.id, {$set: req.body},{new: true})
            .exec( (err, response) => {
                if(err) return res.status(400).json({message: err});
                else return res.status(200).json({data: response});
            });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};

const deleteAnswer = async(req, res) => {
    /**
     * Step 1: get id answer from params
     * Step 2: findByIdAndDelete set answer = req.body
    */
    try {
        await Answer.findByIdAndDelete(req.params.id).exec( (err) => {
            if(err) return res.status(400).json({message: err.message});
            else {
                return res.status(200).json({message: 'Delete successful!'});
            }
        });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};

const AnswerController = {
    createAnswer, selectAnswers, getAnswer, updateAnswer, deleteAnswer
};

module.exports = AnswerController;
