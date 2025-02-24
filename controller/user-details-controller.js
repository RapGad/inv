
const Investment = require('../models/investment')
const User = require('../models/user')
const Transaction = require('../models/transaction')
const getUserInvestments = async(req,res)=>{
    try {
        const id = req.userInfo.id
        const userInvestments = await Investment.find({user:id})


        return res.status(200).json({ 
            success: true,
            data: userInvestments
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const getUserBalance = async(req,res)=>{
    try {
        const id = req.userInfo.id
        const userBalance = await User.findById(id)
        
        return res.status(200).json({ 
            success: true,
            data: userBalance.balance
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}


const getTransactions = async(req,res)=>{
    try {
        const id = req.userInfo.id
        const userTransactions = await Transaction.find({user:id}).lean()
        
        return res.status(200).json({ 
            success: true,
            data: userTransactions
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}


module.exports = {getUserInvestments,getUserBalance, getTransactions}