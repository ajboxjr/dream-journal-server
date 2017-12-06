const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DreamSchema = new Schema({
   title: {type: String, required: true },
   entry: { type: String, required: true },
   tags: [{type: String}],
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
