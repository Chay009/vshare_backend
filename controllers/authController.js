const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createTokens } = require('../utils/createTokens');





const { saveRefreshTokens } = require('../utils/saveRefreshToken');
const { handleTokenRotation } = require('../utils/handleTokenRotation');
const Subscription = require('../model/Subscription');
const { sendPushNotification } = require('../utils/sendPushNotifications');
const { notifyWebAuthnUser } = require('../utils/notifyWebAuthnUser');
const { sendMail}=require('../utils/sendMails');
const{IPtolocation}=require('../services/iplocation');
const { NewLogin } = require('../utils/emailNewLogin');
const handleLogin = async (req, res) => {
    try{
    
    
    const cookies = req.cookies;
    const clientIP=req.ip
    


 
   
    console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
    // see which one is best sending id or email from client
    const { email, pwd,loginDeviceInfo} = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' });


    const foundUser = await User.findOne({ email:email }).exec();
    if (!foundUser) return res.status(401).json({"message":"No user found with this email"}); //Unauthorized  // no user found 
    // evaluate password 
       // Check if user's email is verified
       if (!foundUser.verified) {
        return res.status(401).json({"message":'Email not verified'});
    }
    
    const match = await bcrypt.compare(pwd, foundUser.password);

    console.log(match);
   
    if (match) {

        // ua parser
        if(!loginDeviceInfo){
            console.log("device Info missing")

        }
        else{
            console.log(loginDeviceInfo);
        }

            
    const{accessToken,newRefreshToken,roles}=createTokens(foundUser);
       
    const modifiedUserRefreshTokenArray = await handleTokenRotation(cookies,res,foundUser);

    const clientLocation=await IPtolocation(clientIP);
    console.log(clientLocation,"location")

    // Saving refreshToken with current user || if multiple logins saving all refresh tokens
   await saveRefreshTokens(foundUser,modifiedUserRefreshTokenArray,newRefreshToken,loginDeviceInfo,clientLocation);

    // Creates Secure Cookie with refresh token since we are assigning a new token we must be careful hence implemented token rotatiion
    
   
    //  fixing this one error with headers also adjsut after how many  refresh tokens need to be present to send mail
    await notifyWebAuthnUser(foundUser,loginDeviceInfo)
// fisrt time token allocated means new user 

// not sending him for his login

    // await sendMail(email,NewLogin(foundUser.username,loginDeviceInfo,clientLocation))

  
    res.cookie('jwt', newRefreshToken, {httpOnly: false, secure: true,  sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});
           
    // Send authorization roles and access token to user
    res.status(200).json({ roles, accessToken,foundUser });

} else {
       return res.status(401).json({"message":"Incorrect Password,try again"}); // incorrect password 
    }
} catch (e) {
    console.error(e);
    return res.sendStatus(500); //
}}

module.exports = { handleLogin };