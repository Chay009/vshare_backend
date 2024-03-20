const webpush = require('web-push');

const dayjs=require('dayjs');
const relativeTime=require('dayjs/plugin/relativeTime');
const { reduceRight } = require('lodash');
dayjs.extend(relativeTime)


// Function to send a notification
const sendPushNotification = async (subscription, message,vapidHeaders) => {
    try {
        
        message.body += ` . ${dayjs(new Date()).fromNow(true)}`;

      
        console.log(`${subscription} received notification sending..`);

        // some times you get error like  expired or unsubscribed it is due to service worker changed subscription not passed correctly to sendNotification
        await webpush.sendNotification(subscription, JSON.stringify(message),{
            headers: vapidHeaders
          });
        console.log('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = { sendPushNotification };
