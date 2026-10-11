import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
