import { Event } from "../classes/events";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import Canvas from "canvas";

export default new Event({
    name: "guildMemberAdd",
    run: async (client, member) => {
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext("2d");

        const background = await Canvas.loadImage("./assets/bg.jpg");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Load the member's avatar and add it to the canvas
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: "jpg" }));

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
        ctx.font = "bold 36px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(`Bienvenue ${member.user.username}!`, canvas.width / 2, 220);

        const attachment = new AttachmentBuilder(canvas.toBuffer());
        client.chans.get("welcome")?.send({ files: [attachment] });

        const embed = new EmbedBuilder()
            .setTitle(`New Member ${member.user.username}`)
            .setColor(Number(0x5ac18e))
            .setThumbnail(member.user.displayAvatarURL())
            .setDescription(
                `<@!${member.user.id}> has joined the server!\n\u200b**Nombre total de membre:** ${member.guild.memberCount}`
            )
            .setTimestamp();
        try {
            client.chans.get("logs")?.send({ embeds: [embed] });
            client.saveData();
        } catch (error) {
            console.error(error);
        }
    },
});
