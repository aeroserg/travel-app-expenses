import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'user' })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, default: null })
  token: string | null;

  @Prop({ type: String, unique: true, sparse: true })
  telegramId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
