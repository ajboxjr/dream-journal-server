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
  User.findOne({ username }, 'username password').then((user) => {
    if (!user) {
      // User not found
      return res.render('login', {message: 'Wrong Username or Password' });
    }
    // Check the password
    user.comparePassword(password, (err, isMatch) => {
      console.log(isMatch)
      if (!isMatch) {
        // Password does not match
        return res.render('login', {message: 'Wrong Username or Password' });
      }
			console.log('the password is correct!')
      // Create a token
      const token = jwt.sign(
        { _id: user._id, username: user.username }, process.env.SECRET,
        { expiresIn: "60 days" }
      );
      // Set a cookie and redirect to root
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
			//Console log logged in if logged in
			console.log('sucessfully logged in')
      res.redirect('/');
    });
  }).catch((err) => {
    console.log(err);
  });
})

//Log user into the Dream journal
router.get('/login', (req, res) => {
  let bodyClass = "login"
  if (req.bodyClass){
    bodyClass += req.bodyClass
  }
  res.render('login', {bodyClass})
})
//Sign user into the Dream Journal
router.post('/sign-up', (req, res) => {
  const user = new User(req.body)
  user.save().then((user) => {
    //Create a toekn to authenticate the user
    var token = jwt.sign({_id: user._id}, process.env.SECRET, {expiresIn:"30 days"})
    console.log(`The verified token ${token}`)
    res.cookie('nToken', token, {maxAge:900000, httpOnly:true})//saving the cookie and requiring it be httpOnly
    res.redirect('/')
    }).catch((err) => {
    console.log(err.message)
    return res.status(400).send({err:err})
    })
})
// Sign up Rotuter
router.get('/sign-up', (req, res) => {
  let bodyClass = "sign-up"
	if (req.user) {
		bodyClass += " loggedin"
	}
  res.render('signup', {bodyClass})
})

//Logut Clears server cookies of user.
router.get('/logout', (req,res)=>{
	res.clearCookie('nToken');
	res.redirect('/');
});
module.exports = router
