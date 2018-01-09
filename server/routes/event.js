const router = require('express').Router();
const mongoose = require('mongoose');
const checkToken = require('../middleware').checkToken;
const multer = require('multer');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const exceed = 540;


const storage = multer.diskStorage({
    destination: (req , file , cb) => {
        cb(null , './uploads/')
    },
    filename: (req , file , cb) => {
        cb(null , file.originalname);
    }
});

const fileFilter = (req , file , cb) => {
    if (file.mimetype === 'application/json') {
        cb(null , true);
    } else {
        cb(null , false);
    }
}

const uplaod = multer({storage: storage, fileFilter: fileFilter});
const Event = require('../model/Event');


router.post('/saveCalendarJSON' ,  uplaod.single('json') , (req, res ,next) => {

     return fs.readFileAsync(req.file.path , 'utf-8')
        .then(data => {
            data = JSON.parse(data);

                return Promise.all(
                        data.map(item => new Event({
                                _id: new mongoose.Types.ObjectId(),
                                start : item.start,
                                duration: item.duration,
                                title: item.title,
                                userId: req.body.userId,
                            }).save()))
                            .then(result => {
                                  res.status(200).json({
                                    message: 'etries were saved successfully',
                                    success: true,
                                    data: result.map((item) => ({
                                        _id: item._id,
                                        title: item.title,
                                        duration: item.duration,
                                        start: item.start,
                                    })),
                                });
                            })
                            .catch(err => {
                                 res.status(500).json({
                                    message: 'Internal sever error',
                                    success: false,
                                })
                            })
        })
        .catch(error => {
            console.log('error' , error);
            res.status(500).json({
                message: 'can not read the file',
                success: false,
            });
        })
});

router.post('/getEvents' , checkToken ,(req , res , next) => {
    if (req.body.userId) {
        Event.find({userId : req.body.userId})
            .select('start duration title _id')
            .exec()
            .then(data => {
                res.status(200).json({
                    data,
                    success: true,
                });
            })
            .catch(error => {
                res.status(500).json({
                    error,
                    success: false,
                })
            })
    } else {
        res.status(500).json({
            message: 'Internal Error',
            success: false,
        });
    }
});

router.post('/addEvent' , checkToken, (req, res, next) => {
    if (req.body.start && req.body.title && req.body.duration && req.body.userId) {

        let ev = new Event({
            _id: new mongoose.Types.ObjectId(),
            start : req.body.start,
            duration: req.body.duration,
            title: req.body.title,
            userId: req.body.userId,
        });

        ev.save()
            .then(result => {
                res.status(201).json({
                    message: 'event was saved successfully',
                    success: true,
                    data: {
                        _id : result._id,
                        start: result.start,
                        duration: result.duration,
                        title: result.title,
                    }
                })
            })
            .catch(error => {
                res.status(500).json({
                    error,
                    success: false,
                })
            })


    } else {
        res.status(500).json({
            message: 'Not all arguments are provided',
            success: false,
        })
    }
});

router.post('/removeEvent' , (req , res , next) => {
    if (req.body._id) {
        Event.remove({_id: req.body._id})
            .exec()
            .then(data => {
                res.status(200).json({
                    message: 'event was deleted successfully',
                    success: true,
                });
            })
            .catch(error => {
                res.status(500).json({
                    error,
                    success: false,
                })
            })

    } else {
        res.status(500).json({
            message: 'Not all arguments are provided',
            success: false,
        })
    }
});


module.exports = router;
