import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors";
import {
  editFan,
  editFanPassword,
  findFanById,
  findFans,
  postFan,
  postLoginFan,
  removeFan,
} from "../models/fansModel";
import { NewFan } from "../../helpers/interfaces";

export const getFanById = (req: Request, res: Response, next: NextFunction) => {
  const fanId = req.params.fanId;

  findFanById(fanId)
    .then((fan) => {
      res.status(200).send({ fan });
    })
    .catch((error: CustomError) => {
      next(error);
    });
};

export const getFans = (req: Request, res: Response, next: NextFunction) => {
  findFans().then((fans) => {
    res.status(200).send({ fans });
  });
};

export const registerFan = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newFan = req.body;

  postFan(newFan)
    .then((fan: NewFan) => {
      res.status(201).send(fan);
    })
    .catch((error: CustomError) => {
      next(error);
    });
};

export const deleteFan = (req: Request, res: Response, next: NextFunction) => {
  const fanId = req.params.fanId;

  removeFan(fanId)
    .then((fan) => {
      res.status(204).send(fan);
    })
    .catch((error: CustomError) => {
      next(error);
    });
};

export const patchFan = (req: Request, res: Response, next: NextFunction) => {
  const fanId = req.params.fanId;
  const updatedFields = req.body;

  editFan(fanId, updatedFields)
    .then((fan) => {
      res.status(200).send(fan);
    })
    .catch((error: CustomError) => {
      next(error);
    });
};

export const patchFanPassword = (req: Request, res: Response, next: NextFunction) => {
  const fanId = req.params.fanId;
  const updatedPassword = req.body;

  editFanPassword(fanId, updatedPassword)
  .then((fan) => {
    res.status(200).send(fan);
  })
  .catch((error: CustomError) => {
    next(error);
  });
}

export const loginFan = (req: Request, res: Response, next: NextFunction) => {
  const username = req.body.username;
  const password = req.body.password;

  postLoginFan(username, password)
  .then((token) => {
    res.status(200).send(token);
  })
  .catch((error: CustomError) => {
    next(error);
  })
}
