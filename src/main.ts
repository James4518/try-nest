import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exeception/http-exception.filter';
import { SuccessResponse } from './common/success/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { SERVER_PORT } from '@/common/config/server';
import { JWT_KEY } from './common/config/screct';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SuccessResponse());
  app.use(
    session({
      secret: JWT_KEY,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        maxAge: 12 * 60 * 60 * 1000,
      }
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(SERVER_PORT);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
