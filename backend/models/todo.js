const mongoose = require("mongoose");
const { ref } = require("process");


const todoSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    completed:{
        type:Boolean,
        default:false,
    },
    author:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
    }


});
module.exports = mongoose.model('Todo', todoSchema); 