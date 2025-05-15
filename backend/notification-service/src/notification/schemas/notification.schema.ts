import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  BILL = 'BILL',
  APPOINTMENT = 'APPOINTMENT',
  FOLLOWUP = 'FOLLOWUP',
  OTHER = 'OTHER',
}

@Schema({ timestamps: { createdAt: true } })
export class Notification {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true, maxlength: 100 })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ enum: NotificationType, required: true })
  type: NotificationType;

  @Prop()
  sentAt: Date;

  @Prop({ type: Object })
  response?: any;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
