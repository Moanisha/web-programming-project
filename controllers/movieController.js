/**********************************************************************************************
 * ITE5315 – Project *
 * I declare that this assignment is my own work in accordance with Humber Academic Policy. *
 * No part of this assignment has been copied manually or electronically from any other source * 
 * (including web sites) or distributed to other students. *
 * Group member Name: Moanisha Velayuthem, Sakshi Patel Student IDs: N01482302, N01551583 Date: 30-11-2022 *
 * ********************************************************************************************/

const Movie = require('../models/movie');
require('dotenv').config()

const getAllMovies = async (req, res) => {
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
        return res.status(200).json(movie)
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getAllMoviesForm = async (req, res) => {
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
        return res.render('data', { movies: movie });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getMoviesById = async (req, res) => {
    let id = req.params.movie_id;
    let movie;
    try {
        movie = await Movie.findById(id);
        if (movie == null) {
            return res.status(404).json({ message: "Cannot find movies" });
        }
        return res.status(200).json(movie);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const deleteMovieById = async (req, res) => {
    let movie;
    let id = req.params.delmovie_id;
    try {
        movie = await Movie.deleteOne({
            _id: id
        })
        if (movie.deletedCount == 0) {
            return res.status(404).send("Cannot find movie with ID");
        } else {
            return res.send('Movie data has been sucessfully deleted!');
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const updateMovieById = async (req, res) => {
    let movie;
    // create mongose method to update an existing record into collection
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
    try {
        movie = await Movie.findByIdAndUpdate(id, data);
        return res.status(200).send("Movie has been updated");
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const addNewMovie = async (req, res) => {
    let movie;
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
    try {
        movie = await Movie.create(data);
        return res.send("Movie created");
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}
module.exports = { getAllMovies, getAllMoviesForm, getMoviesById, deleteMovieById, updateMovieById, addNewMovie };