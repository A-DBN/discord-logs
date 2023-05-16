const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'emojiDelete',
    on: true,
    execute(emoji) {
        if (getObject('emojiDelete').enabled === false) return;
        const embed = new EmbedBuilder()
        .setTitle('Emoji Deleted')
        .setColor(Number(0xed1c24))
        .setDescription(`Emoji ${emoji.name} has been deleted`)
        .setThumbnail(emoji.url)
        .setTimestamp()
        if (embed.description !== '')
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}