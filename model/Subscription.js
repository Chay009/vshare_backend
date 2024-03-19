const mongoose = require('mongoose')

// Define the schema with correct data types

const subscriptionSchema = new mongoose.Schema({
  endpoint: {
      type: String
  },
  expirationTime: {
      type: Date,
      default: null
  },
  keys: {
      p256dh: String,
      auth: String
  }
});


const schema = new mongoose.Schema({
    
    userID: {
      type: String,
      
    },
    userSubscriptions: [subscriptionSchema],
    

    webAuthnPushSubscriptions: [{
      credentialID: {
          type: String,
          required: true
      },
      subscription: {
        type:subscriptionSchema,
        required: true

      }
  }]
  });
  
  
  // Create the model
  const Subscription = mongoose.model('Subscription', schema);
  
module.exports = Subscription;