"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editEvent = exports.removeEvent = exports.addEvent = exports.findEventsByClubId = exports.findEvents = exports.findEventById = void 0;
const schemas_1 = require("../../helpers/schemas");
const connection_1 = __importDefault(require("../connection"));
const clubsModel_1 = require("./clubsModel");
const findEventById = (eventId) => {
    return connection_1.default
        .query(`SELECT * FROM events e WHERE e.event_id = $1`, [eventId])
        .then(({ rows }) => {
        const event = rows[0];
        if (!event) {
            return Promise.reject({
                status: 404,
                msg: "This Event ID does not exist.",
            });
        }
        return event;
    });
};
exports.findEventById = findEventById;
const findEvents = () => {
    return connection_1.default.query(`SELECT * FROM events`).then(({ rows }) => {
        return rows;
    });
};
exports.findEvents = findEvents;
const findEventsByClubId = (clubId) => {
    return connection_1.default
        .query(`SELECT * FROM events e WHERE e.home_club_id = $1`, [clubId])
        .then(({ rows }) => {
        const clubEvents = rows[0];
        if (!clubEvents) {
            return Promise.reject({
                status: 404,
                msg: "This Club ID does not exist.",
            });
        }
        return clubEvents;
    });
};
exports.findEventsByClubId = findEventsByClubId;
const addEvent = (clubId, newEvent) => {
    return (0, clubsModel_1.findClubById)(clubId).then((club) => {
        if (!club) {
            return Promise.reject({
                status: 404,
                msg: "That Club ID does not exist",
            });
        }
        const { error } = schemas_1.newEventSchema.validate(newEvent);
        if (error) {
            return Promise.reject({
                status: 400,
                msg: "Bad Request",
                details: error.details,
            });
        }
        const { title, location, price, date_time, description, available_tickets, } = newEvent;
        return connection_1.default
            .query(`INSERT INTO events (home_club_id, title, location, price, date_time, description, available_tickets) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`, [
            clubId,
            title,
            location,
            price,
            date_time,
            description,
            available_tickets,
        ])
            .then(({ rows }) => {
            const newEvent = rows[0];
            return newEvent;
        });
    });
};
exports.addEvent = addEvent;
const removeEvent = (clubId, eventId) => {
    return (0, clubsModel_1.findClubById)(clubId).then((club) => {
        if (!club) {
            return Promise.reject({
                status: 404,
                msg: "That Club ID does not exist",
            });
        }
        return (0, exports.findEventById)(eventId).then((event) => {
            if (!event) {
                return Promise.reject({
                    status: 404,
                    msg: "That Event ID does not exist",
                });
            }
            return connection_1.default
                .query(`DELETE FROM events WHERE event_id = $1 RETURNING *`, [eventId])
                .then(({ rows }) => {
                const event = rows[0];
                return event;
            });
        });
    });
};
exports.removeEvent = removeEvent;
const editEvent = (clubId, eventId, updatedFields) => {
    return (0, clubsModel_1.findClubById)(clubId).then((club) => {
        if (!club) {
            return Promise.reject({
                status: 404,
                msg: "That Club ID does not exist",
            });
        }
        return (0, exports.findEventById)(eventId).then((event) => {
            if (!event) {
                return Promise.reject({
                    status: 404,
                    msg: "That Event ID does not exist",
                });
            }
            const { error } = schemas_1.updatedEventSchema.validate(updatedFields);
            if (error) {
                return Promise.reject({
                    status: 400,
                    msg: "Bad Request",
                    details: error.details,
                });
            }
            let query = "UPDATE events SET ";
            const fields = [];
            let i = 1;
            for (const [key, value] of Object.entries(updatedFields)) {
                query += `${key} = $${i}, `;
                fields.push(value);
                i++;
            }
            query = query.slice(0, -2) + ` WHERE event_id = $${i} RETURNING *`;
            fields.push(eventId);
            return connection_1.default.query(query, fields).then(({ rows }) => {
                const updatedEvent = rows[0];
                return updatedEvent;
            });
        });
    });
};
exports.editEvent = editEvent;
