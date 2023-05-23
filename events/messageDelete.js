const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'messageDelete',
    on: true,
    execute(message) {
        console.log("6")
        if (getObject('messageDelete').enabled === false) return;
        if (message.channel.id !== process.env.log_channel_id && !message.author.bot) {
            const embed = new EmbedBuilder()
                .setTitle(`Message Deleted in #${message.channel.name}`)
                .setAuthor({name: message.author.tag, iconURL:message.author.displayAvatarURL()})
                .setDescription(`${message.content}`)
                .setColor(Number(0xed1c24))
                .setTimestamp()
                try {
                    client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
                } catch (error) {
                    console.error(error);
                }
        } else {
            return 
        }
    }
}