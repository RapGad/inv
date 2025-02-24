const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phoneNumber:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0.0
    }
},)


module.exports = mongoose.model('User', userSchema)