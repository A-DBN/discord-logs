const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: "inviteDelete",
    on: true,
    execute(invite) {
        const embed = new MessageEmbed()
        .setTitle("Invite Deleted")
        .setColor("#ed1c24")
        .setDescription(`**Invite**: ${invite.code}\n**Channel**: <#${invite.channel.id}>\n**Guild**: ${invite.guild.name}`)
        .setTimestamp()
        if (embed.description)
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}