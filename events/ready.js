const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const axios = require('axios')
const { updateTwitterInfo, updateInstagramInfo, updateTwitchInfo, updateTikTokInfo, updateSpotifyInfo } = require('../networks.js')
const {getObject} = require('../utils/utils.js')

async function truc() {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const username = 'areittv';
  
    // Generate access token
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'client_credentials');
    params.append('scope', 'user:read:email');
  
    const { data: { access_token } } = await axios.post(`https://id.twitch.tv/oauth2/token`, params);

    const twitchApiUrl = 'https://api.twitch.tv/helix';

    axios.get(`${twitchApiUrl}/users?login=${username}`, {
    headers: {
        'Client-ID': clientId,
        'Authorization': 'Bearer ' + access_token
    }
    })
    .then(response => {
    const userData = response.data.data[0];
    const userId = userData.id;
    console.log(`User ID for ${username}: ${userId}`);
    })
    .catch(error => {
    console.log(error);
    });
}

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Ready to work ! Logged in as ${client.user.tag}`)
        client.user.setActivity('AreiTTV on Twitch', { type: 'WATCHING' })
        // truc()
        // if (getObject('TwitterUpdate').enabled === true) updateTwitterInfo();
        // if (getObject('InstagramUpdate').enabled === true) updateInstagramInfo();
        // if (getObject('TwitchUpdate').enabled === true) updateTwitchInfo();
        // if (getObject('TikTokUpdate').enabled === true) updateTikTokInfo();
        // if (getObject('SpotifyUpdate').enabled === true) updateSpotifyInfo();
	const embed = new EmbedBuilder()
        .setTitle('Redemarrage du bot')
        .setColor(Number(0x5ac18e))
        .setDescription(`Redemarrage du bot terminé, si le bot redemarre regulierement ou après une certaine action => mp ZenkiuD#3333`)
        .setTimestamp()
        if (embed.description !== '')
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
            return

    }
}
