"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findApi = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const findApi = () => {
    const filePath = `${__dirname}/../../endpoints.json`;
    console.log('Attempting to read file at path:', filePath);
    return promises_1.default.readFile(`${__dirname}/../../endpoints.json`, 'utf-8')
        .then((data) => {
        const parsedEndpoints = JSON.parse(data);
        return parsedEndpoints;
    });
};
exports.findApi = findApi;
