const jwt = require('jsonwebtoken');
// Function to create access and refresh tokens
 const createTokens=(foundUser)=> {
    const roles = Object.values(foundUser.roles).filter(Boolean);

    // Create access token
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": foundUser.email,
                "roles": roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '50m' }
    );

    // Create new refresh token
    const newRefreshToken = jwt.sign(
        { "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '150m' }  // Change it to 1 day
    );

    return { accessToken, newRefreshToken, roles };
}
module.exports ={createTokens}