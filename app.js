var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var app = express();
const exphbs = require('express-handlebars');
var database = require('./config/atlas-database');
var bodyParser = require('body-parser');
var Movie = require('./models/movie');
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')


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



mongoose.connect(database.url).
    catch(error => handleError(error));


//get all movies data from db
app.get('/api/movies', function (req, res) {
    // use mongoose to get all movies in the database
    let perPage = 2;
    let page = 1;
    Movie.find()
        .limit(perPage)
        .skip(perPage * page)
        .sort({
            _id: 'asc'
        }).exec(function (err, movies) {
            // if there is an error retrieving, send the error otherwise send data
            if (err)
                res.send(err)
            console.log(movies)
            res.send(movies); // return all movies in JSON format
        });
});

// get a movie with ID
app.get('/api/movies/:movie_id', function (req, res) {
    let id = req.params.movie_id;
    Movie.findById(id, function (err, movie) {
        if (err)
            res.send(err)
        res.json(movie);
    });
});


app.post('/api/movies', function (req, res) {

    // create mongoose method to create a new record into collection
    console.log(req.body);

    Movie.create({
        plot: req.body.plot,
        genres: req.body.genres,
        runtime: req.body.runtime,
        cast: req.body.cast,
        poster: req.body.poster,
        num_mflix_comments: req.body.num_mflix_comments,
        title: req.body.title,
        countries: req.body.countries,
        languages: req.body.languages,
        released: req.body.released,
        directors: req.body.directors,
        rated: req.body.rated,
        awards: req.body.awards,
        lastupdated: req.body.lastupdated,
        year: req.body.year,
        imdb: req.body.imdb,
        type: req.body.type,
        tomatoes: req.body.tomatoes
    }, function (err, movies) {
        if (err)
            res.send(err);

        // get and return all the movies after newly created movie record
        Movie.find(function (err, movies) {
            if (err)
                res.send(err)
            res.json(movies);
        });
    });

});

app.listen(port);
console.log("App listening on port : " + port);
