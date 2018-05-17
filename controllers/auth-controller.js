const express = require('express');
const mongoose = require('mongoose');
const bosyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');
const { isValidPassword } = require('../utils/utils')

//Login function. Used to test and for modularity
// Signup functon. Testing and Modulartiy
// router.post('/login', passport.authenticate('local'), (req, res) => {
// })

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // User.findOne({username:username}, 'username').then((user)=>{
  //   console.log(user);
  // }).catch((err)=>{
  //   console.log(err);
  // })
  // Find this user name
  console.log(username);
  if(username && password){
    User.findOne({ username }, 'username password', function(err, user){
      console.log(err);
      if (!user) {
        // User not found
        if (err){
          return res.status(401).json({ success: false, err: err, token:null})
        }
        else{
          return res.status(401).json({ success: false, err: ['Wrong username or password.'], token:null})
        }
      }
      console.log(user);
      // Check the password
      // console.log(password);
      user.comparePassword(password, (err, isMatch) => {
        console.log(isMatch)
        if (!isMatch) {
          // Password does not match
          //return res.render('login', {message: 'Wrong Username or Password' });
          return res.status(401).json({ success: false, err: ['Wrong username or password.'], token:null})
        }
  			// console.log('the password is correct!')
        // Create a token
        const token = jwt.sign(
          { _id: user._id, username: user.username }, process.env.SECRET,
          { expiresIn: "30 days" }
        );
  			//Console log logged in if logged in\
        console.log('worked');
        return res.status(200).json({success: true, message: 'Successfully logged in', token});
      });
    })
  }
  else {
    res.status(401).json({ success: false, err: 'missing field(s)', token:null})
  }
})

// Sign user into the Dream Journal
router.post('/sign-up', (req, res) => {
  var regex = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[~`<>#?!@$%^\'\"&*\-_]).{8,}$/g
  var password = req.body.password
  var verifyPassword = req.body.verifyPassword
  // console.log(verifyPassword);
  User.findOne({username: req.body.username}).then((user) => {
    if (user){
      res.status(404).json({ success: false, token: null, err: ["user exists"] });
    }
    else {
      if(password == verifyPassword){
        passArr = isValidPassword(password)
        if(passArr.length == 0){
          console.log('matches');
          const user = new User(req.body)
          user.save()
          .then((user) => {
            // console.log('successfully signed up');
            var token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {expiresIn:"30 days"})
            res.json({success: true, message: 'signed in successfully', token})
          })
          .catch((err) => {
            res.status(401).json({ success: false, token: null, err: [err.message] });
          })
        }
        else {
          //Return list of missing password conditions
           res.status(401).json({ success: false, token: null, err: [passArr] });
        }
      }
      else {
        res.status(404).json({ success: false, token: null, err: ["password mitchmatch"] });
      }
    }
  }).catch((err)=>{
    res.status(404).json({ success: false, token: null, message: [err.message] });
  })
})





module.exports = router
