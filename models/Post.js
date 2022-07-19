const mongoose= require('mongoose')
const { Schema } = mongoose;
const moment = require('moment');
const PostSchema = new Schema({
  title: String, 
  content: String,
  timestamp:{
    type:String,
    default: () => moment().format('MMMM Do YYYY, h:mm:ss a'),
  }, 
  user:{ type: Schema.Types.ObjectId, ref: 'user',required:true }
  })
  module.exports=mongoose.model('post',PostSchema)
