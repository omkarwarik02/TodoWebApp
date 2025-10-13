const express =  require("express");
const Todo = require("../models/todo");
const auth = require("../middleware/authMiddleware");
const mongoose = require("mongoose");


const router = express.Router();

//Post
router.post("/", auth, async (req , res)=>{
    const { title } = req.body;

    const todo =  await new Todo({title, author: new mongoose.Types.ObjectId(req.user.id)});
    await todo.save();
    res.json(todo);
    });

//Get all todos
router.get("/",auth,async (req,res)=>{
try{
    const todos = await Todo.find({author:req.user.id}).populate("author","email");
    res.json(todos);
}catch (error){
    res.status(500).json({msg:"Server Error"});
}
});

//Update todos
router.put("/:id", auth, async (req,res)=>{
    try{
    const todo = await Todo.findById(req.params.id);

    //Check for Todos
    if(!todo) return res.status(400).json({msg:"Todo Not Found"});

    //Check logged in user
    if(todo.author.toString() !== req.user.id){
        return res.status(401).json({msg:"Not authorized to update this todo"});
    }
    todo.completed = req.body.completed;
    const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.json(updatedTodo);
}catch (err){
    console.log(err);
    res.status(500).json({msg:"Server error"});
}
});

//Delete todos
router.delete("/:id", auth, async (req , res)=>{
    try{
    const todo = await Todo.findById(req.params.id);

    if(!todo) return res.status(404).json({msg:"Todo not found"});

    if(todo.author.toString() !== req.user.id){
        return res.status(403).json({msg:"Owner not found"});
    }
    await todo.deleteOne();
    res.json({msg:"Todo Deleted"});
}catch(err){
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;