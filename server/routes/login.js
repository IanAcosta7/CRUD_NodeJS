const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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
                message:'Password mismatch' 
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


// Google Configs
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async (req, res) => {
    const token = req.body.idtoken;

    const googleUser = await verify(token)
    .catch(err => {
        return res.status(403).json({
            error: err
        });
    });

    User.findOne( { email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        }

        if (userDB) {
            if (!userDB.google) {
                return res.status(400).json({
                    error: 'Use your normal credentials'
                });
            }

            const token = jwt.sign({
                user: userDB
            }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

            return res.json({
                user: userDB,
                token
            });
        } else {
            // If the user does not exist in the database
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = googleUser.google;
            user.password = 'Google User';

            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }

                const token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });
    
                return res.json({
                    user: userDB,
                    token
                });
            });
        }
    });
});

module.exports = app;