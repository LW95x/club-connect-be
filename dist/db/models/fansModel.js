"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLoginFan = exports.editFanPassword = exports.editFan = exports.removeFan = exports.postFan = exports.findFans = exports.findFanById = void 0;
const connection_1 = __importDefault(require("../connection"));
const schemas_1 = require("../../helpers/schemas");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}
const findFanById = (fanId) => {
    return connection_1.default
        .query(`SELECT *
        FROM fans f
        WHERE f.fan_id = $1`, [fanId])
        .then(({ rows }) => {
        const fan = rows[0];
        if (!fan) {
            return Promise.reject({
                status: 404,
                msg: "This Fan ID does not exist.",
            });
        }
        return fan;
    });
};
exports.findFanById = findFanById;
const findFans = () => {
    return connection_1.default.query(`SELECT * FROM fans`).then(({ rows }) => {
        return rows;
    });
};
exports.findFans = findFans;
const postFan = (newFan) => {
    const { error } = schemas_1.newFanSchema.validate(newFan);
    if (error) {
        return Promise.reject({
            status: 400,
            msg: "Bad Request",
            details: error.details,
        });
    }
    const { username, password, date_of_birth, address, email, phone_number } = newFan;
    const hashPasswordPromise = bcrypt_1.default.hash(password, 10);
    return hashPasswordPromise
        .then((hashedPassword) => {
        const dbQueryPromise = connection_1.default.query(`INSERT INTO fans (username, password, date_of_birth, address, email, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, [username, hashedPassword, date_of_birth, address, email, phone_number]);
        return dbQueryPromise;
    })
        .then(({ rows }) => {
        const newUser = rows[0];
        return newUser;
    });
};
exports.postFan = postFan;
const removeFan = (fanId) => {
    return (0, exports.findFanById)(fanId).then((fan) => {
        if (!fan) {
            return Promise.reject({
                status: 404,
                msg: "That Fan ID does not exist",
            });
        }
        return connection_1.default
            .query(`DELETE FROM fans WHERE fan_id = $1 RETURNING *`, [fanId])
            .then(({ rows }) => {
            const fan = rows[0];
            return fan;
        });
    });
};
exports.removeFan = removeFan;
const editFan = (fanId, updatedFields) => {
    return (0, exports.findFanById)(fanId).then((fan) => {
        if (!fan) {
            return Promise.reject({
                status: 404,
                msg: "That Fan ID does not exist",
            });
        }
        const { error } = schemas_1.updatedFanSchema.validate(updatedFields);
        if (error) {
            return Promise.reject({
                status: 400,
                msg: "Bad Request",
                details: error.details,
            });
        }
        let query = "UPDATE fans SET ";
        const fields = [];
        let i = 1;
        for (const [key, value] of Object.entries(updatedFields)) {
            query += `${key} = $${i}, `;
            fields.push(value);
            i++;
        }
        query = query.slice(0, -2) + ` WHERE fan_id = $${i} RETURNING *`;
        fields.push(fanId);
        return connection_1.default.query(query, fields).then(({ rows }) => {
            const updatedFan = rows[0];
            return updatedFan;
        });
    });
};
exports.editFan = editFan;
const editFanPassword = (fanId, updatedPassword) => {
    return (0, exports.findFanById)(fanId).then((fan) => {
        if (!fan) {
            return Promise.reject({
                status: 404,
                msg: "That Fan ID does not exist",
            });
        }
        const { current_password, new_password } = updatedPassword;
        return bcrypt_1.default.compare(current_password, fan.password).then((result) => {
            if (!result) {
                return Promise.reject({
                    status: 401,
                    msg: "Provided current password is incorrect.",
                });
            }
            const { error } = schemas_1.updatedPasswordSchema.validate({
                password: new_password,
            });
            if (error) {
                return Promise.reject({
                    status: 400,
                    msg: "Bad Request",
                    details: error.details,
                });
            }
            return bcrypt_1.default.hash(new_password, 10).then((hashedPassword) => {
                return connection_1.default
                    .query(`UPDATE fans SET password = $1 WHERE fan_id = $2 RETURNING *`, [hashedPassword, fanId])
                    .then(({ rows }) => {
                    const updatedPassword = rows[0];
                    return updatedPassword;
                });
            });
        });
    });
};
exports.editFanPassword = editFanPassword;
const postLoginFan = (username, password) => {
    return connection_1.default.query(`SELECT * FROM fans WHERE username = $1`, [username])
        .then((result) => {
        const fan = result.rows[0];
        if (!fan) {
            return Promise.reject({
                status: 404,
                msg: "That username does not exist",
            });
        }
        return bcrypt_1.default.compare(password, fan.password).then((matchResult) => {
            if (!matchResult) {
                return Promise.reject({
                    status: 401,
                    msg: "Provided password is incorrect.",
                });
            }
            const token = jsonwebtoken_1.default.sign({ id: fan.fan_id, username: fan.username }, JWT_SECRET, { expiresIn: '1h' });
            return token;
        });
    });
};
exports.postLoginFan = postLoginFan;
