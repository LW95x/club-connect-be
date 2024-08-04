"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchEvent = exports.deleteEvent = exports.postEvent = exports.getEventsByClubId = exports.getEvents = exports.getEventById = void 0;
const eventsModel_1 = require("../models/eventsModel");
const getEventById = (req, res, next) => {
    const eventId = req.params.eventId;
    (0, eventsModel_1.findEventById)(eventId)
        .then((event) => {
        res.status(200).send({ event });
    })
        .catch((error) => {
        next(error);
    });
};
exports.getEventById = getEventById;
const getEvents = (req, res, next) => {
    (0, eventsModel_1.findEvents)().then((events) => {
        res.status(200).send({ events });
    });
};
exports.getEvents = getEvents;
const getEventsByClubId = (req, res, next) => {
    const clubId = req.params.clubId;
    (0, eventsModel_1.findEventsByClubId)(clubId)
        .then((events) => {
        res.status(200).send({ events });
    })
        .catch((error) => {
        next(error);
    });
};
exports.getEventsByClubId = getEventsByClubId;
const postEvent = (req, res, next) => {
    const clubId = req.params.clubId;
    const newEvent = req.body;
    (0, eventsModel_1.addEvent)(clubId, newEvent)
        .then((event) => {
        res.status(201).send(event);
    })
        .catch((error) => {
        next(error);
    });
};
exports.postEvent = postEvent;
const deleteEvent = (req, res, next) => {
    const clubId = req.params.clubId;
    const eventId = req.params.eventId;
    (0, eventsModel_1.removeEvent)(clubId, eventId)
        .then((event) => {
        res.status(204).send(event);
    })
        .catch((error) => {
        next(error);
    });
};
exports.deleteEvent = deleteEvent;
const patchEvent = (req, res, next) => {
    const clubId = req.params.clubId;
    const eventId = req.params.eventId;
    const updatedFields = req.body;
    (0, eventsModel_1.editEvent)(clubId, eventId, updatedFields)
        .then((event) => {
        res.status(200).send(event);
    })
        .catch((error) => {
        next(error);
    });
};
exports.patchEvent = patchEvent;
