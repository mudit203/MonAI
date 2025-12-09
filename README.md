<div align="center">

# 💰 MonAI - AI-Powered Financial Management

[![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.15.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

*Manage your finances with intelligence - AI-powered insights, smart receipt scanning, and comprehensive budget tracking*

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>


## 🎯 Overview

**MonAI** is a modern, AI-powered financial management platform built with Next.js 15 that helps users track expenses, manage budgets, and gain intelligent insights into their spending patterns. With features like smart receipt scanning using Google's Gemini AI, recurring transaction automation via Inngest, and real-time budget alerts, MonAI makes personal finance management effortless.

### Why MonAI?

- 🤖 **AI-Powered Insights**: Get personalized financial recommendations using Google Gemini AI
- 📸 **Smart Receipt Scanner**: Extract transaction data automatically from receipt images
- 🔄 **Automated Recurring Transactions**: Set-and-forget for subscriptions and regular bills
- 📊 **Advanced Analytics**: Beautiful charts and graphs to visualize your spending
- 🎯 **Budget Alerts**: Get notified when you reach 80% of your monthly budget
- 📧 **Monthly Reports**: Receive AI-generated financial summaries via email
- 🌙 **Dark Mode**: Beautiful UI with light/dark theme support
- 🔒 **Secure**: Built with Clerk authentication and Arcjet rate limiting

---

## ✨ Features

### 💳 Account Management
- Create multiple accounts (Current/Savings)
- Set default accounts for quick access
- Real-time balance updates
- Track income and expenses per account
- View transaction history with advanced filtering

### 📱 Transaction Tracking
- Manual transaction entry with rich categorization
- AI-powered receipt scanning (extracts amount, date, merchant, category)
- Recurring transaction automation (Daily/Weekly/Monthly/Yearly)
- Bulk transaction deletion
- Transaction status tracking (Pending/Completed)
- Advanced search and filtering capabilities

### 📊 Analytics & Insights
- Interactive dashboard with pie charts and bar graphs
- Expense categorization with visual breakdown
- Date range filtering (7D, 1M, 3M, 6M)
- Income vs. Expense comparisons
- Category-wise spending analysis
- Monthly financial trends

### 🎯 Budget Management
- Set monthly budgets per account
- Real-time budget usage tracking with progress bars
- Automated email alerts at 80% budget usage
- Budget vs. actual expense comparisons
- Budget adjustment with validation

### 📧 Automated Reporting
- Monthly financial reports via email (Resend)
- AI-generated spending insights (powered by Gemini)
- Budget alert notifications
- Custom report generation

### 🔐 Security & Performance
- Clerk authentication with user management
- Arcjet rate limiting (10 requests/hour per user)
- Server-side validation with Zod schemas
- Edge-ready with optimized middleware
- CSRF protection

---


## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.1.3 (App Router)
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS 3.4.17
- **Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Backend
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 6.15.0
- **Authentication**: Clerk
- **Email**: Resend + React Email
- **AI/ML**: Google Generative AI (Gemini 2.5)
- **Job Queue**: Inngest (cron jobs, recurring transactions)
- **Rate Limiting**: Arcjet

### DevOps
- **Deployment**: Vercel-ready
- **Database Pooling**: Supabase Pooler
- **Environment**: Node.js 18+

---

## 🚀 Installation

### Prerequisites
- Node.js 18.x or higher
- PostgreSQL database (or Supabase account)
- Clerk account
- Google AI Studio account (for Gemini API)
- Resend account (for emails)
- Inngest account (for background jobs)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/monai.git
cd monai
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Set Up Environment Variables
Create a `.env` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database (Supabase)
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# API Keys
ARCJET_KEY=ajkey_xxxxx
RESEND_KEY=re_xxxxx
GEMINI_KEY=AIzaSyxxxxxx

# Inngest (optional - for local development)
INNGEST_EVENT_KEY=xxxxx
INNGEST_SIGNING_KEY=xxxxx
```

### Step 4: Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database with sample data
npm run seed
```

### Step 5: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key for authentication | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ |
| `DATABASE_URL` | PostgreSQL connection string (pooled) | ✅ |
| `DIRECT_URL` | PostgreSQL direct connection | ✅ |
| `ARCJET_KEY` | Arcjet API key for rate limiting | ✅ |
| `RESEND_KEY` | Resend API key for emails | ✅ |
| `GEMINI_KEY` | Google Gemini AI API key | ✅ |
| `INNGEST_EVENT_KEY` | Inngest event key (production) | ❌ |
| `INNGEST_SIGNING_KEY` | Inngest signing key (production) | ❌ |

---



### Running Migrations
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

---

## 📁 Project Structure

```
monai/
├── actions/              # Server actions (database operations)
│   ├── accounts.js       # Account CRUD operations
│   ├── budget.js         # Budget management
│   ├── dashboard.js      # Dashboard data fetching
│   ├── seed.js           # Database seeding
│   ├── send-email.js     # Email sending logic
│   └── tranzactions.js   # Transaction operations & AI receipt scanning
├── app/
│   ├── (auth)/           # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (main)/           # Protected routes
│   │   ├── accounts/     # Account management pages
│   │   ├── dashboard/    # Dashboard with charts
│   │   └── transaction/  # Transaction creation/editing
│   ├── api/              # API routes
│   │   ├── inngest/      # Inngest webhook endpoint
│   │   └── seed/         # Database seeding endpoint
│   ├── globals.css       # Global styles
│   ├── layout.js         # Root layout with Clerk provider
│   └── page.js           # Landing page
├── components/
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   ├── CreateAccountDrawer.jsx
│   ├── Header.jsx        # Navigation header
│   └── Hero.jsx          # Landing page hero section
├── Data/
│   ├── categories.js     # Transaction categories with colors
│   └── landing.js        # Landing page content
├── emails/
│   └── my-email.jsx      # Email templates (React Email)
├── hooks/
│   └── use-fetch.js      # Custom hook for async operations
├── lib/
│   ├── generated/prisma/ # Generated Prisma client
│   ├── inngest/
│   │   ├── client.js     # Inngest client configuration
│   │   └── functions.js  # Background job definitions
│   ├── arcjet.js         # Rate limiting configuration
│   ├── CheckUser.js      # User verification middleware
│   ├── prisma.js         # Prisma client singleton
│   └── utils.js          # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static assets
├── .env                  # Environment variables (⚠️ never commit)
├── middleware.js         # Next.js middleware (auth protection)
├── next.config.mjs       # Next.js configuration
├── package.json
└── README.md
```

---

