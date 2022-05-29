const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'emojiCreate',
    on: true,
    execute(emoji) {
        const embed = new MessageEmbed()
        .setTitle('Emoji Created')
        .setColor('#5ac18e')
        .setDescription(`Emoji **${emoji.name}** has been created`)
        .setThumbnail(emoji.url)
        .setTimestamp()
        client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}