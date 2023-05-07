const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()
const axios = require('axios')

module.exports = {
    name: 'guildMemberAdd',
    on: true,
    async execute(member) {
        const twitchUsername = member.user.username; // assume that the user's Discord username is the same as their Twitch username
        const followerRoleId = '1104679332170969089'; // your follower role ID
    
        const regex = /^[a-zA-Z0-9]+$/;
        if (!regex.test(twitchUsername)) console.log(`User ${twitchUsername} does not match the regex.`)
        try {
          const twitchResponse = await axios.get(`https://api.twitch.tv/helix/users?login=${twitchUsername}`, {
            headers: {
              'Client-ID': process.env.TWITCH_CLIENT_ID,
              'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
            }
          });
    
          if (twitchResponse.data.data.length === 0) {
            console.log(`User ${twitchUsername} does not exist on Twitch.`);
            return;
          }
    
          const twitchUserId = twitchResponse.data.data[0].id;
    
          const followsResponse = await axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${process.env.CASCA_CHANNEL_ID}&from_id=${twitchUserId}`, {
            headers: {
              'Client-ID': process.env.TWITCH_CLIENT_ID,
              'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
            }
          });
    
          const isFollowing = followsResponse.data.total > 0;
    
          if (isFollowing) {
            member.roles.add(followerRoleId);
            console.log(`User ${twitchUsername} is now a follower and has been granted the follower role.`);
          } else {
            console.log(`User ${twitchUsername} is not a follower.`);
          }
        } catch (error) {
          console.error(error);
        }

        const embed = new MessageEmbed()
        .setTitle(`New Member ${member.user.username}`)
        .setColor('#5ac18e')
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(`<@!${member.user.id}> has joined the server!\n\u200b**Nombre total de membre:** ${member.guild.memberCount}`)
        .setTimestamp()
        if (embed.description)
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}