const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'channelDelete',
    on: true,
    execute(channel) {
        console.log("2")
        if (getObject('channelDelete').enabled === false) return;
        const embed = new EmbedBuilder()
        .setTitle('Channel Deleted')
        .setColor(Number(0xed1c24))
        .setDescription(`Channel **${channel.name}** was deleted`)
        .setTimestamp()
        if (embed.description !== '')
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}