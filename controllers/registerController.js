const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { uniqueNamesGenerator,names,NumberDictionary} = require('unique-names-generator');
const {accountVerification}=require('../utils/emailAccountVerification')
const {sendMail}=require('../utils/sendMails')
const handleNewUser = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'email and password are required.' });

    // check for duplicate usernames in the db
    const foundUser = await User.findOne({ email:email }).exec();
    console.log(foundUser)
    if (foundUser) return res.status(409).json({"message":"There is already an account registered with this mail, try login"}); //Conflict
    if(foundUser&&foundUser.verified) return res.status(409).json({"message":"account already verified login now"}); 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);
        const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
        console.log(email.split('@')[0].slice(0,4))

        const configName = {
            dictionaries: [[email.split('@')[0].slice(0,4)],names,numberDictionary],
            length: 3,
            separator: '',
            style: 'capital'
          };
          const randomName = uniqueNamesGenerator(configName);

          console.log(randomName);


          // create jwt token with these credentials
 
             // create jwt token with user credentials
        const tokenPayload = {
            email: email,
            password: hashedPwd,
            username: randomName
        };
        const jwtToken = jwt.sign(tokenPayload, process.env.VERIFICATION_TOKEN, { expiresIn: '5m' }); // Adjust expiration as needed




     

		const url = `${process.env.BASE_URL}/register/${Date.now()}/verify/${jwtToken}`;
		await sendMail(email,accountVerification(url,randomName),{from:"Vshare Team",subject:"Please confirm your Vshare account"});

       

       return res.status(201).json({ 
            'message': `Verification mail sent check now!`,
            
            
                 });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };