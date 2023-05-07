const Twitter = require('twitter-lite');
const { MessageEmbed } = require('discord.js');
const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');
const axios = require('axios')

const idsFilePath = './Stockage/ids.json';

async function updateTikTokInfo() {
    let tiktokUsername = 'AreiTTV';
    
    try {
        const response = await axios.get(`https://api.tiktok.com/aweme/v1/user/?unique_id=${tiktokUsername}&language=en&verifyFp=verify_kpnn3q3f_YX9K4Nnw_hBOB_4czG_9bLc_MkwwJELf18mt&appType=musical_ly&ts=${Date.now()}`, {
            headers: {
              'User-Agent': 'okhttp',
              'Accept-Encoding': 'gzip',
              'X-Tt-Token': process.env.TIKTOK_ACCESS_TOKEN,
            },
          });
      const userData = response.data.userData;
  
      const embed = new MessageEmbed()
        .setColor('#EE1D52')
        .setAuthor(`${userData.nickname} (@${tiktokUsername})`, userData.coversMedium[0])
        .setDescription(userData.signature)
        .setThumbnail(userData.avatarMedium)
        .setImage(userData.coversMedium[0])
        .addField('Followers', userData.fans.toLocaleString(), true)
        .addField('Following', userData.followings.toLocaleString(), true)
        .addField('Total likes', userData.heartCount.toLocaleString(), true)
        .setURL(`https://www.tiktok.com/@${tiktokUsername}`);

      let ids = { channelId: null, instagramEmbedId: null };
      try {
        const idsFile = fs.readFileSync(idsFilePath);
        ids = JSON.parse(idsFile);
      } catch (error) {
        console.error(`Error while reading IDs file: ${error}`);
      }
  
      const channel = client.channels.cache.get(ids.channelId);
      if (!channel) {
        console.error(`Channel with ID ${ids.channelId} not found.`);
        return;
      }
  
      let tiktokEmbedId;
      try {
        const idsFile = fs.readFileSync(idsFilePath);
        const ids = JSON.parse(idsFile);
        tiktokEmbedId = ids.tiktokEmbedId;
      } catch (error) {
        console.error(`Error while reading IDs file: ${error}`);
      }
  
      if (!ids.tiktokEmbedId) {
        const message = await channel.send({embeds: [embed]});
        ids.tiktokEmbedId = message.id;
        fs.writeFileSync(idsFilePath, JSON.stringify(ids, null, 2));
      } else {
        channel.messages.fetch(ids.tiktokEmbedId)
          .then(message => message.edit({embeds: [embed]}))
          .catch(error => console.error(`Error while updating Twitch info: ${error}`));
      }
    } catch (error) {
      console.error(`Error while updating TikTok info: ${error}`);
    }
  }

async function updateTwitchInfo() {
    const username = 'areittv';
  
    try {
      // Get user ID for the given username
      const { data: { data: [user] } } = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
        }
      });
  
      // Get the number of followers for the user ID
      const { data: { total } } = await axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${user.id}`, {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
        }
      });
  
      const embed = new MessageEmbed()
        .setColor('#9146FF')
        .setTitle(user.display_name)
        .setDescription(user.description)
        .setThumbnail(user.profile_image_url)
        .setImage(user.offline_image_url)
        .addField('Followers', total.toLocaleString(), true)
        .addField('Views', user.view_count.toLocaleString(), true)
        .setFooter(`@${user.login} on Twitch`);
  
      let ids = {channelId: null, twitchEmbedId: null};
      try {
        const idsFile = fs.readFileSync(idsFilePath);
        ids = JSON.parse(idsFile);
      } catch (error) {
        console.error(`Error while reading IDs file: ${error}`);
      }
  
      const channel = client.channels.cache.get(ids.channelId);
      if (!channel) {
        console.error(`Channel with ID ${ids.channelId} not found.`);
        return;
      }
  
      if (!ids.twitchEmbedId) {
        const message = await channel.send({embeds: [embed]});
        ids.twitchEmbedId = message.id;
        fs.writeFileSync(idsFilePath, JSON.stringify(ids, null, 2));
      } else {
        channel.messages.fetch(ids.twitchEmbedId)
          .then(message => message.edit({embeds: [embed]}))
          .catch(error => console.error(`Error while updating Twitch info: ${error}`));
      }
    } catch (error) {
      console.error(`Error while updating Twitch info: ${error}`);
    }
  }

const igClient = new IgApiClient();
igClient.state.generateDevice('zenbot');
igClient.state.proxyUrl = process.env.IG_PROXY;
const username = 'areiTTV';

async function updateInstagramInfo() {
  try {
    await igClient.simulate.preLoginFlow();
    const auth = await igClient.account.login(process.env.INSTAGRAM_LOGIN, process.env.INSTAGRAM_PASSWORD);
    const user = await igClient.user.searchExact(username);
    const userInfo = await igClient.user.info(user.pk);
    
    const embed = new MessageEmbed()
      .setColor('#C13584')
      .setAuthor(userInfo.username, userInfo.profile_pic_url, `https://www.instagram.com/${userInfo.username}/`)
      .setDescription(userInfo.biography)
      .setThumbnail(userInfo.profile_pic_url)
      .addField('Followers', userInfo.follower_count.toLocaleString(), true)
      .addField('Following', userInfo.following_count.toLocaleString(), true)
      .addField('Posts', userInfo.media_count.toLocaleString(), true)
      .setFooter(`@${userInfo.username} on Instagram`);

    let ids = { channelId: null, instagramEmbedId: null };
    try {
      const idsFile = fs.readFileSync(idsFilePath);
      ids = JSON.parse(idsFile);
    } catch (error) {
      console.error(`Error while reading IDs file: ${error}`);
    }

    const channel = client.channels.cache.get(ids.channelId);
    if (!channel) {
      console.error(`Channel with ID ${ids.channelId} not found.`);
      return;
    }

    if (!ids.instagramEmbedId) {
      const message = await channel.send({embeds: [embed]});
      ids.instagramEmbedId = message.id;
      fs.writeFileSync(idsFilePath, JSON.stringify(ids, null, 2));
    } else {
      channel.messages.fetch(ids.instagramEmbedId)
        .then(message => message.edit({embeds: [embed]}))
        .catch(error => console.error(`Error while updating Instagram info: ${error}`));
    }
  } catch (error) {
    console.error(`Error while updating Instagram info: ${error}`);
  }
}

async function updateTwitterInfo() {
    const twitterClient = new Twitter({
        consumer_key: "WO3kzK6EZXFIfScc9UgIu3HE9",
        consumer_secret: "3BD55u93UNpceO25CqDSjFg7L2Kzi4RV0PwXDoNr1hUnMSNoKs",
        bearer_token: "AAAAAAAAAAAAAAAAAAAAAEmomgEAAAAAKM6nsmDzuesevN5x%2B3w3kdsjnjw%3Dl1jF7LsdCuYQieM6iFdOp8gQaAQGNBV3DMdEYMLSug2REB8syv",
        access_token_key: "3365954087-XNnsjoL6Qjz6jhaM9wTfjH7dJWlpf8ID165vf7U",
        access_token_secret: "hcQoxfiXJ8RAsxfTJmEJl6rqQus4C3aX7bSHHYCC2Q8Rh"
    })
    

  // Replace "TWITTER_USERNAME" with your Twitter username
  const params = {
    screen_name: 'AreiTTV',
    include_entities: true,
    tweet_mode: 'extended'
  };

  try {
    const [user, tweets] = await Promise.all([
      twitterClient.get('users/show', params),
      twitterClient.get('statuses/user_timeline', params)
    ]);

    const embed = new MessageEmbed()
      .setColor('#1DA1F2')
      .setAuthor(user.name, user.profile_image_url_https, `https://twitter.com/${user.screen_name}`)
      .setDescription(user.description)
      .setThumbnail(user.profile_image_url_https)
      .setImage(user.profile_banner_url)
      .addField('Followers', user.followers_count.toLocaleString(), true)
      .addField('Tweets', user.statuses_count.toLocaleString(), true)
      .setFooter(`@${user.screen_name} on Twitter`);

    let ids = {channelId: null, twitterEmbedId: null};
    try {
      const idsFile = fs.readFileSync(idsFilePath);
      ids = JSON.parse(idsFile);
    } catch (error) {
      console.error(`Error while reading IDs file: ${error}`);
    }

    const channel = client.channels.cache.get(ids.channelId);
    if (!channel) {
      console.error(`Channel with ID ${ids.channelId} not found.`);
      return;
    }

    if (!ids.twitterEmbedId) {
      const message = await channel.send({embeds: [embed]});
      ids.twitterEmbedId = message.id;
      fs.writeFileSync(idsFilePath, JSON.stringify(ids, null, 2));
    } else {
      channel.messages.fetch(ids.twitterEmbedId)
        .then(message => message.edit({embeds: [embed]}))
        .catch(error => console.error(`Error while updating Twitter info: ${error}`));
    }
  } catch (error) {
    console.error(`Error while updating Twitter info: ${error}`);
  }
}

module.exports = {
    updateTwitterInfo,
    updateInstagramInfo,
    updateTwitchInfo,
    updateTikTokInfo
}

