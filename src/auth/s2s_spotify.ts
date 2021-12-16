import axios from 'axios';

let token = '';
let expiration: number = Date.now();

/**
 * Server-to-server ("client credentials") authentication with Spotify. Requests bearer access token from spotify. 
 * 
 * If previous token hasn't expired, returns previous token.
 * 
 * @returns {Promise<string>} A promise that resolves to the access token
 */
export default async function getToken(): Promise<string> {
    if (!token || !expiration || expiration < Date.now()) {
        try {
            const res = await axios({
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                params: {
                    'grant_type': 'client_credentials',
                },
                headers: {
                    'Accept': 'application/json',
                },
                auth: {
                    username: process.env.SPOTIFY_CLIENT_ID,
                    password: process.env.SPOTIFY_CLIENT_SECRET
                }
            });

            token = res.data.access_token;
            expiration = Date.now() + (res.data.expires_in * 1000);
        } catch (err) {
            console.error(err);
            return '';
        }
    }

    return token;
}