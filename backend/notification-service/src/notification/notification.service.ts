import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { FirebaseService } from './firebase.service';
import { TokenService } from '../token/token.service';
@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notiModel: Model<NotificationDocument>,
    private firebaseService: FirebaseService,
    private tokenService: TokenService,
  ) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    // Giả sử đã có token tương ứng với userId
    const tokens = await this.getUserTokens(dto.userId);

    const firebaseResponse = await this.firebaseService.sendToDevices(
      tokens,
      dto.title,
      dto.message,
    );

    const notification = new this.notiModel({
      ...dto,
      sentAt: new Date(),
      response: firebaseResponse,
    });

    return notification.save();
  }

  async getUserTokens(userId: number): Promise<string[]> {
    const userTokens = await this.tokenService.getTokensByUserId(userId);
    console.log('FCM Tokens:', userTokens);
    return userTokens;
  }
}
