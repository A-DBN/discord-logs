import axios from "axios";
import CustomClient from "../bot/classes/client";

export async function getTwitchAccessToken(client: CustomClient): Promise<void> {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    // Generate access token
    // check if token has expired or not
    const now = Date.now() / 1000;
    if (now >= client.twitchTokenExpiration) {
        const params = new URLSearchParams();
        params.append("client_id", clientId as string);
        params.append("client_secret", clientSecret as string);
        params.append("grant_type", "client_credentials");
        params.append("scope", "user:read:email");

        const {
            data: { access_token },
        } = await axios.post(`https://id.twitch.tv/oauth2/token`, params);
        client.token = access_token;
        client.twitchTokenExpiration = now + 3600; // token will expire in 1 hour
    }
}
