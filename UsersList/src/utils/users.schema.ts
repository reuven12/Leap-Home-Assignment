import Joi from 'joi';

export const createUserSchema = Joi.object({
  first_name: Joi.string().min(3).max(30),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  avatar: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  first_name: Joi.string().min(3).max(30),
  last_name: Joi.string(),
  email: Joi.string().email(),
  avatar: Joi.string(),
});

export const idParamSchema = Joi.object({
  id: Joi.number().required(),
});

export const getUsersByPageSchema = Joi.object({
  page: Joi.number().required(),
});
