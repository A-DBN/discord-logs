const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'messageUpdate',
    on: true,
    execute(oldMessage, newMessage) {
        if (oldMessage.channel.id !== process.env.log_channel_id && !oldMessage.author.bot) {
            const embed = new MessageEmbed()
            .setTitle(`Message Updated in #${newMessage.channel.name}`)
            .setAuthor({name: newMessage.author.tag, iconURL:newMessage.author.displayAvatarURL()})
            .setColor('#ffdf00')
            .setDescription(`${oldMessage.author} updated a message in ${oldMessage.channel}\n\n**Before**\n${oldMessage.content}\n\n**After**\n${newMessage.content}`)	
            .setTimestamp()
            if (embed.description)
                client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        } else { 
            return
        }
    }
}