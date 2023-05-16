const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'emojiUpdate',
    on: true,
    execute(oldEmoji, newEmoji) {
        if (getObject('emojiUpdate').enabled === false) return;
        if (oldEmoji.name !== newEmoji.name) {
            const embed = new EmbedBuilder()
            .setTitle('Emoji Updated')
            .setDescription(`${oldEmoji.name} has been updated to ${newEmoji.name}`)
            .setColor(Number(0xffdf00))
            .setTimestamp()
            if (embed.description !== '')
                client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        }
    }
}