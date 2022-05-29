const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'messageDeleteBulk',
    on: true,
    execute(messages) {
        if (messages.first().channel.id !== process.env.log_channel_id && !messages.first().author.bot) {
            const embed = new MessageEmbed()
            .setTitle('Message Bulk')
            .setColor('#ed1c24')
            .setDescription(`${messages.size} messages have been deleted.`)
            .setTimestamp()
            .setFooter(`${client.user.username}`, client.user.avatarURL());
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        } else {
            return
        }
    }
}