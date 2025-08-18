import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  amount: number;
  description: string;
  date: Date;
  type: 'income' | 'expense';
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot be longer than 200 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Type is required'],
      default: 'expense',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create index for efficient querying by date
TransactionSchema.index({ date: -1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
