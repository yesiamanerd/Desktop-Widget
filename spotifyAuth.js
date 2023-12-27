const https = require('https');
const { localStorage } = require('electron-browser-storage');



function exchangeCodeForToken(authCode) {
    const data = `grant_type=authorization_code&code=${authCode}&redirect_uri=http://localhost:8888/callback`;
    const encodedCredentials = Buffer.from('714028e7932d47b39c83737a841a6735:8f2df3bf00ae4f9e82f89028cf501bbf').toString('base64');

    const options = {
        hostname: 'accounts.spotify.com',
        path: '/api/token',
        method: 'POST',
        headers: {
            'Authorization': `Basic ${encodedCredentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const req = https.request(options, (res) => {
        console.log(`Sending token exchange request to Spotify...`); // Log request send
        let body = '';
        res.on('data', (d) => body += d);

        res.on('end', async () => {
            const response = JSON.parse(body);
            await localStorage.setItem('spotifyAccessToken', response.access_token);
            await localStorage.setItem('spotifyRefreshToken', response.refresh_token);

            // Now retrieve and log the stored tokens
            const storedAccessToken = await localStorage.getItem('spotifyAccessToken');
            const storedRefreshToken = await localStorage.getItem('spotifyRefreshToken');
            console.log('Stored Access Token:', storedAccessToken);
            console.log('Stored Refresh Token:', storedRefreshToken);
        });

    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(data);
    req.end();
}

function refreshAccessToken(refreshToken) {
    const data = `grant_type=refresh_token&refresh_token=${refreshToken}`;
    const encodedCredentials = Buffer.from('714028e7932d47b39c83737a841a6735:8f2df3bf00ae4f9e82f89028cf501bbf').toString('base64');

    const options = {
        hostname: 'accounts.spotify.com',
        path: '/api/token',
        method: 'POST',
        headers: {
            'Authorization': `Basic ${encodedCredentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const req = https.request(options, (res) => {
        console.log(`Sending access token refresh request to Spotify...`); // Log request send
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => {
            console.log(`Access token refresh response: ${body}`); // Log the response body
            const response = JSON.parse(body);
            await localStorage.setItem('spotifyAccessToken', response.access_token);
            // Handle new access token

            // Schedule next refresh
            const expiresIn = response.expires_in; // Time in seconds
            setTimeout(() => {
                refreshAccessToken(refreshToken);
            }, expiresIn * 1000 - 60000); // Refresh 1 minute before expiry

        });
    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(data);
    req.end();
}

module.exports = { exchangeCodeForToken };
