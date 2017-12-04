const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const User = require('../models/user')
router = express.Router()

router.get('/dream', (req, res) => {
  let bodyClass = "dream "
	bodyClass += req.bodyClass
  res.send('Dream index. List dreams and option to create new dream')
})

router.post('/dream', (req,res) => {
  let bodyClass = "dream"
	if (req.user) {
		bodyClass += " loggedin"
	}
  res.send('send new dream')
})

router.get('/dream/new', (req, res) => {
  let bodyClass = "dream"
	if (req.user) {
		bodyClass += " loggedin"
	}
  res.send('create a new dream')
})

router.get('/dream/:dreamId',(req,res) => {
  let bodyClass = "dream"
	if (req.user) {
		bodyClass += " loggedin"
	}
  res.send('Get Dream by id')
})

router.get('/dream/:dreamId/edit', (req, res) => {
  let bodyClass = "dream"
	if (req.user) {
		bodyClass += " loggedin"
	}
  res.send('Edit dream based on ID')
})

module.exports = router
