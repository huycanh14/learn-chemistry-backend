var Grade = require('../models/grade.model');

const { RELATIONSHIPS_IN_GRADE } =  require('../helpers/list_model');

var getCountInRelationships = async(req, res) => {
    /**
     * get count item in relationships: answer, chapter, document, explain, grade, lesson, question, theory, type_of_lesson
     * return count
     */  

    try {
        var id = req.query.grade_id;
        var data = [];
        const listRelationships = RELATIONSHIPS_IN_GRADE.map(item => {
            return new Promise((resolve, reject) => item.countDocuments({'relationships.grade_id': id}, (err, response) => {
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

const createGrade = async(req, res)  => {
    /**
     * Step 1: get information of new grade from the client via the body
     * Step 2: create new grade
     * >>> if create success => return status(200) and data request
     * >>> else return status (400) , message: 'Bad request' and error
    **/
    try {
        let grade = new Grade({
            name: req.body.name,
            created_at: req.body.created_at,
            updated_at: req.body.updated_at,
            activated: req.body.activated
        });

        grade.save((err, response) => {
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

const selectGrades = async(req, res)  => {
    /**
     * if req.query.page
     * >>> const limit = 10, offset = 0 => offset = (req.query.page - 1) * 10
     * >>> get name = req.query.name => select name by key_work
     * >>> get activated
     * >>> find 
     * else if req.query.get_count == 1 => get total count
     * els if req.query.relationships == 1 and grade_id = req.query.grade_id => get Count In Relationships
     * else if req.query.get_all == 1 => get all grades and sort by name
     * else return status(400) and message: 'Not query!'
     */
    try {
        
        let query = [];
        let name = "";
        if (req.query.name) name = req.query.name;
        query = [
            {
                $or: [
                    {'name': {$regex: name, $options: 'is'}},
                ]
            }
        ];
        
        if (req.query.activated) query.push({'activated': req.query.activated});

        if(req.query.page){
            let limit = 10;
            let offset = 10;
            offset = (req.query.page - 1) * 10;
            let sort = {
                created_at: 1
            };
            if(req.query.sort_created_at === 'asc') sort = {created_at: 1};
            else if(req.query.sort_created_at === 'desc') sort = {created_at: -1};
            else if(req.query.sort_name === 'asc') sort = {name: 1};
            else if(req.query.sort_name === 'desc') sort = {name: -1};
            await Grade.find({
                $and: query
            }, null, {limit: limit, skip: offset, sort: sort}, (err, response) => {
                if (err) res.status(400).json({'message': err});
                else res.status(200).json({'data': response});
            });
        } else if (req.query.get_count == 1) {
            await Grade.countDocuments({$and: query}, (err, response) => {
                if (err) {
                    return res.status(400).json({'message': err});
                } else {
                    return res.status(200).json({'count': response});
                }
            });
        // } else return req.status(400).json({'message': 'Not query!'});
        } else if (req.query.relationships == 1 && req.query.grade_id){
            getCountInRelationships(req, res);
        }else if(req.query.get_all == 1){
            let sort = {
                name: 1
            };
            await Grade.find({}, null, {sort: sort}, (err, response) => {
                if (err) res.status(400).json({'message': err});
                else res.status(200).json({'data': response});
            });
        } else return req.status(400).json({'message': 'Not query!'});
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};

const getGrade = async (req, res) => {
    /**
     *  get id grade from params
     *  get grade by id
     */
    try {
        let id = req.params.id;
        await Grade.findById(id).exec((err, response) => {
            if(err) return res.status(400).json({'message': err});
            else return res.status(200).json({'data': response});
        });
    } catch (err) {
        return res.status(400).json({message: 'Bad request!', err: err.message});
    }
};


const updateGrade = async (req, res)  => {
    /**
     * Step 1: get id grade from params
     * Step 2: findByIdAndUpdate set grade = req.body
     */ 
    try {
        req.body.updated_at = req.body.updated_at ? req.body.updated_at : new Date();
        await Grade.findByIdAndUpdate(req.params.id, {$set: req.body},{new: true})
            .exec( (err, response) => {
                if(err) return res.status(400).json({message: err});
                else return res.status(200).json({data: response});
            });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};

const deleteGrade = async(req, res, next) => {
    /**
     * Step 1: get id grade from params
     * Step 2: findByIdAndDelete set grade = req.body
     */ 
    try {
        await Grade.findByIdAndDelete(req.params.id).exec( (err) => {
            if(err) return res.status(400).json({message: err.message});
            else {
                return res.status(200).json({message: 'Delete successful!'});
            }
        });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};

const GradeController = {
    createGrade, selectGrades, getGrade, getCountInRelationships, updateGrade, deleteGrade
};

module.exports = GradeController;
