const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: "inviteCreate",
    on: true,
    execute(invite) {
        console.log(invite)
        const embed = new MessageEmbed()
        .setTitle("Invite Created")
        .setColor("#5ac18e")
        .setAuthor({name: inviter.inviter.tag, iconURL:invite.inviter.displayAvatarURL()})
        .setDescription(`**Invite**: ${invite.code}\n**Channel**: ${invite.channel.name}\n**Guild**: ${invite.guild.name}`)
        .setTimestamp()
        .setFooter({text: `ID: ${invite.guild.id}`})
        client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}