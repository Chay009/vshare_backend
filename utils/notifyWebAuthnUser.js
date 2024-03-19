const Subscription = require("../model/Subscription")
const { sendPushNotification } = require("./sendPushNotifications")

const notifyWebAuthnUser=async(foundUser,loginDeviceInfo)=>{
    const subscriptionDetails= await Subscription.findOne({userID:foundUser._id})
    console.log(subscriptionDetails,"details")

    if(subscriptionDetails){
        subscriptionDetails.webAuthnPushSubscriptions.map(async(webAuthnPushSubscription)=>{
            
            console.log(webAuthnPushSubscription.subscription)
            await sendPushNotification(webAuthnPushSubscription.subscription,{title:"New Device Login Detected",body:loginDeviceInfo.os.name})
        })
    }
}

module.exports={notifyWebAuthnUser}