import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exeception/http-exception.filter';
import { SuccessResponse } from './common/success/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { SERVER_PORT } from '@/common/config/server';
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
  await app.listen(SERVER_PORT);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
