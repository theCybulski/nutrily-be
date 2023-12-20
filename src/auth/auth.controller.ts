import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from './decorator/public.decorator';
import { SignupDto } from './dto/signup.dto';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { GetUser } from './decorator/get-user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';
import {
  ACCESS_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_KEY,
} from './constants/tokens';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userData = await this.authService.login(authDto);
    res.cookie(ACCESS_TOKEN_COOKIE_KEY, userData.tokens.accessToken);
    res.cookie(REFRESH_TOKEN_COOKIE_KEY, userData.tokens.refreshToken, {
      httpOnly: true,
    });

    return userData;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetUser('id') userId: User['id'],
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(userId);
    res.cookie(ACCESS_TOKEN_COOKIE_KEY, '', { maxAge: 0 });
    res.cookie(REFRESH_TOKEN_COOKIE_KEY, '', { maxAge: 0 });
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetUser('id') userId: User['id'],
    @GetUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    res.cookie(ACCESS_TOKEN_COOKIE_KEY, tokens.accessToken);
    res.cookie(REFRESH_TOKEN_COOKIE_KEY, tokens.refreshToken, {
      httpOnly: true,
    });

    return tokens;
  }
}
