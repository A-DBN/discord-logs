const { AttachmentBuilder } = require("discord.js");
const { EmbedBuilder } = require('@discordjs/builders');
const env = require("dotenv").config();
const axios = require("axios");
const Canvas = require('canvas')
const {getTwitchAccessToken} = require('../utils/auth')
const {getObject} = require('../utils/utils.js')

module.exports = {
  name: "guildMemberAdd",
  on: true,
  async execute(member) {
    if (getObject('WelcomeMessage').enabled === false && getObject("TwitchRoleGive").enabled === false) return;
    if (getObject('TwitchRoleGive').enabled === true) {
      const twitchUsername = member.user.username; // assume that the user's Discord username is the same as their Twitch username
      const followerRoleId = "1104681838997422080"; // your follower role ID

      const regex = /^[a-zA-Z0-9]+$/;
      if (!regex.test(twitchUsername)) {
        console.log(`User ${twitchUsername} does not match the regex.`);
        member.send(
          `Salut, Je n'ai pas pu te trouver parmis les followers twitch de AreiTTV. Si tu es bien follow, tape la commande /linktwitch <ton_nom_twitch> dans le channel command_bot sur le serveur discord de AreiTTV.`
          );
        return;
      }

      const access_token = await getTwitchAccessToken();

      try {
        const twitchResponse = await axios.get(
          `https://api.twitch.tv/helix/users?login=${twitchUsername}`,
          {
            headers: {
              "Client-ID": process.env.TWITCH_CLIENT_ID,
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        if (twitchResponse.data.data.length === 0) {
          console.log(`User ${twitchUsername} does not exist on Twitch.`);
          member.send(
              `Salut, Je n'ai pas pu te trouver parmis les followers twitch de AreiTTV. Si tu es bien follow, tape la commande /linktwitch <ton_nom_twitch> dans le channel command_bot sur le serveur discord de AreiTTV.`
              );
          return;
        }

        const twitchUserId = twitchResponse.data.data[0].id;

        const followsResponse = await axios.get(
          `https://api.twitch.tv/helix/users/follows?to_id=${process.env.CASCA_CHANNEL_ID}&from_id=${twitchUserId}`,
          {
            headers: {
              "Client-ID": process.env.TWITCH_CLIENT_ID,
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        const isFollowing = followsResponse.data.total > 0;

        if (isFollowing) {
          member.roles.add(followerRoleId);
          console.log(
            `User ${twitchUsername} is now a follower and has been granted the follower role.`
          );
        } else {
          console.log(`User ${twitchUsername} is not a follower.`);
          member.send(
            `Salut, Je n'ai pas pu te trouver parmis les followers twitch de AreiTTV. Si tu es bien follow, tape la commande /linktwitch <ton_nom_twitch> dans le channel command_bot sur le serveur discord de AreiTTV.`
          );
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (getObject('WelcomeMessage').enabled === true) {
      const canvas = Canvas.createCanvas(700, 250);
      const ctx = canvas.getContext('2d');
      const channel = client.channels.cache.get('980471046815772714');

      const background = await Canvas.loadImage('./assets/bg.jpg');
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
      // Load the member's avatar and add it to the canvas
      const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
    
      // Draw a circular clip around the avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 100, 75, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
    
      // Draw the avatar in the center of the canvas
      ctx.drawImage(avatar, canvas.width / 2 - 75, 25, 150, 150);
    
      // Restore the canvas so that the text is not clipped
      ctx.restore();
    
      // Add the welcome message below the avatar
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`Bienvenue ${member.user.username}!`, canvas.width / 2, 220);
    
  
      const attachment = new AttachmentBuilder(canvas.toBuffer(), 'welcome-image.png');
      channel.send({files: [attachment]})
    }

    const embed = new EmbedBuilder()
      .setTitle(`New Member ${member.user.username}`)
      .setColor(Number(0x5ac18e))
      .setThumbnail(member.user.displayAvatarURL())
      .setDescription(
        `<@!${member.user.id}> has joined the server!\n\u200b**Nombre total de membre:** ${member.guild.memberCount}`
      )
      .setTimestamp();
      try {
        client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
      } catch (error) {
        console.error(error);
        console.log(embed)
      }
  },
};
