const { SlashCommandBuilder } = require('@discordjs/builders')
const {MessageEmbed} = require('discord.js')
const env = require('dotenv').config()
const childProcess = require('child_process')
const { Permissions} = require('discord.js')

function runScript(scriptPath, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}

module.exports = {
    data: new SlashCommandBuilder()
            .setName('createcommand')
            .setDescription('Create a new command')
            .addStringOption(option => option.setName('type').setRequired(true).setDescription('The option to create (Target/Message)'))
            .addStringOption(option => option.setName('name').setRequired(true).setDescription('Command name'))
            .addStringOption(option => option.setName('description').setRequired(true).setDescription('Command description'))
            .addStringOption(option => option.setName('message').setRequired(true).setDescription('Command message')),
        execute: async (interaction) => {
            if (!interaction.memberPermissions.has(Permissions.FLAGS.BAN_MEMBERS)) interaction.reply("Bah t'as pas les perm frerot")
            const username = interaction.user.username
            const type = interaction.options.getString('type')
            const name = interaction.options.getString('name')
            const description = interaction.options.getString('description')
            const message = interaction.options.getString('message')
            childProcess.exec(`sh create_command.sh ${type} ${name} ${description} ${message}`)
            return interaction.reply(`${username}, command ${name} created!`)
        }
}
