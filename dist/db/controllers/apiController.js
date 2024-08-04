"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApi = void 0;
const apiModel_1 = require("../models/apiModel");
const getApi = (req, res, next) => {
    (0, apiModel_1.findApi)().then((endpoints) => {
        res.status(200).send(endpoints);
    })
        .catch((error) => {
        next(error);
    });
};
exports.getApi = getApi;
