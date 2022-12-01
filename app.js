/**********************************************************************************************
 * ITE5315 – Project *
 * I declare that this assignment is my own work in accordance with Humber Academic Policy. *
 * No part of this assignment has been copied manually or electronically from any other source * 
 * (including web sites) or distributed to other students. *
 * Group member Name: Moanisha Velayuthem, Sakshi Patel Student IDs: N01482302, N01551583 Date: 30-11-2022 *
 * ********************************************************************************************/

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

//Connection with atlas movie database
mongoose.connect(database.url).
    then(() => {
        app.listen(port);
        console.log("App listening on port : " + port);
    })
    .catch(error => console.log(error));

//Handlebar input form
app.get('/api/getForm', (req, res) => {
    res.render('insertForm');
});

//Output of handlebar
app.post('/api/movies/getResult', getAllMoviesForm,function (req, res) {
    console.log(req.body)
   res.render('data',{movies:res.movie});
    // use mongoose to get all movies based on page, perpage limit and title
});

//get all movies data from db
app.get("/api/movies", getAllMovies, (req, res) => {
    res.json(res.movie);
});

async function getAllMoviesForm(req, res, next) {
    let movie;
    try {
        // use mongoose to get all movies in the database
        let perPage = 2;
        let page = 1;
        let title = {}
        if (req.body.perpage) {
            perPage = parseInt(req.body.perpage);
        }
        if (req.body.page) {
            page = parseInt(req.body.page);
        }
        if (req.body.title) {
            title = { title: req.body.title }
        }
        movie = await Movie
            .find(title)
            .sort({
                _id: 'asc'
            })
            .skip(perPage * (page - 1))
            .limit(perPage)
        if (movie == null) {
            return res.status(404).json({ message: "Cannot find movies" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.movie = movie;
    next();
}

async function getAllMovies(req, res, next) {
    let movie;
    try {
        // use mongoose to get all movies in the database
        let perPage = 2;
        let page = 1;
        let title = {}
        if (req.query.perPage) {
            perPage = parseInt(req.query.perPage);
        }
        if (req.query.page) {
            page = parseInt(req.query.page);
        }
        if (req.query.title) {
            title = { title: req.query.title }
        }
        movie = await Movie
            .find(title)
            .sort({
                _id: 'asc'
            })
            .skip(perPage * (page - 1))
            .limit(perPage)
        if (movie == null) {
            return res.status(404).json({ message: "Cannot find movies" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.movie = movie;
    next();
}

// get a movie with ID
app.get('/api/movies/:movie_id', function (req, res) {
    let id = req.params.movie_id;
    Movie.findById(id, function (err, movie) {
        if (err)
            res.send(err)
        res.json(movie);
    });
});

//Add new movie data
app.post('/api/movies', function (req, res) {
    // create mongoose method to create a new record into collection
    console.log(req.body);
    let data = {
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
    }
    Movie.create(data, function (err, movies) {
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


//update movie by id 
app.put('/api/movies/:movie_id', function (req, res) {
    // create mongose method to update an existing record into collection
    console.log(req.body);

    let id = req.params.movie_id;
    var data = {
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
    }

    // save the movie
    Movie.findByIdAndUpdate(id, data, function (err, movies) {
        if (err) throw err;
        res.send('Successfully updated!!- ' + movies);
    });
});



//delete movie by id
app.delete('/api/movies/:delmovie_id', function (req, res) {
    console.log(req.params.delmovie_id);
    let id = req.params.delmovie_id;
    Movie.deleteOne({
        _id: id
    }, function (err) {
        if (err)
            res.send(err);
        else
            res.send('Movie data has been sucessfully deleted!');
    });
});


// Wrong route - 404 page not found
app.use((req, res) => {
    res.status(404).send("Oops! Page Not Found!");
});


