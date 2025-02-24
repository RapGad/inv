const jwt = require('jsonwebtoken');


const authMiddleware = async(req,res,next)=>{
    console.log('Middleware is running')
    console.log('Show req.cookies',req.cookies)
    const token = req.cookies?.token;
    console.log(token)



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