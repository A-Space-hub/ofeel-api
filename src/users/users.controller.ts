import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(@Req() request: Request) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.usersService.findMe(userId);
  }
}
