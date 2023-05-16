const axios = require('axios')
const env = require('dotenv').config()
const { EmbedBuilder } = require('@discordjs/builders');
const {getTwitchAccessToken} = require('./auth.js')
const fs = require('fs')

function sendTwitchLiveMessage(channel, access_token) {
    const channelUrl = `https://api.twitch.tv/helix/channels?broadcaster_id=500392653`;
    const streamUrl = `https://api.twitch.tv/helix/streams?user_id=500392653`;
    const gameUrl = `https://api.twitch.tv/helix/games?id=`
    const userUrl = `https://api.twitch.tv/helix/users?login=areittv`
    const clientId = process.env.TWITCH_CLIENT_ID;

    axios.all([axios.get(channelUrl, {
    headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${access_token}`
    }
    }), axios.get(streamUrl, {
    headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${access_token}`
    }
    }), axios.get(userUrl, {
    headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${access_token}`
    }
    })])
    .then(axios.spread((channelRes, streamRes, userRes) => {
    const channelData = channelRes.data.data[0];
    const streamData = streamRes.data.data[0];
    const userData = userRes.data.data[0];

    axios.get(gameUrl + streamData.game_id, {
      headers: {
          'Client-ID': clientId,
          'Authorization': `Bearer ${access_token}`
      }
      }).then(res => {
        const gameData = res.data.data[0];

        const embed = new EmbedBuilder()
            .setColor(Number(0x6441A4))
            .setAuthor({name:channelData.broadcaster_name, iconURL:userData.profile_image_url, url:`https://twitch.tv/${channelData.broadcaster_name}`})
            .setImage(gameData.box_art_url.replace('_IGDB-{width}x{height}', ''))
            .setTitle(`**${channelData.title}**`)
            .setURL(`https://twitch.tv/${channelData.broadcaster_login}`)
            .addFields(
              {name: 'Jeu', value: gameData.name, inline: true},
              {name: 'Viewers', value: String(streamData.viewer_count), inline: true}
            )
            .setImage(streamData.thumbnail_url.replace('{width}', '1280').replace('{height}', '720'))
            .setFooter({text:'Twitch', iconURL:'https://i.imgur.com/rQo24gB.png'})
            .setTimestamp();

        channel.send({content: "@everyone areittv est en ligne par ici -> https://twitch.tv/areittv", embeds: [embed] });
      }).catch(err => console.log(err))
    })).catch(err => console.log(err));
}

async function isLive() {
    const channel = client.channels.cache.get("980527661422108702");
    const access_token = await getTwitchAccessToken();
    axios.get(`https://api.twitch.tv/helix/streams?user_id=500392653`, {
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            'Authorization': `Bearer ${access_token}`
        }
      })
      .then(response => {
        const data = response.data;
        const storagePath = './Stockage/ids.json';
        let idsData = {};
        
        try {
          const idsDataRaw = fs.readFileSync(storagePath);
          idsData = JSON.parse(idsDataRaw);
        } catch (error) {
          console.error(error);
        }
  
        if (data.data.length > 0) {
          if (!idsData.isLive) {
            sendTwitchLiveMessage(channel, access_token);
            idsData.isLive = true;
            try {
              fs.writeFileSync(storagePath, JSON.stringify(idsData));
            } catch (error) {
              console.error(error);
            }
          }
        } else {
          if (idsData.isLive) {
            idsData.isLive = false;
            try {
              fs.writeFileSync(storagePath, JSON.stringify(idsData));
            } catch (error) {
              console.error(error);
            }
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
}

module.exports = {
    isLive,
}