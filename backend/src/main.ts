import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // validacion global de todos los DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  // origenes permitidos: el front local y el desplegado (FRONT_URL, separados por coma)
  const origenes = (process.env.FRONT_URL ?? 'http://localhost:4200').split(',').map((o) => o.trim());
  app.enableCors({ origin: origenes });

  // render define el puerto en la variable PORT
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
void bootstrap();