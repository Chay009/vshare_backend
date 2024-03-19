const User = require('../model/User');


/*TOKEN rotation-making existing token invalid and assigning new one in place of it  */
const handleTokenRotation=async(cookies,res,foundUser)=>{
    
     const currentRefreshToken=cookies.jwt;



     /* generally we dont store refreshtokens in db if 
               1. token revocated-means is invalidated before its expiry for security
               2. token expired
               3.token invalid
               3. token blacklisted */


    //  first time login or no active logins 
    if(!currentRefreshToken)  {
        return foundUser.refreshTokens
    }
    else{


    // here there is  refresh token


    const foundToken = foundUser.refreshTokens.find(rt => rt.token === currentRefreshToken);
    if(!foundToken){
        console.log('Attempted refresh token reuse at login!');
        
        ////we found that currentToken is not in DB  means no user logged in with this token but still
        // try to access 
        
        // implies it is some old token or a invalid token but someone trying to use
        // Detected refresh token reuse!
        
        // Clear out ALL previous refresh tokens
        // For security, invalidate all tokens in the database (signout all users)
        // const result = await User.deleteOne({ refreshToken: existingToken });
        // console.log(result);
        return [];
    
    }

             /* since there is a token 

               first check all possiblities 
               is valid,isblacklisted,isrevocated
              case 1. check for token expiration
                     
              // const isBlacklisted,isvalid,isexpired; fun(refreshToken)

              handle them by handle if they are blacklisted,expired,invalid by their func

             Eg:  HandleInvalidrefreshToken(refreshToken)
              
               if(!isTokenExpired && isvalid){
                // 
                case.2 check for token blacklist 
                if(!istokenBlacklisted){

                    if(!isTokenrevoked){
                        const foundToken = await User.findOne({ refreshToken }).exec();
                        ......
                        ..// rest code ....
                        ..
                    }
         }
            }
*/


   // only  (after verifying valid,blacklisted,revoked)
    // Since no suspicious activity 
    // implementing token rotation
       // Clear existing token from cookies even though this refresh token 
       // not yet expired for security reasons

       res.clearCookie('jwt', { httpOnly: false, sameSite: 'None', secure: true });

       console.log("device change detected logging out user")

      // Also clearing the current refresh token in the database
      foundUser.refreshTokens = foundUser.refreshTokens.filter(rt => rt.token !== currentRefreshToken);
      await foundUser.save();

      return foundUser.refreshTokens;
    }




    
}
module.exports ={handleTokenRotation}