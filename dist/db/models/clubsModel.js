"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLoginClub = exports.editClubPassword = exports.editClub = exports.removeClub = exports.postClub = exports.findClubs = exports.findClubById = void 0;
const schemas_1 = require("../../helpers/schemas");
const connection_1 = __importDefault(require("../connection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}
const findClubById = (clubId) => {
    return connection_1.default
        .query(`SELECT
        c.club_id,
        c.username,
        c.password,
        c.club_name,
        c.league,
        c.location,
        c.stadium_capacity,
        c.email,
        c.phone_number,
        c.website,
        c.facebook,
        c.twitter
        FROM clubs c
        WHERE c.club_id = $1`, [clubId])
        .then(({ rows }) => {
        const club = rows[0];
        if (!club) {
            return Promise.reject({
                status: 404,
                msg: "This Club ID does not exist.",
            });
        }
        return club;
    });
};
exports.findClubById = findClubById;
const findClubs = () => {
    return connection_1.default.query(`SELECT * FROM clubs`).then(({ rows }) => {
        return rows;
    });
};
exports.findClubs = findClubs;
const postClub = (newClub) => {
    const { error } = schemas_1.newClubSchema.validate(newClub);
    if (error) {
        return Promise.reject({
            status: 400,
            msg: "Bad Request",
            details: error.details,
        });
    }
    const { username, password, club_name, league, location, stadium_capacity, email, phone_number, website = "", facebook = "", twitter = "", } = newClub;
    const hashPasswordPromise = bcrypt_1.default.hash(password, 10);
    return hashPasswordPromise
        .then((hashedPassword) => {
        const dbQueryPromise = connection_1.default.query(`INSERT INTO clubs (username, password, club_name, league, location, stadium_capacity, email, phone_number, website, facebook, twitter) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;`, [
            username,
            hashedPassword,
            club_name,
            league,
            location,
            stadium_capacity,
            email,
            phone_number,
            website,
            facebook,
            twitter,
        ]);
        return dbQueryPromise;
    })
        .then(({ rows }) => {
        const newClub = rows[0];
        return newClub;
    });
};
exports.postClub = postClub;
const removeClub = (clubId) => {
    return (0, exports.findClubById)(clubId).then((club) => {
        if (!club) {
            return Promise.reject({
                status: 404,
                msg: "That Club ID does not exist",
            });
        }
        return connection_1.default
            .query(`DELETE FROM clubs WHERE club_id = $1 RETURNING *`, [clubId])
            .then(({ rows }) => {
            const club = rows[0];
            return club;
        });
    });
};
exports.removeClub = removeClub;
const editClub = (clubId, updatedFields) => {
    return (0, exports.findClubById)(clubId).then((club) => {
        if (!club) {
            return Promise.reject({
                status: 404,
                msg: "That Club ID does not exist",
            });
        }
        const { error } = schemas_1.updatedClubSchema.validate(updatedFields);
        if (error) {
            return Promise.reject({
                status: 400,
                msg: "Bad Request",
                details: error.details,
            });
        }
        let query = "UPDATE clubs SET ";
        const fields = [];
        let i = 1;
        for (const [key, value] of Object.entries(updatedFields)) {
            query += `${key} = $${i}, `;
            fields.push(value);
            i++;
        }
        query = query.slice(0, -2) + ` WHERE club_id = $${i} RETURNING *`;
        fields.push(clubId);
        return connection_1.default.query(query, fields).then(({ rows }) => {
            const updatedClub = rows[0];
            return updatedClub;
        });
    });
};
exports.editClub = editClub;
const editClubPassword = (clubId, updatedPassword) => {
    return (0, exports.findClubById)(clubId).then((club) => {
        if (!club) {
            return Promise.reject({
                status: 404,
                msg: "That Club ID does not exist",
            });
        }
        const { current_password, new_password } = updatedPassword;
        return bcrypt_1.default.compare(current_password, club.password).then((result) => {
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
                    .query(`UPDATE clubs SET password = $1 WHERE club_id = $2 RETURNING *`, [hashedPassword, clubId])
                    .then(({ rows }) => {
                    const updatedPassword = rows[0];
                    return updatedPassword;
                });
            });
        });
    });
};
exports.editClubPassword = editClubPassword;
const postLoginClub = (username, password) => {
    return connection_1.default
        .query(`SELECT * FROM clubs WHERE username = $1`, [username])
        .then((result) => {
        const club = result.rows[0];
        if (!club) {
            return Promise.reject({
                status: 404,
                msg: "That username does not exist",
            });
        }
        return bcrypt_1.default.compare(password, club.password).then((matchResult) => {
            if (!matchResult) {
                return Promise.reject({
                    status: 401,
                    msg: "Provided password is incorrect.",
                });
            }
            const token = jsonwebtoken_1.default.sign({ id: club.club_id, username: club.username }, JWT_SECRET, { expiresIn: "1h" });
            return token;
        });
    });
};
exports.postLoginClub = postLoginClub;
