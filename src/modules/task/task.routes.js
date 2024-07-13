import { Router } from "express";
import * as taskControllers from "./task.controllers.js";
import { verifyToken } from "../../middelwares/verifyToken.js";
import { validate } from "../../middelwares/validate.js";
import { addTaskVal, updateTaskVal } from "./task.validation.js";

const taskRouter = Router();
// without auth:
taskRouter.get('/',taskControllers.getAllTasks)
taskRouter.get('/sort', taskControllers.getSortTasks);
taskRouter.get('/filter', taskControllers.getBySharedOption);
taskRouter.get('/paginate', taskControllers.getPaginatedTask);

// auth:
taskRouter.use(verifyToken);

taskRouter.post('/addTask', validate(addTaskVal),taskControllers.addTask);
taskRouter.route('/:id')
.get(taskControllers.getById)
.put(validate(updateTaskVal),verifyToken,taskControllers.updateTask)
.delete(taskControllers.deleteTask)

export default taskRouter;