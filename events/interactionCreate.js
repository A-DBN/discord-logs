const { EmbedBuilder } = require('@discordjs/builders');
const { Events, InteractionType } = require('discord.js');
const env = require ('dotenv').config()
const _ = require('lodash')
const { updateEmbed } = require('../utils/team.js');
const {skip, previous, stop, loop, queue, loopqueue} = require('../music/commands.js')
const axios = require('axios')

function handleRoleButton(interaction) {
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
}

async function handleChatInputCommand(interaction) {
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
}

async function handleFiveStack(interaction)
{
    if (interaction.customId === 'Join') {
        if (players.includes(interaction.user.id)) return 
        if (players.length > 5) return interaction.reply({ content: 'The team is full!', ephemeral: true })
        players.push(interaction.user.id);
        updateEmbed(interaction)
    } else if (interaction.customId === 'Leave') {
        const index = players.indexOf(interaction.user.id);
        if (index > -1) {
            players.splice(index, 1);
            updateEmbed(interaction)
        } else {
            interaction.reply({ content: 'You are not in the team!', ephemeral: true });
        }
    }
    interaction.deferUpdate()
}

async function handleAutoComplete(interaction) {
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try{
        await command.autocomplete(interaction);
    } catch(error) {
        console.error(error);
    }
}

async function linkTwitch(interaction) {
    const followerRoleId = '1104681838997422080';
    const member = interaction.member;
    const twitchUsername = interaction.fields.getTextInputValue('username');

    if (member.roles.cache.has(followerRoleId)) {
      return interaction.reply({ content: 'Tu as déjà le rôle Follower', ephemeral: true });
    }

    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const username = 'areittv';
  
    // Generate access token
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'client_credentials');
    params.append('scope', 'user:read:email');
  
    const { data: { access_token } } = await axios.post(`https://id.twitch.tv/oauth2/token`, params);

    try {
      const twitchResponse = await axios.get(`https://api.twitch.tv/helix/users?login=${twitchUsername}`, {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${access_token}`
        }
      });
      if (twitchResponse.data.data.length === 0) {
        return interaction.reply({ content: 'Cet utilisateur n\'existe pas si tu penses que c\'est une erreur tag @\\zenkiud.', ephemeral: true });
      }
      const twitchUserId = twitchResponse.data.data[0].id;

      const followsResponse = await axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${process.env.CASCA_CHANNEL_ID}&from_id=${twitchUserId}`, {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${access_token}`
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

function handleMusicButton(interaction) {
    const command = interaction.customId;
    switch (command) {
        case 'stop':
            stop(interaction, client)
            break;
        case 'skip':
            skip(interaction, client)
            break;
        case 'previous':
            previous(interaction, client)
            break
        case 'queue':
            queue(interaction, client)
            break
        case 'loop':
            loop(interaction, client)
            break
        case 'loopqueue':
            loopqueue(interaction, client)
            break
    }
}

async function handleButtons(interaction) {
    if (interaction.channelId === '980471046815772717') {
        handleRoleButton(interaction)
    } else if (interaction.commandName === 'fivestack') {
        try {
            handleFiveStack(interaction)
        } catch (error) {
            interaction.message.delete()
            interaction.reply({ content: 'Une erreur est survenue, l\'intéraction a donc été supprimée', ephemeral: true });
        }
    } else {
        handleMusicButton(interaction)
    }
}

module.exports = {
    name: Events.InteractionCreate,
    on: true,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            await handleChatInputCommand(interaction)
        } else if (interaction.isButton()) {
            await handleButtons(interaction)
        } else if (interaction.isAutocomplete()){
            await handleAutoComplete(interaction)
        } else if (interaction.isModalSubmit()) {
            linkTwitch(interaction)
        }
    }
}
