const Twitter = require('twitter');
const { MessageEmbed } = require('discord.js');
const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');
const axios = require('axios')
const env = require('dotenv').config()
const { URLSearchParams } = require('url');
const qs = require('qs')
const puppeteer = require('puppeteer');

const idsFilePath = './Stockage/ids.json';

async function updateTikTokInfo() {
  tiktokUsername = "@areittv"
  try {
    const browser = await puppeteer.launch({headless: "new", executablePath: '/usr/bin/chromium-browser'});
    let page = await browser.newPage();
    await page.goto('http://tiktok.com/' + tiktokUsername);
    await page.waitForSelector('div[data-e2e="user-post-item"] a');
    // parse user data
    let followers = await(await page.$('strong[data-e2e=followers-count]')).evaluate(node => node.innerText); 
    let likes = await(await page.$('strong[data-e2e=likes-count]')).evaluate(node => node.innerText); 
    let profileImage = await page.$eval('#main-content-others_homepage > div > div.tiktok-1g04lal-DivShareLayoutHeader-StyledDivShareLayoutHeaderV2.enm41492 > div.tiktok-1gk89rh-DivShareInfo.ekmpd5l2 > div.tiktok-uha12h-DivContainer.e1vl87hj1 > span > img', img => img.getAttribute('src'));
    await page.close()
    await browser.close()
  
    const embed = new MessageEmbed()
    .setColor('#EE1D52')
    .setAuthor(`${username} (${tiktokUsername})`, profileImage)
    .addField('Followers', followers.toLocaleString(), true)
    .addField('Total likes', likes.toLocaleString(), true)
    .setURL(`https://www.tiktok.com/@${tiktokUsername}`)
    .setThumbnail(profileImage)
    .setFooter('@areittv on TikTok', 'https://i.imgur.com/OT2nXJG.png')

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
  
    try {
      // Get user ID for the given username
      const { data: { data: [user] } } = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Client-ID': clientId
        }
      });
  
      // Get the number of followers for the user ID
      const { data: { total } } = await axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Client-ID': clientId
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
        .setFooter(`@${user.login} on Twitch`, 'https://i.imgur.com/rQo24gB.png');
  
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
      .setFooter(`@${userInfo.username} on Instagram`, 'https://i.imgur.com/OWdUupI.png');

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
  // Twitter API OAuth 2.0 authentication
  const authOptions = {
    method: 'POST',
    url: 'https://api.twitter.com/oauth2/token',
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.TWITTER_CONSUMER_KEY}:${process.env.TWITTER_CONSUMER_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data: qs.stringify({
      grant_type: 'client_credentials'
    })
  };

  try {
    const response = await axios(authOptions);
    const { access_token: bearerToken } = response.data;

    const twitterClient = new Twitter({
      bearer_token: bearerToken
    });

    // Replace "TWITTER_USERNAME" with your Twitter username
    const params = {
      screen_name: 'AreiTTV',
      include_entities: true,
      tweet_mode: 'extended'
    };

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
      .setFooter(`@${user.screen_name} on Twitter`, 'https://i.imgur.com/LS08Auh.png');

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

