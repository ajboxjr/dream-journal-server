const jwt = require('jsonwebtoken');
var { isValidPassword } = require('../utils/utils')
const mongoose = require('mongoose')

const User = mongoose.model('User')
const Dream = mongoose.model('Dream')
var { userResponse, errorResponse } = require('../handlers/jsonResponse/jsonResponse')


/*
 Delete User & properties(Dreams,tags, .etc ) from database
 params: oldpassword
*/
// TODO: FIX ERROR RESPONSEJSON

exports.deleteUser = async (req, res) => {
  //Verfiy password
  //for each dream in user delete from db
  var oldpwd = req.body.oldpassword;
  try {
    const db_user = await User.findById({_id: req.user._id}, 'username password').populate('dreams').exec()
    if (!db_user){
      return res.status(400).json(errorResponse("User not found"))
    }
    console.log(db_user);
    //Delete user
    db_user.comparePassword(oldpwd, (err, isMatch) => {
      if (!isMatch){
        return res.status(400).json(errorResponse('invalid credentials'));
      }
      //Delete dream from it's database & user.
      db_user.dreams.map((dreamId, idx) => {
        //Optional logging for whether dream is found
        Dream.findByIdAndRemove({ _id: dreamId })
        db_user.remove()
      })
      return res.status(202).json(userResponse('deletion sucessful'))
    })
  }
  catch(err){
    console.log(err);
    return res.status(500).json(errorResponse(err))
  }
}

/*
  Change user Password
  params: oldpassword, newpassword
*/
exports.changeUserPassword = async (req, res) => {
  const oldpwd = req.body.oldpassword;
  const newpwd = req.body.newpassword;
  try {
    const user = await User.findOne({ _id: req.user._id}, 'username password' )//.then((user) => {
    if(!user){
      return  res.status(404).json(errorResponse("no user"))
    }
    user.comparePassword(oldpwd, (err, isMatch) => {
      if (!isMatch){
        return res.status(402).json(errorResponse("Password is not valid"))
      }
      // CHANGED: Move validation to handler
      //if(isValidPassword(newpwd)){}
      user.password = newpwd
      user.save().then(() => {
        res.status(200)
      })
    })
  }
  catch(err){
    res.status(404).json(errorResponse("An error has occured"))
  }
}


exports.logoutUser = (req, res) => {

}
