const { EmbedBuilder } = require('@discordjs/builders');
const { Events, InteractionType } = require('discord.js');
const env = require ('dotenv').config()
const _ = require('lodash')
const { updateEmbed } = require('../utils/team.js');

function handleButton(interaction) {
    console.log("je passe dedans ?")
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

module.exports = {
    name: Events.InteractionCreate,
    on: true,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            await handleChatInputCommand(interaction)
        } else if (interaction.isButton()) {
            if (interaction.channelId === '980471046815772717') {
                handleButton(interaction)
            } else if (interaction.commandName === 'fivestack') {
                try {
                    handleFiveStack(interaction)
                } catch (error) {
                    interaction.message.delete()
                    interaction.reply({ content: 'Une erreur est survenue, l\'intéraction a donc été supprimée', ephemeral: true });
                }
            }
        } else if (interaction.isAutocomplete()){
            await handleAutoComplete(interaction)
        }
    }
}
