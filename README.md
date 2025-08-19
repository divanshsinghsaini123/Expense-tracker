# Personal Finance Visualizer

A comprehensive personal finance management application built with Next.js, React, shadcn/ui, Recharts, and MongoDB. Track transactions, manage budgets, and get AI-powered spending insights across all three implementation stages.

## 🚀 Complete Feature Overview

### 📊 Dashboard & Analytics
- **Comprehensive Dashboard** with real-time financial overview
- **Summary Cards** showing total income, expenses, net amount, and transaction count
- **Top Expense Category** identification with percentage breakdown
- **Recent Transactions** feed with quick access to latest activity
- **Monthly Overview Chart** displaying income vs expenses over 6 months
- **Category Pie Charts** for both income and expense visualization
- **Color-coded Visualizations** for easy data interpretation

### 💳 Transaction Management
- **Add Transactions** with amount, date, description, type, and category
- **Edit Transactions** with inline editing and form pre-population
- **Delete Transactions** with confirmation prompts for safety
- **Transaction Categories**:
  - **15 Expense Categories**: Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Education, Travel, Personal Care, Home & Garden, Insurance, Taxes, Gifts & Donations, Business, Other
  - **8 Income Categories**: Salary, Freelance, Business, Investments, Rental, Gifts, Refunds, Other
- **Smart Category Selection** that updates based on transaction type
- **Transaction History** with chronological sorting and search capabilities
- **Category Indicators** with visual color coding for easy identification

### 🎯 Budget Management
- **Monthly Budget Creation** for any expense category
- **Budget Tracking** with real-time utilization monitoring
- **Budget vs Actual Comparison** with interactive bar charts
- **Budget Alerts** for categories approaching or exceeding limits
- **Budget Summary** showing total budgeted vs spent amounts
- **Budget Management** with edit and delete capabilities
- **Month-specific Budgets** with historical tracking

### 🧠 AI-Powered Insights
- **Spending Pattern Analysis** with intelligent trend detection
- **Budget Warnings** when approaching 80% or exceeding 100% of budget
- **Month-over-Month Comparisons** with percentage change calculations
- **Category Spending Spikes** detection for unusual spending patterns
- **Top Spending Analysis** identifying categories consuming >30% of budget
- **Personalized Recommendations** based on spending behavior
- **Smart Insights Dashboard** with color-coded alerts and suggestions

### 🎨 User Experience
- **Tab-based Navigation** with Dashboard, Transactions, Budgets, and Insights sections
- **Responsive Design** optimized for desktop, tablet, and mobile devices
- **Real-time Updates** across all components when data changes
- **Loading States** and skeleton screens for better perceived performance
- **Toast Notifications** for user feedback on all actions
- **Error Handling** with meaningful error messages and recovery suggestions
- **Intuitive Forms** with validation and helpful input formatting

### 📈 Data Visualization
- **Interactive Charts** built with Recharts library
- **Custom Tooltips** showing detailed information on hover
- **Responsive Charts** that adapt to different screen sizes
- **Multiple Chart Types**: Bar charts, pie charts, comparison charts
- **Data Filtering** by date ranges and categories
- **Export Capabilities** for chart data (built-in browser functionality)

### 🔧 Technical Features
- **Real-time Data Sync** across all components
- **Optimistic Updates** for immediate UI feedback
- **Form Validation** with Zod schemas and real-time error display
- **Type Safety** with TypeScript throughout the application
- **Performance Optimization** with React hooks and efficient re-rendering
- **Modern UI Components** using shadcn/ui design system
- **Accessibility** features for screen readers and keyboard navigation



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
│   ├── api/
│   │   ├── transactions/          # Transaction CRUD operations
│   │   └── budgets/               # Budget CRUD operations
│   ├── layout.tsx                 # Root layout with global providers
│   └── page.tsx                   # Main application with tab navigation
├── components/
│   ├── ui/                        # shadcn/ui component library
│   ├── Navigation.tsx             # Tab-based navigation component
│   ├── Dashboard.tsx              # Main dashboard with summary cards
│   ├── TransactionForm.tsx        # Transaction creation/editing form
│   ├── TransactionList.tsx        # Transaction history and management
│   ├── MonthlyExpensesChart.tsx   # Monthly income vs expense bar chart
│   ├── CategoryPieChart.tsx       # Category breakdown pie charts
│   ├── BudgetForm.tsx             # Budget creation and management
│   ├── BudgetComparisonChart.tsx  # Budget vs actual comparison
│   └── SpendingInsights.tsx       # AI-powered spending analysis
├── lib/
│   ├── mongodb.ts                 # Database connection management
│   ├── categories.ts              # Predefined category definitions
│   ├── utils.ts                   # Utility functions and helpers
│   └── validations.ts             # Zod schemas for forms and API
└── models/
    ├── Transaction.ts             # Transaction database model
    └── Budget.ts                  # Budget database model
```

## API Endpoints

### Transaction Management
- `GET /api/transactions` - Get all transactions with category information
- `POST /api/transactions` - Create a new transaction with category
- `GET /api/transactions/[id]` - Get a specific transaction
- `PUT /api/transactions/[id]` - Update a transaction including category
- `DELETE /api/transactions/[id]` - Delete a transaction

### Budget Management
- `GET /api/budgets` - Get all budgets (optional month filter)
- `POST /api/budgets` - Create a new monthly budget for a category
- `PUT /api/budgets/[id]` - Update an existing budget
- `DELETE /api/budgets/[id]` - Delete a budget

### Data Models
- **Transaction**: amount, description, date, type (income/expense), category, timestamps
- **Budget**: category, amount, month (YYYY-MM format), timestamps

## Development

https://expense-tracker-nine-navy.vercel.app/

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint


