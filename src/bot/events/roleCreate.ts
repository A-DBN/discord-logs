import { EmbedBuilder } from "discord.js";
import { Event } from "../classes/events";

export default new Event({
    name: "roleCreate",
    run: async (client, role) => {
        const embed = new EmbedBuilder()
            .setTitle("Role Created")
            .setColor(Number(0x5ac18e))
            .setAuthor({ name: role.client.user.username, iconURL: role.client.user.displayAvatarURL() })
            .setDescription(`Role **${role.name}** was created`)
            .setTimestamp();
        client.chans.get("logs")?.send({ embeds: [embed] });
        client.saveData();
    },
});
