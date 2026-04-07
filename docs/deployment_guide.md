# Launch & Deployment Guide

Since your application is split into two parts: a **Node.js Backend** and a **Next.js Frontend**, you will need to deploy them to two separate services. Your PostgreSQL database is already hosted on Supabase and ready for production!

---

## 1. Deploying the Backend (Render, Railway, or Heroku)
We recommend **Render.com** (it's free and very easy for Node.js).

### Steps for Render:
1. Push your `fund_manager_backend` code to a **GitHub repository**.
2. Create an account on [Render](https://render.com/).
3. Click "New +" and select **Web Service**.
4. Connect your GitHub repository.
5. Setup the environment:
   * **Language / Environment:** Node
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
6. Scroll down to **Environment Variables** and add everything from your `.env` file:
   * `DATABASE_URL` = `(your supabase connection string)`
   * `JWT_SECRET` = `(use a strong random string)`
   * `PORT` = `4000` (Render will automatically assign a port, but it's good practice)
7. Click **Create Web Service**. 

Once deployed, Render will give you a live URL (e.g., `https://fund-manager-backend.onrender.com`). **Save this URL.**

---

## 2. Deploying the Frontend (Vercel)
**Vercel** is the company behind Next.js, so it's the absolute best (and free) place to host it.

### Steps for Vercel:
1. Push your `fund_manager_ui` code to a **GitHub repository**.
2. Create an account on [Vercel](https://vercel.com).
3. Click **Add New Project** and import your GitHub UI repository.
4. Open the **Environment Variables** section and add:
   * **Name:** `NEXT_PUBLIC_API_URL`
   * **Value:** `https://fund-manager-backend.onrender.com` *(The exact URL Render gave you in step 1! Make sure there's no trailing slash)*
5. Click **Deploy**.

Vercel will successfully build and launch your frontend, giving you a live public URL (e.g., `https://fund-manager.vercel.app`).

---

## 3. Post-Launch Testing

1. Open your live Vercel URL in your browser.
2. Sign in with the credentials (`yug@fund.com` / `yugfm@1021`).
3. Add a test transaction.
4. If everything passes, your app is fully launched to the world and you can share the Vercel link with your friends!
