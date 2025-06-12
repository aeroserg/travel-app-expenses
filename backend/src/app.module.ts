// src/app.module.ts

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';
import { ExpensesModule } from './expenses/expenses.module';
import { SyncModule } from './sync/sync.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from './config/database.config';
import { JwtConfig } from './config/jwt.config';
import { UsersModule } from './users/users.module';
import { TokenMiddleware } from './middleware/token.middleware';
import { DebtsModule } from './debts/debts.module';
import { AppController } from './app.controller';
import { MetricsMiddleware } from './metrics/metrics.middlewar';
import { MetricsController } from './metrics/metrics.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseConfig,
    JwtConfig,
    AuthModule,
    UsersModule,
    GroupsModule,
    ExpensesModule,
    SyncModule,
    DebtsModule,
  ],
  controllers: [AppController, MetricsController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware)
      .exclude({ path: 'metrics', method: RequestMethod.GET })
      .forRoutes('*');

    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
