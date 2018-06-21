const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const User = mongoose.model('User')
const { isValidPassword } = require('../utils/utils')

// TODO:  Consistency to if statemenents

/*
  Login User
  params: username, password
*/
exports.login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Find this user name
  if(username && password){
    User.findOne({ username }, 'username password', function(err, user){
      if (!user) {
        // User not found
        if (err){
          return res.status(401).json({ success: false, err: err, token:null})
        }
        else{
          return res.status(401).json({ success: false, err: ['Wrong username or password.'], token:null})
        }
      }
      // Check the password
      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
          // Password does not match
          return res.status(401).json({ success: false, err: ['Wrong username or password.'], token:null})
        }
        // Create a token
        const token = jwt.sign(
          { _id: user._id, username: user.username }, process.env.SECRET,
          { expiresIn: "200ms" }
        );
  			//Send logged in if logged in\
        return res.status(200).json({success: true, message: 'Successfully logged in', token});
      });
    })
  }
  else {
    //Missing fieldse
    res.status(401).json({ success: false, err: 'missing field(s)', token:null})
  }
}

/*
 Sign user into the Dream Journal
 params: username, password, verifyPassword
*/

exports.register = (req, res) => {
  //Express validation password
  var username = req.body.username
  var password = req.body.password
  var verifyPassword = req.body.verifyPassword
  if( username && password ){
    User.findOne({username: req.body.username}).then((user) => {
      if (user){
        res.status(404).json({ success: false, token: null, err: ["user exists"] });
      }
      else {
        //Check password equality
        req.check('password','password mismatch').equals(verifyPassword)
        var error = req.validationErrors();
        if(error.msg){
            res.status(404).json({ success: false, token: null, err: [error.msg] });
        }
        else {
          //Regex verify password
          passArr = isValidPassword(password)
          if(passArr.length == 0){
            //Save user
            const user = new User()
            user.username = username;
            user.password = password;
            user.save()
            .then((user) => {
              //Create and send token
              var token = jwt.sign({ _id: user._id, username: user.username },  process.env.SECRET, {expiresIn:"30 days"})
              res.status(200).json({success: true, err:null, token})
            })
            .catch((err) => {
              //Catch save user error
              res.status(401).json({ success: false, token: null, err: [err.message] });
            })
          }
          else {
            //Return list of missing password conditions
             res.status(401).json({ success: false, token: null, err: passArr });
          }
        }
      }
    }).catch((err)=>{
      //Catch finding error
      res.status(404).json({ success: false, token: null, err: [err.message] });
    })
  }
  else {
    res.status(400).json({ success: false, token: null, err: ['missing fields']})
  }
}
