import { Router } from "express";
import * as userController from './user.controllers.js'
import { validate } from "../../middelwares/validate.js";
import { resetPassVal, signinVal, signupVal, updateVal } from "./user.validation.js";
import { verifyToken } from "../../middelwares/verifyToken.js";
const userRouter = Router();

userRouter.post('/signUp',validate(signupVal),userController.signUp);
userRouter.put("/resetPass", validate(resetPassVal), userController.resetPassword);
userRouter.post('/verifyOtp',userController.verifyOtp );
userRouter.get('/verify/:token',userController.verifyEmail );
userRouter.post('/logIn',validate(signinVal),userController.logIn);

//auth:
userRouter.use(verifyToken);

userRouter.get('/',userController.getAllUsers);
userRouter.get("/sort", userController.sortedUsers);

userRouter.route('/:id')
.get(userController.getUserById)
.put(validate(updateVal),userController.updateUser)
.delete(userController.deleteUser);


export default userRouter;