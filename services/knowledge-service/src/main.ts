import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SafeHttpExceptionFilter } from './shared/errors/http-exception.filter';
async function bootstrap() { const app = await NestFactory.create(AppModule); app.useGlobalFilters(new SafeHttpExceptionFilter()); await app.listen(process.env.PORT ?? 3001); }
void bootstrap();
