const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'guildMemberRemove',
    on: true,
    async execute(member) {
        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });
        const kickLog = fetchedLogs.entries.first();
        if (!kickLog) {
            const embed = new MessageEmbed()
            .setTitle('Member Removed')
            .setColor('#ed1c24')
            .setDescription(`<@!${member.user.id}> has left the server`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp()
            if (embed.description)
                return client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        }
    
        const { executor, target } = kickLog;
    
        if (target.id === member.id) {
            const embed = new MessageEmbed()
            .setTitle('Member Removed')
            .setColor('#ed1c24')
            .setDescription(`**${member.user.tag}** was kicked by <@${executor.id}>`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp()
            if (embed.description)
                client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        } else {
            const embed = new MessageEmbed()
            .setTitle('Member Removed')
            .setColor('#ffdf00')
            .setDescription(`**${member.user.tag}** was kicked`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp()
            if (embed.description)
                client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        }
    }
}