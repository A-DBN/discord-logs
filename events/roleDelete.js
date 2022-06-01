const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'roleDelete',
    on: true,
    execute(role) {
        const embed = new MessageEmbed()
        .setTitle('Role Deleted')
        .setColor('#ed1c24')
        .setAuthor(role.client.user.tag, role.client.user.displayAvatarURL())
        .setDescription(`Role **${role.name}** was deleted`)
        .setTimestamp()
        if (embed.description)
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}