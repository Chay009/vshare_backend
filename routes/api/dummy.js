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

// Human-readable title for your website
const rpName = 'SimpleWebAuthn Example';
// A unique identifier for your website
const rpID = 'localhost';
// The URL at which registrations and authentications should occur
const origin = `http://${rpID}:8000`;

 // Use sessions to store challenges associated with user IDs
 if (!req.session.registrationChallenges) {
    req.session.registrationChallenges = {};
  }

   // Use sessions to store challenges associated with user IDs
   if (!req.session.authenticationChallenges) {
    req.session.authenticationChallenges = {};
  }
router.get('/generate-registration-options/:userID', async (req, res) => {
  const { userID } = req.params;

 

  console.log(req.session.registrationChallenges);

  try {
    // Check if a challenge already exists for the user
    if (req.session.registrationChallenges[userID]) {
      console.log('reg Challenge already exists for user:', userID);
      return res.status(400).send('reg Challenge already exists for user');
    }

    const user = await User.findOne({ _id: userID });

    if (!user) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }

    const webAuthCreds = user.webAuthnCredentials;

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: user._id,
      userName: user.email,
      attestationType: 'none',
      excludeCredentials: webAuthCreds?.map((authenticator) => ({
        id: authenticator.credentialID,
        type: 'public-key',
        transports: authenticator.transports,
      })),
      authenticatorSelection: {
        residentKey: 'discouraged',
        userVerification: 'preferred',
        authenticatorAttachment: 'cross-platform',
      },
      supportedAlgorithmIDs: [-7, -257],
    });

    // Store the challenge associated with the user
    req.session.registrationChallenges[user._id] = options.challenge;

    // Save the session after manipulating it
   req.session.save()
    
    console.log(req.session.registrationChallenges);
    console.log('Options sent');
    
    res.send(options);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});


router.post('/verify-registration/:userID', async (req, res) => {
  const body = req.body;
  const { userID } = req.params;
console.log(req.session.registrationChallenges);
  // Retrieve the stored challenge associated with the user
  const storedRegChallenge = req.session.registrationChallenges && req.session.registrationChallenges[userID];

console.log(storedRegChallenge)
  if (!storedRegChallenge) {
    return res.status(400).send({
      error: 'No stored reg challenge found for this user generate reg options again',
    });
  }

  try {
    const user = await User.findOne({ _id: userID });

    const verifyOptions = {
      response: body,
      expectedChallenge: storedRegChallenge || '',
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    };

    const verification = await verifyRegistrationResponse(verifyOptions);
    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      const { credentialPublicKey, credentialID, counter } = registrationInfo;

      const existingDeviceCredentials = user.webAuthnCredentials.find((deviceCredentials) =>
        isoUint8Array.areEqual(deviceCredentials.credentialID, credentialID)
      );

      if (!existingDeviceCredentials) {
        // add the device in future also count the no of devices to limit devices to register to webauthn
        const newDeviceCredential = {
          credentialPublicKey,
          credentialID,
          counter,
          transports: body.response.transports, // these are optional
        };

        user.webAuthnCredentials.push(newDeviceCredential);
        await user.save(); // Await the save operation
        console.log(user.webAuthnCredentials);
      }
    } else {
      res.status(400).send('Failed registration verification');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  } finally {
    // Clear the challenge from the local variable after verification
    delete req.session.registrationChallenges[userID];
    req.session.save();
  }
});

router.get('/generate-authentication-options/:userID', async (req, res) => {
 

  const { userID } = req.params;

  try {
    // Check if a challenge already exists for the user
    if (req.session.authenticationChallenges && req.session.authenticationChallenges[userID]) {
      console.log('auth Challenge already exists for user:', userID);
      return res.status(400).send('auth Challenge already exists for user');
    }

    const user = await User.findOne({ _id: userID });

    const options = await generateAuthenticationOptions({
      timeout: 60000,
      allowCredentials: user.webAuthnCredentials.map((deviceCredentials) => ({
        id: deviceCredentials.credentialID,
        type: 'public-key',
        transports: deviceCredentials.transports,
      })),
      userVerification: 'required',
      rpID,
    });

    // Store the challenge associated with the user
    req.session.authenticationChallenges[userID] = options.challenge;
    req.session.save();

    res.send(options);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});

router.post('/verify-authentication/:userID', async (req, res) => {
  const { userID } = req.params;
  const body = req.body;

  // Retrieve the stored challenge associated with the user
  const storedAuthChallenge = req.session.authenticationChallenges && req.session.authenticationChallenges[userID];

  if (!storedAuthChallenge) {
    return res.status(400).send({
      error: 'No stored auth challenge found for this user generate auth options again',
    });
  }

  try {
    const user = await User.findOne({ _id: userID });

    const verifyOptions = {
      response: body,
      expectedChallenge: storedAuthChallenge || '',
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    };

    const bodyCredIDBuffer = isoBase64URL.toBuffer(body.rawId);

    const deviceAuthenticator = user.webAuthnCredentials.find((deviceCredentials) =>
      isoUint8Array.areEqual(deviceCredentials.credentialID, bodyCredIDBuffer)
    );

    if (!deviceAuthenticator) {
      return res.status(400).send({
        error: 'Authenticator is not registered with this site',
      });
    }

    const verification = await verifyAuthenticationResponse(verifyOptions);
    const { verified, authenticationInfo } = verification;

    if (verified && authenticationInfo) {
      // Update the authenticator's counter in the DB to the newest count in the authentication
      await User.updateOne(
        { _id: userID, 'webAuthnCredentials.credentialID': deviceAuthenticator.credentialID },
        { $set: { 'webAuthnCredentials.$.counter': authenticationInfo.newCounter } }
      );

      // Clear the challenge from the local variable after successful verification
      delete req.session.authenticationChallenges[userID];
      req.session.save();
      res.send({ verified });
    } else {
      res.status(400).send('Failed authentication verification');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
