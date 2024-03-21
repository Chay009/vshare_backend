const ipapi = require("ipapi.co");



 

const getClientLocation= async()=>{

    return new Promise((resolve, reject) => {
        ipapi.location(loc => {
          resolve(loc);
        });
      });
   


}

module.exports ={getClientLocation}