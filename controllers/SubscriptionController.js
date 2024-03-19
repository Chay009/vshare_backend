const Subscription = require('../model/Subscription');
const User = require('../model/User');
const { sendPushNotification } = require('../utils/sendPushNotifications');
const webpush = require('web-push');
const vapidKeys = {
  publicKey: process.env.PUSH_PUBLIC_KEY,
  privateKey: process.env.PUSH_PRIVATE_KEY,
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const handleSubscription = async (req, res) => {
  try {
    let { subscription, userID } = req.body;
    console.log(subscription);
    console.log(userID);

    // Check if the user exists
    let existingUser = await User.findById(userID);

    if (!existingUser) {
      console.log('User not found. Creating a new user.');

      // Create a new user with the given userID

    }

    // Check if subscription already exists for the given user and endpoint
    const existingSubscription = await Subscription.findOne({
      userID: userID,
      userSubscriptions:[subscription] 
    });

    if (existingSubscription) {
      console.log('Already subscribed');
      await sendPushNotification(subscription, {
        title: 'You have already subscribed',
        body: 'Although we appreciate you trying again',
      });
      return res.sendStatus(201);
    }

    // If no existing subscription, add the new subscription to the user
    const Subscriptionsfound = await Subscription.findOne({ userID: userID });

    console.log(Subscriptionsfound, 'userSub');

    const NotificationSubscriptions = Subscriptionsfound?.userSubscriptions || [];
    NotificationSubscriptions.push(subscription);

    console.log(NotificationSubscriptions);

    // Update the existing user subscriptions in the database
    await Subscription.findOneAndUpdate(
      { userID: userID },
      { userSubscriptions: NotificationSubscriptions },
      { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
    );

    await sendPushNotification(subscription, {
      title: 'Thank you for Subscribing!',
      body: 'Can"t wait to share content!!',
    });

    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    if (e.code === 11000) {
      // Duplicate key error
      console.error('Duplicate key error:', e.keyValue);
      return res.status(400).json({ error: 'Duplicate key error' });
    }
    console.error('Error:', e);

    res.sendStatus(500);
  }
};

module.exports = { handleSubscription };
