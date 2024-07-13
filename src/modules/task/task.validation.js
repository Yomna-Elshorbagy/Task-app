import joi from "joi";

export const addTaskVal = joi.object({
    title: joi.string().min(3).max(50).required(),
    type: joi.string().valid("text", "list").required(), 
    user: joi.string().hex().min(24).max(24).required(),
    category: joi.string().hex().min(24).max(24),
    textBody: joi.string().min(3).max(200),
    listItems: joi.array(),
});
export const updateTaskVal = joi.object({
    title: joi.string().min(3).max(50),
    type: joi.string().valid("text", "list"),
    user: joi.string().hex().min(24).max(24),
    category: joi.string().hex().min(24).max(24),
    textBody: joi.string().min(3).max(200),
    listItems: joi.array(),
    id: joi.string().hex().length(24).required()
});