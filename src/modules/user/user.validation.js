
import joi from "joi";

const passPattern = /^[A-Z][A-Za-z0-9]{5,20}$/;

export const signupVal = joi.object({
    userName: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp(passPattern)).required(),
    Cpassword: joi.valid(joi.ref('password')).required()
});

export const signinVal = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp(passPattern)).required(),
});

export const updateVal = joi.object({
    userName: joi.string().min(3).max(50),
    email: joi.string().email(),
    id: joi.string().hex().length(24).required()
});

export const resetPassVal = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp(passPattern)).required(),
    Cpassword: joi.valid(joi.ref('password')).required(),
});