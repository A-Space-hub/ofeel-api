import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // évite d'importer ConfigModule dans chaque module de l'application.
    }),
    PrismaModule,
    UsersModule, // initialise le module de configuration et permet à Nest de charger les variables depuis l'environnement et le fichier .env
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
