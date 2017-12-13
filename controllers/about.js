const express = require('express');
const router = express.Router();

// 
router.get('/about', (req, res) => {
  let bodyClass = "home"
	bodyClass += req.bodyClass
  res.render('about', { bodyClass, user: req.user })
})

module.exports = router
