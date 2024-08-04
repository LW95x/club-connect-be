"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editOrder = exports.removeOrder = exports.addOrder = exports.findOrderById = exports.findAllOrders = void 0;
const schemas_1 = require("../../helpers/schemas");
const connection_1 = __importDefault(require("../connection"));
const eventsModel_1 = require("./eventsModel");
const fansModel_1 = require("./fansModel");
const googleapis_1 = require("googleapis");
const google_auth_library_1 = require("google-auth-library");
const calendar = googleapis_1.google.calendar("v3");
const oAuth2Client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
const findAllOrders = (fanId) => {
    return (0, fansModel_1.findFanById)(fanId).then((fan) => {
        if (!fan) {
            return Promise.reject({
                status: 404,
                msg: "That Fan ID does not exist",
            });
        }
        return connection_1.default
            .query(`SELECT * FROM orders o WHERE o.user_id = $1`, [fanId])
            .then(({ rows }) => {
            return rows;
        });
    });
};
exports.findAllOrders = findAllOrders;
const findOrderById = (fanId, orderId) => {
    return (0, fansModel_1.findFanById)(fanId).then((fan) => {
        if (!fan) {
            return Promise.reject({
                status: 404,
                msg: "That Fan ID does not exist",
            });
        }
        return connection_1.default
            .query(`SELECT * FROM ORDERS o WHERE o.user_id = $1 AND o.order_id = $2`, [fanId, orderId])
            .then(({ rows }) => {
            const order = rows[0];
            if (!order) {
                return Promise.reject({
                    status: 404,
                    msg: "This Order ID does not exist.",
                });
            }
            return order;
        });
    });
};
exports.findOrderById = findOrderById;
const addOrder = (fanId, newOrder, token) => {
    return (0, fansModel_1.findFanById)(fanId).then((fan) => {
        if (!fan) {
            return Promise.reject({
                status: 404,
                msg: "That Fan ID does not exist",
            });
        }
        return (0, eventsModel_1.findEventById)(newOrder.event_id).then((event) => {
            if (!event) {
                return Promise.reject({
                    status: 404,
                    msg: "That Event ID does not exist",
                });
            }
            const { error } = schemas_1.newOrderSchema.validate(newOrder);
            if (error) {
                return Promise.reject({
                    status: 400,
                    msg: "Bad Request",
                    details: error.details,
                });
            }
            const { event_id, order_date, quantity, total_price, order_status, add_to_calendar } = newOrder;
            return connection_1.default
                .query(`INSERT INTO orders (user_id, event_id, order_date, quantity, total_price, order_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, [fanId, event_id, order_date, quantity, total_price, order_status])
                .then(({ rows }) => {
                const newOrder = rows[0];
                if (add_to_calendar) {
                    const eventDetails = {
                        summary: event.title,
                        location: event.location,
                        description: event.description,
                        start: {
                            dateTime: new Date(event.date_time).toISOString(),
                            timeZone: "Europe/London",
                        },
                        end: {
                            dateTime: new Date(new Date(event.date_time).getTime() + 10800000).toISOString(),
                            timeZone: "Europe/London",
                        },
                    };
                    const authClient = new googleapis_1.google.auth.OAuth2();
                    authClient.setCredentials({ access_token: token });
                    return calendar.events
                        .insert({
                        auth: authClient,
                        calendarId: "primary",
                        requestBody: eventDetails,
                    })
                        .then(() => {
                        return newOrder;
                    });
                }
                return newOrder;
            });
        });
    });
};
exports.addOrder = addOrder;
const removeOrder = (fanId, orderId) => {
    return (0, fansModel_1.findFanById)(fanId).then((fan) => {
        if (!fan) {
            return Promise.reject({
                status: 404,
                msg: "That Fan ID does not exist",
            });
        }
        return (0, exports.findOrderById)(fanId, orderId).then((order) => {
            if (!order) {
                return Promise.reject({
                    status: 404,
                    msg: "That Order ID does not exist",
                });
            }
            return connection_1.default
                .query(`DELETE FROM orders WHERE order_id = $1 RETURNING *`, [orderId])
                .then(({ rows }) => {
                const order = rows[0];
                return order;
            });
        });
    });
};
exports.removeOrder = removeOrder;
const editOrder = (fanId, orderId, updatedFields) => {
    return (0, fansModel_1.findFanById)(fanId).then((fan) => {
        if (!fan) {
            return Promise.reject({
                status: 404,
                msg: "That Fan ID does not exist",
            });
        }
        return (0, exports.findOrderById)(fanId, orderId).then((order) => {
            if (!order) {
                return Promise.reject({
                    status: 404,
                    msg: "That Order ID does not exist",
                });
            }
            const { error } = schemas_1.updatedOrderSchema.validate(updatedFields);
            if (error) {
                return Promise.reject({
                    status: 400,
                    msg: "Bad Request",
                    details: error.details,
                });
            }
            let query = "UPDATE orders SET ";
            const fields = [];
            let i = 1;
            for (const [key, value] of Object.entries(updatedFields)) {
                query += `${key} = $${i}, `;
                fields.push(value);
                i++;
            }
            query = query.slice(0, -2) + ` WHERE order_id = $${i} RETURNING *`;
            fields.push(orderId);
            return connection_1.default.query(query, fields).then(({ rows }) => {
                const updatedOrder = rows[0];
                return updatedOrder;
            });
        });
    });
};
exports.editOrder = editOrder;
