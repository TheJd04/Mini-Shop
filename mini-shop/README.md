# Heirloom — A Mini E-Commerce Store

A simplified online store: browse products, filter by category or search, add to cart, and place a simulated order. Includes a slide-in cart drawer, dummy checkout, and order history.

**Stack:** React (Vite) · Express.js · MongoDB (Mongoose) · JWT authentication · Tailwind CSS

---

## Project structure

```
mini-shop/
├── backend/     Express REST API
└── frontend/    React single-page app
```

Uses ports `5002` (backend) and `5175` (frontend) — distinct from the other two projects, so all three can run side by side.

---

## 1. Set up MongoDB Atlas (free tier)

You can reuse the same Atlas cluster as your other projects — just point this one at a different database name, e.g. `minishop`.

1. https://www.mongodb.com/cloud/atlas/register → free M0 cluster.
2. **Database Access** → create a DB user.
3. **Network Access** → allow your IP (or `0.0.0.0/0` for development).
4. **Connect** → **Drivers** → copy the connection string, e.g.
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/minishop?retryWrites=true&w=majority
   ```

---

## 2. Run the backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env` with your `MONGO_URI` and a `JWT_SECRET`.

```bash
npm run dev
```

Check: http://localhost:5002/api/health → `{"status":"ok","service":"mini-shop-api"}`

### Seed sample products

The store starts with an **empty catalog** — you need to seed it once:

```bash
npm run seed
```

This inserts 8 sample products (bags, home goods, apparel) so there's something to browse immediately. Safe to re-run any time; it wipes and re-inserts.

---

## 3. Run the frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5175

---

## How it works

- **Public browsing** — anyone can view the catalog and product pages without logging in.
- **Cart requires login** — adding to cart prompts a login if you're not signed in; the cart itself lives in MongoDB per-user (not just in browser memory), so it survives a refresh or a new device.
- **Stock is real** — adding more to your cart than is in stock is rejected server-side, and placing an order actually decrements `Product.stock`.
- **Checkout is simulated** — no real payment gateway is called, but the order is genuinely created, items are snapshotted (so price history is preserved even if a product's price later changes), and the cart is genuinely cleared. This is the realistic way to mock "payment" in a portfolio project: fake the payment step, but make everything around it real.
- **Admin-gated product management** — `POST/PUT/DELETE /api/products` require `isAdmin: true` on the user. There's no admin UI in this build (out of scope for the assignment), but the API supports it — to test it, manually flip `isAdmin: true` on a user document in Atlas's data browser, then hit those endpoints with a tool like Postman.

## Design notes

- The logo (`components/HeirloomMark.jsx`) is a wax-seal motif with an "H" cut into it — fitting the idea of something stamped and passed down, rather than a generic letter-in-a-box badge.
- Color palette is deliberately distinct from the other three projects: deep indigo (`--color-clay`, despite the leftover variable name) instead of Tally's coral or Foolscap's teal — reads as a quieter, more upscale boutique rather than a casual storefront.
- Product cards use real elevation (border + shadow-on-hover + slight lift) instead of flat, borderless tiles — small detail, but it's the difference between "list of items" and "shop."
- The "Add" button on each card is a real button with an icon, not a plain text link — easier to tap on mobile and reads as a deliberate action rather than an afterthought.

## API reference

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Create an account |
| POST | `/api/auth/login` | No | Log in |
| GET | `/api/products` | No | List products (`?search=`, `?category=`) |
| GET | `/api/products/:id` | No | Get one product |
| POST | `/api/products` | Admin | Create a product |
| PUT | `/api/products/:id` | Admin | Update a product |
| DELETE | `/api/products/:id` | Admin | Delete a product |
| GET | `/api/cart` | Yes | Get your cart |
| POST | `/api/cart/items` | Yes | Add an item |
| PUT | `/api/cart/items/:itemId` | Yes | Change quantity |
| DELETE | `/api/cart/items/:itemId` | Yes | Remove an item |
| POST | `/api/orders` | Yes | Place an order (checkout) |
| GET | `/api/orders` | Yes | Your order history |
| GET | `/api/orders/:id` | Yes | One order's detail |
