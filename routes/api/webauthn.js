const express = require('express');
const router = express.Router();

const {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  generateRegistrationOptions,
  verifyRegistrationResponse,
} = require('@simplewebauthn/server');
const { isoBase64URL, isoUint8Array } = require('@simplewebauthn/server/helpers');
const User = require('../../model/User');

const Subscription = require('../../model/Subscription');


const { createTokens } = require('../../utils/createTokens');
const { handleTokenRotation } = require('../../utils/handleTokenRotation');
const { saveRefreshTokens } = require('../../utils/saveRefreshToken');
const { notifyWebAuthnUser } = require('../../utils/notifyWebAuthnUser');
const { getClientLocation } = require('../../services/iplocation');






// Initialize express session


// Readable title for your website
// during dev
// const rpName = 'SimpleWebAuthn Example';
// // A unique identifier for your website
// const rpID = 'localhost';
// // The URL at which registrations and authentications should occur
// const origin = `http://${rpID}:3000`;

// Readable title for your website
const rpName = process.env.RP_NAME;
// A unique identifier for your website
const rpID = process.env.RP_ID;
console.log(rpID)
// The URL at which registrations and authentications should occur
const origin =process.env.ORIGIN;
// Variables to store challenges associated with user IDs


let registrationChallenges = {};
let authenticationChallenges = {};



router.get('/generate-registration-options/:userID', async (req, res) => {
  const { userID } = req.params;
  console.log(rpID)

  try {
    const user = await User.findOne({ _id: userID });

    if (!user) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: user._id,
      userName: user.username,
      attestationType: 'none',
      excludeCredentials: user.webAuthnCredentials?.map((authenticator) => ({
        id: authenticator.credentialID,
        type: 'public-key',
        transports: authenticator.transports,
      })),
      authenticatorSelection: {
        residentKey: 'discouraged',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
      supportedAlgorithmIDs: [-7, -257],
    });

    // Store the challenge associated with the user
    registrationChallenges[userID] = options.challenge;

    console.log('Registration Options sent:', options);
    res.send(options);
  } catch (error) {
    console.error('Error generating registration options:', error);
    res.status(500).send('Internal server error');
  }
});

router.post('/verify-registration/:userID', async (req, res) => {
  const {clientRegistrationOptions,regUserSubscription} = req.body;

  if(!clientRegistrationOptions || !regUserSubscription) {
    console.log(clientRegistrationOptions ,"or",regUserSubscription,"missing");
    return res.status(401).json({"message": "missing options or subscription"})

  }

  console.log(regUserSubscription);
  
  const { userID } = req.params;

  try {
    const user = await User.findOne({ _id: userID });

    const storedRegChallenge = registrationChallenges[userID];

    if (!storedRegChallenge) {
      console.error('No stored reg challenge found for this user, generate reg options again');
      return res.status(400).send({
        error: 'No stored reg challenge found for this user, generate reg options again',
      });
    }

    const verifyOptions = {
      response:clientRegistrationOptions,
      expectedChallenge: storedRegChallenge || '',
      expectedOrigin: origin,
      expectedRPID: rpID,
    };

    const verification = await verifyRegistrationResponse(verifyOptions);
    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      const { credentialPublicKey, credentialID, counter } = registrationInfo;

      const existingDeviceCredentials = user.webAuthnCredentials.find((deviceCredentials) =>
        isoUint8Array.areEqual(deviceCredentials.credentialID, credentialID)
      );

      console.log(`Credentials: ${existingDeviceCredentials}`);
      if (!existingDeviceCredentials) {
        const newDeviceCredential = {
          credentialPublicKey,
          credentialID,
          counter,
          transports: clientRegistrationOptions.response.transports,
        };

        user.webAuthnCredentials.push(newDeviceCredential);

        // since webauthncredentials filled mongoose model pre saving sets iswebauthnregistered to true

        // check that there is already sub with this device

            // Create a new subscription object
            const newSubscription = new Subscription({
              userID: userID,
              webAuthnPushSubscriptions: [
                
                {
                  credentialID: credentialID.toString('base64'),

                  subscription: regUserSubscription
              }

            ]
          });
      
        console.log(await newSubscription.save())

        await user.save();

        console.log('Registration successful:', verification);
        res.send(verification);
      }
    } else {
      console.error('Failed registration verification');
      res.status(400).send('Failed registration verification');
    }
  } catch (error) {
    console.error('Error during registration verification:', error);
    res.status(500).send('Internal server error');
  } finally {
    // Clear the challenge associated with the user
    delete registrationChallenges[userID];
  }
});

router.get('/generate-authentication-options/:userID', async (req, res) => {

  // we are using unit8Array notbecause of webauthn but it is because of mongodb which stores the info in binary hence 
  // converting it
  const { userID } = req.params;

  try {
    const user = await User.findOne({ _id: userID });
    
    const myID=user.webAuthnCredentials[0];
    const allowCredentials = user.webAuthnCredentials?.map((deviceCredentials) => {
      const id = new Uint8Array(deviceCredentials.credentialID.buffer);
      const type = 'public-key';
      const transports = deviceCredentials.transports;

      return { id, type, transports };
    });
    console.log(myID.credentialID); 
    const options = await generateAuthenticationOptions({
      rpID,
      timeout: 60000,
      allowCredentials,
      userVerification: 'preferred',
    })
   


    // Store the challenge associated with the user
    authenticationChallenges[userID] = options.challenge;

    console.log('Authentication Options sent:', options);
    res.send(options);
  } catch (error) {
    console.error('Error generating authentication options:', error);
    res.status(500).send('Internal server error');
  }
});

router.post('/verify-authentication/:userID', async (req, res) => {
  const cookies = req.cookies;
  const { userID } = req.params;
 console.log(req.body);
  const {loginDeviceInfo,clientAuthenticationOptions:body} = req.body
console.log(loginDeviceInfo);
  console.log(body.rawId);

  const storedAuthChallenge = authenticationChallenges[userID];

  if (!storedAuthChallenge) {
    console.error('No stored auth challenge found for this user, generate auth options again');
    return res.status(400).send({
      error: 'No stored auth challenge found for this user, generate auth options again',
    });
  }

  try {
    const foundUser = await User.findOne({ _id: userID });

    // Convert body.id to Uint8Array
    const bodyrawIdUint8Array = isoBase64URL.toBuffer(body.rawId);

    // Find the authenticator with matching credentialID and convert to Uint8Array
    const userAuthenticator = foundUser.webAuthnCredentials.find((authenticator) =>
      isoUint8Array.areEqual(new Uint8Array(authenticator.credentialID.buffer), bodyrawIdUint8Array)
    );

    if (!userAuthenticator) {
      console.error('Authenticator not found for the given credentialID');
      return res.status(400).send('Authenticator not found for the given credentialID');
    }

    // Convert credentialID and credentialPublicKey to Uint8Array
    userAuthenticator.credentialID = new Uint8Array(userAuthenticator.credentialID.buffer);
    userAuthenticator.credentialPublicKey = new Uint8Array(userAuthenticator.credentialPublicKey.buffer);
   
   
   
    const verifyOptions = {
      response: body,
      expectedChallenge: storedAuthChallenge || '',
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
      authenticator:userAuthenticator
        };

 
    const verification = await verifyAuthenticationResponse(verifyOptions);
    const { verified, authenticationInfo } = verification;
    const {newCounter}=authenticationInfo;


    if (verified && authenticationInfo) {
      await User.updateOne(
        { _id: userID, 'webAuthnCredentials.credentialID': isoBase64URL.toBuffer(body.rawId) },
        { $set: { 'webAuthnCredentials.$.counter': newCounter } }
      );

      // Clear the challenge associated with the user
      delete authenticationChallenges[userID];

      console.log('Authentication successful:', verification);


      const{accessToken,newRefreshToken,roles}=createTokens(foundUser);
       
      const modifiedUserRefreshTokenArray = await handleTokenRotation(cookies,res,foundUser);
  
      // get location of client based on req ip
      const clientLocation=await getClientLocation();
  
      // Saving refreshToken with current user || if multiple logins saving all refresh tokens
     await saveRefreshTokens(foundUser,modifiedUserRefreshTokenArray,newRefreshToken,loginDeviceInfo,clientLocation);
  
      console.log("token: " + newRefreshToken)
         // Creates Secure Cookie with refresh token since we are assigning a new token we must be careful hence implemented token rotatiion


             //  fixing this one error with headers also adjsut after how many  refresh tokens need to be present to send mail
    await notifyWebAuthnUser(foundUser,loginDeviceInfo)
    // fisrt time token allocated means new user 

// not sending him for his login

if(foundUser.refreshTokens.length >0)
{

    await sendMail(email,NewLogin(foundUser.username,loginDeviceInfo,clientLocation),{from:"Vshare Security Team",subject:"Security Alert: New Login to Your Account"})
}


res.cookie('jwt',newRefreshToken,{httpOnly:false,secure:true,sameSite:"none",maxAge:24 * 60 * 60 * 1000 });



             

       
   



           
   
  // Log the response headers
console.log('Response Headers:', res.getHeaders());
             
      // Send authorization roles and access token to user
      res.status(200).json({ roles, accessToken,foundUser, verification});
      
    } else {
      console.error('Failed authentication verification');
      res.status(400).send('Failed authentication verification');
    }
  } catch (error) {
    console.error('Error during authentication verification:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
