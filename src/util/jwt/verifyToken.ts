import jwt from 'jsonwebtoken';
import exitIfEnvVarNotSpecified from '../exitIfEnvVarNotSpecified';

const JWT_SECRET = process.env.JWT_SECRET;
exitIfEnvVarNotSpecified('JWT_SECRET');

const verifyToken = async (token: string): Promise<object> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decodedJWT: object) => {
      if (err) {
        reject(err);

        return {};
      }

      resolve(decodedJWT);
    });
  });

export default verifyToken;
