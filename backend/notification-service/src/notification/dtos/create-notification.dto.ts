import { IsEnum, IsNumber, IsString, MaxLength } from 'class-validator';
import { NotificationType } from '../schemas/notification.schema';

export class CreateNotificationDto {
  @IsNumber()
  userId: number;

  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;
}
