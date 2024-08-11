import { EmbedBuilder } from "discord.js";
import { Event } from "../classes/events";

export default new Event({
    name: "roleDelete",
    run: async (client, role) => {
        const embed = new EmbedBuilder()
            .setTitle("Role Deleted")
            .setColor(Number(0xed1c24))
            .setAuthor({ name: role.client.user.username, iconURL: role.client.user.displayAvatarURL() })
            .setDescription(`Role **${role.name}** was deleted`)
            .setTimestamp();
        client.chans.get("logs")?.send({ embeds: [embed] });
        client.saveData();
    },
});
