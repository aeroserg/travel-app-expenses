import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { httpRequestCounter } from '../metrics/metrics';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      // eslint-disable-next-line
      const route =
        // eslint-disable-next-line
        'path' in (req.route ?? {}) && typeof req.route?.path === 'string'
          ? req.route?.path // eslint-disable-line
          : req.path;

      httpRequestCounter.inc({
        method: req.method,
        route: route, // eslint-disable-line
        status: res.statusCode,
      });
    });
    next();
  }
}
