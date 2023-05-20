const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        console.log("5")
        if (getObject('voiceStateUpdate').enabled === false) return;
        const embed = new EmbedBuilder()
        if ((oldState.channelId !== newState.channelId) && newState.channelId === null) {
                embed.setTitle('Member left voice channel')
                embed.setAuthor({name: newState.member.user.tag, iconURL:newState.member.user.displayAvatarURL()})
                embed.setDescription(`**${oldState.member.user.tag}** left 🔈${oldState.channel.name}`)
                embed.setTimestamp()
                embed.setColor(Number(0xff0000))
        } else if (oldState.channelId === null && newState.channelId !== null) {
                embed.setTitle('Member joined voice channel')
                embed.setAuthor({name: newState.member.user.tag, iconURL:newState.member.user.displayAvatarURL()})
                embed.setDescription(`**${newState.member.user.tag}** joined 🔈${newState.channel.name}`)
                embed.setTimestamp()
                embed.setColor(Number(0x00ff00))
        } else if ((oldState.channelId !== newState.channelId) && (newState.channelId !== null) && (oldState.channelId !== null)) {
                embed.setTitle('Member changed voice channel')
                embed.setAuthor({name: newState.member.user.tag, iconURL:newState.member.user.displayAvatarURL()})
                embed.setDescription(`**${newState.member.user.tag}** moved from **🔈${oldState.channel.name}** to **🔈${newState.channel.name}**`)
                embed.setTimestamp()
                embed.setColor(Number(0xffff00))
        }
        if (embed.description !== '')
                client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}