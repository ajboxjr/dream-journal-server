const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DreamSchema = new Schema({
   dream: { type: String, required: true },
   people: { type: String},
   actions : { type: String},
   emotions : { type: String},
   createdAt: {type: Date},
   updatedAt: {type: Date},
   author : { type: Schema.Types.ObjectId, ref: 'User', required: true },
  });

DreamSchema.pre('save', function(next){
  const date = new Date
  this.updatedAt = date
  if(!this.createdAt){
    this.createdAt = date
  }
  next();
})

module.exports = mongoose.model('Dream', DreamSchema)
