const express = require('express');
const mongoose = require('mongoose');
const bosyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();


const User = require('../models/user');
const Dream = require('../models/dream')


router.delete('/user/delete', (req, res) => {
  //Verfiy password
  //for each dream in user delete from db
  var oldpwd = req.body.oldpassword;
    User.findById({_id: req.user._id}, 'username password').populate('dreams').exec((err, user) => {
      if (user){
        user.comparePassword(oldpwd, (err, isMatch) => {
          if (isMatch){
            // console.log(`total dreams: ${user.dreams.length}`);
            user.dreams.map((dreamId, idx) => {
              Dream.findByIdAndRemove({ _id: dreamId }).exec((err,dream) =>{
                if (dream){
                  console.log(`Dream ${idx} Deleted successfully`);
                }
                else{
                  console.log(`Dream not Found ${dreamId}`);
                }
            })
            user.remove()
          })
          console.log('done');
          res.status(200).json({message:'user and dreams deleted successfuly', success: true})
        }
        else{
          res.status(400).json({message:'invalid credentials', success: false, err:"invalid password"});
        }
      })
    }
    else {
      res.status(400).json({message:"User not found", success:false, err:err})
    }
  })
})

router.post('/user/change-password', (req,res) => {
  const oldpwd = req.body.oldpassword;
  const newpwd = req.body.newpassword;
  console.log(req.body);
  console.log(req.body.newpassword, req.body.oldpassword);
  // console.log(req.user._id);
  if (oldpwd !== newpwd){
    User.findOne({ _id: req.user._id}, 'username password' ).then((user) => {
        user.comparePassword(oldpwd, (err, isMatch) => {
          console.log(isMatch);
          // console.log(isMatch);
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
})

  router.get('/logout', (req, res) => {
})

module.exports = router
