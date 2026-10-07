import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // évite d'importer ConfigModule dans chaque module de l'application.
    }),
    UsersModule, // initialise le module de configuration et permet à Nest de charger les variables depuis l'environnement et le fichier .env
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
