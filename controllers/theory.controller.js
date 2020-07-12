var Theory = require('../models/theory.model');

const createTheory = async(req, res)  => {
    /**
     *  Step 1: get information of new theory from the client via the body
     *  Step 2: create a new theory
     *  >>> if create success => return status(200) and data request
     *  >>> else return status (400) , message: 'Bad request' and error
    */ 
    try {
        let theory = new Theory({
            content: req.body.content,
            relationships: {
                grade_id: req.body.grade_id,
                chapter_id: req.body.chapter_id,
                lesson_id: req.body.lesson_id,
            },
            created_at: req.body.created_at,
            updated_at: req.body.updated_at,
            activated: req.body.activated
        });
        theory.save((err, response) => {
            if(err) return res.status(400).json({message: err});
            else {
                response = JSON.parse(JSON.stringify(response));
                return res.status(200).json({'data': response});
            }
        });
        
    } catch (err) {
        return res.status(400).json({message: 'Bad request', error: err.message})
    }

};

var getAllTheories = async(req, res) => {
    try {
        let query = [{}];
        if (req.query.lesson_id) query.push( {"relationships.lesson_id": req.query.lesson_id} );
        let sort = {
            created_at: 1
        };
        await Theories.find({
            $and: query
        }, null, {sort: sort}, (err, response) => {
            if (err) res.status(400).json({'message': err});
            else res.status(200).json({'data': response});
        });
    } catch(err){
        return res.status(400).json({ message: 'Bad request!', error: err.message });
    }
};

const selectTheories = async(req, res) => {
    /**
     * if req.query.page
     * >>> const limit = 10, offset = 0 => offset = (req.query.page - 1) * 10
     * >>> get key_word = req.query.key_work => select content by key_work
     * >>> get activated
     * >> get lesson_id by req.query.lesson_id
     * >>> find 
     * else if req.query.get_count == 1
     * >>> if req.query.lesson_id => get total count by lesson id
     * >>> else => get total count
     * else get all theory and sort by created_at
     * else return status(400) and message: 'Not query!'
    */
    try {
        let query = [];
        let key_word = "";
        if (req.query.key_word) key_word = req.query.key_word;
        query = [
            {
                $or: [
                    {'content': {$regex: key_word, $options: 'is'}},
                ]
            }
        ];
        if (req.query.activated) query.push({'activated': req.query.activated});
        if (req.query.lesson_id) query.push({'relationships.lesson_id': req.query.lesson_id});

        if(req.query.page) {

            let limit = 10;
            let offset = 10;
            offset = (req.query.page - 1) * 10;

            let sort = {
                created_at: 1
            };
            if(req.query.sort_created_at === 'asc') sort = {created_at: 1};
            else if(req.query.sort_created_at === 'desc') sort = {created_at: -1};
            else if(req.query.sort_content === 'asc') sort = {content: 1};
            else if(req.query.sort_content === 'desc') sort = {content: -1};

            await Theory.find({
                $and: query
            }, null, {limit: limit, skip: offset, sort: sort}, (err, response) => {
                if (err) res.status(400).json({'message': err});
                else res.status(200).json({'data': response});
            });

        } else if(req.query.get_count == 1 ){
            await Theory.countDocuments({$and: query}, (err, response) => {
                if (err) {
                    return res.status(400).json({'message': err});
                } else {
                    return res.status(200).json({'count': response});
                }
            });

        } else if(req.query.get_all == 1){
            getAllTheories(req, res);
        } else return req.status(400).json({'message': 'Not query!'});
    } catch (err) {
        return res.status(400).json({message: 'Bad request!', error: err.message})
    }
};

const getTheory = async(req, res) => {
    /**
     *  Step 1: get id theory from params
     *  Step 2: get theory by id 
    */
    try {
        await Theory.findById(req.params.id).exec((err, response) => {
            if(err) return res.status(400).json({'message': err});
            else return res.status(200).json({'data': response});
        });
    } catch (err) {
        return res.status(400).json({message: 'Bad request', error: err.message});
    }
};

const updateTheory = async(req, res) => {
    /**
     * Step 1: get id the from params
     * Step 2: findByIdAndUpdate set theory = req.body 
    */
    try {
        req.body.updated_at = req.body.updated_at ? req.body.updated_at : new Date();
        await Theory.findByIdAndUpdate(req.params.id, {$set: req.body},{new: true})
            .exec( (err, response) => {
                if(err) return res.status(400).json({message: err});
                else return res.status(200).json({data: response});
            });
    } catch (err) {
        return res.status(400).json({message: 'Bad request', error: err.message});
    }
};

const deleteTheory = async(req, res) => {
    /**
     * Step 1: get id theory from params
     * Step 2: findByIdAndDelete set theory = req.body
     */ 
    try {
        await Theory.findByIdAndDelete(req.params.id).exec( (err) => {
            if(err) return res.status(400).json({message: err.message});
            else {
                return res.status(200).json({message: 'Delete successful!'});
            }
        });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};

const TheoryController = {
    createTheory, selectTheories, getTheory, updateTheory, deleteTheory
};

module.exports = TheoryController;