"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../data/index");
const seed_1 = __importDefault(require("./seed"));
const connection_1 = __importDefault(require("../connection"));
const runSeed = () => {
    return (0, seed_1.default)({ clubsData: index_1.clubsData, fansData: index_1.fansData, eventsData: index_1.eventsData, ordersData: index_1.ordersData }).then(() => connection_1.default.end());
};
runSeed();
