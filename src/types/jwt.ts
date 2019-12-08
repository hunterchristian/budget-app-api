import { Request } from 'express';

interface JWT {
  decodedJWT: object;
}

export interface AuthRequestBody {
  username: string;
  password: string;
}

export interface AuthRequest {
  body: AuthRequestBody;
}

export type RequestWithJWT = Request & JWT;
