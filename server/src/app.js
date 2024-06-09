const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = 'src/credentials.json';

const app = express();
app.use(bodyParser.json());

// CORS configuration
app.use(cors({
  origin: "http://localhost:3000",  // Allow requests from the frontend
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allow these methods
  credentials: true  // Allow credentials (cookies, authorization headers, etc.)
}));

let oAuth2Client;

// Function to initialize OAuth2 Client
function initializeOAuth2Client() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

// Function to get a new access token
function getAccessToken(res) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.redirect(authUrl);
}

// OAuth2 callback route
app.get('/auth/google/callback', (req, res) => {
    const code = req.query.code;
    if (!code) {
      return res.status(400).send('Error: Missing code parameter.');
    }
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return res.status(400).send('Error retrieving access token');
      oAuth2Client.setCredentials(token);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      // Respond with CORS headers and close the tab
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.send('Authentication successful! You can close this tab.');
    });
  });
  

// Middleware to ensure OAuth2 is initialized and token is available
app.use((req, res, next) => {
  if (!oAuth2Client) {
    initializeOAuth2Client();
  }
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return getAccessToken(res);
    } else {
      oAuth2Client.setCredentials(JSON.parse(token));
      next();
    }
  });
});

// Endpoint to start OAuth2 flow
app.get('/auth/google', (req, res) => {
  getAccessToken(res);
});

// Helper function to get email details
async function getEmailDetails(gmail, messageId) {
  const response = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
  });
  const message = response.data;
  const payload = message.payload;
  const headers = payload.headers;
  const subjectHeader = headers.find(header => header.name === 'Subject');
  const fromHeader = headers.find(header => header.name === 'From');
  const subject = subjectHeader ? subjectHeader.value : 'No Subject';
  const from = fromHeader ? fromHeader.value : 'No From';

  return {
    id: messageId,
    subject,
    from,
  };
}

// List emails and decode details
app.get('/listEmails', async (req, res) => {
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
    });
    const messages = response.data.messages;
    const emailDetails = await Promise.all(messages.map(message => getEmailDetails(gmail, message.id)));
    res.send(emailDetails);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read email
app.get('/readEmail/:id', async (req, res) => {
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  try {
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: req.params.id,
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 6005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
