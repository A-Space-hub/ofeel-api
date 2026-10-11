import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  async search(search?: string) {
    const query = search?.trim();

    return this.prisma.exercise.findMany({
      where: query
        ? {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          }
        : undefined,
      select: {
        id: true,
        name: true,
        description: true,
        createdByUserId: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: 20,
    });
  }

  async create(userId: string, dto: CreateExerciseDto) {
    try {
      return await this.prisma.exercise.create({
        data: {
          name: dto.name.trim(),
          description: dto.description?.trim(),
          createdByUserId: userId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdByUserId: true,
          createdAt: true,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Exercise name already exists');
      }

      throw error;
    }
  }

  async update(userId: string, exerciseId: string, dto: UpdateExerciseDto) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    if (exercise.createdByUserId !== userId) {
      throw new ForbiddenException('You cannot modify this exercise');
    }

    try {
      return await this.prisma.exercise.update({
        where: { id: exerciseId },
        data: {
          ...(dto.name !== undefined && { name: dto.name.trim() }),
          ...(dto.description !== undefined && {
            description: dto.description.trim(),
          }),
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdByUserId: true,
          updatedAt: true,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Exercise name already exists');
      }

      throw error;
    }
  }

  async remove(userId: string, exerciseId: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    if (exercise.createdByUserId !== userId) {
      throw new ForbiddenException('You cannot delete this exercise');
    }

    await this.prisma.exercise.delete({
      where: { id: exerciseId },
    });

    return { message: 'Exercise deleted successfully' };
  }
}
