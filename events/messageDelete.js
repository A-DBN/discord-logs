const { MessageEmbed } = require('discord.js');
const env = require ('dotenv').config()

module.exports = {
    name: 'messageDelete',
    on: true,
    execute(message) {
        if (message.channel.id !== process.env.log_channel_id && !message.author.bot) {
            const embed = new MessageEmbed()
                .setTitle(`Message Deleted in #${message.channel.name}`)
                .setAuthor({name: message.author.tag, iconURL:message.author.displayAvatarURL()})
                .setDescription(`${message.content}`)
                .setColor('#ed1c24')
                .setTimestamp()
                if (embed.description)
                    client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        } else {
            return 
        }
    }
}