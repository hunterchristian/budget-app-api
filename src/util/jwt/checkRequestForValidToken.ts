import { Response } from 'express';
import { RequestWithJWT } from '../../types/jwt';
import {
  sendAuthTokenInvalidResponse,
  sendAuthTokenMissingResponse,
} from '../responses';
import getTokenFromRequest from './getTokenFromRequest';
import verifyToken from './verifyToken';

const checkRequestForValidToken = async (
  req: RequestWithJWT,
  res: Response
): Promise<object> =>
  new Promise(async (resolve, reject) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      sendAuthTokenMissingResponse(res);
      reject();

      return {};
    }

    try {
      const decodedJWT = await verifyToken(token);
      resolve(decodedJWT);
    } catch (err) {
      sendAuthTokenInvalidResponse(res);
      reject();
    }
  });

export default checkRequestForValidToken;
