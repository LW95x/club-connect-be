import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
  status?: number;
  msg?: string;
  code?: string;
  details?: any;
}

export const handleCustomErrors = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.status) {
    const response: { msg: string; details?: any } = {
      msg: err.msg || "An error occurred.",
    };
    if (err.details) {
      response.details = err.details;
    }
    res.status(err.status).send(response);
  } else {
    next(err);
  }
};

export const handlePsqlErrors = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error details:', err);

  if (err.code === "22P02" || err.code === "23503" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request", error: err.message });
  } else {
    next(err);
  }
};

export const handleServerErrors = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
