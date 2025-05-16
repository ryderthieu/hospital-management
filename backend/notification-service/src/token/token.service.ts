import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,
  ) {}

  // Phương thức lấy token của người dùng
  async getTokensByUserId(userId: number): Promise<string[]> {
    // Truy vấn token theo userId
    const tokens = await this.tokenModel.find({ userId }).exec();
    // Trả về mảng các token của người dùng
    return tokens.map((token) => token.token);
  }

  // Phương thức thêm token mới vào cơ sở dữ liệu
  async addToken(userId: number, token: string): Promise<Token> {
    const newToken = new this.tokenModel({ userId, token });
    return newToken.save();
  }
}
