import { Response } from 'express';
import { RequestWithJWT } from '../types/jwt';

export const sendMissingParamResponse = (res: Response, param: string) =>
  res.status(400).json({
    success: false,
    message: `Missing parameter in request body: ${param}`,
  });

export function sendAuthTokenMissingResponse(res: Response) {
  res.set('WWW-Authenticate', 'Bearer realm="User visible", charset="UTF-8"');
  res.status(401).json({
    success: false,
    message: 'Authentication token was not found in request',
  });
}

export function sendAuthTokenInvalidResponse(res: Response) {
  res.set('WWW-Authenticate', 'Bearer realm="User visible", charset="UTF-8"');
  res.status(401).json({
    success: false,
    message: 'Authentication token is not valid',
  });
}

export const sendIncorrectCredentialsResponse = (res: Response) =>
  res.status(403).json({
    success: false,
    message: 'Incorrect username or password',
  });

export const sendAuthSuccessfulResponseWithToken = (
  res: Response,
  token: string
) =>
  res.json({
    success: true,
    message: 'Authentication successful',
    token,
  });
