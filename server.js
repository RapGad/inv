require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const authRouter = require('./routes/authRoute')
const paymentRouter = require('./routes/payment-route')
const rateLimit = require('express-rate-limit');
const {paymentHandler} = require('./controller/payment-controller')
const userDetailsRouter = require('./routes/user-details-route')
const investmentRouter = require('./routes/investmentRoute')
const adminRouter = require('./routes/adminRoute')
const twilio = require('twilio');



const app = express();
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);



const PORT = process.env.PORT;
app.use(express.json())

app.use(express.urlencoded({ extended: true }));
const allowedOrigins = process.env.CLIENT_URL.split(',');

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200 // ✅ Required for cookies/auth
}));

/* app.use(cors({
    origin: allowedOrigins,  // Only allow frontend domain
    credentials: true,  // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
})); */
app.options(allowedOrigins, cors());


app.set('trust proxy', 1)

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests, please try again later.",
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
  });
  
app.use(apiLimiter);
app.use(cookieParser());


     

connectToDb();


app.use('/user/auth',authRouter);
app.use('/payment',paymentRouter)
//app.use('/payment/paystack/webhook',paymentHandler)
app.use('/get',userDetailsRouter)
app.use('/investment',investmentRouter)
app.use('/admin',adminRouter)



app.listen(PORT, ()=>{
    console.log('server is running')
})