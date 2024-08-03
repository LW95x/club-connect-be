import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors";
import { AuthTokens } from "../../helpers/interfaces";
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

export const authFlow = (req: Request, res: Response, next: NextFunction) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.redirect(authUrl);
};

export const handleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = req.query.code;

  oAuth2Client
    .getToken(code)
    .then(({ tokens }: { tokens: AuthTokens }) => { 
      oAuth2Client.setCredentials(tokens);

      res.json({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
  })
  .catch((error: CustomError) => {
    next(error);
  })
};
