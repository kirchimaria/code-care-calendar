const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../model/User');
const jwt = require('jsonwebtoken');

const secretKey = require('../constants').secretKey;


router.post('/signup', (req, res , next) => {
    User.find({email:  req.body.email}).exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'mail exists',
                    success: false,
                })
            }
            else {
                bcrypt.hash(req.body.password , 10 , (err , hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err,
                            success: false,
                        });
                    }

                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                    });

                    user.save()
                    .then(result => {
                        const token = jwt.sign({email: user.email , userId: user._id },
                                secretKey,
                                {
                                    expiresIn: '3h',
                                });

                        res.status(201).json({
                            _id: user._id,
                            message: 'User created',
                            success: true,
                            token,
                        });

                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            message: 'User wan\'t created',
                            success: false,
                        });
                    })
                })
            }
        })
});

router.post('/login', (req , res , next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth fail',
                    success: false
                })
            }

            bcrypt.compare(req.body.password , user[0].password , (err , hash) => {
                if (err) {
                    return res.status(401).json({ message: 'Auth failed' , success: false})
                }

                if (hash) {
                    const token = jwt.sign({email: user[0].email , userId: user[0]._id },
                            secretKey,
                            {
                                expiresIn: '3h',
                            });

                    return res.status(200).json({
                        _id: user[0]._id,
                        message: 'Auth was successfull',
                        success: true,
                        token,
                    })
                }
            })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Internal Server error',
                success: false,
            })
        })
});

module.exports = router;
