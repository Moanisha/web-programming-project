/**********************************************************************************************
 * ITE5315 – Project *
 * I declare that this assignment is my own work in accordance with Humber Academic Policy. *
 * No part of this assignment has been copied manually or electronically from any other source * 
 * (including web sites) or distributed to other students. *
 * Group member Name: Moanisha Velayuthem, Sakshi Patel Student IDs: N01482302, N01551583 Date: 30-11-2022 *
 * ********************************************************************************************/

const User = require('../models/user');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
require('dotenv').config()

const signup = async (req, res) => {
    let user;
    let pwd = bcrypt.hashSync(req.body.password, 10)
    let data = {
        name: req.body.name,
        email: req.body.email,
        password: pwd
    }
    try {
        user = await User.create(data);
        return res.send("User created");
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const signin = async (req, res) => {
    let user;
    try {
        user = await User.findOne({
            name: req.body.name
        })
        if (!user || !user.comparePassword(req.body.password, user.password)) {
            return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
        }
        const accessToken = jwt.sign({ name: user.name }, process.env.SECRETKEY, { expiresIn: "1h" })
        return res.json(accessToken);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const verifyToken = (req, res, next) => {
    let token;
    const bearerHeadr = req.headers['authorization']
    if (typeof bearerHeadr != 'undefined') {
        const bearer = bearerHeadr.split(' ')
        const bearerToken = bearer[1]
        token = bearerToken
    }
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.name = decoded.name;
        next();
    });
};

module.exports = { verifyToken, signup, signin };