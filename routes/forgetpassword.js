const express = require('express');
const router = express.Router();
const {forgetpasswordEmail} = require('../controllers/forgetpassword');
const bcrypt = require('bcrypt');
const User = require('../model/User');
const jwt=require('jsonwebtoken')

router.post('/', forgetpasswordEmail);

router.post("/:id/change/:token", async (req, res) => {
    const {OTP, password}=req.body;
    console.log(req.params.id);
    console.log(req.params.token);
    console.log(OTP,password);

 
   
    if (!req.params.token || !req.params.id) {
        return res.status(404).send({ message: "invalid" });
    }
    try {
        const decodedToken = jwt.decode(req.params.token);

        if (!decodedToken) {
            return res.status(400).send({ message: "Invalid token" });
        }

        if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
            console.log("Token has expired");
            return res.status(400).send({ message: "OTP expired" });
        }

        const verifiedToken = jwt.verify(req.params.token, process.env.FORGET_PASSWORD_TOKEN);
console.log(verifiedToken);
        if(OTP!==verifiedToken.OTP){
            return res.status(400).json({ "message": "Wrong OTP or OTP expired" });
        }




        try {
            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Update the user's password in the database
            const updatedUser = await User.findByIdAndUpdate(req.params.id, { password: hashedPassword }, { new: true });
    
           console.log(updatedUser);
           
    
           return res.status(200).json({"message":"password updated successfully"});
        } catch (error) {
            throw new Error(`Error updating password: ${error.message}`);
        }
        

      

      

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;