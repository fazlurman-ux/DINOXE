# Dinoxe Smart Accessories E-commerce Store

A complete e-commerce store for smart accessories with Cash on Delivery (COD) payment, built with Next.js 14, Prisma, and SQLite.

## Features

- **8 Pages**: Landing, Products, Product Detail, Cart, Checkout, Confirmation, Order Tracking, Admin Panel
- **24 Products**: Bluetooth earbuds, chargers, speakers, phone cases, screen protectors, cooling fans, phone coolers
- **COD Payment**: Cash on Delivery only - no Stripe or online payments
- **Admin Panel**: Login, order management, product management, refund handling
- **Form Validation**: Phone (10 digits, starts with 6-9), Pincode (6 digits), Email, Address
- **Duplicate Order Prevention**: Max 1 order per phone number per 60 seconds
- **Mobile Responsive**: Designed for 375px, 768px, 1200px breakpoints
- **Dark Theme**: Charcoal (#0F0F0F) + Teal (#00D9D9) color scheme
- **Shopping Cart**: Add to cart, edit quantity, remove items, persist in localStorage
- **Order Tracking**: Timeline view of order status
- **Product Filters**: Category, price range, sort options
- **Search**: Real-time product search

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: bcryptjs for password hashing
- **Validation**: Zod schema validation
- **Icons**: Lucide React

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Create database and seed with data
npx prisma db push
npm run seed
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Admin Login

- URL: `http://localhost:3000/admin/login`
- Email: `admin@dinoxe.com`
- Password: `admin123`

## Pages

### Customer Pages
1. **/** - Landing page with hero, trust badges, testimonials, featured products
2. **/products** - Product catalog with filters, search, sorting, 24 products
3. **/product/[id]** - Product detail page with reviews, related products
4. **/cart** - Shopping cart with editable quantities
5. **/checkout** - Checkout form with COD payment, form validation
6. **/confirmation** - Order confirmation with order ID and timeline
7. **/orders/[orderId]** - Order tracking page

### Admin Pages
8. **/admin/login** - Admin login
9. **/admin/dashboard** - Orders management with status updates
10. **/admin/products** - Product management (add, edit, delete, toggle active)
11. **/admin/refunds** - Refund request management

## Database Schema

### Users
- id, email, password (hashed), createdAt

### Products
- id, name, category, price (₹), description, imageUrl, specifications, warranty, stock, rating, isActive, createdAt, updatedAt

### Orders
- id, orderId (ORD-YYYYMMDD-XXXXX), customerName, customerPhone, customerEmail, deliveryAddress, alternatePhone, deliveryInstructions, totalAmount, paymentMethod (COD), paymentStatus, orderStatus (Pending/Dispatched/Delivered/Refund Pending/Refunded), createdAt, updatedAt

### OrderItems
- id, orderId, productId, productName, productPrice, quantity, subtotal

### CartItems
- id, userId, sessionId, productId, quantity, createdAt

### Refunds
- id, orderId, amount, reason, status, createdAt, processedAt

### Reviews
- id, productId, customerName, city, rating, comment, isApproved, createdAt

## Design System

### Colors
- Background: #0F0F0F (deep charcoal)
- Accent: #00D9D9 (teal)
- Text: #F5F5F5 (off-white)
- Border: #333333 (gray)
- Success: #10B981 (green)
- Error: #EF4444 (red)
- Warning: #F59E0B (orange)

### Typography
- Headings: Inter SemiBold
- Body: Inter Regular
- Buttons: Inter Medium
- Numbers: JetBrains Mono (prices, order IDs)

### Layout
- Mobile-first: 375px, 768px, 1200px
- 8px grid system
- Max width: 1200px

### Interactions
- Fade-in on scroll
- Hover: Lift cards, scale buttons 102%
- Skeleton loaders
- Toast notifications (3s auto-dismiss)
- Loading spinners
- Smooth transitions (200ms)

## Form Validation Rules

- **Phone**: 10 digits, starts with 6-9 → Format: +91 XXXXX XXXXX
- **Pincode**: 6 digits
- **Email**: Standard format (optional)
- **Name**: 3-100 chars, letters only
- **Address**: 20+ chars, must contain 6-digit pincode
- **Duplicate Order**: Prevent 2 orders same phone in 60 seconds

## COD Payment Flow

1. Customer fills checkout form
2. COD pre-selected (radio button, disabled)
3. Click "Confirm Order"
4. Order created in database
5. Order ID generated: ORD-YYYYMMDD-XXXXX
6. Redirect to confirmation page
7. Admin sees order in dashboard
8. Admin marks: Pending → Dispatched → Delivered → Refund

## Build & Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Lint

```bash
npm run lint
```

## Admin Credentials

Default admin user:
- Email: admin@dinoxe.com
- Password: admin123

To change credentials, update `prisma/seed.ts` and run the seed script again.

## License

MIT
