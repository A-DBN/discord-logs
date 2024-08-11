import { EmbedBuilder, Role } from "discord.js";
import { Event } from "../classes/events";

export default new Event({
    name: "guildMemberUpdate",
    run: async (client, oldMember, newMember) => {
        const embed = new EmbedBuilder();
        if (oldMember.user.username !== newMember.user.username) {
            embed.setTitle("Name Changed");
            embed.setColor(Number(0xffdf00));
            embed.setAuthor({
                name: newMember.user.username,
                iconURL: "https://cdn.discordapp.com/avatars/" + newMember.user.id + "/" + newMember.user.avatar,
            });
            embed.setDescription(`**Before:** ${oldMember.user.username}\n**+After:** ${newMember.user.username}`);
            embed.setTimestamp();
        } else if (oldMember.roles.length !== newMember.roles.length) {
            embed.setTitle("Roles Update");
            embed.setColor(Number(0xffdf00));
            embed.setAuthor({
                name: newMember.user.username,
                iconURL: "https://cdn.discordapp.com/avatars/" + newMember.user.id + "/" + newMember.user.avatar,
            });
            embed.setThumbnail(newMember.user.displayAvatarURL());
            oldMember._roles.length > newMember._roles.length
                ? embed.setDescription(
                      `Deleted role <@&${oldMember.roles.filter((role: Role) => newMember.roles.includes(role))[0]}>`
                  )
                : embed.setDescription(
                      `Added role <@&${oldMember.roles.filter((role: Role) => newMember.roles.includes(role))[0]}>`
                  );
            embed.setTimestamp();
        } else {
            embed.setTitle("Member Updated");
            embed.setColor(Number(0xffdf00));
            embed.setAuthor({
                name: newMember.user.username,
                iconURL: "https://cdn.discordapp.com/avatars/" + newMember.user.id + "/" + newMember.user.avatar,
            });
            embed.setThumbnail(newMember.user.displayAvatarURL());
            embed.setDescription("Member informations updated");
            embed.setTimestamp();
        }
        try {
            client.chans.get("logs")?.send({ embeds: [embed] });
            client.saveData();
        } catch (error) {
            console.error(error);
        }
    },
});
