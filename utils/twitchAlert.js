const axios = require('axios')
const env = require('dotenv').config()
const { EmbedBuilder } = require('@discordjs/builders');
const {getTwitchAccessToken} = require('./auth.js')
const fs = require('fs')
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function setupRequest() {
  const oauth = OAuth({
    consumer: {
          key: process.env.TWITTER_AREI_KEY,
          secret: process.env.TWITTER_AREI_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64');
    },
  });

  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = oauth.getNonce(32);

  const token = {
      key: process.env.TWITTER_AREI_TOKEN,
      secret: process.env.TWITTER_AREI_SECRET_TOKEN,
  };

  const signature = oauth.getSignature(requestData, token.secret, {
      oauth_consumer_key: oauth.consumer.key,
      oauth_token: token.key,
      oauth_signature_method: oauth.signature_method,
      oauth_timestamp: timestamp,
      oauth_nonce: nonce,
      oauth_version: '1.0',
  });

  const authHeader = oauth.toHeader({
      oauth_consumer_key: oauth.consumer.key,
      oauth_token: token.key,
      oauth_signature_method: oauth.signature_method,
      oauth_timestamp: timestamp,
      oauth_nonce: nonce,
      oauth_version: '1.0',
      oauth_signature: signature,
  });

  const headers = {
      Authorization: authHeader['Authorization'],
  };

  return headers
}

function deleteTweet() {

  const data = fs.readFileSync('./Stockage/ids.json', 'utf8', function (err, data) {
    if (err) throw err;
  })

  const tweetId = JSON.parse(data).tweetId
  const requestData = {
    url: `https://api.twitter.com/2/tweets/${tweetId}`,
    method: 'DELETE',
  }

  const headers = setupRequest(requestData)

  const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: requestData.url,
      headers: {
          'Content-Type': 'application/json',
          ...headers,
      }
  }

  axios(config)
  .catch(error => {
    console.log(error)
  })
}

function sendTweet() {
  const dt = fs.readFileSync('./Stockage/ids.json', 'utf8')
  let ids = JSON.parse(dt)

  const requestData = {
    url: 'https://api.twitter.com/2/tweets',
    method: 'POST',
  };

  const headers = setupRequest(requestData);

  const data = JSON.stringify({
      text: 'Je passe en live ! https://twitch.tv/AreiTTV',
  });

  const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: requestData.url,
      headers: {
          'Content-Type': 'application/json',
          ...headers,
      },
      data: data,
  };

  axios(config)
  .then(response => {
    const id = response.data.data.id;
    ids.tweetId = id;
    fs.writeFileSync(
      './Stockage/ids.json',
      JSON.stringify(ids, null, 4),
      function (err) {
        if (err) console.log(err);
      }
    );
  })
  .catch(error => {
    console.log(error)
  })

}

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
        const image = streamData.thumbnail_url.replace('{width}', '1280').replace('{height}', '720') + `?cachebuster=${Date.now()}`;

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
            .setImage(image)
            .setFooter({text:'Twitch', iconURL:'https://i.imgur.com/rQo24gB.png'})
            .setTimestamp();
        channel.send({content: "@everyone areittv est en ligne par ici -> https://twitch.tv/areittv", embeds: [embed] })
      }).catch(err => console.log(err))
    })).catch(err => console.log(err));
}

async function isLive() {
    const channel = client.channels.cache.get("980503343661195385");
    const access_token = await getTwitchAccessToken();
    axios.get(`https://api.twitch.tv/helix/streams?user_id=500392653`, {
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            'Authorization': `Bearer ${access_token}`
        }
      })
      .then(async response => {
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
            if (idsData.tweetId !== "") deleteTweet()
            await delay(3000)
            sendTweet()
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
            idsData.liveembed = "";
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