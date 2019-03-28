const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const app = express();

app.get('/', function (req, res) {
    res.json('Hello World')
});

app.get('/user', function (req, res) {
    res.json('get User')
});

app.post('/user', function (req, res) {

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
                response: {},
                status: 400,
                error: err
            });
        } else {

            res.json({
                response: userDB,
                status: 200,
            });
        }
    });

});

app.put('/user/:id', function (req, res) {

    const id = req.params.id;
    const body = _.pick(req.body, ['name', 'email', 'img', 'state']);

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userDB) => {
        if (err) {
            res.status(400).json({
                response: {},
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

app.delete('/user', function (req, res) {
    res.json('delete User')
});

module.exports = app;