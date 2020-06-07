var Chapter = require('../models/chapter.model');

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


const ChapterController = {
    createChapter
};

module.exports = ChapterController;
