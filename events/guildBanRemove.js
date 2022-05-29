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
        .setFooter(`ID: ${ban.user.id}`)
        .setDescription(`<@${ban.user.id}> has been unbanned from the server.`)
        client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}