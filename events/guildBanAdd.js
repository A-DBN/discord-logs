const {MessageEmbed} = require('discord.js');
const env = require ('dotenv').config()

module.exports = {
    name: 'guildBanAdd',
    on: true,
    execute(ban) {
        const embed = new MessageEmbed()
        .setTitle('Member Banned')
        .setColor('#ed1c24')
        .setThumbnail(ban.user.displayAvatarURL())
        .setTimestamp()
        if (ban.reason)
            embed.setDescription(`<@${ban.user.id}> has been banned from the server.\n\nReason: ${ban.reason}`)
        else 
            embed.setDescription(`<@${ban.user.id}> has been banned from the server*.`)
        if (embed.description)
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}