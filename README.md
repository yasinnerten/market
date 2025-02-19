1. Install dependencies and start the containers:
cd frontend
npm install
docker compose up -d

2. Access the application:
- Frontend: http://localhost:80
- Admin Panel: http://localhost:80/admin
- Backend Health: http://localhost:8080/health

## Notes
- The backend API is proxied through Nginx at `/api/*`
- All API endpoints require authentication except login/register
- Admin endpoints require admin role authentication
- File uploads are stored in the `/uploads` directory

## Base URLs
- Frontend: `http://localhost:80`
- Backend API: `http://localhost:8080`
- Admin Panel: `http://localhost:80/admin`

## Authentication
Default admin credentials:
- Email: root@localhost.com
- Password: Deneme01

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` (Admin) - Create new product
- `PUT /api/products/:id` (Admin) - Update product
- `DELETE /api/products/:id` (Admin) - Delete product

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

### Admin
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/analytics` - Get sales analytics
- `GET /api/admin/about` - Get about page content
- `PUT /api/admin/about` - Update about page content

### Auth
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

## Health Check
- `GET /health` - Backend health status check

## Backup Configuration
The system includes an automated backup script (`backup.sh`) that:
- Creates daily database backups
- Stores backups in `/backups` directory
- Retains backups for 7 days
- Uses PostgreSQL credentials from environment variables

## CORS Configuration
The backend is configured to accept requests from all origins (*) with the following allowed methods:
- GET
- POST
- PUT
- DELETE
- OPTIONS

## Nginx Configuration
The frontend Nginx server:
- Listens on port 80
- Proxies API requests to backend (port 8080)
- Handles static file caching
- Manages SPA routing

## Development
To start the development environment:
1. Install dependencies:

