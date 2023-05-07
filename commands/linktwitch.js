const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const env = require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('linktwitch')
    .setDescription('Give you the follower role if you follow Casca on Twitch')
    .addStringOption(option => option.setName('name').setRequired(true).setDescription('Twitch Name')),
  execute: async (interaction) => {
    const followerRoleId = '1104679332170969089';
    const member = interaction.member;
    const twitchUsername = interaction.options.getString('name');

    if (member.roles.cache.has(followerRoleId)) {
      return interaction.reply({ content: 'Tu as déjà le rôle Follower', ephemeral: true });
    }

    try {
      const twitchResponse = await axios.get(`https://api.twitch.tv/helix/users?login=${twitchUsername}`, {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
        }
      });
      if (twitchResponse.data.data.length === 0) {
        return interaction.reply({ content: 'Cet utilisateur n\'existe pas si tu penses que c\'est une erreur tag @\\zenkiud.', ephemeral: true });
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
        return interaction.reply({ content: 'Félicitations, Tu as maintenant le rôle Follower', ephemeral: true });
      } else {
        return interaction.reply({ content: 'Tu dois être follow à la chaine afin d\'obtenir le rôle !', ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue, tag @\\zenkiud si le problème persiste', ephemeral: true });
    }
  }
};
