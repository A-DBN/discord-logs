const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'channelCreate',
    on: true,
    execute(channel) {
        if (getObject('channelCreate').enabled === false) {console.log("c\'est desactivé") ;return};
        const embed = new EmbedBuilder()
        .setTitle('Channel Created')
        .setColor(Number(0x5ac18e))
        .setDescription(`Channel **${channel.name}** created`)
        .setTimestamp()
        if (embed.description !== '')
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}