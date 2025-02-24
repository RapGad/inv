const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {initiatePayment,withdraw} = require('../controller/payment-controller');



const router = express.Router();

router.post('/initiate', authMiddleware, initiatePayment)
router.post('/withdraw', authMiddleware,withdraw)



module.exports = router;
