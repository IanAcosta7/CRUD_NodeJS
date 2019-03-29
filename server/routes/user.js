const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const {verifyToken} = require('../middlewares/auth');
const app = express();

app.get('/', function (req, res) {
    res.json('Hello World')
});

app.get('/user', verifyToken, function (req, res) {

    // return res.json({
    //     user: req.user,
    //     name: req.user.name,
    //     email: req.user.email,
    // });

    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 10;

    User.find({ state: true }, 'email name state role google img')
        .skip(skip)
        .limit(limit)
        .exec((err, usersDB) => {
            if (err) {
                res.status(400).json({
                    response: [],
                    status: 400,
                    error: err
                });
            } else {
                User.count({ state: true }, (err, count) => {
                    res.json({
                        response: usersDB,
                        count
                    });
                });
            }
        });
});

app.post('/user', verifyToken, function (req, res) {

    const body = req.body;

    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        // img: body.img,
        role: body.role
        // google: body.google
        // state: body.state
    });

    user.save((err, userDB) => {
        if (err) {
            res.status(400).json({
                response: [],
                status: 400,
                error: err
            });
        } else {

            res.json({
                response: userDB,
            });
        }
    });

});

app.put('/user/:id', verifyToken, function (req, res) {

    const id = req.params.id;
    const body = _.pick(req.body, ['name', 'email', 'img', 'state']);

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userDB) => {
        if (err) {
            res.status(400).json({
                response: [],
                status: 400,
                error: err
            });
        } else {
            res.json({
                response: userDB
            });
        }
    });

});

app.delete('/user/:id', verifyToken, function (req, res) {

    const id = req.params.id;

    // Finds the user with the given ID and changes his state to false.
    User.findByIdAndUpdate(id, {state: false}, {new: true}, (err, userDB) => {
        if (err) {
            res.status(400).json({
                response: [],
                status: 400,
                error: err
            });
        } else {
            if (!userDB) {
                return res.status(400).json({
                    response: [],
                    error: {
                        message: 'User not found.'
                    }
                });
            }
            res.json({
                response: userDB
            });
        }
    });
});

module.exports = app;