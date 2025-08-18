import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Budget from '@/models/Budget';

// GET /api/budgets - Get all budgets
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    
    const query = month ? { month } : {};
    const budgets = await Budget.find(query).sort({ category: 1 }).lean();
    
    return NextResponse.json({ budgets });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

// POST /api/budgets - Create a new budget
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { category, amount, month } = body;
    
    // Validate required fields
    if (!category || !amount || !month) {
      return NextResponse.json(
        { error: 'Category, amount, and month are required' },
        { status: 400 }
      );
    }
    
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }
    
    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({ category, month });
    if (existingBudget) {
      return NextResponse.json(
        { error: 'Budget already exists for this category and month' },
        { status: 400 }
      );
    }
    
    const budget = new Budget({
      category: category.trim(),
      amount: parseFloat(amount),
      month,
    });
    
    const savedBudget = await budget.save();
    
    return NextResponse.json({ budget: savedBudget }, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}
