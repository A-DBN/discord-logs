const {AttachmentBuilder, AuditLogEvent} = require("discord.js");
const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const Canvas = require('canvas');
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'guildMemberRemove',
    on: true,
    async execute(member) {
        if (getObject('guildMemberRemove').enabled === false) return;
        // const fetchedLogs = await member.guild.fetchAuditLogs({
        //     limit: 1,
        //     type: AuditLogEvent.MemberKick,
        // });
        // const kickLog = fetchedLogs.entries.first();
        // if (!kickLog) {
        //     const embed = new EmbedBuilder()
        //     .setTitle('Member Removed')
        //     .setColor(0xed1c24)
        //     .setDescription(`<@!${member.user.id}> has left the server`)
        //     .setThumbnail(member.user.displayAvatarURL())
        //     .setTimestamp()
        //     if (embed.description)
        //         return client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        // }
    
        // const { executor, target } = kickLog;
    
        // if (target.id === member.id) {
        //     const embed = new EmbedBuilder()
        //     .setTitle('Member Removed')
        //     .setColor(0xed1c24)
        //     .setDescription(`**${member.user.tag}** was kicked by <@${executor.id}>`)
        //     .setThumbnail(member.user.displayAvatarURL())
        //     .setTimestamp()
        //     if (embed.description)
        //         client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        // } else {
        //     const embed = new EmbedBuilder()
        //     .setTitle('Member Removed')
        //     .setColor(Number(0xffdf00))
        //     .setDescription(`**${member.user.tag}** was kicked`)
        //     .setThumbnail(member.user.displayAvatarURL())
        //     .setTimestamp()
        //     if (embed.description)
        //         client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        // }

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
        const channel = client.channels.cache.get('980527661422108702');
        // 980471046815772714

        const background = await Canvas.loadImage('./assets/bg.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
        // Load the member's avatar and add it to the canvas
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
    
        // Draw a circular clip around the avatar
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 100, 75, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
    
        // Draw the avatar in the center of the canvas
        ctx.drawImage(avatar, canvas.width / 2 - 75, 25, 150, 150);
    
        // Restore the canvas so that the text is not clipped
        ctx.restore();
    
        // Add the welcome message below the avatar
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`${member.user.username} nous a trahis !`, canvas.width / 2, 220);
    
    
        const attachment = new AttachmentBuilder(canvas.toBuffer(), 'welcome-image.png');
        channel.send({files: [attachment]})
    }
}