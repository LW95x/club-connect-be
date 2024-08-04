"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersData = exports.eventsData = exports.fansData = exports.clubsData = void 0;
const clubs_1 = __importDefault(require("./clubs"));
exports.clubsData = clubs_1.default;
const fans_1 = __importDefault(require("./fans"));
exports.fansData = fans_1.default;
const events_1 = __importDefault(require("./events"));
exports.eventsData = events_1.default;
const orders_1 = __importDefault(require("./orders"));
exports.ordersData = orders_1.default;
