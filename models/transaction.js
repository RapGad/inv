const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    status: {
        type: String,
        required: true,
        
    },
    phone: {
        type: String
    },
    network: {
        type: String
    },
    name: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true
})



module.exports = mongoose.model('Transaction', transactionSchema)