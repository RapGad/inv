const jwt = require('jsonwebtoken');


const authMiddleware = async(req,res,next)=>{
    const token = req.cookies?.token;



    if(!token){
        return res.status(401).json({
            success: false,
            message: 'access denied'
        })
    }


    try {
        const decodedInfo = jwt.verify(token, process.env.MY_SECRET);
        req.userInfo = decodedInfo;

        next();
        
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: 'internal server error'
        })
        
    }
}


module.exports = authMiddleware