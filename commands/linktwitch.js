const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('linktwitch')
    .setDescription('Give you the follower role if you follow Casca on Twitch'),
  execute: async (interaction) => {
    const modal = new ModalBuilder()
      .setCustomId('modal')
      .setTitle('Lie ton compte Twitch')

      const username = new TextInputBuilder()
        .setCustomId('username')
        .setLabel('Nom d\'utilisateur Twitch')
        .setPlaceholder("Username")
        .setRequired(true)
        .setStyle(TextInputStyle.Short)

      const actionRow = new ActionRowBuilder().addComponents(username)

      modal.addComponents(actionRow)

      await interaction.showModal(modal)
  }
};
