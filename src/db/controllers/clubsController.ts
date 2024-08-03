import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors";
import { editClub, editClubPassword, findClubById, findClubs, postClub, postLoginClub, removeClub } from "../models/clubsModel";
import { NewClub } from "../../helpers/interfaces";

export const getClubById = (req: Request, res: Response, next: NextFunction) => {
    const clubId = req.params.clubId;

    findClubById(clubId)
    .then((club) => {
        res.status(200).send({club});
    })
    .catch((error: CustomError) => {
        next(error);
    });
};

export const getClubs = (req: Request, res: Response, next: NextFunction) => {
    findClubs().then((clubs) => {
        res.status(200).send({clubs});
    });
};

export const registerClub = (req: Request, res: Response, next: NextFunction) => {
    const newClub = req.body;

    postClub(newClub).then((club: NewClub) => {
        res.status(201).send(club);
    })
    .catch((error: CustomError) => {
        next(error);
    });
};

export const deleteClub = (req: Request, res: Response, next: NextFunction) => {
    const clubId = req.params.clubId;

    removeClub(clubId)
    .then((club) => {
        res.status(204).send(club);
    })
    .catch((error: CustomError) => {
        next(error);
    })
}

export const patchClub = (req: Request, res: Response, next: NextFunction) => {
    const clubId = req.params.clubId;
    const updatedFields = req.body;

    editClub(clubId, updatedFields)
    .then((club) => {
        res.status(200).send(club);
    })
    .catch((error: CustomError) => {
        next(error);
    })
}

export const patchClubPassword = (req: Request, res: Response, next: NextFunction) => {
    const clubId = req.params.clubId;
    const updatedPassword = req.body;

    editClubPassword(clubId, updatedPassword)
    .then((fan) => {
        res.status(200).send(fan);
    })
    .catch((error: CustomError) => {
        next(error);
    });
}

export const loginClub = (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username;
    const password = req.body.password;
  
    postLoginClub(username, password)
    .then((token) => {
      res.status(200).send(token);
    })
    .catch((error: CustomError) => {
      next(error);
    })
}