const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'channelUpdate',
    on: true,
    execute(oldChannel, newChannel) {
        console.log("3")
        if (oldChannel.name !== newChannel.name) {
            if (getObject('channelUpdate').enabled === false) return;
            const embed = new EmbedBuilder()
            .setTitle("Channel Update")
            .setColor(Number(0xffdf00))
            .setDescription(`Channel **${oldChannel.name}** has been updated to **${newChannel.name}** `)
            .setTimestamp()
            if (embed.description !== '')
                client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        }
    }
}