"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginFan = exports.patchFanPassword = exports.patchFan = exports.deleteFan = exports.registerFan = exports.getFans = exports.getFanById = void 0;
const fansModel_1 = require("../models/fansModel");
const getFanById = (req, res, next) => {
    const fanId = req.params.fanId;
    (0, fansModel_1.findFanById)(fanId)
        .then((fan) => {
        res.status(200).send({ fan });
    })
        .catch((error) => {
        next(error);
    });
};
exports.getFanById = getFanById;
const getFans = (req, res, next) => {
    (0, fansModel_1.findFans)().then((fans) => {
        res.status(200).send({ fans });
    });
};
exports.getFans = getFans;
const registerFan = (req, res, next) => {
    const newFan = req.body;
    (0, fansModel_1.postFan)(newFan)
        .then((fan) => {
        res.status(201).send(fan);
    })
        .catch((error) => {
        next(error);
    });
};
exports.registerFan = registerFan;
const deleteFan = (req, res, next) => {
    const fanId = req.params.fanId;
    (0, fansModel_1.removeFan)(fanId)
        .then((fan) => {
        res.status(204).send(fan);
    })
        .catch((error) => {
        next(error);
    });
};
exports.deleteFan = deleteFan;
const patchFan = (req, res, next) => {
    const fanId = req.params.fanId;
    const updatedFields = req.body;
    (0, fansModel_1.editFan)(fanId, updatedFields)
        .then((fan) => {
        res.status(200).send(fan);
    })
        .catch((error) => {
        next(error);
    });
};
exports.patchFan = patchFan;
const patchFanPassword = (req, res, next) => {
    const fanId = req.params.fanId;
    const updatedPassword = req.body;
    (0, fansModel_1.editFanPassword)(fanId, updatedPassword)
        .then((fan) => {
        res.status(200).send(fan);
    })
        .catch((error) => {
        next(error);
    });
};
exports.patchFanPassword = patchFanPassword;
const loginFan = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    (0, fansModel_1.postLoginFan)(username, password)
        .then((token) => {
        res.status(200).send(token);
    })
        .catch((error) => {
        next(error);
    });
};
exports.loginFan = loginFan;
