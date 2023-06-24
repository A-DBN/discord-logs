const Twitter = require('twitter');
const { EmbedBuilder } = require('@discordjs/builders');
const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');
const axios = require('axios')
const env = require('dotenv').config()
const { URLSearchParams } = require('url');
const qs = require('qs')
const puppeteer = require('puppeteer');

const {getTwitchAccessToken} = require('./utils/auth.js')

const idsFilePath = './Stockage/ids.json';

async function updateSpotifyInfo() {
  // const clientId = process.env.SPOTIFY_CLIENT_ID;
  // const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  // const accessTokenEndpoint = 'https://accounts.spotify.com/api/token';
  // const userProfileEndpoint = 'https://api.spotify.com/v1/me';
  // const username = 'ZenkiuD';
  
  // // Generate access token
  // const data = await axios.post(accessTokenEndpoint, 'grant_type=client_credentials&scope=user-read-email%20user-read-private', {
  //   headers: {
  //     'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   }
  // });
  // console.log(data.data)
  
  // const access_token = data.data.access_token;
  // console.log(userProfileEndpoint)
  // try {
  //   // Get user profile information for the given username
  //   console.log(access_token)
  //   const { data } = await axios.get(userProfileEndpoint, {
  //     headers: {
  //       'Authorization': `Bearer ${access_token}`
  //     }
  //   });
  try {
    const URL = "https://open.spotify.com/user/izbhsh9rxqf0darc2stcap265"
    const browser = await puppeteer.launch({headless: "new" });

    const page = await browser.newPage();

    await page.goto(URL, {waitUntil: 'networkidle2'});
    await page.waitForSelector('#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw.lPapCDz3v_LipgXwe8gi > div.main-view-container > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > main > section > div > div.contentSpacing.NXiYChVp4Oydfxd7rT5r.RMDSGDMFrx8eXHpFphqG > div.RP2rRchy4i8TIp1CTmb7 > span.rEN7ncpaUeSGL9z0NGQR > h1')
    const displayName = await page.$eval('#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw.lPapCDz3v_LipgXwe8gi > div.main-view-container > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > main > section > div > div.contentSpacing.NXiYChVp4Oydfxd7rT5r.RMDSGDMFrx8eXHpFphqG > div.RP2rRchy4i8TIp1CTmb7 > span.rEN7ncpaUeSGL9z0NGQR > h1', el => el.innerText);
    const followers = await page.$eval('#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw.lPapCDz3v_LipgXwe8gi > div.main-view-container > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > main > section > div > div.contentSpacing.NXiYChVp4Oydfxd7rT5r.RMDSGDMFrx8eXHpFphqG > div.RP2rRchy4i8TIp1CTmb7 > div > span:nth-child(2) > a', el => el.innerText);
    const profile_picture = await page.$eval('#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw.lPapCDz3v_LipgXwe8gi > div.main-view-container > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > main > section > div > div.contentSpacing.NXiYChVp4Oydfxd7rT5r.RMDSGDMFrx8eXHpFphqG > div.rMpf7sfaPDcj387_52fA > div > div > img', el => el.src);
    const public = await page.$eval('#main > div > div.ZQftYELq0aOsg6tPbVbV > div.jEMA2gVoLgPQqAFrPhFw.lPapCDz3v_LipgXwe8gi > div.main-view-container > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > main > section > div > div.contentSpacing.NXiYChVp4Oydfxd7rT5r.RMDSGDMFrx8eXHpFphqG > div.RP2rRchy4i8TIp1CTmb7 > div > span:nth-child(1)', el => el.innerText);
    await browser.close();

    const embed = new EmbedBuilder()
      .setColor(Number(0x1DB954))
      .setAuthor({name: displayName, iconURL:profile_picture, url:URL})
      .addFields(
        {name: "Followers", value: `${followers.split(/\s+/)[0]}`, inline: true},
        {name: "Public Playlists", value: `${public.split(/\s+/)[0]}`, inline: true}
      )
      .setThumbnail(profile_picture)
      .setFooter({text: `@${displayName} on Spotify`, iconURL:'https://i.imgur.com/qvdqtsc.png'});
  
    let ids = {channelId: null, spotifyEmbedId: null};
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
  
    if (!ids.spotifyEmbedId) {
      const message = await channel.send({embeds: [embed]});
      ids.spotifyEmbedId = message.id;
      fs.writeFileSync(idsFilePath, JSON.stringify(ids, null, 2));
    } else {
      channel.messages.fetch(ids.spotifyEmbedId)
        .then(message => message.edit({embeds: [embed]}))
        .catch(error => console.error(`Error while updating Spotify info: ${error}`));
    }
  } catch (error) {
    console.error(`Error while updating Spotify info: ${error}`);
  }
}

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
  
    const embed = new EmbedBuilder()
    .setColor(Number(0xEE1D52))
    .setAuthor({name:username, iconURL: profileImage, url:`https://www.tiktok.com/${tiktokUsername}`})
    .addFields(
      {name:'Followers', value:followers.toLocaleString(), inline:true},
      {name:'Total likes', value:likes.toLocaleString(), inline:true}
    )
    .setURL(`https://www.tiktok.com/${tiktokUsername}`)
    .setThumbnail(profileImage)
    .setFooter({text:`@areittv on TikTok`, iconURL:'https://i.imgur.com/OT2nXJG.png'})

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
    const access_token = await getTwitchAccessToken();
  
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
  
      const embed = new EmbedBuilder()
        .setColor(Number(0x9146FF))
        .setAuthor({name: user.display_name, iconURL:user.profile_image_url, url:'https://www.twitch.tv/areittv'})
        .setDescription(user.description)
        .setThumbnail(user.profile_image_url)
        .setImage(user.offline_image_url)
        .addFields(
          {name:'Followers', value:total.toLocaleString(), inline:true},
          {name:'Views', value:user.view_count.toLocaleString(), inline:true}
        )
        .setFooter({text:`@${user.login} on Twitch`, iconURL:'https://i.imgur.com/rQo24gB.png'});
  
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
    
    const embed = new EmbedBuilder()
      .setColor(Number(0xC13584))
      .setAuthor({name: userInfo.username, iconURL:userInfo.profile_pic_url, url:`https://www.instagram.com/${userInfo.username}/`})
      .setDescription(userInfo.biography)
      .setThumbnail(userInfo.profile_pic_url)
      .addFields(
        {name:'Followers', value:userInfo.follower_count.toLocaleString(), inline:true},
        {name:'Following', value:userInfo.following_count.toLocaleString(), inline:true},
        {name:'Posts', value:userInfo.media_count.toLocaleString(), inline:true}
      )
      .setFooter({text:`@${userInfo.username} on Instagram`, iconURL:'https://i.imgur.com/OWdUupI.png'});

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

    const embed = new EmbedBuilder()
      .setColor(Number(0x1DA1F2))
      .setAuthor({name:user.name, iconURL:user.profile_image_url_https, url:`https://twitter.com/${user.screen_name}`})
      .setDescription(user.description)
      .setThumbnail(user.profile_image_url_https)
      .setImage(user.profile_banner_url)
      .addFields(
        {name:'Followers', value:user.followers_count.toLocaleString(), inline:true},
        {name:'Tweets', value:user.statuses_count.toLocaleString(), inline:true}
      )
      .setFooter({text:`@${user.screen_name} on Twitter`, iconURL:'https://i.imgur.com/LS08Auh.png'});

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
    updateTikTokInfo,
    updateSpotifyInfo
}

