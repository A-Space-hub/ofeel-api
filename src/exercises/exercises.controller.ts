import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  search(@Query('search') search?: string) {
    return this.exercisesService.search(search);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() request: Request, @Body() dto: CreateExerciseDto) {
    return this.exercisesService.create(request.user!.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() dto: UpdateExerciseDto,
  ) {
    return this.exercisesService.update(request.user!.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.exercisesService.remove(request.user!.id, id);
  }
}
