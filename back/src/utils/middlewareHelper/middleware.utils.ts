import { ForbiddenException, Req } from '@nestjs/common';
import { Request } from 'express';
import * as jwts from 'jsonwebtoken';

export class Utils {
  constructor() {}

  extractUserJwtMiddleware(@Req() req: Request) {
    const authorization = req.headers;
    const token = authorization
      ? authorization['authorization'].split(' ')[1]
      : undefined;
    return token ? jwts.decode(token) : undefined;
  }

  getUserId(@Req() req: Request) {
    const user = this.extractUserJwtMiddleware(req);
    const userId = user ? parseInt(user['sub'] as string) : null;
    if (!userId) {
      throw new ForbiddenException(
        'An error happend while retrieving information.',
      );
    }
    return userId;
  }
}
