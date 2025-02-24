const Transaction = require("../models/transaction");
const User = require("../models/user");
const mongoose = require("mongoose");


const sendTransaction = async (type, amount, status,phone,network,name, id) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const transaction = new Transaction({
            type,
            amount,
            status,
            user: id,
        });
        await transaction.save({ session });
        await User.findByIdAndUpdate(id, { $inc: { balance: amount } }, { session });
        await session.commitTransaction();
        session.endSession();

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
    }
};


module.exports = sendTransaction
