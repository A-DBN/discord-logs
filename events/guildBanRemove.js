const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'guildBanRemove',
    on: true,
    execute(ban) {
        if (getObject('guildBanRemove').enabled === false) return;
        const embed = new EmbedBuilder()
        .setTitle('Member Unbanned')
        .setColor(Number(0xffdf00))
        .setThumbnail(ban.user.displayAvatarURL())
        .setTimestamp()
        .setDescription(`<@${ban.user.id}> has been unbanned from the server.`)
        if (embed.description !== '')
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}