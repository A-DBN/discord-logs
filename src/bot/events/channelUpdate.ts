import {
    ChannelType,
    EmbedBuilder,
} from "discord.js";
import { Event } from "../classes/events";

export default new Event({
    name: "channelUpdate",
    run: async (client, oldChannel, newChannel) => {
        const logsChannel = client.chans.get("logs");
        if (!logsChannel) return;

        const changes: EmbedBuilder[] = [];

        const createBaseEmbed = (title: string) => {
            return new EmbedBuilder()
                .setTitle(title)
                .setColor(0xffdf00)
                .setTimestamp();
        };

        const variableInObject = (permission: string) => {
            return (permission in oldChannel && permission in newChannel);
        };

        // Name change
        if (oldChannel.name !== newChannel.name) {
            changes.push(
                createBaseEmbed("Channel Name Changed").setDescription(
                    `**Before:** ${oldChannel.name}\n**After:** ${newChannel.name}`
                )
            );
        }

        // NSFW change (only on applicable channels)
        if (variableInObject("nsfw") && oldChannel.nsfw !== newChannel.nsfw) {
            changes.push(
                createBaseEmbed("NSFW Status Changed").setDescription(
                    `**Before:** ${oldChannel.nsfw ? "NSFW" : "SFW"}\n**After:** ${newChannel.nsfw ? "NSFW" : "SFW"}`
                )
            );
        }

        // Parent channel change
        if (oldChannel.parentId !== newChannel.parentId) {
            changes.push(
                createBaseEmbed("Parent Channel Changed").setDescription(
                    `**Before:** ${oldChannel.parentId ? `<#${oldChannel.parentId}>` : "*None*"}\n**After:** ${newChannel.parentId ? `<#${newChannel.parentId}>` : "*None*"}`
                )
            );
        }

        // Channel type change
        if (oldChannel.type !== newChannel.type) {
            changes.push(
                createBaseEmbed("Channel Type Changed").setDescription(
                    `**Before:** ${ChannelType[oldChannel.type]}\n**After:** ${ChannelType[newChannel.type]}`
                )
            );
        }

        // Slowmode (rate limit) - only on text/news channels
        if (
            (oldChannel.type === ChannelType.GuildText || oldChannel.type === ChannelType.GuildAnnouncement) &&
            (newChannel.type === ChannelType.GuildText || newChannel.type === ChannelType.GuildAnnouncement)
        ) {
            if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
                changes.push(
                    createBaseEmbed("Slowmode Changed").setDescription(
                        `**Before:** ${oldChannel.rateLimitPerUser || "No slowmode"}\n**After:** ${newChannel.rateLimitPerUser || "No slowmode"}`
                    )
                );
            }
        }

        // Topic change - only on text/news channels
        if (variableInObject("topic") && oldChannel.topic !== newChannel.topic) {
            changes.push(
                createBaseEmbed("Channel Topic Changed").setDescription(
                    `**Before:** ${oldChannel.topic || "*None*"}\n**After:** ${newChannel.topic || "*None*"}`
                )
            );
        }

        // Bitrate change - only on voice/stage channels
        if (variableInObject("bitrate") && oldChannel.bitrate !== newChannel.bitrate) {
            changes.push(
                createBaseEmbed("Bitrate Changed").setDescription(
                    `**Before:** ${oldChannel.bitrate} bps\n**After:** ${newChannel.bitrate} bps`
                )
            );
        }

        // User limit change - only on voice/stage channels
        if (variableInObject("userLimit") && oldChannel.userLimit !== newChannel.userLimit) {
            changes.push(
                createBaseEmbed("User Limit Changed").setDescription(
                    `**Before:** ${oldChannel.userLimit || "No limit"}\n**After:** ${newChannel.userLimit || "No limit"}`
                )
            );
        }

        // Permission overwrites count
        if (variableInObject("permissionOverwrites") && oldChannel.permissionOverwrites.cache.size !== newChannel.permissionOverwrites.cache.size) {
            changes.push(
                createBaseEmbed("Permission Overwrites Changed").setDescription(
                    `**Before:** ${oldChannel.permissionOverwrites.cache.size} overwrites\n**After:** ${newChannel.permissionOverwrites.cache.size} overwrites`
                )
            );
        }

        // Position
        if (oldChannel.position !== newChannel.position) {
            changes.push(
                createBaseEmbed("Channel Position Changed").setDescription(
                    `**Before:** ${oldChannel.position}\n**After:** ${newChannel.position}`
                )
            );
        }

        // Threads count (optional and may be unreliable)
        if (variableInObject("`threads`") ) {
            if (oldChannel.threads.cache.size !== newChannel.threads.cache.size) {
                changes.push(
                    createBaseEmbed("Threads Number Changed").setDescription(
                        `**Before:** ${oldChannel.threads.cache.size} threads\n**After:** ${newChannel.threads.cache.size} threads`
                    )
                );
            }
        }

        try {
            for (const embed of changes) {
                await logsChannel.send({ embeds: [embed] });
            }
            client.saveData?.();
        } catch (error) {
            console.error("Failed to send logs:", error);
        }
    },
});
