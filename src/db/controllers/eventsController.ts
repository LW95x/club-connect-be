import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors";
import {
  addEvent,
  editEvent,
  findEventById,
  findEvents,
  findEventsByClubId,
  removeEvent,
} from "../models/eventsModel";
import { NewEvent } from "../../helpers/interfaces";

export const getEventById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const eventId = req.params.eventId;

  findEventById(eventId)
    .then((event) => {
      res.status(200).send({ event });
    })
    .catch((error: CustomError) => {
      next(error);
    });
};

export const getEvents = (req: Request, res: Response, next: NextFunction) => {
  findEvents().then((events) => {
    res.status(200).send({ events });
  });
};

export const getEventsByClubId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clubId = req.params.clubId;

  findEventsByClubId(clubId)
    .then((events) => {
      res.status(200).send({ events });
    })
    .catch((error: CustomError) => {
      next(error);
    });
};

export const postEvent = (req: Request, res: Response, next: NextFunction) => {
  const clubId = req.params.clubId;
  const newEvent = req.body;

  addEvent(clubId, newEvent)
    .then((event: NewEvent) => {
      res.status(201).send(event);
    })
    .catch((error: CustomError) => {
      next(error);
    });
};

export const deleteEvent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clubId = req.params.clubId;
  const eventId = req.params.eventId;

  removeEvent(clubId, eventId)
    .then((event) => {
      res.status(204).send(event);
    })
    .catch((error: CustomError) => {
      next(error);
    });
};

export const patchEvent = (req: Request, res: Response, next: NextFunction) => {
  const clubId = req.params.clubId;
  const eventId = req.params.eventId;
  const updatedFields = req.body;

  editEvent(clubId, eventId, updatedFields)
  .then((event) => {
    res.status(200).send(event);
  })
  .catch((error: CustomError) => {
    next(error);
  })
}