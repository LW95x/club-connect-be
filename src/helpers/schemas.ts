import Joi from "joi";

export const newFanSchema = Joi.object({
  username: Joi.string().min(5).required(),
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?!.* ).{8,16}$")
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.",
    }),
  date_of_birth: Joi.string().isoDate().required(),
  address: Joi.string().min(10).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().min(10).required(),
});

export const newClubSchema = Joi.object({
  username: Joi.string().min(5).required(),
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?!.* ).{8,16}$")
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.",
    }),
  club_name: Joi.string().min(5).required(),
  league: Joi.string().min(5).required(),
  location: Joi.string().min(10).required(),
  stadium_capacity: Joi.number().required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().min(10).required(),
  website: Joi.string().uri(),
  facebook: Joi.string().uri(),
  twitter: Joi.string().uri(),
});

export const newEventSchema = Joi.object({
  title: Joi.string().min(5).required(),
  location: Joi.string().min(10).required(),
  price: Joi.number().required(),
  date_time: Joi.date().iso().required(),
  description: Joi.string().min(10).required(),
  available_tickets: Joi.number().required(),
});

export const newOrderSchema = Joi.object({
  event_id: Joi.string().required(),
  order_date: Joi.string().isoDate().required(),
  quantity: Joi.number().required(),
  total_price: Joi.number().required(),
  order_status: Joi.string().required(),
  add_to_calendar: Joi.boolean().required()
});

export const updatedFanSchema = Joi.object({
  date_of_birth: Joi.string().isoDate(),
  address: Joi.string().min(10),
  email: Joi.string().email(),
  phone_number: Joi.string().min(10),
});

export const updatedClubSchema = Joi.object({
  club_name: Joi.string().min(5),
  league: Joi.string().min(5),
  location: Joi.string().min(10),
  stadium_capacity: Joi.number(),
  email: Joi.string().email(),
  phone_number: Joi.string().min(10),
  website: Joi.string().uri(),
  facebook: Joi.string().uri(),
  twitter: Joi.string().uri(),
});

export const updatedEventSchema = Joi.object({
  title: Joi.string().min(5),
  location: Joi.string().min(10),
  price: Joi.number(),
  date_time: Joi.date().iso(),
  description: Joi.string().min(10),
  available_tickets: Joi.number(),
});

export const updatedOrderSchema = Joi.object({
  quantity: Joi.number(),
  total_price: Joi.number(),
  order_status: Joi.string(),
});

export const updatedPasswordSchema = Joi.object({
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?!.* ).{8,16}$")
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.",
    }),
});