const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'channelUpdate',
    on: true,
    execute(oldChannel, newChannel) {
        if (oldChannel.name !== newChannel.name) {
            const embed = new MessageEmbed()
            .setTitle("Channel Update")
            .setColor("#ffdf00")
            .setThumbnail(newChannel.client.user.avatarURL())
            .setDescription(`Channel **${oldChannel.name}** has been updated to **${newChannel.name}** `)
            .setTimestamp()
            .setFooter(`ID: ${newChannel.client.user.id}`);
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        }
    }
}