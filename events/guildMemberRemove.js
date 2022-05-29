const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'guildMemberRemove',
    on: true,
    execute(member) {
        const embed = new MessageEmbed()
        .setTitle('Member Removed')
        .setColor('#ffdf00')
        .setDescription(`<@${member.user.id}> has left the server`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter('Member left')
        client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}