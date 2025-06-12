import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { register } from './metrics';

@Controller('metrics')
export class MetricsController {
  @Get()
  async getMetrics(@Res() res: Response): Promise<void> {
    const metrics = await register.metrics();

    res.setHeader('Content-Type', 'text/plain; version=0.0.4');
    res.status(200).send(metrics);
  }
}
