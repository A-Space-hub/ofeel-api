import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ne conserve que les propriétés déclarées avec des décorateurs de validation
      forbidNonWhitelisted: true, // Rejette une requête contenant des propriétés non autorisées
      transform: true, // Transforme les données reçues en instances des DTO attendus
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
