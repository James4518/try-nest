import { NestFactory } from '@nestjs/core';
declare const module: any;
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exeception/http-exception.filter';
import { SuccessResponse } from './common/success/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api")
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SuccessResponse());
  await app.listen(3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
