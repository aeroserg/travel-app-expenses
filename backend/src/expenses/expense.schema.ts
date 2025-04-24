import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Expense extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Group' })
  groupId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['RUB', 'USD', 'EUR'] })
  currency: 'RUB' | 'USD' | 'EUR';

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  paidBy: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  debtors: Types.ObjectId[];
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
