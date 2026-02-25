// import express from "express";
// import authMiddleware from "../middleware/auth.js";

// import { getTasks, createTask, getTaskById, updateTask, deletedTask } from "../controllers/taskController.js";
// const taskRouter = express.Router();

// taskRouter.route('/all')
//     .get(authMiddleware, getTasks)
//     .post(authMiddleware, createTask);
    
// taskRouter.route('/all/:id')
//     .get(authMiddleware, getTaskById)
//     .put(authMiddleware, updateTask)
//     .delete(authMiddleware, deletedTask);

// export default taskRouter;



import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deletedTask
} from "../controllers/taskController.js";

const taskRouter = express.Router();

// Get all tasks
taskRouter.get("/gettasks", authMiddleware, getTasks);

// Create task
taskRouter.post("/createtask", authMiddleware, createTask);

// Get single task
taskRouter.get("/gettasks/:id", authMiddleware, getTaskById);

// Update task
taskRouter.put("/edittask/:id", authMiddleware, updateTask);

// Delete task
taskRouter.delete("/deltask/:id", authMiddleware, deletedTask);

export default taskRouter;