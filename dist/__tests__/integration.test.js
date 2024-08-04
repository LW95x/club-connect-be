"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const connection_1 = __importDefault(require("../db/connection"));
const seed_1 = __importDefault(require("../db/seed/seed"));
const index_1 = require("../db/data/index");
const app_1 = __importDefault(require("../app"));
beforeEach(() => {
    return (0, seed_1.default)({ clubsData: index_1.clubsData, fansData: index_1.fansData, eventsData: index_1.eventsData, ordersData: index_1.ordersData });
});
afterAll(() => connection_1.default.end());
////////////////////////////////////////////////////////////////////////////////////
// FANS TESTS
////////////////////////////////////////////////////////////////////////////////////
describe("GET /api/fans/:fanId", () => {
    test("GET 200: returns a fan object, with all of the correct properties", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/fans/1")
            .expect(200)
            .then(({ body }) => {
            const fan = body.fan;
            expect(fan.fan_id).toBe(1);
            expect(typeof fan.username).toBe("string");
            expect(typeof fan.password).toBe("string");
            expect(typeof fan.date_of_birth).toBe("string");
            expect(typeof fan.address).toBe("string");
            expect(typeof fan.email).toBe("string");
            expect(typeof fan.phone_number).toBe("string");
        });
    });
    test("GET 404: Not Found - Fan ID does not exist", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/fans/5")
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Fan ID does not exist.");
        });
    });
    test("GET 400: Bad Request - Fan ID provided is invalid", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/fans/notanid")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
        });
    });
});
describe("GET /api/fans", () => {
    test("GET 200: returns all fans data", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/fans")
            .expect(200)
            .then(({ body }) => {
            expect(body.fans.length).toBe(3);
            body.fans.forEach((fan) => {
                expect(typeof fan.username).toBe("string");
                expect(typeof fan.password).toBe("string");
                expect(typeof fan.date_of_birth).toBe("string");
                expect(typeof fan.address).toBe("string");
                expect(typeof fan.email).toBe("string");
                expect(typeof fan.phone_number).toBe("string");
            });
        });
    });
});
describe("POST /api/fans/register", () => {
    test("POST 201: should register a new fan, and encrypt the provided password to avoid exposing passwords on the API", () => {
        const newFan = {
            username: "stringyman556",
            password: "Stringy-123",
            date_of_birth: "1974-11-05",
            address: "24, Tauren Lane, Manchester, England, M13 0FZ",
            email: "user12345555@hotmail.com",
            phone_number: "+44712245866319",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/fans/register")
            .send(newFan)
            .expect(201)
            .then((response) => {
            expect(response.body.username).toBe("stringyman556");
            expect(response.body.password).not.toBe("Stringy-123");
            expect(typeof response.body.password).toBe("string");
            expect(response.body.date_of_birth).toBe("1974-11-05T00:00:00.000Z");
            expect(response.body.address).toBe("24, Tauren Lane, Manchester, England, M13 0FZ");
            expect(response.body.email).toBe("user12345555@hotmail.com");
            expect(response.body.phone_number).toBe("+44712245866319");
        });
    });
    test("POST 400: Incomplete request body provided", () => {
        const newFan = {
            username: "stringyman556",
            password: "Stringy-123",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/fans/register")
            .send(newFan)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("POST 400: Password does not meet the required validation criteria's", () => {
        const newFan = {
            username: "stringyman556",
            password: "lowercaseonly",
            date_of_birth: "1974-11-05",
            address: "24, Tauren Lane, Manchester, England, M13 0FZ",
            email: "user12345555@hotmail.com",
            phone_number: "+44712245866319",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/fans/register")
            .send(newFan)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
            expect(response.body.details[0].message).toBe("Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.");
        });
    });
    test("POST 400: Invalid input type on a field in the request body", () => {
        const newFan = {
            username: 556,
            password: "Stringy-123",
            date_of_birth: "1974-11-05",
            address: "24, Tauren Lane, Manchester, England, M13 0FZ",
            email: "user12345555@hotmail.com",
            phone_number: "+44712245866319",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/fans/register")
            .send(newFan)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
            expect(response.body.details[0].message).toBe('"username" must be a string');
        });
    });
    test("POST 201: should only post with the correct properties when foreign properties are added", () => {
        const newFan = {
            username: "stringyman556",
            password: "Stringy-123",
            date_of_birth: "1974-11-05",
            address: "24, Tauren Lane, Manchester, England, M13 0FZ",
            email: "user12345555@hotmail.com",
            phone_number: "+44712245866319",
            extra_property: "banana",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/fans/register")
            .send(newFan)
            .expect(400)
            .then((response) => {
            expect(response.body.extra_property).toBeUndefined();
        });
    });
});
describe("POST /api/fans/login", () => {
    test("POST 200: should login the fan when the correct username and password are provided, and return a JWT token", () => {
        const newFan = {
            username: "stringyman556",
            password: "Stringy-123",
            date_of_birth: "1974-11-05",
            address: "24, Tauren Lane, Manchester, England, M13 0FZ",
            email: "user12345555@hotmail.com",
            phone_number: "+44712245866319",
        };
        const loginRequest = {
            username: "stringyman556",
            password: "Stringy-123",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/fans/register")
            .send(newFan)
            .then(() => {
            return (0, supertest_1.default)(app_1.default)
                .post("/api/fans/login")
                .send(loginRequest)
                .expect(200)
                .then((response) => {
                expect(typeof response.text).toBe("string");
                expect(response.text.split(".").length).toBe(3);
            });
        });
    });
    test("POST 401: should return an unauthorisation response when an incorrect password is passed in", () => {
        const newFan = {
            username: "stringyman556",
            password: "Stringy-123",
            date_of_birth: "1974-11-05",
            address: "24, Tauren Lane, Manchester, England, M13 0FZ",
            email: "user12345555@hotmail.com",
            phone_number: "+44712245866319",
        };
        const loginRequest = {
            username: "stringyman556",
            password: "Stringy-12345",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/fans/register")
            .send(newFan)
            .then(() => {
            return (0, supertest_1.default)(app_1.default)
                .post("/api/fans/login")
                .send(loginRequest)
                .expect(401)
                .then((response) => {
                expect(response.body.msg).toBe("Provided password is incorrect.");
            });
        });
    });
    test("POST 404: should return a Not Found response when an invalid username is entered", () => {
        const newFan = {
            username: "stringyman556",
            password: "Stringy-123",
            date_of_birth: "1974-11-05",
            address: "24, Tauren Lane, Manchester, England, M13 0FZ",
            email: "user12345555@hotmail.com",
            phone_number: "+44712245866319",
        };
        const loginRequest = {
            username: "stringyman",
            password: "Stringy-123",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/fans/register")
            .send(newFan)
            .then(() => {
            return (0, supertest_1.default)(app_1.default)
                .post("/api/fans/login")
                .send(loginRequest)
                .expect(404)
                .then((response) => {
                expect(response.body.msg).toBe("That username does not exist");
            });
        });
    });
});
describe("PATCH /api/fans/:fanId/change-password", () => {
    test("PATCH 200: should update to new password when provided with a valid current password", () => {
        const newFan = {
            username: "stringyman556",
            password: "Stringy-123",
            date_of_birth: "1974-11-05",
            address: "24, Tauren Lane, Manchester, England, M13 0FZ",
            email: "user12345555@hotmail.com",
            phone_number: "+44712245866319",
        };
        const passwordChangeRequest = {
            current_password: "Stringy-123",
            new_password: "Stringyman-123",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/fans/register")
            .send(newFan)
            .expect(201)
            .then((newFan) => {
            return (0, supertest_1.default)(app_1.default)
                .patch("/api/fans/4/change-password")
                .send(passwordChangeRequest)
                .expect(200)
                .then((response) => {
                expect(newFan.body.password).not.toBe(response.body.password);
            });
        });
    });
    test("PATCH 404:Invalid user ID provided", () => {
        const passwordChangeRequest = {
            current_password: "Stringy-123",
            new_password: "Stringyman-123",
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/fans/55/change-password")
            .send(passwordChangeRequest)
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Fan ID does not exist.");
        });
    });
    test("PATCH 400: Invalid current password provided", () => {
        const passwordChangeRequest = {
            current_password: "Stringy-12",
            new_password: "Stringyman-123",
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/fans/1/change-password")
            .send(passwordChangeRequest)
            .expect(401)
            .then((response) => {
            expect(response.body.msg).toBe("Provided current password is incorrect.");
        });
    });
    test("PATCH 400: New password provided did not meet the validation criteria", () => {
        const newFan = {
            username: "stringyman556",
            password: "Stringy-123",
            date_of_birth: "1974-11-05",
            address: "24, Tauren Lane, Manchester, England, M13 0FZ",
            email: "user12345555@hotmail.com",
            phone_number: "+44712245866319",
        };
        const passwordChangeRequest = {
            current_password: "Stringy-123",
            new_password: "stringy",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/fans/register")
            .send(newFan)
            .expect(201)
            .then((newFan) => {
            return (0, supertest_1.default)(app_1.default)
                .patch("/api/fans/4/change-password")
                .send(passwordChangeRequest)
                .expect(400)
                .then((response) => {
                expect(response.body.msg).toBe("Bad Request");
                expect(response.body.details[0].message).toBe("Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.");
            });
        });
    });
});
describe("PATCH /api/fans/:fanId", () => {
    test("PATCH 200: should update fields when provided with new, valid properties", () => {
        const updatedFan = {
            email: "billybobber123@outlook.com",
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/fans/1")
            .send(updatedFan)
            .expect(200)
            .then((response) => {
            expect(response.body.email).toBe("billybobber123@outlook.com");
        });
    });
    test("PATCH 400: Invalid patch object input", () => {
        const updatedFan = {
            email: "billybobber123-outlook.com",
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/fans/1")
            .send(updatedFan)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
            expect(response.body.details[0].message).toBe('"email" must be a valid email');
        });
    });
    test("PATCH 404: Fan ID does not exist in the database", () => {
        const updatedFan = {
            email: "billybobber123@outlook.com",
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/fans/66")
            .send(updatedFan)
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Fan ID does not exist.");
        });
    });
    test("PATCH 400: Invalid Fan ID input provided", () => {
        const updatedFan = {
            email: "billybobber123@outlook.com",
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/fans/notanid")
            .send(updatedFan)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
            expect(response.body.error).toBe('invalid input syntax for type integer: "notanid"');
        });
    });
});
describe("DELETE /api/fans/:fanId", () => {
    test("DELETE 204: should delete fan by Fan ID", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/fans/1")
            .expect(204)
            .then(() => {
            return connection_1.default.query(`SELECT * FROM fans`).then(({ rows }) => {
                rows.forEach((fan) => {
                    expect(fan.fan_id).not.toBe(1);
                });
            });
        });
    });
    test("DELETE 404: Not Found - Fan ID does not exist", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/fans/77")
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Fan ID does not exist.");
        });
    });
    test("DELETE 400: Bad Request - Invalid input", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/fans/notanid")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
            expect(response.body.error).toBe('invalid input syntax for type integer: "notanid"');
        });
    });
});
////////////////////////////////////////////////////////////////////////////////////
// CLUBS TESTS
////////////////////////////////////////////////////////////////////////////////////
describe("GET /api/clubs", () => {
    test("GET 200: returns all clubs data", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/clubs")
            .expect(200)
            .then(({ body }) => {
            expect(body.clubs.length).toBe(5);
            body.clubs.forEach((club) => {
                expect(typeof club.username).toBe("string");
                expect(typeof club.password).toBe("string");
                expect(typeof club.club_name).toBe("string");
                expect(typeof club.league).toBe("string");
                expect(typeof club.location).toBe("string");
                expect(typeof club.stadium_capacity).toBe("number");
                expect(typeof club.email).toBe("string");
                expect(typeof club.phone_number).toBe("string");
                expect(typeof club.website).toBe("string");
                expect(typeof club.facebook).toBe("string");
                expect(typeof club.twitter).toBe("string");
            });
        });
    });
});
describe("GET /api/clubs/:clubId", () => {
    test("GET 200: returns a club object, with all of the correct properties", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/clubs/1")
            .expect(200)
            .then(({ body }) => {
            const club = body.club;
            expect(club.club_id).toBe(1);
            expect(typeof club.username).toBe("string");
            expect(typeof club.password).toBe("string");
            expect(typeof club.club_name).toBe("string");
            expect(typeof club.league).toBe("string");
            expect(typeof club.location).toBe("string");
            expect(typeof club.stadium_capacity).toBe("number");
            expect(typeof club.email).toBe("string");
            expect(typeof club.phone_number).toBe("string");
            expect(typeof club.website).toBe("string");
            expect(typeof club.facebook).toBe("string");
            expect(typeof club.twitter).toBe("string");
        });
    });
    test("GET 404: Not Found - Club ID does not exist", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/clubs/55")
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Club ID does not exist.");
        });
    });
    test("GET 400: Bad Request - Club ID provided is invalid", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/clubs/notanid")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
        });
    });
});
// START POST
describe("POST /api/clubs/register", () => {
    test("POST 201: should register a new club, and encrypt the provided password to avoid exposing passwords on the API", () => {
        const newClub = {
            "username": "billingstontown",
            "password": "Bilstonfc-123",
            "club_name": "Bilston Town F.C.",
            "league": "National League North",
            "location": "62 Queen St, Bilston WV14 7EX",
            "stadium_capacity": 500,
            "email": "bilstontown@hotmail.co.uk",
            "phone_number": "+445214527767",
            "website": "https://www.bilston-town.co.uk"
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/clubs/register")
            .send(newClub)
            .expect(201)
            .then((response) => {
            expect(response.body.username).toBe("billingstontown");
            expect(response.body.password).not.toBe("Bilstonfc-123");
            expect(typeof response.body.password).toBe("string");
            expect(response.body.club_name).toBe("Bilston Town F.C.");
            expect(response.body.location).toBe("62 Queen St, Bilston WV14 7EX");
            expect(response.body.stadium_capacity).toBe(500);
            expect(response.body.email).toBe("bilstontown@hotmail.co.uk");
            expect(response.body.phone_number).toBe("+445214527767");
            expect(response.body.website).toBe("https://www.bilston-town.co.uk");
            expect(response.body.facebook).toBeUndefined;
            expect(response.body.twitter).toBeUndefined;
        });
    });
    test("POST 400: Incomplete request body provided", () => {
        const newClub = {
            username: "billingstontown",
            password: "Bilstonfc-123",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/clubs/register")
            .send(newClub)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("POST 400: Password does not meet the required validation criteria's", () => {
        const newClub = {
            "username": "billingstontown",
            "password": "bilstonfc",
            "club_name": "Bilston Town F.C.",
            "league": "National League North",
            "location": "62 Queen St, Bilston WV14 7EX",
            "stadium_capacity": 500,
            "email": "bilstontown@hotmail.co.uk",
            "phone_number": "+445214527767",
            "website": "https://www.bilston-town.co.uk"
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/clubs/register")
            .send(newClub)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
            expect(response.body.details[0].message).toBe("Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.");
        });
    });
    test("POST 400: Invalid input type on a field in the request body", () => {
        const newClub = {
            "username": 554,
            "password": "Bilstonfc-123",
            "club_name": "Bilston Town F.C.",
            "league": "National League North",
            "location": "62 Queen St, Bilston WV14 7EX",
            "stadium_capacity": 500,
            "email": "bilstontown@hotmail.co.uk",
            "phone_number": "+445214527767",
            "website": "https://www.bilston-town.co.uk"
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/clubs/register")
            .send(newClub)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
            expect(response.body.details[0].message).toBe('"username" must be a string');
        });
    });
    test("POST 201: should only post with the correct properties when foreign properties are added", () => {
        const newClub = {
            "username": "billingstontown",
            "password": "Bilstonfc-123",
            "club_name": "Bilston Town F.C.",
            "league": "National League North",
            "location": "62 Queen St, Bilston WV14 7EX",
            "stadium_capacity": 500,
            "email": "bilstontown@hotmail.co.uk",
            "phone_number": "+445214527767",
            "website": "https://www.bilston-town.co.uk",
            "extra_property": "banana"
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/clubs/register")
            .send(newClub)
            .expect(400)
            .then((response) => {
            expect(response.body.extra_property).toBeUndefined();
        });
    });
});
// LOGIN CLUB
describe("POST /api/clubs/login", () => {
    test("POST 200: should login the club when the correct username and password are provided, and return a JWT token", () => {
        const newClub = {
            "username": "billingstontown",
            "password": "Bilstonfc-123",
            "club_name": "Bilston Town F.C.",
            "league": "National League North",
            "location": "62 Queen St, Bilston WV14 7EX",
            "stadium_capacity": 500,
            "email": "bilstontown@hotmail.co.uk",
            "phone_number": "+445214527767",
            "website": "https://www.bilston-town.co.uk"
        };
        const loginRequest = {
            username: "billingstontown",
            password: "Bilstonfc-123",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/clubs/register")
            .send(newClub)
            .then(() => {
            return (0, supertest_1.default)(app_1.default)
                .post("/api/clubs/login")
                .send(loginRequest)
                .expect(200)
                .then((response) => {
                expect(typeof response.text).toBe("string");
                expect(response.text.split(".").length).toBe(3);
            });
        });
    });
    test("POST 401: should return an unauthorisation response when an incorrect password is passed in", () => {
        const newClub = {
            "username": "billingstontown",
            "password": "Bilstonfc-123",
            "club_name": "Bilston Town F.C.",
            "league": "National League North",
            "location": "62 Queen St, Bilston WV14 7EX",
            "stadium_capacity": 500,
            "email": "bilstontown@hotmail.co.uk",
            "phone_number": "+445214527767",
            "website": "https://www.bilston-town.co.uk"
        };
        const loginRequest = {
            username: "billingstontown",
            password: "bilstonfc",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/clubs/register")
            .send(newClub)
            .then(() => {
            return (0, supertest_1.default)(app_1.default)
                .post("/api/clubs/login")
                .send(loginRequest)
                .expect(401)
                .then((response) => {
                expect(response.body.msg).toBe("Provided password is incorrect.");
            });
        });
    });
    test("POST 404: should return a Not Found response when an invalid username is entered", () => {
        const newClub = {
            "username": "billingstontown",
            "password": "Bilstonfc-123",
            "club_name": "Bilston Town F.C.",
            "league": "National League North",
            "location": "62 Queen St, Bilston WV14 7EX",
            "stadium_capacity": 500,
            "email": "bilstontown@hotmail.co.uk",
            "phone_number": "+445214527767",
            "website": "https://www.bilston-town.co.uk"
        };
        const loginRequest = {
            username: "bilstonfc",
            password: "Bilstonfc-123",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/clubs/register")
            .send(newClub)
            .then(() => {
            return (0, supertest_1.default)(app_1.default)
                .post("/api/clubs/login")
                .send(loginRequest)
                .expect(404)
                .then((response) => {
                expect(response.body.msg).toBe("That username does not exist");
            });
        });
    });
});
// PATCH CLUB PASSWORD CHANGE
describe("PATCH /api/clubs/:clubId/change-password", () => {
    test("PATCH 200: should update to new password when provided with a valid current password", () => {
        const newClub = {
            "username": "billingstontown",
            "password": "Bilstonfc-123",
            "club_name": "Bilston Town F.C.",
            "league": "National League North",
            "location": "62 Queen St, Bilston WV14 7EX",
            "stadium_capacity": 500,
            "email": "bilstontown@hotmail.co.uk",
            "phone_number": "+445214527767",
            "website": "https://www.bilston-town.co.uk"
        };
        const passwordChangeRequest = {
            current_password: "Bilstonfc-123",
            new_password: "Stringyman-123",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/clubs/register")
            .send(newClub)
            .expect(201)
            .then((newFan) => {
            return (0, supertest_1.default)(app_1.default)
                .patch("/api/clubs/6/change-password")
                .send(passwordChangeRequest)
                .expect(200)
                .then((response) => {
                expect(newFan.body.password).not.toBe(response.body.password);
            });
        });
    });
    test("PATCH 404:Invalid user ID provided", () => {
        const passwordChangeRequest = {
            current_password: "Stringy-123",
            new_password: "Stringyman-123",
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/clubs/55/change-password")
            .send(passwordChangeRequest)
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Club ID does not exist.");
        });
    });
    test("PATCH 400: Invalid current password provided", () => {
        const passwordChangeRequest = {
            current_password: "Stringy-12",
            new_password: "Stringyman-123",
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/clubs/1/change-password")
            .send(passwordChangeRequest)
            .expect(401)
            .then((response) => {
            expect(response.body.msg).toBe("Provided current password is incorrect.");
        });
    });
    test("PATCH 400: New password provided did not meet the validation criteria", () => {
        const newClub = {
            "username": "billingstontown",
            "password": "Bilstonfc-123",
            "club_name": "Bilston Town F.C.",
            "league": "National League North",
            "location": "62 Queen St, Bilston WV14 7EX",
            "stadium_capacity": 500,
            "email": "bilstontown@hotmail.co.uk",
            "phone_number": "+445214527767",
            "website": "https://www.bilston-town.co.uk"
        };
        const passwordChangeRequest = {
            current_password: "Bilstonfc-123",
            new_password: "stringy",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/clubs/register")
            .send(newClub)
            .expect(201)
            .then(() => {
            return (0, supertest_1.default)(app_1.default)
                .patch("/api/clubs/6/change-password")
                .send(passwordChangeRequest)
                .expect(400)
                .then((response) => {
                expect(response.body.msg).toBe("Bad Request");
                expect(response.body.details[0].message).toBe("Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.");
            });
        });
    });
});
// PATCH CLUB
describe("PATCH /api/clubs/:clubId", () => {
    test("PATCH 200: should update fields when provided with new, valid properties", () => {
        const updatedClub = {
            email: "billybobber123@outlook.com",
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/clubs/1")
            .send(updatedClub)
            .expect(200)
            .then((response) => {
            expect(response.body.email).toBe("billybobber123@outlook.com");
        });
    });
    test("PATCH 400: Invalid patch object input", () => {
        const updatedClub = {
            email: "billybobber123-outlook.com",
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/clubs/1")
            .send(updatedClub)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
            expect(response.body.details[0].message).toBe('"email" must be a valid email');
        });
    });
    test("PATCH 404: Club ID does not exist in the database", () => {
        const updatedClub = {
            email: "billybobber123@outlook.com",
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/clubs/66")
            .send(updatedClub)
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Club ID does not exist.");
        });
    });
    test("PATCH 400: Invalid Club ID input provided", () => {
        const updatedFan = {
            email: "billybobber123@outlook.com",
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/clubs/notanid")
            .send(updatedFan)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
            expect(response.body.error).toBe('invalid input syntax for type integer: "notanid"');
        });
    });
});
// CLUB DELETE TESTS
describe("DELETE /api/clubs/:clubId", () => {
    test("DELETE 204: should delete club by Club ID", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/clubs/1")
            .expect(204)
            .then(() => {
            return connection_1.default.query(`SELECT * FROM clubs`).then(({ rows }) => {
                rows.forEach((club) => {
                    expect(club.club_id).not.toBe(1);
                });
            });
        });
    });
    test("DELETE 404: Not Found - Club ID does not exist", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/clubs/77")
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Club ID does not exist.");
        });
    });
    test("DELETE 400: Bad Request - Invalid input", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/clubs/notanid")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
            expect(response.body.error).toBe('invalid input syntax for type integer: "notanid"');
        });
    });
});
////////////////////////////////////////////////////////////////////////////////////
// EVENTS TESTS
////////////////////////////////////////////////////////////////////////////////////
describe("GET /api/events", () => {
    test("GET 200: returns all events data", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/events")
            .expect(200)
            .then(({ body }) => {
            expect(body.events.length).toBe(5);
            body.events.forEach((event) => {
                expect(typeof event.home_club_id).toBe("number");
                expect(typeof event.title).toBe("string");
                expect(typeof event.location).toBe("string");
                expect(typeof event.price).toBe("string");
                expect(typeof event.date_time).toBe("string");
                expect(typeof event.description).toBe("string");
                expect(typeof event.available_tickets).toBe("number");
            });
        });
    });
});
describe("GET /api/clubs/:clubId/events", () => {
    test("GET 200: returns all events belonging to a club, with all of the correct properties", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/clubs/1/events")
            .expect(200)
            .then(({ body }) => {
            const event = body.events;
            expect(event.home_club_id).toBe(1);
            expect(typeof event.event_id).toBe("number");
            expect(typeof event.title).toBe("string");
            expect(typeof event.location).toBe("string");
            expect(typeof event.price).toBe("string");
            expect(typeof event.date_time).toBe("string");
            expect(typeof event.description).toBe("string");
            expect(typeof event.available_tickets).toBe("number");
        });
    });
    test("GET 404: Not Found - Club ID does not exist", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/clubs/55/events")
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Club ID does not exist.");
        });
    });
    test("GET 400: Bad Request - Club ID provided is invalid", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/clubs/notanid/events")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
        });
    });
});
describe("GET /api/events/:eventId", () => {
    test("GET 200: Returns a specific valid event", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/events/2")
            .expect(200)
            .then((response) => {
            expect(response.body.event.event_id).toBe(2);
            expect(typeof response.body.event.title).toBe("string");
            expect(typeof response.body.event.location).toBe("string");
            expect(typeof response.body.event.price).toBe("string");
            expect(typeof response.body.event.date_time).toBe("string");
            expect(typeof response.body.event.description).toBe("string");
            expect(typeof response.body.event.available_tickets).toBe("number");
        });
    });
    test("GET 404: Returns Not Found for an Event ID that does not exist", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/events/455")
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Event ID does not exist.");
        });
    });
    test("GET 400: Returns a Bad Request error for an invalid input for ID", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/events/notanid")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
        });
    });
});
// POST EVENT
describe("POST /api/clubs/:clubId/events", () => {
    test("POST 201: should create a new event tied to the club posting", () => {
        const newEvent = {
            "title": "Wealdstone F.C. vs Bilston Town F.C.",
            "location": "Grosvenor Vale, Ruislip, West London, HA4 6JQ",
            "price": 10,
            "date_time": "2024-10-15T12:00:00",
            "description": "A clash between two top half contenders",
            "available_tickets": 6500
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/clubs/1/events")
            .send(newEvent)
            .expect(201)
            .then((response) => {
            expect(response.body.home_club_id).toBe(1);
            expect(typeof response.body.title).toBe("string");
            expect(typeof response.body.location).toBe("string");
            expect(typeof response.body.price).toBe("string");
            expect(typeof response.body.date_time).toBe("string");
            expect(typeof response.body.description).toBe("string");
            expect(typeof response.body.available_tickets).toBe("number");
        });
    });
    test("POST 400: Incomplete request body provided", () => {
        const newEvent = {
            "title": "Wealdstone F.C. vs Bilston Town F.C.",
            "location": "Grosvenor Vale, Ruislip, West London, HA4 6JQ",
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/clubs/1/events")
            .send(newEvent)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("POST 400: Invalid input type on a field in the request body", () => {
        const newEvent = {
            "title": 44,
            "location": "Grosvenor Vale, Ruislip, West London, HA4 6JQ",
            "price": 10,
            "date_time": "2024-10-15T12:00:00",
            "description": "A clash between two top half contenders",
            "available_tickets": 6500
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/clubs/1/events")
            .send(newEvent)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
            expect(response.body.details[0].message).toBe('"title" must be a string');
        });
    });
    test("POST 201: should only post with the correct properties when foreign properties are added", () => {
        const newEvent = {
            "title": "Wealdstone F.C. vs Bilston Town F.C.",
            "location": "Grosvenor Vale, Ruislip, West London, HA4 6JQ",
            "price": 10,
            "date_time": "2024-10-15T12:00:00",
            "description": "A clash between two top half contenders",
            "available_tickets": 6500,
            "added_property": "banana"
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/clubs/1/events")
            .send(newEvent)
            .expect(400)
            .then((response) => {
            expect(response.body.extra_property).toBeUndefined();
        });
    });
});
// PATCH EVENT
describe("PATCH /api/clubs/:clubId/events/:eventId", () => {
    test("PATCH 200: should update fields when provided with new, valid properties", () => {
        const updatedEvent = {
            "available_tickets": 6500
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/clubs/1/events/5")
            .send(updatedEvent)
            .expect(200)
            .then((response) => {
            expect(response.body.available_tickets).toBe(6500);
        });
    });
    test("PATCH 400: Invalid patch object input", () => {
        const updatedEvent = {
            "title": 44
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/clubs/1/events/5")
            .send(updatedEvent)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
            expect(response.body.details[0].message).toBe('"title" must be a string');
        });
    });
    test("PATCH 404: Club ID does not exist in the database", () => {
        const updatedEvent = {
            "available_tickets": 6500
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/clubs/777/events/5")
            .send(updatedEvent)
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Club ID does not exist.");
        });
    });
    test("PATCH 404: Event ID does not exist in the database", () => {
        const updatedEvent = {
            "available_tickets": 6500
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/clubs/1/events/555")
            .send(updatedEvent)
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Event ID does not exist.");
        });
    });
    test("PATCH 400: Invalid Club ID input provided", () => {
        const updatedEvent = {
            "available_tickets": 6500
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/clubs/notanid/events/5")
            .send(updatedEvent)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
            expect(response.body.error).toBe('invalid input syntax for type integer: "notanid"');
        });
    });
    test("PATCH 400: Invalid Event ID input provided", () => {
        const updatedEvent = {
            "available_tickets": 6500
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/clubs/1/events/notanid")
            .send(updatedEvent)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
            expect(response.body.error).toBe('invalid input syntax for type integer: "notanid"');
        });
    });
});
// EVENT DELETE TESTS
describe("DELETE /api/clubs/:clubId/events/:eventId", () => {
    test("DELETE 204: should delete Event by Event ID", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/clubs/1/events/5")
            .expect(204)
            .then(() => {
            return connection_1.default.query(`SELECT * FROM events`).then(({ rows }) => {
                rows.forEach((event) => {
                    expect(event.event_id).not.toBe(5);
                });
            });
        });
    });
    test("DELETE 404: Not Found - Club ID does not exist", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/clubs/555/events/5")
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Club ID does not exist.");
        });
    });
    test("DELETE 404: Not Found - Event ID does not exist", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/clubs/1/events/555")
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Event ID does not exist.");
        });
    });
    test("DELETE 400: Bad Request - Invalid input", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/clubs/notanid/events/555")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
            expect(response.body.error).toBe('invalid input syntax for type integer: "notanid"');
        });
    });
    test("DELETE 400: Bad Request - Invalid input", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/clubs/1/events/notanid")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
            expect(response.body.error).toBe('invalid input syntax for type integer: "notanid"');
        });
    });
});
////////////////////////////////////////////////////////////////////////////////////
// ORDERS TESTS
////////////////////////////////////////////////////////////////////////////////////
describe("GET /api/fans/:fanId/orders", () => {
    test("GET 200: returns all orders belonging to a fan ID", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/fans/1/orders")
            .expect(200)
            .then(({ body }) => {
            body.orders.forEach((order) => {
                expect(order.user_id).toBe(1);
                expect(typeof order.event_id).toBe("number");
                expect(typeof order.order_date).toBe("string");
                expect(typeof order.quantity).toBe("number");
                expect(typeof order.total_price).toBe("string");
                expect(typeof order.order_status).toBe("string");
            });
        });
    });
});
describe("GET /api/fans/:fanId/orders/:orderId", () => {
    test("GET 200: returns a single order belonging to a Fan ID", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/fans/2/orders/2")
            .expect(200)
            .then(({ body }) => {
            expect(body.order.user_id).toBe(2);
            expect(body.order.event_id).toBe(2);
            expect(typeof body.order.order_date).toBe("string");
            expect(typeof body.order.quantity).toBe("number");
            expect(typeof body.order.total_price).toBe("string");
            expect(typeof body.order.order_status).toBe("string");
        });
    });
    test("GET 404: Not Found - Fan ID does not exist", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/fans/222/orders/2")
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Fan ID does not exist.");
        });
    });
    test("GET 404: Not Found - Event does not exist", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/fans/2/orders/222")
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Order ID does not exist.");
        });
    });
    test("GET 400: Bad Request - Club ID provided is invalid", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/fans/notanid/orders/2")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
        });
    });
    test("GET 400: Bad Request - Order ID provided is invalid", () => {
        return (0, supertest_1.default)(app_1.default)
            .get("/api/fans/2/orders/notanid")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
        });
    });
});
// POST ORDERS TESTS
describe("POST /api/fans/:fanId/orders", () => {
    test("POST 201: should create a new order tied to the fan posting", () => {
        const newOrder = {
            "event_id": "1",
            "order_date": "2024-10-26T11:46:00.000Z",
            "quantity": 1,
            "total_price": 10,
            "order_status": "Pending",
            "add_to_calendar": false,
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/fans/1/orders")
            .send(newOrder)
            .expect(201)
            .then((response) => {
            expect(response.body.user_id).toBe(1);
            expect(response.body.event_id).toBe(1);
            expect(typeof response.body.order_id).toBe("number");
            expect(typeof response.body.order_date).toBe("string");
            expect(typeof response.body.quantity).toBe("number");
            expect(typeof response.body.total_price).toBe("string");
            expect(typeof response.body.order_status).toBe("string");
        });
    });
    test("POST 400: Incomplete request body provided", () => {
        const newOrder = {
            "event_id": "1",
            "order_date": "2024-10-26T11:46:00.000Z",
            "quantity": 1,
            "total_price": 10
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/fans/2/orders")
            .send(newOrder)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("POST 400: Invalid input type on a field in the request body", () => {
        const newOrder = {
            "event_id": "1",
            "order_date": "2024-10-26T11:46:00.000Z",
            "quantity": 1,
            "total_price": 10,
            "order_status": 55
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/fans/2/orders")
            .send(newOrder)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
            expect(response.body.details[0].message).toBe('"order_status" must be a string');
        });
    });
    test("POST 201: should only post with the correct properties when foreign properties are added", () => {
        const newOrder = {
            "event_id": "1",
            "order_date": "2024-10-26T11:46:00.000Z",
            "quantity": 1,
            "total_price": 10,
            "order_status": "Pending",
            "added_property": "banana"
        };
        return (0, supertest_1.default)(app_1.default)
            .post("/api/fans/2/orders")
            .send(newOrder)
            .expect(400)
            .then((response) => {
            expect(response.body.extra_property).toBeUndefined();
        });
    });
});
// PATCH ORDER TESTS
describe("PATCH /api/fans/:fanId/orders/:orderId", () => {
    test("PATCH 200: should update fields when provided with new, valid properties", () => {
        const updatedOrder = {
            "order_status": "Completed"
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/fans/2/orders/2")
            .send(updatedOrder)
            .expect(200)
            .then((response) => {
            expect(response.body.order_status).toBe("Completed");
        });
    });
    test("PATCH 400: Invalid patch object input", () => {
        const updatedOrder = {
            "order_status": 44
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/fans/2/orders/2")
            .send(updatedOrder)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad Request");
            expect(response.body.details[0].message).toBe('"order_status" must be a string');
        });
    });
    test("PATCH 404: Fan ID does not exist in the database", () => {
        const updatedOrder = {
            "order_status": "Completed"
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/fans/222/orders/2")
            .send(updatedOrder)
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Fan ID does not exist.");
        });
    });
    test("PATCH 404: Order ID does not exist in the database", () => {
        const updatedOrder = {
            "order_status": "Completed"
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/fans/2/orders/222")
            .send(updatedOrder)
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Order ID does not exist.");
        });
    });
    test("PATCH 400: Invalid Fan ID input provided", () => {
        const updatedOrder = {
            "order_status": "Completed"
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/fans/notanid/orders/2")
            .send(updatedOrder)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
            expect(response.body.error).toBe('invalid input syntax for type integer: "notanid"');
        });
    });
    test("PATCH 400: Invalid Order ID input provided", () => {
        const updatedOrder = {
            "order_status": "Completed"
        };
        return (0, supertest_1.default)(app_1.default)
            .patch("/api/fans/2/orders/notanid")
            .send(updatedOrder)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
            expect(response.body.error).toBe('invalid input syntax for type integer: "notanid"');
        });
    });
});
// ORDERS DELETE TESTS
describe("DELETE /api/fans/:fanId/orders/:orderId", () => {
    test("DELETE 204: should delete Order by Order ID", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/fans/1/orders/1")
            .expect(204)
            .then(() => {
            return connection_1.default.query(`SELECT * FROM orders`).then(({ rows }) => {
                rows.forEach((order) => {
                    expect(order.order_id).not.toBe(1);
                });
            });
        });
    });
    test("DELETE 404: Not Found - Fan ID does not exist", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/fans/111/orders/1")
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Fan ID does not exist.");
        });
    });
    test("DELETE 404: Not Found - Order ID does not exist", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/fans/1/orders/111")
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("This Order ID does not exist.");
        });
    });
    test("DELETE 400: Bad Request - Invalid input", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/fans/notanid/orders/1")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
            expect(response.body.error).toBe('invalid input syntax for type integer: "notanid"');
        });
    });
    test("DELETE 400: Bad Request - Invalid input", () => {
        return (0, supertest_1.default)(app_1.default)
            .delete("/api/fans/1/orders/notanid")
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe("Bad request");
            expect(response.body.error).toBe('invalid input syntax for type integer: "notanid"');
        });
    });
});
