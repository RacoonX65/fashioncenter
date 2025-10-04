# FashionCenter E-commerce Store

A modern e-commerce platform built for a South African clothing store, featuring retail and wholesale/bulk purchasing options.

## Features

- **Product Catalog**: Browse men's and women's clothing with detailed product pages
- **Shopping Cart**: Add items to cart with persistent storage
- **Guest Checkout**: Checkout without creating an account
- **Bulk Orders**: Special pricing for wholesale/reseller purchases
- **PayStack Integration**: Secure payment processing
- **Order Tracking**: Track shipments with courier integration
- **WhatsApp Notifications**: Get order updates via WhatsApp
- **Admin Dashboard**: Manage products, orders, and track sales

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Payment Processing**: PayStack
- **Notifications**: WhatsApp Business API

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account
- PayStack account
- WhatsApp Business API access

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/fashioncenter.git
cd fashioncenter
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Fill in your environment variables in .env.local
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Setting up Supabase

1. Create a new project in Supabase
2. Set up the following tables:
   - `products`: Store product information
   - `orders`: Track customer orders
   - `customers`: Store customer information (optional for guest checkout)
   - `banners`: Manage homepage banners

The SQL for creating these tables is available in the `database/schema.sql` file.

### PayStack Setup

1. Create a PayStack account at [paystack.com](https://paystack.com)
2. Generate API keys from the PayStack dashboard
3. Add the keys to your `.env.local` file

### WhatsApp Notification Setup

1. Register for WhatsApp Business API through Meta or a provider like Twilio
2. Set up a webhook endpoint for receiving notifications
3. Add your API token and phone number ID to `.env.local`

## Deployment

This project can be easily deployed on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up the environment variables in Vercel dashboard
4. Deploy!

## Project Structure

- `/src/app`: Next.js application routes
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions and API clients
- `/src/hooks`: Custom React hooks
- `/public`: Static assets

## Contact

For any questions or inquiries, please contact us at info@fashioncenter.co.za