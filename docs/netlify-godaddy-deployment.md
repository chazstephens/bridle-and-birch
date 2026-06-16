# Bridle & Birch Deployment Guide

This guide details how to deploy the **Bridle & Birch** storefront to Netlify, transition the local SQLite database to a production PostgreSQL database (Supabase), and configure your GoDaddy domain name.

---

## 01. Transitioning from SQLite to PostgreSQL (Supabase)

Netlify is a serverless platform. Because serverless functions are ephemeral, stateless, and run on read-only file systems, **a local SQLite database file (`dev.db`) will not persist or allow write operations in production.** 

To run the storefront in production, you must use a hosted PostgreSQL database. We recommend **Supabase** (which has a generous free tier).

### Step 1: Create a Supabase Database
1. Go to [supabase.com](https://supabase.com) and sign up or log in.
2. Click **New Project** and select a name, database password, and region (choose one close to your target audience, e.g., US East or US West).
3. Wait for the database instance to provision (usually takes 1–2 minutes).

### Step 2: Retrieve the Connection String
1. In your Supabase dashboard, navigate to **Project Settings** (gear icon) -> **Database**.
2. Under **Connection string**, select **URI**.
3. Copy the URI. It will look like this:
   `postgresql://postgres.[username]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`
4. Replace `[password]` with your actual database password.
5. *Note: For serverless builds like Netlify, always use the **Transaction Mode (port 6543)** connection string with connection pooling enabled (e.g., `?pgbouncer=true` at the end).*

### Step 3: Update the Prisma Schema
Because Prisma requires a static database provider in the schema file, you will need to change the provider in `prisma/schema.prisma` from `sqlite` to `postgresql` when transitioning to production.

In [prisma/schema.prisma](file:///Users/chazstephens/Developer/bridle-birch-store/prisma/schema.prisma):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 4: Push the Database Schema to Supabase
Run the following command locally to create the tables in your production Supabase database:
```bash
# Set your DATABASE_URL environment variable to the Supabase connection string
export DATABASE_URL="postgresql://..."

# Push the schema definitions directly to the database
npx prisma db push
```

### Step 5: Seed the Database
To populate the production database with the initial products, categories, and custom render coordinates, run the seed script:
```bash
npx prisma db seed
```

---

## 02. Deploying to Netlify

Next.js is fully supported on Netlify via Netlify's Next.js Runtime.

### Step 1: Import the Repository
1. Log in to [netlify.com](https://www.netlify.com/).
2. Click **Add new site** -> **Import an existing project**.
3. Choose **GitHub** and authorize Netlify.
4. Select the `bridle-and-birch` repository.

### Step 2: Configure Build Settings
Configure the build settings as follows:
*   **Build command:** `npx prisma generate && next build`
    *(Running `prisma generate` before `next build` ensures that the client classes match the schema during Next.js static page generation).*
*   **Publish directory:** `.next`
*   **Branch to deploy:** `main`

### Step 3: Add Environment Variables
In the Netlify dashboard under **Site configuration** -> **Environment variables**, add the following keys:
1.  **`DATABASE_URL`**: Your Supabase transaction-mode connection string.
2.  **`JWT_SECRET`**: A secure random string used to sign customer session tokens (e.g., generate one with `openssl rand -base64 32` or type a long random phrase).

### Step 4: Deploy
Click **Deploy site**. Netlify will build the Next.js app and spin up Serverless Functions for your dynamic routes (like `/admin`, `/account`, and customized product previews).

---

## 03. Configuring the GoDaddy Domain

To link your GoDaddy domain to your Netlify site, you have two options. **Option A (Netlify DNS) is highly recommended** because Netlify will automatically manage your SSL certificates (HTTPS) and configure DNS records for optimal global performance.

### Option A: Use Netlify DNS (Recommended)
1. In the Netlify dashboard, go to **Site configuration** -> **Domain management** -> **Domains** -> **Add custom domain**.
2. Enter your GoDaddy domain name (e.g., `bridleandbirch.com`) and click **Verify** and **Add domain**.
3. Netlify will state that the domain is registered externally and will give you **4 Netlify Nameservers**. They will look similar to:
   *   `dns1.p01.nsone.net`
   *   `dns2.p01.nsone.net`
   *   `dns3.p01.nsone.net`
   *   `dns4.p01.nsone.net`
4. Keep this tab open, then log in to your **GoDaddy Account**.
5. Go to **My Products** -> **Domains** -> click the three dots next to your domain -> **Manage DNS**.
6. Find the **Nameservers** section and click **Change Nameservers**.
7. Select **I'll use my own nameservers** and paste the 4 Netlify nameservers into the input fields. Save your changes.
8. *Note: Nameserver propagation can take anywhere from 2 to 24 hours to update worldwide. Once complete, Netlify will automatically provision a free Let's Encrypt SSL certificate for your site.*

### Option B: Use GoDaddy DNS (A and CNAME Records)
If you prefer to keep your DNS records managed inside GoDaddy, you can configure manual records pointing to Netlify instead:
1. Log in to **GoDaddy** -> **My Products** -> **Manage DNS**.
2. In your DNS Records table, edit or add these two records:
   *   **Type:** `A` | **Name:** `@` | **Value:** `75.2.60.5` (Netlify's load balancer IP) | **TTL:** Default
   *   **Type:** `CNAME` | **Name:** `www` | **Value:** `your-netlify-site-name.netlify.app` (your Netlify subdomain) | **TTL:** Default
3. Save the records.

---

## 04. Local Development with SQLite

If you want to keep using SQLite for local development while using Supabase in production, you can easily toggle the provider in `prisma/schema.prisma`:
*   **For local development:** Keep `provider = "sqlite"` and `DATABASE_URL="file:./dev.db"`.
*   **For production deployment:** Change `provider = "postgresql"` and use your Supabase connection string. 

Before pushing your final changes to GitHub, make sure to update the schema to `postgresql` so Netlify builds successfully.
