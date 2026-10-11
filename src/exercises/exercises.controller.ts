import { Controller, Get, Query } from '@nestjs/common';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  search(@Query('search') search?: string) {
    return this.exercisesService.search(search);
  }
}
