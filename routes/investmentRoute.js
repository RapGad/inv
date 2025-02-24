const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {purchaseInvestment,getInvestmentplans,addInvestmentPlan} = require('../controller/investment-controller')



const router = express.Router();


router.post('/purchase',authMiddleware,purchaseInvestment)
router.get('/get/investment-plans',getInvestmentplans)




module.exports = router;