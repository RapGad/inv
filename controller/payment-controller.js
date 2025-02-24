const crypto = require("crypto");
const axios = require("axios");
const User = require('../models/user')
const sendTransaction = require('../controller/transaction-controller')
const Transaction = require('../models/transaction')
const paymentHandler = async(req, res) => {
    const paystackSignature = req.headers["x-paystack-signature"];
    const hash = crypto.createHmac("sha512", process.env.PAYSTACK_TEST_SECRET_KEY).update(JSON.stringify(req.body)).digest("hex");

  
/* ß */

    if (hash !== paystackSignature) {
      return res.status(400).send("Invalid signature");
    }
  
    const event = req.body;
    if (event.event === "charge.success") {
      const { id, amount } = event.data.metadata;
      sendTransaction('Deposit',amount,'Completed',id)

      res.status(200).send("Success");
    }
    else {
      res.status(400).send("Event not recognized");
    }
}


const initiatePayment = async (req, res) => {
    try {
        const id = req.userInfo.id
        const { amount} = req.body;

        const email = 'jeefa@example.com';


        // Call Paystack API to create a payment session
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {   email,
                amount: amount * 100, // Convert to kobo
                currency: "GHS",
                metadata: { id, amount },
                callback_url: "https://localhost:5173/dashboard/content", // Redirect after payment
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return res.json({ paymentUrl: response.data.data.authorization_url });
    } catch (error) {
        console.error("Error initiating payment:", error.response?.data || error.message);
        return res.status(500).json({ error: "Payment initialization failed" });
    }
};


const withdraw = async (req, res) => {
    try {
        const { amount, phone, network, name } = req.body;


        const id = req.userInfo.id

        const user = await User.findById(id)

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        if(user.balance < amount){
            return res.status(400).json({
                success: false,
                message: 'Insufficient funds'
            })
        }

        const createTransaction = await Transaction.create({
            type: "Withdraw",
            amount,
            status: "Pending",
            phone,
            network,
            name,
            user: id,
        })

        if(!createTransaction){
            return res.status(400).json({
                success: false,
                message: 'Withdrawal could not be initiated'
            })
        }
       
    
        res.status(200).json({
          success: true,
          data: {message: "Withdrawal initiated"},
        });


        
      } catch (error) {
        console.error("Error processing withdrawal:", error.response?.data || error);
        res.status(500).json({ error: "Withdrawal failed" });
      }
    }





module.exports = {paymentHandler,initiatePayment,withdraw}