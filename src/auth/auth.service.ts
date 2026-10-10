import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import * as argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto.email.trim().toLowerCase(); // normalisation

    const passwordHash = await argon2.hash(registerDto.password);

    try {
      return await this.prisma.user.create({
        data: {
          email,
          passwordHash,
          preferences: {
            create: {},
          },
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          preferences: {
            select: {
              weightUnit: true,
            },
          },
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already registered');
      }

      throw error;
    }
  }
}
