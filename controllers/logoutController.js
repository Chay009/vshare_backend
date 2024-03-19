const User = require('../model/User');

const handleLogout = async (req, res) => {
    // On the client, also delete the accessToken

    const cookies = req.cookies;
    console.log(cookies.jwt)

    if (!cookies?.jwt) return res.sendStatus(204); // No content
    const refreshToken = cookies.jwt;
    console.log(refreshToken)

    // Is refreshToken in the db?
    const foundUser = await User.findOne({ 'refreshTokens.token': refreshToken }).exec();

    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: false, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in the db based on the token value
    foundUser.refreshTokens = foundUser.refreshTokens.filter(rt => rt.token !== refreshToken);
    
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: false, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout };
