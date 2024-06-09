const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/google', authController.getAccessToken);
router.get('/google/callback', authController.authCallback);

module.exports = router;
