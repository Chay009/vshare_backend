const axios=require('axios')    

const IPtolocation= async(ip)=>{
    try {
        const response = await axios.get(  `https://ipapi.co/${ip}/json`);
        return response.data; // Assuming API returns JSON data
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Handle the error as needed
    }


}

module.exports ={IPtolocation}