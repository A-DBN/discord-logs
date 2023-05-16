const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'emojiCreate',
    on: true,
    execute(emoji) {
        if (getObject('emojiCreate').enabled === false) return;
        const embed = new EmbedBuilder()
        .setTitle('Emoji Created')
        .setColor(Number(0x5ac18e))
        .setDescription(`Emoji **${emoji.name}** has been created`)
        .setThumbnail(emoji.url)
        .setTimestamp()
        if (embed.description !== '')
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}