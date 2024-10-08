const express = require('express');
const cors = require('cors'); 
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'Jess',
    host: 'localhost',
    database: '2405-ftb-et-web-pt',
    password: 'test',
    port: 5432,
});
const PORT = 8080;
const app = express();


app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from React app
    credentials: true,
}));
app.use(express.json());

// GitHub OAuth route - redirect to GitHub for authentication
app.get('/auth/github', (req, res) => {
    const redirect_uri = 'http://localhost:8080/auth/github/callback';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirect_uri}&scope=user:email`;
    res.redirect(githubAuthUrl);
});

// OAuth callback handler
app.get('/auth/github/callback', async (req, res) => {
    const { code } = req.query; // github sends code in query params
    // console.log('Received GitHub callback', code);

    try {
        // Exchange code for access token - step 1
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            }),
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

    //     // Get user info using access token - step 2 
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });


        const userData = await userResponse.json();
        console.log(userData);
 
       await pool.query("INSERT INTO users (github_id,login,avatar_url, access_token) VALUES ($1, $2, $3, $4)", [userData.id, userData.login, userData.avatar_url, accessToken]);
        // // Redirect back to frontend with the user ID
        res.redirect(`http://localhost:5173?user_id=${userData.id}`);
    //     // console.log(response);
    } catch (error) {
        console.error('Error fetching access token or user info', error);
        res.status(500).json({ error: 'Failed to authenticate with GitHub' });
    }
});




// API route to get the user data from PostgreSQL using GitHub ID
app.get('/api/github/user/:id', async (req, res) => {
    console.log('Received GitHub ID:', req.params.id);
    const { id } = req.params;

    try {
        // Find the user by GitHub ID in the database
        const result = await pool.query('SELECT github_id, login, avatar_url FROM users WHERE github_id = $1', [id]);
        console.log(result)
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return user data
        const user = result.rows[0];
        res.json({
            github_id: user.github_id,
            login: user.login,
            avatar_url: user.avatar_url,
        });
    } catch (error) {
        console.error('Error fetching user from database', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});


app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});