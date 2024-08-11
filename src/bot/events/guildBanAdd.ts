import { Event } from "../classes/events";
import { EmbedBuilder } from "discord.js";

export default new Event({
    name: "guildBanAdd",
    run: async (client, ban) => {
        const embed = new EmbedBuilder()
            .setTitle("Member Banned")
            .setColor(Number(0xed1c24))
            .setThumbnail(ban.user.displayAvatarURL())
            .setTimestamp();
        if (ban.reason)
            embed.setDescription(`<@${ban.user.id}> has been banned from the server.\n\nReason: ${ban.reason}`);
        else embed.setDescription(`<@${ban.user.id}> has been banned from the server*.`);
        client.chans.get("logs")?.send({ embeds: [embed] });
        client.saveData();
    },
});
