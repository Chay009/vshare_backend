const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const User = require('../model/User');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { VerifiedHTML } = require('../utils/htmlEmailVerified');

router.post('/', registerController.handleNewUser);

router.get("/:id/verify/:token", async (req, res) => {
    console.log(req.params.id);
    console.log(req.params.token);

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
            return res.status(400).send({ message: "Token has expired" });
        }

        const verifiedToken = jwt.verify(req.params.token, process.env.VERIFICATION_TOKEN);
console.log(verifiedToken);
        

        const existingUser = await User.findOne({ email:verifiedToken.email }).exec();
		console.log(existingUser);
        if (existingUser) {
            console.log("User already exists with this email. Try logging in.");
            return res.status(409).send({ message: "User already exists with this email" });
        }

        console.log(verifiedToken.email)

        const newUser = await User.create({
            "email": verifiedToken.email,
            "password": verifiedToken.password,
            "username": verifiedToken.username
        });

        console.log(newUser);
		newUser.verified=true;
		newUser.save();

        console.log("Email verified");
        res.status(200).send(VerifiedHTML(verifiedToken.username))

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
