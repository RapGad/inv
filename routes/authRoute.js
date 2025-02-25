const express = require('express');
const { registerUser, loginUser,logoutUser } =  require('../controller/auth-controller');



const router = express.Router();


router.post('/register', registerUser);
router.post('/login',loginUser);
router.get('/logout',logoutUser);
router.post('/send-otp',sendOtp)



module.exports = router;