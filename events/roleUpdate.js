const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'roleUpdate',
    on: true,
    execute(oldRole, newRole) {
        if (oldRole.name !== newRole.name) {
            const embed = new MessageEmbed()
            .setTitle('Role Updated')
            .setColor('#ffdf00')
            .setAuthor(newRole.client.user.tag, newRole.client.user.displayAvatarURL())
            .setDescription(`Role **${oldRole.name}** was updated to **${newRole.name}**`)
            .setTimestamp()
            .setFooter({text:`ID: ${newRole.client.user.id}`})
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        } else {
            return
        }
    }
}