import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { MailService } from '../mail/mail.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import {
  generatePasswordResetToken,
  hashPasswordResetToken,
} from './password-reset-token';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

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

  async login(loginDto: LoginDto) {
    const email = loginDto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const message = 'If an account exists, a reset link will be sent';

    const email = forgotPasswordDto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return { message };
    }

    const { token, tokenHash } = generatePasswordResetToken();

    await this.prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.deleteMany({
        where: { userId: user.id },
      });

      await tx.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    });

    const frontendUrl = this.configService
      .getOrThrow<string>('FRONTEND_URL')
      .replace(/\/$/, '');

    const resetUrl = new URL('/reset-password', frontendUrl);
    resetUrl.searchParams.set('token', token);

    await this.mailService.sendPasswordResetEmail(email, resetUrl.toString());

    return { message };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const tokenHash = hashPasswordResetToken(resetPasswordDto.token);

    const passwordHash = await argon2.hash(resetPasswordDto.newPassword);

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
      },
    });

    if (!resetToken || resetToken.expiresAt <= new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.prisma.$transaction(async (tx) => {
      const deleted = await tx.passwordResetToken.deleteMany({
        where: {
          id: resetToken.id,
          expiresAt: { gt: new Date() },
        },
      });

      if (deleted.count !== 1) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      await tx.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      });

      await tx.passwordResetToken.deleteMany({
        where: { userId: resetToken.userId },
      });
    });

    return { message: 'Password successfully reset' };
  }
}
