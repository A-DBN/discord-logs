import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import Canvas from "canvas";
import { Event } from "../classes/events";

export default new Event({
    name: "guildMemberRemove",
    run: async (client, member) => {
        const embed = new EmbedBuilder()
            .setTitle("Member Removed")
            .setColor(Number(0xffdf00))
            .setDescription(`**${member.user.username}** left the server`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();
        if (embed.data.description) client.chans.get("logs")?.send({ embeds: [embed] });

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
        ctx.fillText(`${member.user.username} nous a trahis !`, canvas.width / 2, 220);

        const attachment = new AttachmentBuilder(canvas.toBuffer());
        client.chans.get("welcome")?.send({ files: [attachment] });
        client.saveData();
    },
});
