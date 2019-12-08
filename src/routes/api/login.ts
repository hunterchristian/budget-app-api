import { Request, Response } from 'express';
import { RequestWithJWT } from '../../types/jwt';
import generateSignedJWTFromRequest from '../../util/jwt/generateSignedJWTFromRequest';
import { sendAuthSuccessfulResponseWithToken } from '../../util/responses';

function loginHandler(req: RequestWithJWT, res: Response) {
  try {
    const token = generateSignedJWTFromRequest(req, res);

    return sendAuthSuccessfulResponseWithToken(res, token);
  } catch (errorResponse) {
    return errorResponse;
  }
}

export default loginHandler;
