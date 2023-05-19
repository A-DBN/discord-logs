const env = require('dotenv').config()
const cron = require('node-cron');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const {isLive} = require('./utils/twitchAlert.js')
const {getObject} = require('./utils/utils.js')
const {updateTwitterInfo, updateInstagramInfo, updateTwitchInfo, updateTikTokInfo, updateSpotifyInfo } = require('./networks.js');
const { updateEmbed } = require('./utils/team.js');

// Create a new client instance
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,

    ]});

//make client global
global.client = client;

require('./deploy-commands.js')

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventsFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args))
	} else {
		client.on(event.name, (...args) => event.execute(...args))
	}
}


for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	} else if (interaction.isButton()) {
		if (interaction.channelId === '980471046815772717') {
			const roleName = interaction.customId;
			const role = interaction.guild.roles.cache.find(role => role.name === roleName);

			if (role) {
				const member = interaction.guild.members.cache.get(interaction.user.id);
				if (interaction.member.roles.cache.has(role.id)) {
				member.roles.remove(role)
					.then(() => {
					console.log(`Removed role ${roleName} from ${member.user.tag}`);
					})
					.catch(console.error);
				} else {
				member.roles.add(role)
					.then(() => {
					console.log(`Assigned role ${roleName} to ${member.user.tag}`);
					})
					.catch(console.error);
				}
				interaction.deferUpdate()
			} else {
				console.log(`Role ${roleName} not found.`);
			}
		} else {
			if (interaction.customId === 'Join') {
				if (players.includes(interaction.user.id)) return 
				players.push(interaction.user.id);
				updateEmbed(interaction)
			} else if (interaction.customId === 'Leave') {
				const index = players.indexOf(interaction.user.id);
				if (index > -1) {
					players.splice(index, 1);
				}
				updateEmbed(interaction)
			}
			interaction.deferUpdate()
		}
	}
});

setInterval(async () => {
	if (getObject('TwitchLiveAlert').enabled === true) isLive();
  }, 1000 * 20 * 1);
  

cron.schedule('0 0 * * *', () => {
	if (getObject('TwitterUpdate').enabled === true) updateTwitterInfo();
	if (getObject('InstagramUpdate').enabled === true) updateInstagramInfo();
	if (getObject('TwitchUpdate').enabled === true) updateTwitchInfo();
	if (getObject('TikTokUpdate').enabled === true) updateTikTokInfo();
	if (getObject('SpotifyUpdate').enabled === true) updateSpotifyInfo();
});

// Log in to Discord with your client's token
client.login(process.env.token);