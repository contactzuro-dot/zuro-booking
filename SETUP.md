# Zuro Booking Platform - Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- A Stripe account

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy the environment variables file:
```bash
cp .env.example .env.local
```

3. Set up your environment variables (see below)

4. Set up your Supabase database (see DATABASE_SCHEMA.md)

5. Run the development server:
```bash
npm run dev
```

## Environment Variables

Add these to your `.env.local` file:

### Supabase

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### Stripe

1. Go to your Stripe dashboard
2. Navigate to Developers > API keys
3. Copy:
   - `Secret key` → `STRIPE_SECRET_KEY`
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (optional, if you need client-side Stripe)

4. For webhooks:
   - Go to Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/payment/webhook`
   - Select event: `checkout.session.completed`
   - Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### Application URL

- For local development: `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- For production: `NEXT_PUBLIC_APP_URL=https://yourdomain.com`

## Database Setup

1. In your Supabase dashboard, go to SQL Editor
2. Run the SQL from `DATABASE_SCHEMA.md` to create tables
3. Optionally insert default business hours

## Creating Admin User

1. In Supabase dashboard, go to Authentication > Users
2. Click "Add user" and create an admin account
3. Use this email/password to log in at `/admin/login`

## Testing

1. Start the dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. Create a service in the admin panel
4. Book a service as a customer
5. Complete the Stripe checkout (use test card: 4242 4242 4242 4242)

## Production Deployment

1. Set all environment variables in your hosting platform
2. Run database migrations
3. Set up Stripe webhook endpoint in production
4. Update `NEXT_PUBLIC_APP_URL` to your production domain

