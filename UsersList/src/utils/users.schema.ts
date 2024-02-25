import Joi from 'joi';

export const createUserSchema = Joi.object({
  body: {
    first_name: Joi.string().min(3).max(30).required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    avatar: Joi.string(),
  },
  params: {},
  query: {},
});

export const updateUserSchema = Joi.object({
  body: {
    first_name: Joi.string().min(3).max(30),
    last_name: Joi.string(),
    email: Joi.string().email(),
    avatar: Joi.string(),
  },
  params: { id: Joi.number().required() },
  query: {},
});

export const getUsersByPageSchema = Joi.object({
  body: {},
  params: { page: Joi.number().required() },
  query: {},
});

export const getUserByIdSchema = Joi.object({
  body: {},
  params: {
    id: Joi.number().required(),
  },
  query: {},
});

export const deleteUserSchema = Joi.object({
  body: {},
  params: {
    id: Joi.number().required(),
  },
  query: {},
});
