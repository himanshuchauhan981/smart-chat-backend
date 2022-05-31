import { Response, Request, NextFunction } from "express";
import { MongoServerError } from "mongodb";


import CustomError from "../exception/CustomError";

function handleError(
  err: CustomError,
  _request: Request,
  res: Response,
  _next: NextFunction
) {
  let customError = err;

  if ((err instanceof CustomError)) {
    return res.status(err.status).send(customError);
  }

  if(err['name'] === 'MongoServerError') {
    customError = new CustomError('Internal Server Error',500, err['message']);
  }
  else {
    customError = new CustomError('Internal Server Error',500);
  }
  return res.status((customError as CustomError).status).send(customError);
}

export default handleError;