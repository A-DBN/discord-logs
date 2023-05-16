const { SlashCommandBuilder } = require('@discordjs/builders')
const fs = require('fs');

const eventsFile = fs.readFileSync('Stockage/events.json');
const events = JSON.parse(eventsFile);

const choices = events.events
  .filter(event => event.enabled)
  .map(event => ({
    name: event.name,
    value: event.value
  }));

// console.log(...choices)

module.exports = {
        data: new SlashCommandBuilder()
            .setName('eventoff')
            .setDescription('Désactive un ou plusieurs events')
            .addStringOption(option => option.setName('event').setDescription('Selectionne un event à désactiver').setRequired(true).addChoices(...choices)),
        execute: async (interaction) => {
            const user = interaction.user;
            const allowedUser = ['655815335257178125', '927672705375928350'];
  
            if (!allowedUser.includes(user.id)) {
                await interaction.reply('You are not allowed to use this command.');
                return;
              }
            const event = interaction.options.getString('event')

            const eventsFile = fs.readFileSync('Stockage/events.json')
            const events = JSON.parse(eventsFile)

            // Find the event with the given name and set its enabled property to false
            const eventIndex = events.events.findIndex((e) => e.value === event)
            if (eventIndex !== -1) {
                events.events[eventIndex].enabled = false
                            // Write the updated events data back to the file
              fs.writeFileSync('Stockage/events.json', JSON.stringify(events, 0, 4))

              return await interaction.reply(
              `L'event ${event} a été désactivé avec succès!`
              )
            } else {
              await interaction.reply("Une erreur est survenue pendant la désactivation de l'event")
            }
        }            
}
