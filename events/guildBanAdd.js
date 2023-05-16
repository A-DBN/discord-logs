const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'guildBanAdd',
    on: true,
    execute(ban) {
        if (getObject('guildBanAdd').enabled === false) return;
        const embed = new EmbedBuilder()
        .setTitle('Member Banned')
        .setColor(Number(0xed1c24))
        .setThumbnail(ban.user.displayAvatarURL())
        .setTimestamp()
        if (ban.reason)
            embed.setDescription(`<@${ban.user.id}> has been banned from the server.\n\nReason: ${ban.reason}`)
        else 
            embed.setDescription(`<@${ban.user.id}> has been banned from the server*.`)
            if (embed.description !== '')
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}