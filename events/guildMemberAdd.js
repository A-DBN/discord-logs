const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'guildMemberAdd',
    on: true,
    execute(member) {
        const embed = new MessageEmbed()
        .setTitle(`New Member ${member.user.username}`)
        .setColor('#5ac18e')
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(`<@${member.user.id}> has joined the server!`)
        .setTimestamp()
        .setFooter(`ID: ${member.user.id}`)
        client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}