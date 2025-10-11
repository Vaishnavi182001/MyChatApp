const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const User = require('../models/userModels');
const Helpers = require('../Helpers/helpers.js');
const bcrypt = require('bcryptjs');
const { dbConfig } = require('../config/secret.js');
const jwt = require('jsonwebtoken')

//if the email not exist then create a new user
const CreateUser = async (req, res) => {
    try {
        // Log the request body to verify its contents
        //console.log("Request body:", req.body);

        //first check if the email exists in the database
        const email = req.body.email;
        if (!email) {
            throw new TypeError("Email is undefined");
        }
        const userEmail = await User.findOne({ email: Helpers.lowerCase(email) });
        if (userEmail) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        //check if the username exists in the database
        const userName = await User.findOne({ username: Helpers.firstUpper(req.body.username) });
        if (userName) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const schema = Joi.object().keys({
            username: Joi.string().min(5).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(5).required()
        });

        //validate the req.body against the schema
        const { error, value } = schema.validate(req.body);
        if (error && error.details) {
            return res.status(400).json({ msg: error.details });
        }

        //to store password in database we need to hash it
        return bcrypt.hash(value.password, 10, (err, hash) => {
            if (err) {
                return res.status(400).json({ msg: 'Error hashing password' });
            }

            const body = {
                username: value.username,
                email: value.email,
                password: hash
            };

            User.create(body).then((user) => {
                const token = jwt.sign({data : user}, dbConfig.secret, {
                    expiresIn: '1h'
                });
                res.cookie('auth', token);
               res.status(201).json({ message: 'User created successfully', user,token });
            }).catch((err) => {
                return res.status(500).json({ msg: 'Error creating user' });
            });
        });
    } catch (error) {
        console.error("Error in CreateUser:", error);
        return res.status(400).json({ msg: error.message });
    }

};
const LoginUser = async (req, res) => {

    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'No empty fields allowed' });
    }

    try {
        const normalizedUsername = req.body.username;
       // console.log("Normalized username:", normalizedUsername);
       // console.log("Request body password:", req.body.password);
        const user = await User.findOne({ username: normalizedUsername });

        if (!user) {
            return res.status(401).json({ message: 'Username is not found' });
        }

        return bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                return res.status(401).json({ message: 'Password is incorrect' });
            }
            if (result) {
                const token = jwt.sign({ data: user }, dbConfig.secret, {
                    expiresIn: '24h'
                });
                res.cookie('auth', token);
                return res.status(200).json({ message: 'Login successful', user, token });
            }
            return res.status(401).json({ message: 'Password is incorrect' });
        });
    } catch (err) {
        console.error("Error in LoginUser:", err);
        return res.status(500).json({ message: 'An error occurred' });
    }
};


module.exports = { CreateUser, LoginUser };