const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: "Pending",
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    network: {
        type: String,
        required: true,
    },  
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Withdraw", withdrawSchema);