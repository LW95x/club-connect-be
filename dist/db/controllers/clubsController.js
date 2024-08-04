"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginClub = exports.patchClubPassword = exports.patchClub = exports.deleteClub = exports.registerClub = exports.getClubs = exports.getClubById = void 0;
const clubsModel_1 = require("../models/clubsModel");
const getClubById = (req, res, next) => {
    const clubId = req.params.clubId;
    (0, clubsModel_1.findClubById)(clubId)
        .then((club) => {
        res.status(200).send({ club });
    })
        .catch((error) => {
        next(error);
    });
};
exports.getClubById = getClubById;
const getClubs = (req, res, next) => {
    (0, clubsModel_1.findClubs)().then((clubs) => {
        res.status(200).send({ clubs });
    });
};
exports.getClubs = getClubs;
const registerClub = (req, res, next) => {
    const newClub = req.body;
    (0, clubsModel_1.postClub)(newClub).then((club) => {
        res.status(201).send(club);
    })
        .catch((error) => {
        next(error);
    });
};
exports.registerClub = registerClub;
const deleteClub = (req, res, next) => {
    const clubId = req.params.clubId;
    (0, clubsModel_1.removeClub)(clubId)
        .then((club) => {
        res.status(204).send(club);
    })
        .catch((error) => {
        next(error);
    });
};
exports.deleteClub = deleteClub;
const patchClub = (req, res, next) => {
    const clubId = req.params.clubId;
    const updatedFields = req.body;
    (0, clubsModel_1.editClub)(clubId, updatedFields)
        .then((club) => {
        res.status(200).send(club);
    })
        .catch((error) => {
        next(error);
    });
};
exports.patchClub = patchClub;
const patchClubPassword = (req, res, next) => {
    const clubId = req.params.clubId;
    const updatedPassword = req.body;
    (0, clubsModel_1.editClubPassword)(clubId, updatedPassword)
        .then((fan) => {
        res.status(200).send(fan);
    })
        .catch((error) => {
        next(error);
    });
};
exports.patchClubPassword = patchClubPassword;
const loginClub = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    (0, clubsModel_1.postLoginClub)(username, password)
        .then((token) => {
        res.status(200).send(token);
    })
        .catch((error) => {
        next(error);
    });
};
exports.loginClub = loginClub;
