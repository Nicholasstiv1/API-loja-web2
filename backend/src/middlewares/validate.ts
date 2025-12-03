import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export function validate(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ errors: messages });
    }

    next();
  };
}

export const productSchema = Joi.object({
  name: Joi.string().min(3).required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  description: Joi.string().allow("").optional(),
});

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  userType: Joi.string().valid("admin", "cliente").required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
