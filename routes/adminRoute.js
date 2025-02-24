const express = require('express');
const {getUserinfo,completeWithdrawal,getWithdrawals,addInvestmentPlan}  = require('../controller/admin-controller')


const router = express.Router();

router.get('/get-user-details', getUserinfo)
router.post('/complete-withdrawal', completeWithdrawal)
router.get('/get-withdrawals', getWithdrawals)
router.post('/add-investment', addInvestmentPlan)


module.exports = router;