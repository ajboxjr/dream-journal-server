const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const User = mongoose.model('User')
const { isValidPassword } = require('../utils/utils')
const { tokenReponse, tokenErrorResponse } = require('../handlers/jsonResponse/jsonAuth')


// TODO:  Consistency to if statemenents

/*
  Login User
  params: username, password
*/
exports.login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Find this user name
  try {
    const user = await User.findOne({ username }, 'username password')
    if(user){
      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
          // Password does not match
          //status: 'error', message: ["Wrong username or password."]
          return res.status(401).json(tokenErrorResponse("Wrong Usrname or password"))
        }
        // Create a token
        const token = jwt.sign(
          { _id: user._id, username: user.username }, process.env.SECRET,
          { expiresIn: process.env.TOKEN_EXP }
        );
        //Send logged in if logged in
        //"data": {id:"date?", type:"token",attributes: {access_token: token, token_type: "Bearer-Token", expires-in: "30days"}}
        return res.status(200).json(tokenReponse(token))
      })
    }
    else {
      return res.status(401).json(tokenErrorResponse("Wrong Usrname or password"))
    }
  }
  catch(err){
      return res.status(401).json(tokenErrorResponse("Login User error"))
    }
}

/*
 Sign user into the Dream Journal
 params: username, password, verifyPassword
 Pre: Validate body(password capacha, equality etc.)
*/

exports.register = async (req, res) => {
  //Express validation password
  var username = req.body.username
  var password = req.body.password
  var verifyPassword = req.body.verifyPassword
  try {
    const db_user  = await User.findOne({username: req.body.username})
    if (db_user){
      return res.status(404).json(tokenErrorResponse("User exists, Please Login"))
    }
    const user = new User()
    user.username = username;
    user.password = password;
    user.save()
    .then((saved_user) => {
      //Create and send token
      var token = jwt.sign({ _id: saved_user._id, username: saved_user.username },  process.env.SECRET, {expiresIn:process.env.TOKEN_EXP})
      res.status(200).json(tokenReponse(token))
      })
      .catch((err) => {
        //Catch save user error
        res.status(401).json(tokenErrorResponse(err.message));
    })
  }
  catch(err){
    // Catch finding error
    console.log(err);
    res.status(404).json(tokenErrorResponse(err.message));
  }
}
