const Subscription = require("../model/Subscription")
const { sendPushNotification } = require("./sendPushNotifications")



const webpush = require('web-push');

const notifyWebAuthnUser=async(foundUser,loginDeviceInfo)=>{





    const subscriptionDetails= await Subscription.findOne({userID:foundUser._id})
    console.log(subscriptionDetails,"details")

    if(subscriptionDetails){
        subscriptionDetails.webAuthnPushSubscriptions.map(async(webAuthnPushSubscription)=>{
            
            console.log("the webauthn user subs",webAuthnPushSubscription.subscription)
            const parsedUrl = new URL(webAuthnPushSubscription.subscription);
           
            const audience = parsedUrl.protocol + '//' +
              parsedUrl.hostname;

            const vapidHeaders = webpush.getVapidHeaders(
                audience,
                // 'mailto: example@web-push-node.org',
                vapidDetails.publicKey,
                vapidDetails.privateKey,
                'aes128gcm'
              );

              console.log("vapid headers",vapidHeaders);

            await sendPushNotification(webAuthnPushSubscription.subscription,{title:"New Device Login Detected",body:loginDeviceInfo.os.name},vapidHeaders )
        })
    }
}

module.exports={notifyWebAuthnUser}