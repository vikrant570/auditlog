const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 2
    },
    email :{
        type : String,
        required : true,
        match : /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        unique : true
    },
    password : {
        type :String,
    }
});

const User = mongoose.model("users", userSchema);

module.exports = User;