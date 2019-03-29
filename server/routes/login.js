const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({email: body.email}, (err, userDB) => {
        if (err) {
            res.status(500).json({
                response: [],
                status: 500,
                error: err
            });
        }
        if(!userDB) {
            return res.status(400).json({
                response: [],
                status: 400,
                message:'User not found' 
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                response: [],
                status: 400,
                message:'Password' 
            });
        }

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });
        
        res.json({
            response: userDB,
            token
        });
    });

});

module.exports = app;