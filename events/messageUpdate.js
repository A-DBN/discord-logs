const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const _ = require('lodash')
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'messageUpdate',
    on: true,
    execute(oldMessage, newMessage) {
        console.log("4")
        if (getObject('messageUpdate').enabled === false) return;
        if (oldMessage.channel.id !== process.env.log_channel_id && !oldMessage.author.bot && oldMessage.content !== newMessage.content) {
            const embed = new EmbedBuilder()
            .setTitle(`Message Updated in #${newMessage.channel.name}`)
            .setAuthor({name: newMessage.author.tag, iconURL:newMessage.author.displayAvatarURL()})
            .setColor(Number(0xffdf00))
            .setDescription(`${oldMessage.author} updated a message in ${oldMessage.channel}\n\n**Before**\n${oldMessage.content}\n\n**After**\n${newMessage.content}`)	
            .setTimestamp()
            try {
                client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
            } catch (error) {
                console.error(error);
            }
        } else { 
            return
        }
    }
}