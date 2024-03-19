const User = require('../model/User');
const {sendMail}=require('../utils/sendMails')
const crypto = require('node:crypto')
const jwt=require('jsonwebtoken')
const {mailOTP}=require('../utils/emailOTP')

const forgetpasswordEmail= async (req, res) => {
   
    // see which one is best sending id or email from client
    const { email} = req.body;
    if (!email) return res.status(400).json({ 'message': 'Email required' });

    try{
        const foundUser = await User.findOne({ email:email }).exec();
        
        if (!foundUser) return res.status(401).json({"message":"No user found with the email,register now"});

         // Create a buffer to hold the random bytes
        //  random bytes has no relation with string length
    const buffer = crypto.randomBytes(101);

    // Convert the buffer to a hex string
    const randomString = buffer.toString('hex');

  
console.log(randomString.slice(0,6));
               // create jwt token with user credentials
               const tokenPayload = {
                OTP:randomString.slice(0,6),
               
            };
            const jwtToken = jwt.sign(tokenPayload, process.env.FORGET_PASSWORD_TOKEN, { expiresIn: '5m' }); // Adjust expiration as needed
    
    
    
    
         
    
            const url = `${process.env.BASE_URL}/forget-password/${foundUser._id}change/${jwtToken}`;
            await sendMail(email,mailOTP(randomString.slice(0,6)));

        return res.json({token:jwtToken,email:email,id:foundUser._id});

    }catch(err){
        console.error(err);
        res.json({ 'message': err.message});
    }

   
   
 
}

module.exports = { forgetpasswordEmail};