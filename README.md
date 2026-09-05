# Reseror — Full-Stack Booking Platform (Monorepo)

A modern, high-performance full-stack web application for hotel & restaurant bookings built as a **Bun monorepo**. Powered by Next.js 15, Hono, Drizzle ORM, Better Auth, and deployed globally using **OpenNext** on **Cloudflare Workers**.

---

## 🌟 Key Features

- **🏨 Property & Room Management**: Browse hotels, villas, and resort rooms with dynamic pricing, interactive filters, and rich media galleries.
- **🍽️ Restaurant & Dining Reservations**: Search nearby dining spots, view menus, opening hours, and leave verified reviews.
- **🔐 Better-Auth Integration**: Robust multi-role authentication system (Admin, Hotel Owner, Nursery Owner, Parent, Teacher, User).
- **🗺️ Interactive Maps & POI Search**: Integration with Google Maps & Places API for location autocomplete and nearby attractions.
- **📱 Responsive & Modern UI**: Built with Next.js 15 (App Router), Tailwind CSS v4, Radix UI primitives, Lucide Icons, and Framer Motion animations.
- **⚡ High Performance Edge Deployment**: Full SSR support compiled for **Cloudflare Workers** using `@opennextjs/cloudflare`.

---

## 📁 Repository Structure

```text
├── apps/
│   ├── api/        # Hono REST API backend with OpenAPI & Scalar docs
│   └── web/        # Next.js 15 frontend application with App Router & OpenNext
├── packages/
│   └── core/       # Shared business logic, Drizzle ORM database schemas, auth config & RPC types
├── .github/
│   └── workflows/  # GitHub Actions automated deployment pipeline
├── bun.lock        # Monorepo Bun lockfile
└── package.json    # Monorepo root configuration
```

---

## 🚀 Tech Stack

- **Runtime & Package Manager**: [Bun](https://bun.sh) (v1.2+)
- **Frontend Framework**: Next.js 15 (App Router, Turbopack)
- **Backend Framework**: [Hono](https://hono.dev/) API framework with Type-Safe RPC
- **Database & ORM**: PostgreSQL / Neon DB with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Styling & UI**: Tailwind CSS v4, Radix UI, Lucide React, Framer Motion
- **Deployment & Edge**: Cloudflare Workers via `@opennextjs/cloudflare` & Wrangler CLI
- **CI/CD**: GitHub Actions

---

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh) `v1.2.0` or higher
- Node.js `v20` or `v22`

### 1. Clone the Repository

```bash
git clone https://github.com/maheshkmp/reseror-cloudflare.git
cd reseror-cloudflare
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Variables Setup

Create a `.env` file in `apps/web` and `apps/api`:

```bash
# apps/web/.env & apps/api/.env
DATABASE_URL="your-postgresql-database-url"
BETTER_AUTH_SECRET="your-better-auth-secret"
NEXT_PUBLIC_BACKEND_URL="http://localhost:4000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:4000"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-key"
```

### 4. Database Setup & Migrations

```bash
# Generate database migrations
bun run db:generate

# Push schema directly to database
bun run db:push
```

### 5. Running Local Development Servers

```bash
# Run both API and Web concurrently
bun run dev:api   # Starts API on http://localhost:4000
bun run dev:web   # Starts Web on http://localhost:3000
```

---

## ☁️ Deployment

### Automated GitHub Actions (CI/CD)

Deployments to Cloudflare Workers are **automated on every push to `main`** via GitHub Actions.

Ensure the following secrets are added under **GitHub Repository > Settings > Secrets and variables > Actions**:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Manual Deployment via CLI

```bash
# 1. Build the core package
bun run --filter core build

# 2. Build the OpenNext Cloudflare Worker bundle
cd apps/web
npx @opennextjs/cloudflare build

# 3. Deploy to Cloudflare Workers
npx wrangler deploy
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
