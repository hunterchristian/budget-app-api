import { Response } from 'express';
import { AuthRequest, RequestWithJWT } from '../types/jwt';
import exitIfEnvVarNotSpecified from './exitIfEnvVarNotSpecified';
import {
  sendIncorrectCredentialsResponse,
  sendMissingParamResponse,
} from './responses';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
exitIfEnvVarNotSpecified('ADMIN_USERNAME');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
exitIfEnvVarNotSpecified('ADMIN_PASSWORD');

function checkRequestForValidCredentials(req: RequestWithJWT, res: Response) {
  const username = (req as AuthRequest).body.username;
  if (!username) {
    return sendMissingParamResponse(res, 'username');
  }
  const password = (req as AuthRequest).body.password;
  if (!password) {
    return sendMissingParamResponse(res, 'password');
  }
  const credentialsAreValid =
    username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  if (!credentialsAreValid) {
    return sendIncorrectCredentialsResponse(res);
  }

  return null;
}

export default checkRequestForValidCredentials;
