const { Client, Intents, Collection, Interaction } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES] });
global.client = client
const env = require('dotenv').config()
const fs = require('fs')
const cron = require('node-cron');

const {updateTwitterInfo, updateInstagramInfo, updateTwitchInfo } = require('./networks.js')

require('./deploy-commands.js')

client.commands = new Collection()

const eventFiles = fs.readdirSync("./events/").filter(file => file.endsWith(".js"));
const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

for (const commands of commandFiles) {
    const command = require(`./commands/${commands}`)
    client.commands.set(command.data.name, command)
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName)
    if (!command) return

    try {
        await command.execute(interaction).catch(err => {console.log(err)})
    } catch (error) {
        console.error(error)
        return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
})

cron.schedule('0 0 * * *', () => {
    updateTwitterInfo()
    updateInstagramInfo()
    updateTwitchInfo()
});

client.login(process.env.token);