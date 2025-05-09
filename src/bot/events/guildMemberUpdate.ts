import { EmbedBuilder, Role } from "discord.js";
import { Event } from "../classes/events";

export default new Event({
    name: "guildMemberUpdate",
    run: async (client, oldMember, newMember) => {
        const logsChannel = client.chans.get("logs");
        if (!logsChannel) return;

        const changes: EmbedBuilder[] = [];

        const createBaseEmbed = (title: string) => {
            return new EmbedBuilder()
                .setTitle(title)
                .setColor(0xffdf00)
                .setAuthor({
                    name: newMember.user.username,
                    iconURL: newMember.user.displayAvatarURL(),
                })
                .setTimestamp();
        };

        // Username change
        if (oldMember.user.username !== newMember.user.username) {
            changes.push(
                createBaseEmbed("Username Changed").setDescription(
                    `**Before:** ${oldMember.user.username}\n**After:** ${newMember.user.username}`
                )
            );
        }

        // Global name (display name) change
        if (oldMember.user.globalName !== newMember.user.globalName) {
            changes.push(
                createBaseEmbed("Global Display Name Changed").setDescription(
                    `**Before:** ${oldMember.user.globalName || "*None*"}\n**After:** ${newMember.user.globalName || "*None*"}`
                )
            );
        }

        // Nickname change
        if (oldMember.nickname !== newMember.nickname) {
            changes.push(
                createBaseEmbed("Nickname Changed").setDescription(
                    `**Before:** ${oldMember.nickname || "*None*"}\n**After:** ${newMember.nickname || "*None*"}`
                )
            );
        }

        // Avatar change
        if (oldMember.user.avatar !== newMember.user.avatar) {
            changes.push(
                createBaseEmbed("Avatar Changed")
                    .setDescription("New avatar:")
                    .setImage(newMember.user.displayAvatarURL({ size: 512 }))
            );
        }

        // Discriminator change (for legacy users)
        if (oldMember.user.discriminator !== newMember.user.discriminator) {
            changes.push(
                createBaseEmbed("Discriminator Changed").setDescription(
                    `**Before:** #${oldMember.user.discriminator}\n**After:** #${newMember.user.discriminator}`
                )
            );
        }

        // Accent color
        if (oldMember.user.accentColor !== newMember.user.accentColor) {
            changes.push(
                createBaseEmbed("Accent Color Changed").setDescription(
                    `**Before:** ${oldMember.user.accentColor || "*None*"}\n**After:** ${newMember.user.accentColor || "*None*"}`
                )
            );
        }

        // Timeout / communicationDisabledUntil
        const oldTimeout = oldMember.communicationDisabledUntilTimestamp;
        const newTimeout = newMember.communicationDisabledUntilTimestamp;
        if (oldTimeout !== newTimeout) {
            const status = newTimeout ? "Timed out" : "Timeout lifted";
            changes.push(
                createBaseEmbed("Timeout Updated").setDescription(
                    `${status}\n**Until:** ${newTimeout ? `<t:${Math.floor(newTimeout / 1000)}:F>` : "*None*"}`
                )
            );
        }

        // Server boost change
        if (oldMember.premiumSince?.getTime() !== newMember.premiumSince?.getTime()) {
            const status = newMember.premiumSince ? "Started boosting" : "Stopped boosting";
            changes.push(
                createBaseEmbed("Boost Status Changed").setDescription(
                    `${status}\n${newMember.premiumSince ? `Since: <t:${Math.floor(newMember.premiumSince.getTime() / 1000)}:F>` : ""}`
                )
            );
        }

        // Pending status (e.g., not yet accepted rules)
        if (oldMember.pending !== newMember.pending) {
            changes.push(
                createBaseEmbed("Pending Status Changed").setDescription(
                    `**Before:** ${oldMember.pending}\n**After:** ${newMember.pending}`
                )
            );
        }

        // Role changes
        const oldRoles = new Set(oldMember.roles.cache.map((r: Role) => r.id));
        const newRoles = new Set(newMember.roles.cache.map((r: Role) => r.id));
        const addedRoles = [...newRoles].filter(id => !oldRoles.has(id));
        const removedRoles = [...oldRoles].filter(id => !newRoles.has(id));

        for (const roleId of addedRoles) {
            changes.push(createBaseEmbed("Role Added").setDescription(`Added role <@&${roleId}>`));
        }

        for (const roleId of removedRoles) {
            changes.push(createBaseEmbed("Role Removed").setDescription(`Removed role <@&${roleId}>`));
        }

        if (changes.length === 0) {
            changes.push(createBaseEmbed("Member Updated").setDescription("No significant tracked changes were found."));
        }

        try {
            for (const embed of changes) {
                await logsChannel.send({ embeds: [embed] });
            }
            client.saveData();
        } catch (error) {
            console.error("Failed to send logs:", error);
        }
    },
});
