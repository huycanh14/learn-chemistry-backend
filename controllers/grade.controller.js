var Grade = require('../models/grade.model');
var { RELATIONSHIPS_IN_GRADE } =  require('../helpers/list_model');

var getCountInRelationships = async(req, res) => {
    /**
     * get count item in relationships: answer, chapter, document, explain, grade, lesson, question, theory, type_of_lesson
     * return count
     */  

    try {
        var id = req.body.grade_id;
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
     * >>> get name = req.body.name => select name by key_work
     * >>> get activated
     * >>> find 
     * else if req.query.get_count == 1 => get total count
     * els if req.query.relationships == 1 and grade_id = req.body.grade_id => get Count In Relationships
     * else return status(400) and message: 'Not query!'
     */
    try {
        if(req.query.page){
            let limit = 10;
            let offset = 10;
            let query = [];
            offset = (req.query.page - 1) * 10;
            let name = "";
            if (req.body.name) name = req.body.name;
            query = [
                {
                    $or: [
                        {'name': {$regex: name, $options: 'is'}},
                    ]
                }
            ];
            
            if (req.body.activated) query.push({'activated': req.body.activated});
            await Grade.find({
                $and: query
            }, null, {limit: limit, skip: offset}, (err, response) => {
                if (err) res.status(400).json({'message': err});
                else res.status(200).json({'data': response});
            });
        } else if (req.query.get_count == 1) {
            await Grade.countDocuments({}, (err, response) => {
                if (err) {
                    return res.status(400).json({'message': err});
                } else {
                    return res.status(200).json({'count': response});
                }
            });
        // } else return req.status(400).json({'message': 'Not query!'});
        } else if (req.query.relationships == 1 && req.body.grade_id){
            getCountInRelationships(req, res);
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
     * get id grade from params
     * else findByIdAndUpdate set grade = req.body
     */ 
    try {
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
     * get id grade from params
     * else findByIdAndDelete set grade = req.body
     */ 
    try {
        // await Grade.findByIdAndDelete({_id: req.params.id}).exec( (err) => {
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
