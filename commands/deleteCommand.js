const { SlashCommandBuilder } = require('@discordjs/builders')
const {MessageEmbed} = require('discord.js')
const env = require('dotenv').config()
const childProcess = require('child_process')
const { Permissions} = require('discord.js')
const fs = require('fs')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
            .setName('deletecommand')
            .setDescription('Delete a command')
            .addStringOption(option => option.setName('name').setRequired(true).setDescription('Command name')),
        execute: async (interaction) => {
            if (!interaction.memberPermissions.has(Permissions.FLAGS.BAN_MEMBERS)) interaction.reply("Bah t'as pas les perm frerot")
            const username = interaction.user.username
            const name = interaction.options.getString('name')
            fs.rm(__dirname + `\\${name}.js`, function(err) {
                if (err) return interaction.reply(`${username}, command ${name} doesn't exist!`)
                return interaction.reply(`${username}, command ${name} deleted!`)
            })
        }
}
