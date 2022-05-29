const { SlashCommandBuilder } = require('@discordjs/builders')
const {MessageEmbed} = require('discord.js')
const env = require('dotenv').config()

module.exports = {
    data: new SlashCommandBuilder()
            .setName('test')
            .setDescription('Makes API call to apex')
            .addStringOption(option => option.setName('option').setRequired(true).setDescription('stats/game/news')),
        execute: async (interaction) => {
            const username = interaction.user.username
            const option = interaction.options.getString('option')
            return interaction.reply(`${username} said ${option}`)
        }
}