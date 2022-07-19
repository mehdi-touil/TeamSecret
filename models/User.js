const mongoose= require('mongoose')
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const UserSchema = new Schema({
  username: {type:String,required:true} , // String is shorthand for {type: String}
  password:  {type:String,required:true},
  fullname:String,
  isMember: {
    type: Boolean,
    default: false  }
  , isadmin: {
    type: Boolean,
    default: false 
   }}
  )
  UserSchema.pre('save', async function(next) {
    try {
    // check method of registration
    const user = this;
    if (!user.isModified('password')) next();
    // generate salt
    const salt = await bcrypt.genSalt(10);
    // hash the password
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // replace plain text password with hashed password
    this.password = hashedPassword;
    next();
    } catch (error) {
    return next(error);
    }
    });
module.exports=mongoose.model('user',UserSchema)
