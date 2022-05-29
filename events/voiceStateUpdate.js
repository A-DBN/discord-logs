const {MessageEmbed} = require('discord.js');
const env = require ('dotenv').config()

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        const embed = new MessageEmbed()
        if ((oldState.channelId !== newState.channelId) && newState.channelId === null) {
                embed.setTitle('Member left voice channel')
                .setAuthor({name: newState.member.user.tag, iconURL:newState.member.user.displayAvatarURL()})
                embed.setDescription(`**${oldState.member.user.tag}** left 🔈${oldState.channel.name}`)
                embed.setTimestamp()
                embed.setColor('#ff0000')
                embed.setFooter({text:`ID: ${newState.member.id}`});
        } else if (oldState.channelId === null && newState.channelId !== null) {
                embed.setTitle('Member joined voice channel')
                .setAuthor({name: newState.member.user.tag, iconURL:newState.member.user.displayAvatarURL()})
                embed.setDescription(`**${newState.member.user.tag}** joined 🔈${newState.channel.name}`)
                embed.setTimestamp()
                embed.setColor('#00ff00')
                embed.setFooter({text:`ID: ${newState.member.id}`});
        } else if ((oldState.channelId !== newState.channelId) && (newState.channelId !== null) && (oldState.channelId !== null)) {
                embed.setTitle('Member changed voice channel')
                .setAuthor({name: newState.member.user.tag, iconURL:newState.member.user.displayAvatarURL()})
                embed.setDescription(`**${newState.member.user.tag}** moved from **🔈${oldState.channel.name}** to **🔈${newState.channel.name}**`)
                embed.setTimestamp()
                embed.setColor('#ffff00')
                embed.setFooter({text:`ID: ${newState.member.id}`});
        }
        client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}