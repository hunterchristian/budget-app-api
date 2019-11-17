import getTokenFromRequest from './getTokenFromRequest';
import verifyToken from './verifyToken';
import { sendAuthTokenInvalidResponse, sendAuthTokenMissingResponse } from '../responses';

const checkRequestForValidToken = (req, res) => new Promise(async (resolve, reject) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    reject(sendAuthTokenMissingResponse(res));
    return;
  }

  try {
    const decodedJWT = await verifyToken(token);
    resolve(decodedJWT);
  } catch (err) {
    reject(sendAuthTokenInvalidResponse(res));
  }
});

export default checkRequestForValidToken;
