// Function to save refresh tokens with the user
const saveRefreshTokens = async (foundUser, modifiedUserRefreshTokenArray, newRefreshToken, loginDeviceInfo,clientLocation) => {
    // Save refresh tokens with the current user
    foundUser.refreshTokens = modifiedUserRefreshTokenArray; // Set the modified array
console.log(clientLocation);
    loginDeviceInfo.deviceLocation=clientLocation;
    if (newRefreshToken) {
        // Add the new refresh token if it exists
        foundUser.refreshTokens.push({
            token: newRefreshToken,
            deviceInfo: loginDeviceInfo,
            
        });
    }

    try {
        const result = await foundUser.save();
        console.log("saved new token ");
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { saveRefreshTokens };
