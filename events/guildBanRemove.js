const {MessageEmbed} = require('discord.js');
const env = require ('dotenv').config()

module.exports = {
    name: 'guildBanRemove',
    on: true,
    execute(ban) {
        const embed = new MessageEmbed()
        .setTitle('Member Unbanned')
        .setColor('#ffdf00')
        .setThumbnail(ban.user.displayAvatarURL())
        .setTimestamp()
        .setDescription(`<@${ban.user.id}> has been unbanned from the server.`)
        if (embed.description)
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}