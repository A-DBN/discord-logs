const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'emojiDelete',
    on: true,
    execute(emoji) {
        const embed = new MessageEmbed()
        .setTitle('Emoji Deleted')
        .setColor('#ed1c24')
        .setDescription(`Emoji ${emoji.name} has been deleted`)
        .setThumbnail(emoji.url)
        .setTimestamp()
        client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}