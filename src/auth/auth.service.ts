import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUser(username);
    if (user) {
      const toCheckPass = await this.usersService.checkPass(pass, user.password)
      if (toCheckPass == true) {
        return user
      }
    }
  }

  async login(user: any, response: Response) {
    if (!user || !user.email || !user._id) {
      throw new UnauthorizedException('Đối tượng người dùng không hợp lệ');
    }
    const payload = {
      username: user.email,
      sub: user._id
    };

    //create refresh token
    const refreshToken = this.createRefreshToken(payload)

    //save to DB
    await this.usersService.refreshToken(refreshToken, payload.sub)
    //set cookies
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true
    })

    return {
      access_token: this.jwtService.sign(payload),
      payload
    };
  }


  createRefreshToken = (payload: any) => {
    const expiresIn = this.configService.get('JWT_REFRESH_TOKEN_EXPIRE');
    const refresh_token = this.jwtService.sign(payload,
      {
        expiresIn,
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET')
      })
    return refresh_token
  }

  processRefresh = async (refresh_token: string, response: Response) => {

    try {
      this.jwtService.verify(
        refresh_token,
        {
          secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
        }
      )
      // query db
      const checkUserDB = await this.usersService.findRefreshToken(refresh_token)
      //issue access token moi

      if (!checkUserDB) {
        throw new UnauthorizedException('Đối tượng người dùng không hợp lệ');
      }
      const payload = {
        username: checkUserDB.email,
        sub: checkUserDB._id
      };

      //create refresh token
      const refreshToken = this.createRefreshToken(payload)

      //save to DB
      await this.usersService.refreshToken(refreshToken, payload.sub)
      //set cookies
      response.cookie('refresh_token', refreshToken, {
        httpOnly: true
      })

      return {
        access_token: this.jwtService.sign(payload),
        payload
      };

    } catch (error) {
      // throw new BadRequestException("refresh token khong hop le")
      console.log(error)
    }

  }
}