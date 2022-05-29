const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'roleCreate',
    on: true,
    execute(role) {
        const embed = new MessageEmbed()
        .setTitle('Role Created')
        .setColor('#5ac18e')
        .setAuthor(role.client.user.tag, role.client.user.displayAvatarURL())
        .setDescription(`Role **${role.name}** was created`)
        .setTimestamp()
        .setFooter(`ID: ${role.client.user.id}`)
        client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}