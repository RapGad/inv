const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {getUserInvestments,getUserBalance,getTransactions} = require('../controller/user-details-controller')



const router = express.Router();

router.get('/user-details', authMiddleware,getUserInvestments)
router.get('/user-balance', authMiddleware,getUserBalance)
router.get('/transactions', authMiddleware,getTransactions)

module.exports = router;