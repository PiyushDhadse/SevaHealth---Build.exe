This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Project Structure
src/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # Auth group (login, register pages)
│   │   ├── login/
│   │   │   └── page.jsx
│   │   └── register/
│   │       └── page.jsx
│   ├── (dashboard)/              # Dashboard group (protected routes)
│   │   ├── layout.jsx            # Dashboard layout with sidebar & navbar
│   │   ├── page.jsx              # Main dashboard page
│   │   ├── patients/
│   │   │   └── page.jsx
│   │   ├── workers/
│   │   │   └── page.jsx
│   │   ├── alerts/
│   │   │   └── page.jsx
│   │   └── reports/
│   │       └── page.jsx
│   ├── layout.jsx                # Root layout
│   └── page.jsx                  # Landing page (Hero section)
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   └── ...
│   ├── dashboard/                # Dashboard specific components
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   ├── StatCard.jsx
│   │   ├── AlertBox.jsx
│   │   └── VisitsChart.jsx
│   ├── landing/                  # Landing page components
│   │   ├── HeroSection.jsx
│   │   ├── Features.jsx
│   │   └── CTASection.jsx
│   └── forms/                    # Form components
│       ├── PatientForm.jsx
│       └── WorkerForm.jsx
├── lib/
│   ├── supabase/
│   │   └── client.js             # Supabase client initialization
│   ├── storage/
│   │   ├── localStorage.js       # Local storage operations
│   │   ├── syncManager.js        # Sync local ↔ server
│   │   └── offlineQueue.js       # Queue for offline operations
│   ├── utils/
│   │   ├── constants.js          # Constants & config
│   │   └── helpers.js            # Helper functions
│   └── hooks/
│       ├── useLocalStorage.js    # Custom hook for local storage
│       └── useOfflineSync.js     # Custom hook for sync
├── styles/
│   └── globals.css               # Global styles & Tailwind directives
├── public/
│   ├── images/
│   │   ├── hero-bg.jpg
│   │   └── logo.svg
│   └── icons/
└── .env.local                    # Environment variables (ignored in git)