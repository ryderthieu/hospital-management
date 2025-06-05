import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from './token.service';
import { Token, TokenSchema } from './schemas/token.schema';
import { TokenController } from './token.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  providers: [TokenService],
  exports: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {}
