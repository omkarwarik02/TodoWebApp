const express = require("express");
const Todo = require("../models/todo");
const auth = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
const agenda = require("../agenda/agendaInstance"); 
const User = require("../models/user")

const router = express.Router();
router.post("/", auth, async (req, res) => {
  try {
    const { title, remindAt } = req.body; // <-- getting datetime string from frontend

    const todo = new Todo({
      title,
      author: req.user.id,
      remindAt: remindAt ? new Date(remindAt) : null
    });

    await todo.save();

    const user = await User.findById(req.user.id).select("email deviceToken");

    // Schedule Reminder Only If remindAt is valid and in the future
    if (remindAt) {
      const scheduleTime = new Date(remindAt);

      if (!isNaN(scheduleTime.getTime()) && scheduleTime > new Date()) {
        await agenda.schedule(scheduleTime, "todo reminder", {
          todo: { title: todo.title },
          user: { id:req.user.id, email: user.email }
        });

        console.log(`📅 Reminder set for ${scheduleTime.toISOString()}`);
      } else {
        console.log("⚠️ 'remindAt' is invalid or in the past. Reminder NOT scheduled.");
      }
    }

    res.json(todo);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
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