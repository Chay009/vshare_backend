const express = require('express');
const router = express.Router();
const usernameController = require('../controllers/usernameController');

router.post('/', usernameController.handleUsername);

module.exports = router;