"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCallback = exports.authFlow = void 0;
const { google } = require("googleapis");
const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];
const authFlow = (req, res, next) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    res.redirect(authUrl);
};
exports.authFlow = authFlow;
const handleCallback = (req, res, next) => {
    const code = req.query.code;
    oAuth2Client
        .getToken(code)
        .then(({ tokens }) => {
        oAuth2Client.setCredentials(tokens);
        res.json({
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
        });
    })
        .catch((error) => {
        next(error);
    });
};
exports.handleCallback = handleCallback;
