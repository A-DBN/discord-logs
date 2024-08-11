import { EmbedBuilder } from "discord.js";
import { Event } from "../classes/events";

export default new Event({
    name: "voiceStateUpdate",
    run: async (client, oldState, newState) => {
        const embed = new EmbedBuilder();
        if (oldState.channelId !== newState.channelId && newState.channelId === null) {
            embed.setTitle("Member left voice channel");
            embed.setAuthor({ name: newState.member.user.username, iconURL: newState.member.user.displayAvatarURL() });
            embed.setDescription(`**${oldState.member.user.username}** left 🔈${oldState.channel.name}`);
            embed.setTimestamp();
            embed.setColor(Number(0xff0000));
        } else if (oldState.channelId === null && newState.channelId !== null && !oldState.member.user.bot) {
            embed.setTitle("Member joined voice channel");
            embed.setAuthor({ name: newState.member.user.username, iconURL: newState.member.user.displayAvatarURL() });
            embed.setDescription(`**${newState.member.user.username}** joined 🔈${newState.channel.name}`);
            embed.setTimestamp();
            embed.setColor(Number(0x00ff00));
        } else if (
            oldState.channelId !== newState.channelId &&
            newState.channelId !== null &&
            oldState.channelId !== null &&
            !oldState.member.user.bot
        ) {
            embed.setTitle("Member changed voice channel");
            embed.setAuthor({ name: newState.member.user.username, iconURL: newState.member.user.displayAvatarURL() });
            embed.setDescription(
                `**${newState.member.user.username}** moved from **🔈${oldState.channel.name}** to **🔈${newState.channel.name}**`
            );
            embed.setTimestamp();
            embed.setColor(Number(0xffff00));
        }

        client.chans.get("logs")?.send({ embeds: [embed] });
        client.saveData();
    },
});
