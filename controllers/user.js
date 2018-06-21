const jwt = require('jsonwebtoken');
var { isValidPassword } = require('../utils/utils')
const mongoose = require('mongoose')

const User = mongoose.model('User')
const Dream = mongoose.model('Dream')

/*
 Delete User & properties(Dreams,tags, .etc ) from database
 params: oldpassword
*/

exports.deleteUser = (req, res) => {
  //Verfiy password
  //for each dream in user delete from db
  var oldpwd = req.body.oldpassword;
  if( oldpwd ){
    User.findById({_id: req.user._id}, 'username password').populate('dreams').exec((err, user) => {
      if (user){
        //Delete user
        user.comparePassword(oldpwd, (err, isMatch) => {
          if (isMatch){
            //Delete dream from it's database & user.
            user.dreams.map((dreamId, idx) => {
              //Optional logging for whether dream is found
              Dream.findByIdAndRemove({ _id: dreamId })
              user.remove()
            })
            res.status(200).json({ err:['user and dreams deleted successfuly'], success: true })
          }
          else{
            res.status(400).json({ err:['invalid credentials'], success: false });
          }
        })
      }
      else {
        res.status(400).json({ message:"User not found", success:false, err:err })
      }
    })
  }
  else {
    res.status(400).json({ success:false, err: ["missing field"] })
  }
}

/*
  Change user Password
  params: oldpassword, newpassword
*/
exports.changeUserPassword = (req, res) =>{
  const oldpwd = req.body.oldpassword;
  const newpwd = req.body.newpassword;
  if (oldpwd !== newpwd){
    User.findOne({ _id: req.user._id}, 'username password' ).then((user) => {
        user.comparePassword(oldpwd, (err, isMatch) => {
          if (isMatch){

            if(isValidPassword(newpwd)){
              user.password = newpwd
              user.save().then(() => {
                res.status(200).json({ message: "Password successfully Changed.", success: true, err:null })
              })
            }
            else {
              res.status(402).json({error: "Password must contain (1) capital, lowercase, number, special char \"%@!$..\""})
            }
          }
          else {
            res.status(404).json({ message: "No user",  success: false })
          }
        })
    })
    .catch((err) => {
      res.status(404).json({ message: "An error has occured:"+err,  success: false })
    })
  }
  else{
    res.status(404).json({ message: "Invalid Password(s)",  success: false })
  }
}


exports.logoutUser = (req, res) => {

}
