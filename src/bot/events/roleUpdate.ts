import { EmbedBuilder } from "discord.js";
import { Event } from "../classes/events";

export default new Event({
    name: "roleUpdate",
    run: async (client, oldRole, newRole) => {
        if (oldRole.name === newRole.name) return;
        const embed = new EmbedBuilder()
            .setTitle("Role Updated")
            .setColor(Number(0xffdf00))
            .setAuthor({ name: newRole.client.user.username, iconURL: newRole.client.user.displayAvatarURL() })
            .setDescription(`Role **${oldRole.name}** was updated to **${newRole.name}**`)
            .setTimestamp();
        client.chans.get("logs")?.send({ embeds: [embed] });
        client.saveData();
    },
});
