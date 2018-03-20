const express = require('express');
const mongoose = require('mongoose');
const bosyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

//Login function. Used to test and for modularity
// Signup functon. Testing and Modulartiy
// router.post('/login', passport.authenticate('local'), (req, res) => {
// })
router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Find this user name
  User.findOne({ username }, 'username password')
    .then((user) => {
    if (!user) {
      // User not found
      //return res.render('login', {message: 'Wrong Username or Password' });
      return res.status(401).json({ success: false, err: 'wrong Username or Password', token:null})
    }
    // Check the password
    // console.log(password);
    user.comparePassword(password, (err, isMatch) => {
      // console.log(isMatch)
      if (!isMatch) {
        // Password does not match
        //return res.render('login', {message: 'Wrong Username or Password' });
        return res.status(401).json({ success: false, err: 'wrong Username or Password', token:null})
      }
			// console.log('the password is correct!')
      // Create a token
      const token = jwt.sign(
        { _id: user._id, username: user.username }, process.env.SECRET,
        { expiresIn: "30 days" }
      );
			//Console log logged in if logged in
      return res.status(200).json({success: true, message: 'successfully logged in', token});
    });
  })
  .catch((err) => {
    return res.status(401).json({ success: false, message: err, token:null})
  });
})

// Sign user into the Dream Journal
router.post('/sign-up', (req, res) => {
  User.findOne({username: req.body.username}).then((user) => {
    if (!user){
      const user = new User(req.body)
      user.save()
      .then((user) => {
        // console.log('successfully signed up');
        var token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {expiresIn:"30 days"})
        return res.json({success: true, message: 'signed in successfully', token})
      })
      .catch((err) => {
        return res.status(401).json({ success: false, token: null, message: err.message });
      })
    }
    else {
      res.status(404).json({ success: false, token: null, message: "user exists" });
    }
  }).catch((err)=>{
    res.status(404).json({ success: false, token: null, message: err.message });
  })
})


router.post('/change-password', (req,res) => {
  const oldpwd = req.body.oldpassword;
  const newpwd = req.body.newpassword
  if (oldpwd !== newpwd){
    User.findOne({_id: req.user._id}, 'username password').then((user) => {
        user.comparePassword(oldpwd, (err, isMatch) => {
          if (isMatch){
            user.password = newpwd
            user.save()
            // console.log('saved successfully');
            res.status(200).json({message: "Password successfully Changed.", err:null})
          }
          else {
            res.status(404).json({message: "An error has occured:"+err})
          }
        })
    }).catch((err) => {
      res.status(404).json({message: "An error has occured:"+err})
    })
  }
  else{
    res.status(404).json({message: "Invalid Password(s)"})

  }
})
  router.get('/logout', (req, res) => {
})


module.exports = router
