// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

const UserSchema = new Schema({
    name: {
        unique: true,
        type: String,
        lowercase: true
    },
    email:{
        unique: true,
        type: String,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }

}, { collection: 'users' });

UserSchema.methods.comparePassword = (password, original) => {
    return bcrypt.compareSync(password, original);
};

module.exports = mongoose.model('User', UserSchema);
