const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const UserSchema =  new Schema({
  createdAt : {type: Date},
  username  : {type: String, required: true},
  password  : {type: String, select: false, required: true },
  dreams    : [{type: Schema.Types.ObjectId, ref: 'Dream'}]
})
  
//Check if password is correct and pass to callback
// Must use function here! ES6 => functions do not bind this!
UserSchema.pre('save', function(next) {
  // SET createdAt AND updatedAt
  const now = new Date();
  this.createdAt = now;
  // If the passsword is not modified ENCRYPT PASSWORD
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    });
  });
});
//Make sure that this is a es5 function call
UserSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
}

module.exports = mongoose.model('User', UserSchema);
