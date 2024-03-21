const Subscription = require("../model/Subscription")
const { sendPushNotification } = require("./sendPushNotifications")



const webpush = require('web-push');

const notifyWebAuthnUser=async(foundUser,loginDeviceInfo)=>{





    const subscriptionDetails= await Subscription.findOne({userID:foundUser._id})
    console.log(subscriptionDetails,"details")

    if(subscriptionDetails){
        subscriptionDetails.webAuthnPushSubscriptions.map(async(webAuthnPushSubscription)=>{
            
            console.log("the webauthn user subs",webAuthnPushSubscription.subscription)
            console.log(webAuthnPushSubscription.subscription.endpoint)
            const parsedUrl = new URL(webAuthnPushSubscription.subscription.endpoint);
           
            const audience = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
            console.log(audience)

            const vapidHeaders = webpush.getVapidHeaders(
                audience,
                'mailto: example@web-push-node.org',
                process.env.PUSH_PUBLIC_KEY,
                process.env.PUSH_PRIVATE_KEY,
                'aes128gcm'
              );

              console.log("vapid headers",vapidHeaders);

            await sendPushNotification(webAuthnPushSubscription.subscription,{title:"New Device Login Detected",body:loginDeviceInfo.os.name},vapidHeaders )
        })
    }
}

module.exports={notifyWebAuthnUser}