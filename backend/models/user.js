const mongoose = require("mongoose");
const { type } = require("os");

const userSchema = new mongoose.Schema({

    email:{
       type:String,
       required: true,
       unique: true,
       lowercase: true,
       match:[/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password:{
        type:String,
        required:true
    },
    devices: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.models.User|| mongoose.model("User",userSchema);