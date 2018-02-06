const express = require('express');
const mongoose = require('mongoose');
const bosyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

//Login function. Used to test and for modularity
// Signup functon. Testing and Modulartiy
router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Find this user name
  User.findOne({ username }, 'username password')
    .then((user) => {
      console.log(user)

    if (!user) {
      // User not found
      //return res.render('login', {message: 'Wrong Username or Password' });
      return res.status(401).json({ sucess: false, err: 'wrong Username or Password', token:null})
    }
    // Check the password
    user.comparePassword(password, (err, isMatch) => {
      console.log(isMatch)
      if (!isMatch) {
        // Password does not match
        //return res.render('login', {message: 'Wrong Username or Password' });
        return res.status(401).json({ sucess: false, err: 'wrong Username or Password', token:null})
      }
			console.log('the password is correct!')
      // Create a token
      const token = jwt.sign(
        { _id: user._id, username: user.username }, process.env.SECRET,
        { expiresIn: "30 days" }
      );
			//Console log logged in if logged in
      return res.json({sucess: true, message: 'sucessfully logged in', token});
    });
  })
  .catch((err) => {
    return res.json({ sucess: false, message: err, token:null})
  });
})

// Sign user into the Dream Journal
router.post('/sign-up', (req, res) => {
  const user = new User(req.body)
  user.save()
  .then((user) => {
    var token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {expiresIn:"30 days"})
    return res.json({sucess: true, message: 'signed in sucessfully', token})
  })
  .catch((err) => {
    return res.status(401).json({ sucess: false, token: null, message: err.message });
    })
})

module.exports = router
