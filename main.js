const env = require('dotenv').config()
const cron = require('node-cron');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const {isLive} = require('./utils/twitchAlert.js')
const {getObject} = require('./utils/utils.js')
const {updateTwitterInfo, updateInstagramInfo, updateTwitchInfo, updateTikTokInfo, updateSpotifyInfo } = require('./networks.js');
const {DisTube} = require('distube')
const {SpotifyPlugin} = require('@distube/spotify')

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

    ],
	sweepers: {
		messages: {
			interval: 10,
			lifetime: 10
		}
	}
});

client.DisTube = new DisTube(client, {emitNewSongOnly: true, leaveOnFinish: true, leaveOnEmpty: true, leaveOnStop: true, plugins: [new SpotifyPlugin(
	{
		api: {
			clientId: process.env.SPOTIFY_CLIENT_ID,
			clientSecret:process.env.SPOTIFY_CLIENT_SECRET,
		},
		parallel: true,
		emitEventsAfterFetching: true,
	}
)]})

//make client global
global.client = client;

require('./deploy-commands.js')


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
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

setInterval(async () => {
	if (getObject('TwitchLiveAlert').enabled === true) isLive();
  }, 1000 * 60 * 3);

cron.schedule('0 0 * * *', () => {
	if (getObject('TwitterUpdate').enabled === true) updateTwitterInfo();
	if (getObject('InstagramUpdate').enabled === true) updateInstagramInfo();
	if (getObject('TwitchUpdate').enabled === true) updateTwitchInfo();
	if (getObject('TikTokUpdate').enabled === true) updateTikTokInfo();
	if (getObject('SpotifyUpdate').enabled === true) updateSpotifyInfo();
});

client.login(process.env.token);