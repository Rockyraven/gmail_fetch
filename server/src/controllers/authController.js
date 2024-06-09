const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(__dirname, '../token.json');
const CREDENTIALS_PATH = path.join(__dirname, '../credentials.json');

let oAuth2Client;

function initializeOAuth2Client() {
  if (!oAuth2Client) {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    console.log(credentials);
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  }
}

function getAccessToken(req, res) {
  initializeOAuth2Client();
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log(authUrl);
  res.redirect(authUrl);
}

function authCallback(req, res) {
  initializeOAuth2Client();
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Error: Missing code parameter.');
  }
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return res.status(400).send('Error retrieving access token');
    oAuth2Client.setCredentials(token);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    res.send('Authentication successful! You can close this tab.');
  });
}

function ensureAuthenticated(req, res, next) {
  initializeOAuth2Client();
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return getAccessToken(req, res);
    } else {
      oAuth2Client.setCredentials(JSON.parse(token));
      next();
    }
  });
}

module.exports = {
  getAccessToken,
  authCallback,
  ensureAuthenticated,
};
