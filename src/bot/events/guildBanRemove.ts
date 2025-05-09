import { Event } from "../classes/events";
import { EmbedBuilder } from "discord.js";

export default new Event({
    name: "guildBanRemove",
    run: async (client, ban) => {
        const embed = new EmbedBuilder()
            .setTitle("Member Unbanned")
            .setColor(Number(0xffdf00))
            .setThumbnail(ban.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`<@${ban.user.id}> has been unbanned from the server.`);
        client.chans.get("logs")?.send({ embeds: [embed] });
        client.saveData();
    },
});
