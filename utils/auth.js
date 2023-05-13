const axios = require('axios')
const env = require('dotenv').config()

let tokenExpiration = 0;
let token = null;

async function getTwitchAccessToken(){
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  
    // Generate access token
        // check if token has expired or not
    const now = Date.now() / 1000;
    if (now >= tokenExpiration) {
        const params = new URLSearchParams();
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('grant_type', 'client_credentials');
        params.append('scope', 'user:read:email');
      
        const { data: { access_token } } = await axios.post(`https://id.twitch.tv/oauth2/token`, params);
        token = access_token
        tokenExpiration = now + 3600; // token will expire in 1 hour
    }
    return token
}

module.exports = {
    getTwitchAccessToken
}