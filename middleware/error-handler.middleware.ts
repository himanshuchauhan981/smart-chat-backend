import { Response, Request, NextFunction } from "express";

import CustomError from "../exception/CustomError";

function handleError(
  err: CustomError,
  _request: Request,
  res: Response,
  _next: NextFunction
) {
  let customError = err;

  if (!(err instanceof CustomError)) {
    customError = new CustomError('Internal Server Error',500);

    res.status((customError as CustomError).status).send(customError);
  }
  res.status(err.status).send(customError);
  
}

export default handleError;