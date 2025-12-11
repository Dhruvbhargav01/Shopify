Shopify – E-Commerce Project

A modern E-commerce application built with Next.js (App Router), TypeScript, Supabase, shadcn UI, and TailwindCSS.
The project includes product listing with SSR filtering, cart persistence, authentication, and a complete checkout flow.

Live Demo: https://shopify-pi-rose.vercel.app/

Screenshots

1. Home - <img width="1920" height="1080" alt="Screenshot 2025-12-11 213519" src="https://github.com/user-attachments/assets/b7b8e601-b290-4dec-84d2-5ac5faef0689" />
2. Login/Signup - <img width="1920" height="1080" alt="Screenshot 2025-12-11 213601" src="https://github.com/user-attachments/assets/e4fd48a7-9363-4088-9d63-6d4f5a4d23f5" />
3. My Cart - <img width="1920" height="1080" alt="Screenshot 2025-12-11 213544" src="https://github.com/user-attachments/assets/bc2ab0eb-6384-4d56-b2de-872c23d6a553" />
4. My Orders - <img width="1920" height="1080" alt="Screenshot 2025-12-11 213636" src="https://github.com/user-attachments/assets/c26d33b8-c7f9-4117-b8d0-cd4e11dad7ac" />

Features
Product Listing

Server-side product fetching

Price range and category filters

Scrollable horizontal categories

Responsive product grid with images, name, price, and category

Add to Cart button

Filtering

Filters applied using Supabase SQL queries

Supports price + category combined filters

Smooth SSR filtering optimized for large datasets (500+ products)

Cart System

Cart works without login using localStorage

After login, local cart syncs to Supabase

Cart persists across sessions

On checkout, both Supabase and localStorage carts are cleared

Authentication

Supabase Auth (Email/Password or Google)

Login required only for checkout and persistent cart

Testing

Database includes 500+ products

Tested for filtering, guest cart, login sync, checkout process, and performance

UI

Built entirely with shadcn UI

Clean, modern, and fully responsive layout

Tech Stack

Next.js (App Router + SSR)

TypeScript

Supabase (Database, Auth, Storage)

shadcn UI

TailwindCSS

Setup

Clone the project

Install dependencies

Create a .env.local file with Supabase keys

Run npm run dev to start the server
