# Personal Finance Visualizer

A simple web application for tracking personal finances built with Next.js, React, shadcn/ui, Recharts, and MongoDB.

## Features - Stage 1: Basic Transaction Tracking

✅ **Add/Edit/Delete Transactions**
- Create new transactions with amount, date, and description
- Edit existing transactions inline
- Delete transactions with confirmation

✅ **Transaction List View**
- View all transactions in chronological order
- Visual indicators for income (green) vs expenses (red)
- Responsive design with action buttons

✅ **Monthly Expenses Bar Chart**
- Interactive chart showing income vs expenses over 6 months
- Built with Recharts for responsive visualization
- Empty state handling when no data is available

✅ **Form Validation**
- Client-side validation using Zod schemas
- Required field validation
- Amount validation (must be positive)
- Description length limits

✅ **Responsive Design**
- Mobile-first responsive layout
- Grid-based layout that adapts to screen size
- Touch-friendly interface elements

✅ **Error Handling**
- Toast notifications for user feedback
- API error handling with meaningful messages
- Loading states for better UX

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB with Mongoose
- **Validation**: Zod
- **Forms**: React Hook Form
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── api/transactions/          # API routes for CRUD operations
│   ├── layout.tsx                 # Root layout with global providers
│   └── page.tsx                   # Main dashboard page
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── TransactionForm.tsx        # Form for adding/editing transactions
│   ├── TransactionList.tsx        # List view of all transactions
│   └── MonthlyExpensesChart.tsx   # Bar chart for monthly overview
├── lib/
│   ├── mongodb.ts                 # Database connection utility
│   ├── utils.ts                   # Utility functions
│   └── validations.ts             # Zod validation schemas
└── models/
    └── Transaction.ts             # MongoDB transaction model
```

## API Endpoints

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/[id]` - Get a specific transaction
- `PUT /api/transactions/[id]` - Update a transaction
- `DELETE /api/transactions/[id]` - Delete a transaction

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Schema

```typescript
Transaction {
  _id: ObjectId
  amount: Number (required, min: 0.01)
  description: String (required, max: 200 chars)
  date: Date (required)
  type: 'income' | 'expense' (default: 'expense')
  createdAt: Date
  updatedAt: Date
}
```

## Next Steps (Future Stages)

**Stage 2: Categories**
- Predefined transaction categories
- Category-wise pie chart
- Dashboard with summary cards

**Stage 3: Budgeting**
- Monthly category budgets
- Budget vs actual comparison
- Spending insights and analytics

