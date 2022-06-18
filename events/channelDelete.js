const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'channelDelete',
    on: true,
    execute(channel) {
        const embed = new MessageEmbed()
        .setTitle('Channel Deleted')
        .setColor('#ed1c24')
        .setDescription(`Channel **${channel.name}** was deleted`)
        .setTimestamp()
        if (embed.description)
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}