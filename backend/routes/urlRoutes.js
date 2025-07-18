const express = require('express');
const {
  createShortURL,
  redirectURL,
  getStats,
  getAllURLs
} = require('../controllers/urlController');

const router = express.Router();

router.post('/shorten', createShortURL);
router.get('/shorturls/:code', getStats);
router.get('/allurls', getAllURLs);
router.get('/:code', redirectURL);

module.exports = router;