const User = require('../model/User');


const handleUsername= async (req, res) => {
   
    // see which one is best sending id or email from client
    const { email} = req.body;
    if (!email) return res.status(400).json({ 'message': 'Email and password are required.' });

    try{
        const foundUser = await User.findOne({ email:email }).exec();
        
        if (!foundUser) return res.status(401).json({"message":"No user found with this mail,register now"});

        return res.json({id:foundUser.id,username:foundUser.username, email:foundUser.email,isWebauthnReg:foundUser.isWebAuthnRegistered})

    }catch(err){
        console.error(err);
        res.json({ 'message': err.message});
    }
 //Unauthorized  // no user found 
    // evaluate password 
   
   
 
}

module.exports = { handleUsername};