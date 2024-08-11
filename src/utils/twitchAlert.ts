import axios from "axios";
import { EmbedBuilder } from "@discordjs/builders";
import fs from "fs";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import { getTwitchAccessToken } from "./auth";
import CustomClient from "../bot/classes/client";

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

    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = oauth.getNonce();

    const token = {
        key: process.env.TWITTER_AREI_TOKEN,
        secret: process.env.TWITTER_AREI_SECRET_TOKEN,
    };

    const signature = oauth.getSignature(requestData, token.secret, {
        oauth_consumer_key: oauth.consumer.key,
        oauth_token: token.key,
        oauth_signature_method: oauth.signature_metho,
        oauth_timestamp: timestamp,
        oauth_nonce: nonce,
        oauth_version: "1.0",
    });

    const authHeader = oauth.toHeader({
        oauth_consumer_key: oauth.consumer.key,
        oauth_token: token.key,
        oauth_signature_method: oauth.signature_metho,
        oauth_timestamp: timestamp,
        oauth_nonce: nonce,
        oauth_version: "1.0",
        oauth_signature: signature,
    });

    const headers = {
        Authorization: authHeader["Authorization"],
    };

    return headers;
}

function deleteTweet(client: CustomClient) {
    try {
        client.tweetId = JSON.parse(fs.readFileSync("./Stockage/ids.json", "utf8")).tweetId;
    } catch (err) {
        console.error(err);
    }

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

function sendTweet(title: string) {
    const dt = fs.readFileSync("./Stockage/ids.json", "utf8");
    let ids = JSON.parse(dt);

    const requestData = {
        url: "https://api.twitter.com/2/tweets",
        method: "POST",
    };

    const headers = setupRequest(requestData);

    const data = JSON.stringify({
        text: ` ${title} ! https://twitch.tv/AreiTTV`,
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
            ids.tweetId = id;
            fs.writeFileSync("./Stockage/ids.json", JSON.stringify(ids, null, 4));
        })
        .catch(error => {
            console.log(error);
        });
}

function sendTwitchLiveMessage(client: CustomClient) {
    const channelUrl = `https://api.twitch.tv/helix/channels?broadcaster_id=500392653`;
    const streamUrl = `https://api.twitch.tv/helix/streams?user_id=500392653`;
    const gameUrl = `https://api.twitch.tv/helix/games?id=`;
    const userUrl = `https://api.twitch.tv/helix/users?login=areittv`;
    const clientId = process.env.TWITCH_CLIENT_ID;

    axios
        .all([
            axios.get(channelUrl, {
                headers: {
                    "Client-ID": clientId,
                    Authorization: `Bearer ${client.twitchToken}`,
                },
            }),
            axios.get(streamUrl, {
                headers: {
                    "Client-ID": clientId,
                    Authorization: `Bearer ${client.twitchToken}`,
                },
            }),
            axios.get(userUrl, {
                headers: {
                    "Client-ID": clientId,
                    Authorization: `Bearer ${client.twitchToken}`,
                },
            }),
        ])
        .then(
            axios.spread((channelRes, streamRes, userRes) => {
                const channelData = channelRes.data.data[0];
                const streamData = streamRes.data.data[0];
                const userData = userRes.data.data[0];

                axios
                    .get(gameUrl + streamData.game_id, {
                        headers: {
                            "Client-ID": clientId,
                            Authorization: `Bearer ${client.twitchToken}`,
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
                                name: channelData.broadcaster_name,
                                iconURL: userData.profile_image_url,
                                url: `https://twitch.tv/${channelData.broadcaster_name}`,
                            })
                            .setImage(gameData.box_art_url.replace("_IGDB-{width}x{height}", ""))
                            .setTitle(`**${channelData.title}**`)
                            .setURL(`https://twitch.tv/${channelData.broadcaster_login}`)
                            .addFields(
                                { name: "Jeu", value: gameData.name, inline: true },
                                { name: "Viewers", value: String(streamData.viewer_count), inline: true }
                            )
                            .setImage(image)
                            .setFooter({ text: "Twitch", iconURL: "https://i.imgur.com/rQo24gB.png" })
                            .setTimestamp();
                        client.chans.get("twitch")?.send({
                            content: "@everyone areittv est en ligne par ici -> https://twitch.tv/areittv",
                            embeds: [embed],
                        });
                        sendTweet(channelData.title);
                    })
                    .catch(err => console.log(err));
            })
        )
        .catch(err => console.log(err));
}

export async function isLive(client: CustomClient) {
    const access_token = await getTwitchAccessToken(client);
    axios
        .get(`https://api.twitch.tv/helix/streams?user_id=500392653`, {
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${access_token}`,
            },
        })
        .then(async response => {
            const data = response.data;

            if (data.data.length > 0) {
                if (!client.isLive) {
                    client.isLive = true;
                    sendTwitchLiveMessage(client);
                    if (client.tweetId !== "") deleteTweet(client);
                    await delay(3000);
                }
            } else {
                if (client.isLive) client.isLive = false;
            }
        })
        .catch(error => {
            console.log(error);
        });
}