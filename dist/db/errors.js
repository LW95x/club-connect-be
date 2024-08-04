"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleServerErrors = exports.handlePsqlErrors = exports.handleCustomErrors = void 0;
const handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        const response = {
            msg: err.msg || "An error occurred.",
        };
        if (err.details) {
            response.details = err.details;
        }
        res.status(err.status).send(response);
    }
    else {
        next(err);
    }
};
exports.handleCustomErrors = handleCustomErrors;
const handlePsqlErrors = (err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23503" || err.code === "23502") {
        res.status(400).send({ msg: "Bad request", error: err.message });
    }
    else {
        next(err);
    }
};
exports.handlePsqlErrors = handlePsqlErrors;
const handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
};
exports.handleServerErrors = handleServerErrors;
