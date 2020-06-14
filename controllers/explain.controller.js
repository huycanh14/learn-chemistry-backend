var Explain = require('../models/explain.model');

const createExplain = async(req, res)  => {
    /**
     * Step 1: get information of new explain from the client via the body
     * Step 2: create new explain
     * >>> if create success => return status(200) and data request
     * >>> else return status (400) , message: 'Bad request' and error
    **/
    try {
        let explain = new Explain({
            content: req.body.content,
            relationships: {
                grade_id : req.body.grade_id,
                chapter_id : req.body.chapter_id,
                lesson_id : req.body.lesson_id,
                example_id: req.body.example_id,
                question_id: req.body.question_id
            },
            created_at: req.body.created_at,
            updated_at: req.body.updated_at,
            activated: req.body.activated
        });

        explain.save((err, response) => {
            if(err) return res.status(400).json({message: err});
            else {
                response = JSON.parse(JSON.stringify(response));
                return res.status(200).json({'data': response});
            }
        });
    } catch(err) {
        return res.status(400).json({message: 'Bad request!', error: err.message});
    }
};

const selectExplains = async(req, res) => {
    /**
     * if req.query.question_id
     * >>> get activated
     * >>> find by question_id
     * else if req.query.get_count == 1 => get total count
     * else return status(400) and message: 'Not query!'
     */
    try {
        if(req.query.question_id){
            let query = [];
            query.push({'relationships.question_id': req.query.question_id});
            if (req.body.activated) query.push({'activated': req.body.activated});
            await Explain.find({
                $and: query
            }, null, {}, (err, response) => {
                if (err) res.status(400).json({'message': err});
                else res.status(200).json({'data': response});
            });
        } else if (req.query.get_count == 1) {
            await Explain.countDocuments({}, (err, response) => {
                if (err) {
                    return res.status(400).json({'message': err});
                } else {
                    return res.status(200).json({'count': response});
                }
            });
        } else return req.status(400).json({'message': 'Not query!'});
    } catch(err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message})
    }
};

const getExplain = async(req, res) => {
    /**
     *  Step 1: get id explain from params
     *  Step 2: get explain by id
     */
    try {
        await Explain.findById(req.params.id).exec((err, response) => {
            if(err) return res.status(400).json({'message': err});
            else return res.status(200).json({'data': response});
        });
    } catch(err){
        return res.status(400).json({message: 'Bad request!', error: err.message});
    }
};

const updateExplain = async(req, res) => {
    /**
     * Step 1: get id explain from params
     * Step 2: findByIdAndUpdate set explain = req.body
     */ 
    try {
        req.body.updated_at = req.body.updated_at ? req.body.updated_at : new Date();
        await Explain.findByIdAndUpdate(req.params.id, {$set: req.body},{new: true})
            .exec( (err, response) => {
                if(err) return res.status(400).json({message: err});
                else return res.status(200).json({data: response});
            });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};

const deleteExplain = async(req, res) => {
    /**
     * Step 1: get id explain from params
     * Step 2: findByIdAndDelete set explain = req.body
    */
    try {
        await Explain.findByIdAndDelete(req.params.id).exec( (err) => {
            if(err) return res.status(400).json({message: err.message});
            else {
                return res.status(200).json({message: 'Delete successful!'});
            }
        });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};

const ExplainController = {
    createExplain, selectExplains, getExplain, updateExplain, deleteExplain
};

module.exports = ExplainController;