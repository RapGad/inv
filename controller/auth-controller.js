const bcrypt = require('bcrypt');
const User = require('../models/user')
const jwt = require('jsonwebtoken');


const registerUser = async(req,res)=>{



    try {
        const { username,phoneNumber, password } = req.body;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;


        if(!username || !phoneNumber || !password){
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
            });
        }
    
        const checkIfUserExist = await User.findOne({
            $or: [{username},{phoneNumber}]
        })
    
        if(checkIfUserExist){
            return res.status(402).json({
                success: false,
                message: 'username or phone number already exist'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

    
    
        const createUser = new User({
            username,phoneNumber, password: hashedPassword
        });
    
    
        await createUser.save();
    
        if(createUser){
            console.log(createUser);
            return res.status(201).json({
                success: true,
                message: 'user created successful'
            })
    
        }
        else{
            return res.status(401).json({
                success: false,
                message: 'Unexpected error occured'
            })
    
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal error'
        })
        
    }

   

   



}


const loginUser = async(req,res)=>{

    try {
        const { username, password } = req.body

        const checkIfUserExist = await User.findOne({username})

        if(!checkIfUserExist){
            return res.status(404).json({
                success: false,
                message: 'User is not found'
            })
        }

        const isPasswordValid = await bcrypt.compare(password,checkIfUserExist.password);


        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                message: 'Password is incorrect'
            })

        }



        const accessToken = jwt.sign(
            {
                id: checkIfUserExist._id,
                username: checkIfUserExist.username,
                balance: checkIfUserExist.balance
            },
            process.env.MY_SECRET,
            {expiresIn: '24h'}
        )
        res.cookie('token', accessToken, {
            maxAge: 24*60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        })

        res.status(200).json({
            success: true,
            message: 'login successful',
            data: {
                username: checkIfUserExist.username,
            }
        })



        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'internal server error'
        })
        
    }


}

const logoutUser = async(req,res)=>{
    res.clearCookie('token')
    res.status(200).json({
        success: true,
        message: 'logout successful'
    })
}

const otpStore = {};

const sendOtp = async(req,res)=>{
    const { phone } = req.body;

    try {
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[phone] = otp; // Store OTP temporarily

        // Send OTP via Twilio
        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: twilioPhone,
            to: phone,
        });

        return res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error sending OTP" });
    }
}




module.exports = {registerUser, loginUser,logoutUser,sendOtp}