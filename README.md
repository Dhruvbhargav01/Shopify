Shopify – E-Commerce Platform

A modern, fully-featured E-commerce application built with Next.js App Router, TypeScript, Supabase, shadcn UI, and TailwindCSS.
This project demonstrates SSR filtering, cart persistence, auth-based sync, and a complete checkout flow optimized for performance with 500+ products.It connect your personal Chat Assistant that suggest you and help you for searching your best products.

🔗 Live Demo: https://shopify-pi-rose.vercel.app/

📸 Screenshots

1. Home - <img width="1920" height="1080" alt="Screenshot 2025-12-11 213519" src="https://github.com/user-attachments/assets/b7b8e601-b290-4dec-84d2-5ac5faef0689" />
2. Login/Signup - <img width="1920" height="1080" alt="Screenshot 2025-12-11 213601" src="https://github.com/user-attachments/assets/e4fd48a7-9363-4088-9d63-6d4f5a4d23f5" />
3. My Cart - <img width="1920" height="1080" alt="Screenshot 2025-12-11 213544" src="https://github.com/user-attachments/assets/bc2ab0eb-6384-4d56-b2de-872c23d6a553" />
4. My Orders - <img width="1920" height="1080" alt="Screenshot 2025-12-11 213636" src="https://github.com/user-attachments/assets/c26d33b8-c7f9-4117-b8d0-cd4e11dad7ac" />

🚀 Tech Stack

Next.js 14 (App Router + SSR)

TypeScript

Supabase (Database, Auth, Storage)

shadcn UI + TailwindCSS

Client- & Server-Side Filtering

LocalStorage + Supabase Cart Sync

🛍️ Features
✅ Product Listing

Server-side product fetch with SSR for fast performance

Left sidebar contains:

Price Range Filter

Category Filter

Top bar includes:

Scrollable horizontal categories

Product grid showing:

Image, Name, Price, Category

Add to Cart button

🔍 Advanced Filtering

Filters applied via Supabase SQL queries

Works with:

Price Range

Categories

Combined Filters

Supports fast filtering even with 500+ products

Smooth UX using Server Actions + optimized queries

🛒 Cart System
Before Login:

Cart saved in localStorage

User can add, remove, and update items freely

After Login:

Local cart merges automatically with Supabase cart

Cart persists across sessions

Checkout:

Supabase cart cleared

LocalStorage cleared

Order saved in database

Success confirmation shown

🔐 Authentication

Uses Supabase Auth

Login required only for:

Persistent cart

Checkout flow

Email/Password or Google (any one implemented by you)

🧪 Testing & Performance

Database includes 500+ products for real-world testing

Tested for:

Filtering

Guest cart

Login sync

Checkout flow

High-load performance

🎨 UI & Design

Built entirely with shadcn UI components

Uses TailwindCSS for layout & responsiveness

Modern, clean, mobile-friendly UX

Smooth transitions and consistent styling

🧰 Setup Instructions

1️⃣ Clone the Repository
git clone https://github.com/your-username/shopify.git
cd shopify

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create a .env.local file and add:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

4️⃣ Start Development Server
npm run dev

📦 Database Setup

Create products table with fields:
id, title, price, category, image_url

Insert 500+ products

Create cart & orders tables

Enable Supabase Auth & Storage
