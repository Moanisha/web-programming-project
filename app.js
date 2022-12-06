/**********************************************************************************************
 * ITE5315 – Project *
 * I declare that this assignment is my own work in accordance with Humber Academic Policy. *
 * No part of this assignment has been copied manually or electronically from any other source * 
 * (including web sites) or distributed to other students. *
 * Group member Name: Moanisha Velayuthem, Sakshi Patel Student IDs: N01482302, N01551583 Date: 30-11-2022 *
 * ********************************************************************************************/

var express = require('express');
var path = require('path');
const exphbs = require('express-handlebars');
var app = express();

require('dotenv').config()

var bodyParser = require('body-parser');
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const { getAllMovies, getAllMoviesForm, getMoviesById, deleteMovieById, updateMovieById, addNewMovie } = require('./controllers/movieController');
const { verifyToken, signup, signin } = require('./controllers/userController');
const { initialize } = require('./controllers/dbController');

var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(express.static(path.join(__dirname, 'public')));
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', '.hbs');

//Start the server if the db connection is successful

const initializeDb = () => {
    initialize.then((isConnected) => {
        if (isConnected) {
            app.listen(port);
            console.log("App listening on port : " + port);
        }
    });
};

initializeDb();

//Signup
app.post("/api/user/signup", signup);

//Signin to get the token
app.get("/api/user/signin", signin);

//Handlebar input form
app.get('/api/getForm', (req, res) => {
    res.render('insertForm');
});

//Output of handlebar
app.post('/api/movies/getResult', getAllMoviesForm);

//get all movies data from db
app.get("/api/movies", [verifyToken], getAllMovies);

// get a movie with ID
app.get('/api/movies/:movie_id', [verifyToken], getMoviesById);

//Add new movie data
app.post('/api/movies', [verifyToken], addNewMovie);

//update movie by id 
app.put('/api/movies/:movie_id', [verifyToken], updateMovieById);

//delete movie by id
app.delete('/api/movies/:delmovie_id', [verifyToken], deleteMovieById);

// Wrong route - 404 page not found
app.use((req, res) => {
    res.status(404).send("Oops! Page Not Found!");
});


