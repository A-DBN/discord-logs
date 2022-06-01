const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: "inviteCreate",
    on: true,
    execute(invite) {
        const embed = new MessageEmbed()
        .setTitle("Invite Created")
        .setColor("#5ac18e")
        .setAuthor({name: invite.inviter.username + "#" + invite.inviter.discriminator, iconURL:"https://cdn.discordapp.com/avatars/" + invite.inviter.id + "/" + invite.inviter.avatar})
        .setDescription(`**Invite**: ${invite.code}\n**Channel**: <#${invite.channel.id}>\n**Guild**: ${invite.guild.name}`)
        .setTimestamp()
        if (embed.description)
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}