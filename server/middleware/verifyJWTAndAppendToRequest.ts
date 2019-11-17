import checkRequestForValidToken from '../util/jwt/checkRequestForValidToken';

const verifyJWTAndAppendToRequest = async (req, res, next) => {
  try {
    req.decodedJWT = await checkRequestForValidToken(req, res);
    next();
  } catch (errorResponse) {
    return errorResponse;
  }
};

export default verifyJWTAndAppendToRequest;
