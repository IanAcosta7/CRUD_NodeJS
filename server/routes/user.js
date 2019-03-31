const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const {verifyToken} = require('../middlewares/auth');
const app = express();

const getResponse = (err, status, res, usersDB) => {
    User.count({ state: true }, (countErr, count) => {
        let response = usersDB;
        let statusCode = 200;

        if (err || countErr) {
            response = [],
            statusCode = status
        }

        res.status(status).json({
            response,
            amount: count,
            status: statusCode,
            error: err || countErr
        });
    });
};

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
            getResponse(err, 400, res, usersDB);
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
        getResponse(err, 400, res, userDB);
    });

});

app.put('/user/:id', verifyToken, function (req, res) {

    const id = req.params.id;
    const body = _.pick(req.body, ['name', 'email', 'img', 'state']);

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userDB) => {
        getResponse(err, 400, res, userDB);
    });

});

app.delete('/user/:id', verifyToken, function (req, res) {

    const id = req.params.id;

    // Finds the user with the given ID and changes his state to false.
    User.findByIdAndUpdate(id, {state: false}, {new: true}, (err, userDB) => {
        if (!userDB) {
            return res.status(400).json({
                response: [],
                error: {
                    message: 'User not found.'
                }
            });
        } else {
            getResponse(err, 400, res, userDB);
        }
    });
});

module.exports = app;