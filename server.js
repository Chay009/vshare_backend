require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3500; 





const { Crypto } = require("@peculiar/webcrypto");

const crypto = new Crypto();
//  working in my laptop but problem while deploying
// the simplewebauthn server uses webcrypto but may be it is not supporting so this is a polyfill which mimics the behaviour of webcrypto


// Connect to MongoDB
connectDB();

// custom middleware logger
// enable it during development 
// app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware for json 
app.use(express.json());
// built-in middleware to handle urlencoded form data

app.use(express.urlencoded({ extended: true }));



//middleware for cookies
app.use(cookieParser());

//session

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));




// routes


app.use('/posts',require('./routes/getPost'))
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/username', require('./routes/username'));
app.use('/forget-password', require('./routes/forgetpassword'));
app.use('/auth', require('./routes/auth'));





app.use('/refresh', require('./routes/refresh'));
app.use('/webauth',require('./routes/api/webauthn'))

app.use('/logout', require('./routes/logout'));


app.use('/create-post', require('./routes/createPost'));
app.use('/subscribe', require('./routes/subscribe'));
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));


app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});
app.listen(PORT, () =>{
     console.log(`Server running on port ${PORT}`)
    
   
   

    
});