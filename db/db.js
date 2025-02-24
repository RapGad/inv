const mongoose = require('mongoose');


const connectToDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database is connected");

    }catch (error){
        console.log(error);
       
    }
};


module.exports = connectToDb;