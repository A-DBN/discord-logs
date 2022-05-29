const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'guildMemberUpdate',
    on: true,
    execute(oldMember, newMember) {
        if (!oldMember.roles.cache.has('729455408451944460') && newMember.roles.cache.has('729455408451944460')) {
            newMember.roles.remove('908788259591700512')
        }
        const embed = new MessageEmbed()
        if (oldMember.user.username !== newMember.user.username) {
            embed.setTitle('Name Changed')
            embed.setColor('#ffdf00')
            .setAuthor({name: newMessage.author.tag, iconURL:newMessage.author.displayAvatarURL()})
            embed.setDescription(`**Before:** ${oldMember.user.username}\n**+After:** ${newMember.user.username}`)
            embed.setTimestamp()
            embed.setFooter(`ID: ${newMember.user.id}`)
        } else if (oldMember.user.discriminator !== newMember.user.discriminator) {
            embed.setTitle('Discriminator Update')
            embed.setColor('#ffdf00')
            .setAuthor({name: newMessage.author.tag, iconURL:newMessage.author.displayAvatarURL()})
            embed.setThumbnail(newMember.user.displayAvatarURL())
            embed.setDescription(`**Before:** ${oldMember.user.discriminator}\n**+After:** ${newMember.user.discriminator}`)
            embed.setTimestamp()
            embed.setFooter(`ID: ${newMember.user.id}`)
        } else {
            embed.setTitle('Member Updated')
            embed.setColor('#ffdf00')
            .setAuthor({name: newMessage.author.tag, iconURL:newMessage.author.displayAvatarURL()})
            embed.setThumbnail(newMember.user.displayAvatarURL())
            embed.setDescription('Member informations updated')
            embed.setTimestamp()
            embed.setFooter(`ID: ${newMember.user.id}`)
        }
        client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}