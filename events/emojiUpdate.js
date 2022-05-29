const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'emojiUpdate',
    on: true,
    execute(oldEmoji, newEmoji) {
        if (oldEmoji.name !== newEmoji.name) {
            const embed = new MessageEmbed()
            .setTitle('Emoji Updated')
            .setDescription(`${oldEmoji.name} has been updated to ${newEmoji.name}`)
            .setColor('#ffdf00')
            .setTimestamp()
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        }
    }
}