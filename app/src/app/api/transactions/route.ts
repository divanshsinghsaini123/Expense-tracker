import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

// GET /api/transactions - Get all transactions
export async function GET() {
  try {
    await connectDB();
    
    const transactions = await Transaction.find({})
      .sort({ date: -1 })
      .lean();
    
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { amount, description, date, type } = body;
    
    // Validate required fields
    if (!amount || !description || !date) {
      return NextResponse.json(
        { error: 'Amount, description, and date are required' },
        { status: 400 }
      );
    }
    
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }
    
    const transaction = new Transaction({
      amount: parseFloat(amount),
      description: description.trim(),
      date: new Date(date),
      type: type || 'expense',
    });
    
    const savedTransaction = await transaction.save();
    
    return NextResponse.json({ transaction: savedTransaction }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
