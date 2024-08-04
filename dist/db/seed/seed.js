"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const format = require("pg-format");
const connection_1 = __importDefault(require("../connection"));
const seed = ({ eventsData, clubsData, fansData, ordersData }) => {
    return connection_1.default
        .query(`DROP TABLE IF EXISTS orders;`)
        .then(() => {
        return connection_1.default.query(`DROP TABLE IF EXISTS events;`);
    })
        .then(() => {
        return connection_1.default.query(`DROP TABLE IF EXISTS clubs;`);
    })
        .then(() => {
        return connection_1.default.query(`DROP TABLE IF EXISTS fans;`);
    })
        .then(() => {
        const fansTablePromise = connection_1.default.query(`CREATE TABLE fans (
        fan_id SERIAL PRIMARY KEY,
        username VARCHAR(30) NOT NULL, 
        password VARCHAR(100) NOT NULL, 
        date_of_birth DATE NOT NULL, 
        address VARCHAR(255) NOT NULL, 
        email VARCHAR(100) NOT NULL, 
        phone_number VARCHAR(30) NOT NULL
        );`);
        const clubsTablePromise = connection_1.default.query(`CREATE TABLE clubs (
        club_id SERIAL PRIMARY KEY, 
        username VARCHAR(30) NOT NULL, 
        password VARCHAR(100) NOT NULL, 
        club_name VARCHAR(50) NOT NULL, 
        league VARCHAR(50) NOT NULL, 
        location VARCHAR(255) NOT NULL, 
        stadium_capacity INT NOT NULL, 
        email VARCHAR(100) NOT NULL, 
        phone_number VARCHAR(30) NOT NULL, 
        website VARCHAR(100), 
        facebook VARCHAR(100), 
        twitter VARCHAR(100)
        );`);
        return Promise.all([fansTablePromise, clubsTablePromise]);
    })
        .then(() => {
        return connection_1.default.query(`CREATE TABLE events (
        event_id SERIAL PRIMARY KEY, 
        home_club_id INT NOT NULL REFERENCES clubs(club_id) ON DELETE CASCADE, 
        title VARCHAR (100) NOT NULL, 
        location VARCHAR(255) NOT NULL, 
        price DECIMAL(10,2) NOT NULL, 
        date_time TIMESTAMP NOT NULL, 
        description VARCHAR(255) NOT NULL, 
        available_tickets INT DEFAULT 0 NOT NULL
        );`);
    })
        .then(() => {
        return connection_1.default.query(`CREATE TABLE orders (
        order_id SERIAL PRIMARY KEY, 
        user_id INT NOT NULL REFERENCES fans(fan_id) ON DELETE CASCADE, 
        event_id INT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE, 
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, 
        quantity INT NOT NULL, 
        total_price DECIMAL(10,2) NOT NULL, 
        order_status VARCHAR(50) NOT NULL
        );`);
    })
        .then(() => {
        const insertFans = format("INSERT INTO fans (username, password, date_of_birth, address, email, phone_number) VALUES %L;", fansData.map(({ username, password, dateOfBirth, address, email, phoneNumber, }) => [username, password, dateOfBirth, address, email, phoneNumber]));
        const fansDataPromise = connection_1.default.query(insertFans);
        const insertClubs = format("INSERT INTO clubs (username, password, club_name, league, location, stadium_capacity, email, phone_number, website, facebook, twitter) VALUES %L;", clubsData.map(({ username, password, clubName, league, location, stadiumCapacity, email, phoneNumber, website, facebook, twitter, }) => [
            username,
            password,
            clubName,
            league,
            location,
            stadiumCapacity,
            email,
            phoneNumber,
            website || null,
            facebook || null,
            twitter || null,
        ]));
        const clubsDataPromise = connection_1.default.query(insertClubs);
        return Promise.all([fansDataPromise, clubsDataPromise]);
    })
        .then(() => {
        const insertEvents = format("INSERT INTO events (home_club_id, title, location, price, date_time, description, available_tickets) VALUES %L;", eventsData.map(({ homeClubId, title, location, price, dateTime, description, availableTickets, }) => [
            homeClubId,
            title,
            location,
            price,
            dateTime,
            description,
            availableTickets,
        ]));
        return connection_1.default.query(insertEvents);
    })
        .then(() => {
        const insertOrders = format("INSERT INTO orders (user_id, event_id, order_date, quantity, total_price, order_status) VALUES %L;", ordersData.map(({ userId, eventId, orderDate, quantity, totalPrice, orderStatus, }) => [userId, eventId, orderDate, quantity, totalPrice, orderStatus]));
        return connection_1.default.query(insertOrders);
    });
};
exports.default = seed;
