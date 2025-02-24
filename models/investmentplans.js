 const mongoose = require("mongoose");

const investmentPlansSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    returns: {
        type: Number,
        required: true,
    },
    Duration: {
        type: String,
        required: true,
    },
});



module.exports = mongoose.model("InvestmentPlans", investmentPlansSchema)