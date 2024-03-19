const User = require('../model/User');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { IPtolocation } = require('../services/iplocation');

const handleRefreshToken = async (req, res) => {
    
    try {
        console.log("attempted refreshing tokens ")
        const cookies = req.cookies;
        const clientIP=req.ip
        const clientLocation=await IPtolocation(clientIP);
//     console.log(clientLocation,"location")
 // Check if 'DeviceInfo' header is present in the request
 const reqDeviceInfo = JSON.parse(req.headers['device-info']);

 reqDeviceInfo.deviceLocation=JSON.parse(clientLocation);

        if (!cookies?.jwt || !reqDeviceInfo.ua) {
            if(!cookies?.jwt) console.log('no token found');
            if(!reqDeviceInfo.ua) console.log('no device details found client side error');

            return res.sendStatus(401); // No token, unauthorized
        }

        const refreshToken = cookies.jwt;
        res.clearCookie('jwt', { httpOnly: false, sameSite: 'None', secure: true });

        const foundUser = await User.findOne({ refreshToken }).exec();

        if (!foundUser) {
            // Detected refresh token reuse!
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            console.log('Attempted refresh token reuse!');

            // Find the user with the decoded username and clear their refresh tokens
            const hackedUser = await User.findOne({ username: decoded.username }).exec();
            hackedUser.refreshTokens = [];
            const result = await hackedUser.save();
            console.log(result);

            return res.sendStatus(403); // Forbidden
        }

        // Evaluate jwt
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            
            if (err) {
                // Handle JWT verification errors
                console.log('JWT verification error:', err.message);
                // Remove the refresh token from the user's record in the database
                foundUser.refreshTokens = foundUser.refreshTokens.filter(rt => rt.token !== refreshToken);
                 // just before saving removing all expired tokens
                 clearExpiredRefreshTokens(foundUser);
                await foundUser.save();
                console.log("refresh token expired logged out user in server do it in client too")
                res.status(403).json({"message":"token expired logged out user"}); // Forbidden
                return
            }

            // Check for username mismatch
            if (foundUser.username !== decoded.username) {
                console.log('Username mismatch');
                console.log('Found User Username:', foundUser.username);
                console.log('Decoded Token Username:', decoded.username);

                // Possible malicious behavior, sign out all users and send a push notification
                // BLACKLIST/SUSPEND ACCOUNT()
                return res.sendStatus(403); // Forbidden
            }

           
            console.log("reqdev",reqDeviceInfo)

            // Compare 'DeviceInfo' header with the device information in the refresh token
            const refreshTokenDeviceInfo = foundUser.refreshTokens[0]?.deviceInfo;
            console.log("in db",refreshTokenDeviceInfo)

            if (isDeviceInfoMatched(reqDeviceInfo, refreshTokenDeviceInfo)) {
                // Device info matches, proceed with token issuance

                const roles = Object.values(foundUser.roles);
                const accessToken = jwt.sign(
                    {
                        UserInfo: {
                            username: decoded.username,
                            roles: roles,
                        },
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '10s' }
                );

                const newRefreshToken = jwt.sign(
                    { username: foundUser.username },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '30s' }
                );

                // just before saving removing all expired tokens
                clearExpiredRefreshTokens(foundUser);
                // Saving new refreshToken with current user
                foundUser.refreshTokens = [...foundUser.refreshTokens.filter(rt => rt.token !== refreshToken), { token: newRefreshToken, deviceInfo: reqDeviceInfo }];
                const result = await foundUser.save();

                // Creates Secure Cookie with refresh token
                res.cookie('jwt', newRefreshToken, { httpOnly: false, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
              console.log('cookie set');
                // Send the final response
                return res.json({ roles, accessToken });
            } else {
                // Device info doesn't match, potential security threat
                // here you can suspend or freeze account for some time or blacklist it too
            //BLACKLIST/SUSPEND ACCOUNT()
            foundUser.refreshTokens = foundUser.refreshTokens.filter(rt => rt.token !== refreshToken);
            await foundUser.save()
            console.log("device info mismatched suspicious activity")
         
                return res.sendStatus(403); // Forbidden
            }
        });
    } catch (error) {
        console.error('Error in handleRefreshToken:', error.message);
        return res.sendStatus(403); // Forbidden
    }
};

module.exports = { handleRefreshToken };

// Helper function for deep equality comparison
// Helper function for deep equality comparison


 
// Function to clear expired refresh tokens for a user
const clearExpiredRefreshTokens = async (user) => {
    
    user.refreshTokens = user.refreshTokens.filter((tokenInfo) => {
        try {
            jwt.verify(tokenInfo.token, process.env.REFRESH_TOKEN_SECRET);
            // If verification is successful, the token is not expired
            return true;
        } catch (err) {
            // If verification fails, the token is expired
            return false;
        }
    });

    // Save the user with the updated refreshTokens array
    
};


const isDeviceInfoMatched=(reqDeviceInfo,refreshTokenDeviceInfo)=>{
 reqDeviceInfo=_.chain(reqDeviceInfo).toPairs().sortBy(0).fromPairs().value();
 refreshTokenDeviceInfo=_.chain(refreshTokenDeviceInfo).toPairs().sortBy(0).fromPairs().value();
 console.log(reqDeviceInfo)
 console.log(refreshTokenDeviceInfo)


if(JSON.stringify(reqDeviceInfo)===JSON.stringify(refreshTokenDeviceInfo))
{
    return true;
}
else{
    return false;
}
 



}

