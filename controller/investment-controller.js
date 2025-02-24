const InvestmentPlans = require('../models/investmentplans')
const Investment = require('../models/investment')
const User = require('../models/user')

const purchaseInvestment = async(req,res)=>{
    try {
        const id = req.userInfo.id
        const {investmentId} = req.body

        const userExist = await User.findById(id)
        const plan = await InvestmentPlans.findById(investmentId)


        if(!userExist){
            return res.status(404).json({
                success: false,
                message: 'User is not found'
            })
        }
        if(!plan){
            return res.status(404).json({
                success: false,
                message: 'Invalid Plan Selection'
            })
        }

        if(userExist.balance < plan.amount){
            return res.status(400).json({
                success: false,
                message: 'Insufficient funds'
            })
        }

        const investment = new Investment({
            name: plan._id,
            user: id,
            amountInvested: plan.amount,
            returns: plan.amount * 0.12,
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + Number(plan.Duration))),
        });


        await investment.save();

        const updateBalance = await User.findOneAndUpdate(
            { _id: id },
            { $inc: { balance: -plan.amount } },
            { new: true }
        );

        if (!updateBalance) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Investment created successfully'
        })


        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
        
    }
}


const getInvestmentplans = async(req,res)=>{


    const getInvestments = await InvestmentPlans.find({})

    if(getInvestments.length === 0){
        return res.status(404).json({
            success: false,
            message: 'Investment plans not found'
        })
    }

    return res.status(200).json({
        success: true,
        data: getInvestments
    })
}




module.exports = {purchaseInvestment,getInvestmentplans}
