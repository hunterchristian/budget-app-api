import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, RequestWithJWT } from '../../types/jwt';
import checkRequestForValidCredentials from '../checkRequestForValidCredentials';
import exitIfEnvVarNotSpecified from '../exitIfEnvVarNotSpecified';

const JWT_SECRET = process.env.JWT_SECRET;
exitIfEnvVarNotSpecified('JWT_SECRET');

function generateSignedJWTFromResponse(req: RequestWithJWT, res: Response) {
  const errorResponse = checkRequestForValidCredentials(req, res);
  if (errorResponse) {
    throw errorResponse;
  }

  return jwt.sign(
    { username: (req as AuthRequest).body.username },
    JWT_SECRET,
    {
      expiresIn: '24h',
    }
  );
}

export default generateSignedJWTFromResponse;
