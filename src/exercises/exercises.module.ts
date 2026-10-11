import { Module } from '@nestjs/common';

import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [AuthModule],
  providers: [ExercisesService],
  controllers: [ExercisesController],
})
export class ExercisesModule {}
