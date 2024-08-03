import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors";
import { findApi } from "../models/apiModel";

export const getApi = (req: Request, res: Response, next: NextFunction) => {
    findApi().then((endpoints) => {
        res.status(200).send(endpoints);
    })
    .catch((error: CustomError) => {
        next(error);
    });
}