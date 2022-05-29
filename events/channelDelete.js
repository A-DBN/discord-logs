const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'channelDelete',
    on: true,
    execute(channel) {
        const embed = new MessageEmbed()
        .setTitle('Channel Deleted')
        .setColor('#ed1c24')
        .setThumbnail(channel.client.user.avatarURL())
        .setDescription(`Channel **${channel.name}** was deleted`)
        .setTimestamp()
        .setFooter({text:`ID: ${channel.client.user.id}`});
        client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}