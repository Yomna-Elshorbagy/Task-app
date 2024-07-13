import joi from "joi";

export const addCatVal = joi.object({
    name: joi.string().min(3).max(50).required(),
    user: joi.string().hex().min(24).max(24).required()
});
export const updateCatVal = joi.object({
    name: joi.string().min(3).max(50),
    user: joi.string().hex().length(24),
    id: joi.string().hex().length(24).required()
});