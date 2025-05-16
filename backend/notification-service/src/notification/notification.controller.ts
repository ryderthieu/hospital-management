import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { Notification } from './schemas/notification.schema';

@Controller('/notifications')
export class NotificationController {
  constructor(private readonly notiService: NotificationService) {}

  @Post()
  async create(@Body() dto: CreateNotificationDto): Promise<Notification> {
    return this.notiService.create(dto);
  }
}
