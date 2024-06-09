const { google } = require('googleapis');
const { ensureAuthenticated } = require('./authController');

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
async function listEmails(req, res) {
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
}

// Read email
async function readEmail(req, res) {
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
}

module.exports = {
  listEmails,
  readEmail,
};
