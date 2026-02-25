import Task from "../models/taskModel.js";
 
// Create a new task

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;

    // Make sure req.user exists
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      completed: completed === 'Yes' || completed === true,
      owner: req.user._id,
    });

    const saved = await task.save();
    res.status(201).json({ success: true, task: saved }); // ✅ fixed key
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); // ✅ fixed key
  }
};


//get task
export const getTasks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // ✅ FIXED: sort in Mongo query (NOT after await)
    const tasks = await Task.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tasks
    });

  } catch (err) {
    console.error("GET TASK ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

//Get single task by id
export const getTaskById = async (req,res)=>{
    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if(!task){
            return res.status(404).json({success:false, message:"Task not found"})
        }
        res.status(200).json({sucess:true, task})
    }
    catch(err){
        res.status(500).json({sucess:false, message:err.message})
    }
}

//Update a Task

export const updateTask = async(req,res) =>{
    try{
       const data = {...req.body}
       if(data.completed !==undefined){
        data.completed = data.completed === 'Yes' || data.completed === true
       }
       const update = await Task.findOneAndUpdate(
        {_id: req.params.id, owner: req.user._id},
        data,
        {new:true}
       )
       if(!update){
        return res.status(404).json({sucess:false, message:"Task not found"})
       }
       res.json({sucess:true, task:update})
    }
    catch(err){
        res.status(500).json({sucess:false, message:err.message})
    }
}


//Delete a Task

export const deletedTask = async (req,res)=>{
    try{
        const deleted = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })
        if(!deleted){
            return res.status(404).json({sucess:false, message:"Task not found"})
        }
        res.json({sucess:true, message:"Task deleted successfully"})
    }
    catch(err){
        res.status(500).json({sucess:false, message:err.message})
    }
}
