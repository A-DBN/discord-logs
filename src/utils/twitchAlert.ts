import axios from "axios";
import { EmbedBuilder } from "@discordjs/builders";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import { getTwitchAccessToken } from "./auth";
import CustomClient from "../bot/classes/client";

type StreamData = {
    id: string;
    user_id: string;
    user_name: string;
    user_login: string;
    game_id: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: string;
    thumbnail_url: string;
};

const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));

function setupRequest(requestData: { url: string; method: string }) {
    const oauth = new OAuth({
        consumer: {
            key: process.env.TWITTER_AREI_KEY as string,
            secret: process.env.TWITTER_AREI_SECRET as string,
        },
        signature_method: "HMAC-SHA1",
        hash_function(base_string, key) {
            return crypto.createHmac("sha1", key).update(base_string).digest("base64");
        },
    });

    const token = {
        key: process.env.TWITTER_AREI_TOKEN || "",
        secret: process.env.TWITTER_AREI_SECRET_TOKEN || "",
    };

    const signature = oauth.authorize(requestData, token);

    const authHeader = oauth.toHeader(signature);

    const headers = {
        Authorization: authHeader.Authorization,
    };

    return headers;
}

function deleteTweet(client: CustomClient) {
    const requestData = {
        url: `https://api.twitter.com/2/tweets/${client.tweetId}`,
        method: "DELETE",
    };

    const headers = setupRequest(requestData);

    const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: requestData.url,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    };

    axios(config).catch(error => {
        console.log(error);
    });
}

function sendTweet(client: CustomClient, title: string) {
    const requestData = {
        url: "https://api.twitter.com/2/tweets",
        method: "POST",
    };

    const headers = setupRequest(requestData);

    const data = JSON.stringify({
        // text: ` ${title} ! https://twitch.tv/AreiTTV`,
        text: "Test API",
    });

    const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: requestData.url,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        data: data,
    };

    axios(config)
        .then(response => {
            const id = response.data.data.id;
            client.tweetId = id;
        })
        .catch(error => {
            console.log(error);
        });
}

function sendTwitchLiveMessage(client: CustomClient, streamData: StreamData) {
    const gameUrl = `https://api.twitch.tv/helix/games?id=`;
    const userUrl = `https://api.twitch.tv/helix/users?login=areittv`;
    const clientId = process.env.TWITCH_CLIENT_ID;

    axios
        .get(userUrl, {
            headers: {
                "Client-ID": clientId,
                Authorization: `Bearer ${client.token}`,
            },
        })
        .then(userRes => {
            const user = userRes.data.data[0];

            axios
                .get(gameUrl + streamData.game_id, {
                    headers: {
                        "Client-ID": clientId,
                        Authorization: `Bearer ${client.token}`,
                    },
                })
                .then(res => {
                    const gameData = res.data.data[0];
                    const image =
                        streamData.thumbnail_url.replace("{width}", "1280").replace("{height}", "720") +
                        `?cachebuster=${Date.now()}`;

                    const embed = new EmbedBuilder()
                        .setColor(Number(0x6441a4))
                        .setAuthor({
                            name: streamData.user_name,
                            iconURL: user.profile_image_url,
                            url: `https://twitch.tv/${streamData.user_name}`,
                        })
                        .setImage(gameData.box_art_url.replace("_IGDB-{width}x{height}", ""))
                        .setTitle(`**${streamData.title}**`)
                        .setURL(`https://twitch.tv/${streamData.user_login}`)
                        .addFields(
                            { name: "Jeu", value: gameData.name, inline: true },
                            { name: "Viewers", value: String(streamData.viewer_count), inline: true }
                        )
                        .setImage(image)
                        .setFooter({ text: "Twitch", iconURL: "https://i.imgur.com/rQo24gB.png" })
                        .setTimestamp();
                    client.chans.get("twitch")?.send({
                        content: `@everyone areittv est en ligne par ici -> https://twitch.tv/areittv`,
                        embeds: [embed],
                    });
                    sendTweet(client, streamData.title);
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

export async function isLive(client: CustomClient) {
    await getTwitchAccessToken(client);
    axios
        .get(`https://api.twitch.tv/helix/streams?user_id=${process.env.AREI_CHANNEL_ID}`, {
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${client.token}`,
            },
        })
        .then(async response => {
            const streamData = response.data;

            if (streamData.data.length > 0) {
                if (!client.isLive) {
                    client.isLive = true;
                    sendTwitchLiveMessage(client, streamData.data[0] as StreamData);
                    if (client.tweetId !== "") deleteTweet(client);
                    await delay(3000);
                }
            } else if (client.isLive) client.isLive = false;
            client.saveData();
        })
        .catch(error => {
            console.log(error);
        });
}
