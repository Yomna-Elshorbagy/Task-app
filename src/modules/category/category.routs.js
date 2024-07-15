import { Router } from "express";
import * as catControllers from './category.controllers.js'
import { verifyToken } from "../../middelwares/verifyToken.js";
import { addCatVal, updateCatVal } from "./category.validation.js";
import { validate } from "../../middelwares/validate.js";
const categoryRouter = Router();
//to implement auth for all api:
// categoryRouter.use(verifyToken)

categoryRouter.post('/addCat',verifyToken,validate(addCatVal) ,catControllers.addCategory)

categoryRouter.get('/', catControllers.getAllCategorys)
categoryRouter.get('/paginate', catControllers.getPaginatedCategories)
categoryRouter.get('/sort', catControllers.getSortCategorys)
categoryRouter.get('/userCat', verifyToken,catControllers.getAllUserCategorys)
categoryRouter.get('/filter', catControllers.getByName)

categoryRouter.route('/:id')
.get(verifyToken,catControllers.getById)
.put(verifyToken, validate(updateCatVal),catControllers.updateCategory)
.delete(verifyToken,catControllers.deleteCategorys)
categoryRouter.put('/update/:id',verifyToken, validate(updateCatVal),catControllers.updateCategory2)

export default categoryRouter;