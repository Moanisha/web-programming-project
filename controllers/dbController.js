/**********************************************************************************************
 * ITE5315 – Project *
 * I declare that this assignment is my own work in accordance with Humber Academic Policy. *
 * No part of this assignment has been copied manually or electronically from any other source * 
 * (including web sites) or distributed to other students. *
 * Group member Name: Moanisha Velayuthem, Sakshi Patel Student IDs: N01482302, N01551583 Date: 30-11-2022 *
 * ********************************************************************************************/

var mongoose = require('mongoose');
require('dotenv').config()

const initialize =
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => {
            console.log("Successfully connected to DB");
            return true;
        })
        .catch(error => {
            console.log("Error connecting to the database", error)
            return false;
        });

module.exports = { initialize };