"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedPasswordSchema = exports.updatedOrderSchema = exports.updatedEventSchema = exports.updatedClubSchema = exports.updatedFanSchema = exports.newOrderSchema = exports.newEventSchema = exports.newClubSchema = exports.newFanSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.newFanSchema = joi_1.default.object({
    username: joi_1.default.string().min(5).required(),
    password: joi_1.default.string()
        .pattern(new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?!.* ).{8,16}$"))
        .required()
        .messages({
        "string.pattern.base": "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.",
    }),
    date_of_birth: joi_1.default.string().isoDate().required(),
    address: joi_1.default.string().min(10).required(),
    email: joi_1.default.string().email().required(),
    phone_number: joi_1.default.string().min(10).required(),
});
exports.newClubSchema = joi_1.default.object({
    username: joi_1.default.string().min(5).required(),
    password: joi_1.default.string()
        .pattern(new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?!.* ).{8,16}$"))
        .required()
        .messages({
        "string.pattern.base": "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.",
    }),
    club_name: joi_1.default.string().min(5).required(),
    league: joi_1.default.string().min(5).required(),
    location: joi_1.default.string().min(10).required(),
    stadium_capacity: joi_1.default.number().required(),
    email: joi_1.default.string().email().required(),
    phone_number: joi_1.default.string().min(10).required(),
    website: joi_1.default.string().uri(),
    facebook: joi_1.default.string().uri(),
    twitter: joi_1.default.string().uri(),
});
exports.newEventSchema = joi_1.default.object({
    title: joi_1.default.string().min(5).required(),
    location: joi_1.default.string().min(10).required(),
    price: joi_1.default.number().required(),
    date_time: joi_1.default.date().iso().required(),
    description: joi_1.default.string().min(10).required(),
    available_tickets: joi_1.default.number().required(),
});
exports.newOrderSchema = joi_1.default.object({
    event_id: joi_1.default.string().required(),
    order_date: joi_1.default.string().isoDate().required(),
    quantity: joi_1.default.number().required(),
    total_price: joi_1.default.number().required(),
    order_status: joi_1.default.string().required(),
    add_to_calendar: joi_1.default.boolean().required()
});
exports.updatedFanSchema = joi_1.default.object({
    date_of_birth: joi_1.default.string().isoDate(),
    address: joi_1.default.string().min(10),
    email: joi_1.default.string().email(),
    phone_number: joi_1.default.string().min(10),
});
exports.updatedClubSchema = joi_1.default.object({
    club_name: joi_1.default.string().min(5),
    league: joi_1.default.string().min(5),
    location: joi_1.default.string().min(10),
    stadium_capacity: joi_1.default.number(),
    email: joi_1.default.string().email(),
    phone_number: joi_1.default.string().min(10),
    website: joi_1.default.string().uri(),
    facebook: joi_1.default.string().uri(),
    twitter: joi_1.default.string().uri(),
});
exports.updatedEventSchema = joi_1.default.object({
    title: joi_1.default.string().min(5),
    location: joi_1.default.string().min(10),
    price: joi_1.default.number(),
    date_time: joi_1.default.date().iso(),
    description: joi_1.default.string().min(10),
    available_tickets: joi_1.default.number(),
});
exports.updatedOrderSchema = joi_1.default.object({
    quantity: joi_1.default.number(),
    total_price: joi_1.default.number(),
    order_status: joi_1.default.string(),
});
exports.updatedPasswordSchema = joi_1.default.object({
    password: joi_1.default.string()
        .pattern(new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?!.* ).{8,16}$"))
        .required()
        .messages({
        "string.pattern.base": "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.",
    }),
});
