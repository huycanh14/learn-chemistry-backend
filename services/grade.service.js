var GradeModule = require('../modules/grade.module');

const createGrade = async(req, res)  => {
    /**
     * Step 1: get information of new grade from the client via the body
     * Step 2: create new grade
     * >>> if create success => return status(200) and data request
     * >>> else return status (400) , message: 'Bad request' and error
    **/
    try {
        let grade = await GradeModule({
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
     * else req.query.get_count == 1 => get total count
     * else return status(400) and message: 'Not query!'
     */
    try {
        let limit = 10;
        let offset = 10;
        let query = [];
        if(req.query.page){
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
            await GradeModule.find({
                $and: query
            }, null, {limit: limit, skip: offset}, (err, response) => {
                if (err) res.status(400).json({'message': err});
                else res.status(200).json({'data': response});
            });
        } else if (req.query.get_count == 1) {
            await GradeModule.count({}, (err, response) => {
                if (err) {
                    return res.status(400).json({'message': err});
                } else {
                    return res.status(200).json({'count': response});
                }
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
        await GradeModule.findById(id).exec((err, response) => {
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
        await GradeModule.findByIdAndUpdate(req.params.id, {$set: req.body},{new: true})
            .exec( (err, response) => {
                if(err) return res.status(400).json({message: err});
                else return res.status(200).json({data: response});
            });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request!', error: err.message});
    }
};

const deleteGrade = async(req, res) => {
    /**
     * get id grade from params
     * else findByIdAndDelete set grade = req.body
     */ 
};

const GradeService = {
    createGrade, selectGrades, getGrade, updateGrade,
};

module.exports = GradeService;
