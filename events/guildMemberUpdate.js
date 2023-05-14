const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()
const _ = require('lodash')

module.exports = {
    name: 'guildMemberUpdate',
    on: true,
    execute(oldMember, newMember) {
        const embed = new MessageEmbed()
        if (oldMember.user.username !== newMember.user.username) {
            embed.setTitle('Name Changed')
            embed.setColor('#ffdf00')
            embed.setAuthor({name: newMember.user.username + "#" + newMember.user.discriminator, iconURL:"https://cdn.discordapp.com/avatars/" + newMember.user.id + "/" + newMember.user.avatar})
            embed.setDescription(`**Before:** ${oldMember.user.username}\n**+After:** ${newMember.user.username}`)
            embed.setTimestamp()
        } else if (oldMember.user.discriminator !== newMember.user.discriminator) {
            embed.setTitle('Discriminator Update')
            embed.setColor('#ffdf00')
            embed.setAuthor({name: newMember.user.username + "#" + newMember.user.discriminator, iconURL:"https://cdn.discordapp.com/avatars/" + newMember.user.id + "/" + newMember.user.avatar})
            embed.setThumbnail(newMember.user.displayAvatarURL())
            embed.setDescription(`**Before:** ${oldMember.user.discriminator}\n**+After:** ${newMember.user.discriminator}`)
            embed.setTimestamp()
        }  else if (oldMember._roles.length !== newMember._roles.length) {
            embed.setTitle('Roles Update')
            embed.setColor('#ffdf00')
            embed.setAuthor({name: newMember.user.username + "#" + newMember.user.discriminator, iconURL:"https://cdn.discordapp.com/avatars/" + newMember.user.id + "/" + newMember.user.avatar})
            embed.setThumbnail(newMember.user.displayAvatarURL())
            oldMember._roles.length > newMember._roles.length ? embed.setDescription(`Deleted role <@&${_.difference(oldMember._roles, newMember._roles)[0]}>`) : embed.setDescription(`Added role <@&${_.difference(newMember._roles, oldMember._roles)[0]}>`)
            embed.setTimestamp()
        } else {
            embed.setTitle('Member Updated')
            embed.setColor('#ffdf00')
            embed.setAuthor({name: newMember.user.username + "#" + newMember.user.discriminator, iconURL:"https://cdn.discordapp.com/avatars/" + newMember.user.id + "/" + newMember.user.avatar})
            embed.setThumbnail(newMember.user.displayAvatarURL())
            embed.setDescription('Member informations updated')
            embed.setTimestamp()
        }
        if (embed.description)
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}
