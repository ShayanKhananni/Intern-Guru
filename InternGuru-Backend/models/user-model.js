import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
 
  username:{
    type:String,
    required:true,
    unique:[true,'Username already exist']
  },
  fathername:{type:String},
  photoURL:
  {
    type:String,
    default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToiRnzzyrDtkmRzlAvPPbh77E-Mvsk3brlxQ&s"
  },
  email:{
    type:String,
    required:true,
    unique:[true,'Email already exist']
  },
  password:{type:String,required:true},
  role:{type:"String",enum:['admin','intern'],required:true,default:'intern'},

  university: String,
  program: String,
  contact: String,
  address: String,
},{timestamps:true})

const User = mongoose.model('User',UserSchema); 
export default User;