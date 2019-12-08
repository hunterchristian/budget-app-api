import { NextFunction, Request, Response } from 'express';
import { RequestWithJWT } from '../types/jwt';
import checkRequestForValidToken from '../util/jwt/checkRequestForValidToken';

const verifyJWTAndAppendToRequest = async (
  req: RequestWithJWT,
  res: Response,
  next: NextFunction
) => {
  try {
    req.decodedJWT = await checkRequestForValidToken(req, res);
    next();
  } catch (errorResponse) {
    return errorResponse;
  }
};

export default verifyJWTAndAppendToRequest;
