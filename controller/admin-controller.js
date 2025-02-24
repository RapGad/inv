const User = require('../models/user')
const Withdraw = require('../models/withdraw')
const InvestmentPlans = require('../models/investmentplans')
const Transaction = require('../models/transaction')
const mongoose = require('mongoose')



const getUserinfo = async(req,res)=>{
    try {
        const user = await User.find({}, 'username balance').lean()
        return res.status(200).json({ 
            success: true,
            data: user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}


const completeWithdrawal = async(req,res)=>{

    try {
        const {id} = req.body

        const updateWithdrawal = await Transaction.findOneAndUpdate({
            _id: id
        }, {
            $set: {
                status: "Completed"
            }
        }, {
            new: true
        })

        console.log('completed',updateWithdrawal)
        console.log('amount',updateWithdrawal.amount)

        if(!updateWithdrawal){
            return res.status(400).json({
                success: false,
                message: 'Withdrawal could not be completed'
            })
        }

        const updateUserBalance = await User.updateOne({
            _id: updateWithdrawal.user
        }, {
            $inc: {
                balance: -Number(updateWithdrawal.amount)
            }
        })

        if(!updateUserBalance){
            return res.status(400).json({
                success: false,
                message: 'Withdrawal could not be completed'
            })
        }


    return res.status(200).json({
        success: true,
        message: 'Withdrawal completed successfully'
    })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }

    

}


const getWithdrawals = async(req,res)=>{
    try {
        const transactions = await Transaction.find({
            type: "Withdraw",
            status: "Pending"
        }).sort({ createdAt: -1 }).lean()
        return res.status(200).json({ 
            success: true,
            data: transactions
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
const addInvestmentPlan = async(req,res)=>{


    try {
        const { name, amount, returns ,Duration } = req.body
        const createPlan = new InvestmentPlans({
            name,
            amount,
            returns,
            Duration
        })


        const result = await createPlan.save()
        console.log(result)

        return res.status(200).json({
            success: true,
            data: result
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
        
    }
}



module.exports = {getUserinfo,completeWithdrawal,getWithdrawals,addInvestmentPlan}