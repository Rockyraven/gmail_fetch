const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const authController = require('../controllers/authController');

router.get('/listEmails', authController.ensureAuthenticated, emailController.listEmails);
router.get('/readEmail/:id', authController.ensureAuthenticated, emailController.readEmail);

module.exports = router;
