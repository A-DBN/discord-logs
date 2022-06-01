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
        .setDescription(`<@!${member.user.id}> has joined the server!\n\u200b**Nombre total de membre:** ${member.guild.memberCount}`)
        .setTimestamp()
        if (embed.description)
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}