// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
BookSchema = new Schema({
    plot : String,
    genres : {type:Array, "default":[]},
	runtime : Number,
    cast: {type:Array, "default":[]},
    num_mflix_comments: Number,
    poster: String,
    title:String,
    fullplot: String,
    languages:{type:Array, "default":[]},
    released: Date,
    directors: {type:Array, "default":[]},
    writers:{type:Array, "default":[]},
    awards:{type:Object, "default":{}},
    lastUpdated: String,
    year: Number,
    imbd: {type:Object, "default":{}},
    countries:  {type:Array, "default":[]},
    type: String,
    tomatoes: {type:Object, "default":{}}
});
module.exports = mongoose.model('Book', BookSchema);
