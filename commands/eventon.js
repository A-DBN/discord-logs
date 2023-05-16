const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

const eventsFile = fs.readFileSync('Stockage/events.json');
const events = JSON.parse(eventsFile);

const choices = events.events
  .filter(event => !event.enabled)
  .map(event => ({
    name: event.name,
    value: event.value
  }));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eventon')
    .setDescription('Active un ou plusieurs events')
    .addStringOption(option => option.setName('event').setDescription('Selectionne un event à activer').setRequired(true).addChoices(...choices)),
  execute: async (interaction) => {
    const user = interaction.user;
    const allowedUser = ['655815335257178125', '927672705375928350'];
  
    if (!allowedUser.includes(user.id)) {
        await interaction.reply('You are not allowed to use this command.');
        return;
      }
    const eventName = interaction.options.getString('event');

    const eventsFile = fs.readFileSync('Stockage/events.json');
    const events = JSON.parse(eventsFile);

    const eventIndex = events.events.findIndex((event) => event.value === eventName);
    if (eventIndex !== -1) {
      events.events[eventIndex].enabled = true;
      fs.writeFileSync('Stockage/events.json', JSON.stringify(events, 0, 4));

      return await interaction.reply(
        `L'événement ${eventName} a été activé avec succès !`
      );
    } else {
      await interaction.reply("Une erreur est survenue pendant l'activation de l'événement");
    }
  },
};
