const express = require('express');
const router = express.Router();

const {handleSubscription}=require('../controllers/SubscriptionController');



router.post('/', handleSubscription);

module.exports = router;