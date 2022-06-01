const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'channelCreate',
    on: true,
    execute(channel) {
        const embed = new MessageEmbed()
        .setTitle('Channel Created')
        .setColor('#5ac18e')
        .setThumbnail(channel.client.user.avatarURL())
        .setDescription(`Channel **${channel.name}** with the name ${channel.name}`)
        .setTimestamp()
        if (embed.description)
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}