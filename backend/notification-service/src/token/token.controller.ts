import { Controller, Post, Body } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  addToken(@Body() body: { userId: number; token: string }) {
    return this.tokenService.addToken(body.userId, body.token);
  }
}
