const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        if (getObject('voiceStateUpdate').enabled === false) return;
        const embed = new EmbedBuilder()
        if ((oldState.channelId !== newState.channelId) && newState.channelId === null) {
                embed.setTitle('Member left voice channel')
                embed.setAuthor({name: newState.member.user.username, iconURL:newState.member.user.displayAvatarURL()})
                embed.setDescription(`**${oldState.member.user.username}** left 🔈${oldState.channel.name}`)
                embed.setTimestamp()
                embed.setColor(Number(0xff0000))
        } else if (oldState.channelId === null && newState.channelId !== null) {
                embed.setTitle('Member joined voice channel')
                embed.setAuthor({name: newState.member.user.username, iconURL:newState.member.user.displayAvatarURL()})
                embed.setDescription(`**${newState.member.user.username}** joined 🔈${newState.channel.name}`)
                embed.setTimestamp()
                embed.setColor(Number(0x00ff00))
        } else if ((oldState.channelId !== newState.channelId) && (newState.channelId !== null) && (oldState.channelId !== null)) {
                embed.setTitle('Member changed voice channel')
                embed.setAuthor({name: newState.member.user.username, iconURL:newState.member.user.displayAvatarURL()})
                embed.setDescription(`**${newState.member.user.username}** moved from **🔈${oldState.channel.name}** to **🔈${newState.channel.name}**`)
                embed.setTimestamp()
                embed.setColor(Number(0xffff00))
        } else {
            return
        }
        try {
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    }
}