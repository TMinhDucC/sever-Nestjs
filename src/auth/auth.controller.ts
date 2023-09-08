import { Body, Controller, Post, Request, UseGuards, Get, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request as request, Response } from 'express';


import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from 'src/decorator/public';
import { RolesService } from 'src/roles/roles.service';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private roleService: RolesService

    ) { }


  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get('refresh')
  async getRefresh(@Req() request: request, @Res({ passthrough: true }) response: Response) {
    const refresh_token = await request.cookies['refresh_token']
    return await this.authService.processRefresh(refresh_token, response)
  }
}