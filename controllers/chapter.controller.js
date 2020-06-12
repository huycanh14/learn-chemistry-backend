var Chapter = require('../models/chapter.model');

const { RELATIONSHIPS_IN_CHAPTER } =  require('../helpers/list_model');

var getCountInRelationships = async(req, res) => {
    /**
     * get count item in relationships: answer, document, explain, grade, lesson, question, theory, type_of_lesson
     * return count
     */  

    try {
        var id = req.body.chapter_id;
        var data = [];
        const listRelationships = RELATIONSHIPS_IN_CHAPTER.map(item => {
            return new Promise((resolve, reject) => item.countDocuments({'relationships.chapter_id': id}, (err, response) => {
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

const createChapter = async(req, res)  => {
    /**
     * Step 1: get information of new chapter from the client via the body
     * Step 2: create new chapter
     * >>> if create success => return status(200) and data request
     * >>> else return status (400) , message: 'Bad request' and error
    **/
    try {
        let chapter = new Chapter({
            chapter_number: req.body.chapter_number,
            title: req.body.title,
            description: req.body.description,
            relationships: {
                grade_id : req.body.grade_id
            },
            created_at: req.body.created_at,
            updated_at: req.body.updated_at,
            activated: req.body.activated
        });

        chapter.save((err, response) => {
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

const selectChapters = async(req, res)  => {
    /**
     * if req.query.page
     * >>> const limit = 10, offset = 0 => offset = (req.query.page - 1) * 10
     * >>> get key_word = req.body.key_work => select title, description by key_work
     * >>> get activated
     * >> get grade_id by req.body.grade_id
     * >>> find 
     * else if req.query.get_count == 1 => get total count
     * else if req.query.relationships == 1 and req.body.chapter_id => get count in relationships
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
                        {'description': {$regex: key_word, $options: 'is'}},
                    ]
                }
            ];
            if (req.body.activated) query.push({'activated': req.body.activated});
            if (req.body.grade_id) query.push({relationships: {grade_id: req.body.grade_id}})
            await Chapter.find({
                $and: query
            }, null, {limit: limit, skip: offset}, (err, response) => {
                if (err) res.status(400).json({'message': err});
                else res.status(200).json({'data': response});
            });
        } else if (req.query.get_count == 1) {
            await Chapter.countDocuments({}, (err, response) => {
                if (err) {
                    return res.status(400).json({'message': err});
                } else {
                    return res.status(200).json({'count': response});
                }
            });
        } else if (req.query.relationships == 1 && req.body.chapter_id){
            getCountInRelationships(req, res);
        } else return req.status(400).json({'message': 'Not query!'});
    } catch(err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message})
    }
};

const getChapter = async(req, res) => {
    /**
     *  Step 1: get id chapter from params
     *  Step 2: get chapter by id
     */
    try {
        await Chapter.findById(req.params.id).exec((err, response) => {
            if(err) return res.status(400).json({'message': err});
            else return res.status(200).json({'data': response});
        });
    } catch(err){
        return res.status(400).json({message: 'Bad request!', error: err.message});
    }
};


const updateChapter = async(req, res)  => {
    /**
     * Step 1: get id chapter from params
     * Step 2: findByIdAndUpdate set chapter = req.body
     */ 
    try {
        req.body.updated_at = req.body.updated_at ? req.body.updated_at : new Date();
        await Chapter.findByIdAndUpdate(req.params.id, {$set: req.body},{new: true})
            .exec( (err, response) => {
                if(err) return res.status(400).json({message: err});
                else return res.status(200).json({data: response});
            });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }

};

const deleteChapter = async(req, res) => {
    /**
     * Step 1: get id chapter from params
     * Step 2: findByIdAndDelete set chapter = req.body
    */
    try {
        await Chapter.findByIdAndDelete(req.params.id).exec( (err) => {
            if(err) return res.status(400).json({message: err.message});
            else {
                return res.status(200).json({message: 'Delete successful!'});
            }
        });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};


const ChapterController = {
    createChapter, selectChapters, getChapter, updateChapter, deleteChapter
};

module.exports = ChapterController;
