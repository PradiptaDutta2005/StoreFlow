
# StoreFlow - Full-Stack Store Management System

A comprehensive store management web application built with React, Express, and MongoDB, featuring four distinct portals for different user roles.

## 🚀 Features

### Customer Portal
- **Authentication**: Phone number + OTP login
- **Order History**: View past orders with filtering
- **Product Search**: Search and locate products in store
- **Interactive Store Map**: 10x5 grid with product location highlighting
- **Loyalty Points**: Track points, redeem rewards, view history

### Storekeeper Portal
- **Stock Management**: Full CRUD operations for products
- **Order Registration**: Create orders and manage customer data
- **Loyalty Points**: Assign points (1 point per $10 spent)
- **Alert System**: Send alerts to employees

### Employee Portal
- **Alert Management**: View and manage assigned alerts
- **Task Tracking**: Mark tasks as completed
- **Work Dashboard**: Overview of pending tasks

### Admin Portal
- **User Management**: Manage storekeepers, employees, and customers
- **Stock Overview**: Monitor inventory with low-stock alerts
- **Order Analytics**: View all orders with advanced filtering
- **Reports**: Sales summaries and inventory reports

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **React Router** for navigation
- **React Query** for data fetching

### Backend
- **Express.js** REST API
- **MongoDB** with Mongoose ODM
- **CORS** enabled for cross-origin requests
- **Error handling** middleware

### Design System
- **Colors**: Light Blue (#60A5FA) and White (#FFFFFF)
- **Font**: Inter
- **Mobile-first** responsive design
- **Smooth animations** and transitions

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Frontend Setup
```bash
# Clone the repository
git clone <repository-url>
cd storeflow

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your MongoDB URI to .env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/storeflow

# Seed the database
npm run seed

# Start the server
npm run dev
```

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy automatically on push

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
6. Deploy

### MongoDB Atlas Setup
1. Create MongoDB Atlas account
2. Create new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string and add to environment variables

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/storeflow
PORT=5000
NODE_ENV=production
```

### Frontend
Update `src/services/api.ts` with your backend URL:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.render.com' 
  : 'http://localhost:5000';
```

## 📚 API Documentation

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:phoneNumber` - Get customer by phone
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:phoneNumber` - Update customer
- `DELETE /api/customers/:phoneNumber` - Delete customer

### Products
- `GET /api/products` - Get all products (supports ?name and ?category)
- `GET /api/products/:productId` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:productId` - Update product
- `DELETE /api/products/:productId` - Delete product

### Orders
- `GET /api/orders` - Get all orders (supports ?customerId, ?status, ?startDate, ?endDate)
- `GET /api/orders/:orderId` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:orderId` - Update order
- `DELETE /api/orders/:orderId` - Delete order

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:employeeId` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:employeeId` - Update employee
- `DELETE /api/employees/:employeeId` - Delete employee

### Alerts
- `GET /api/alerts` - Get all alerts (supports ?employeeId)
- `GET /api/alerts/:alertId` - Get alert by ID
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/:alertId` - Update alert
- `DELETE /api/alerts/:alertId` - Delete alert

## 🎨 Design System

### Colors
- Primary: `#60A5FA` (Light Blue)
- Secondary: `#FFFFFF` (White)
- Gradients: `bg-gradient-to-r from-blue-500 to-blue-300`

### Components
- All components use Shadcn/ui for consistency
- Minimum 48px touch targets for mobile
- Smooth transitions with `transition-all duration-300`
- Hover effects and shadows for premium feel

### Typography
- Font Family: Inter
- Responsive text sizes
- Proper contrast ratios for accessibility

## 🚀 Development

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### Code Structure
```
storeflow/
├── src/
│   ├── components/
│   │   ├── layouts/
│   │   └── ui/
│   ├── contexts/
│   ├── pages/
│   │   ├── customer/
│   │   ├── storekeeper/
│   │   ├── employee/
│   │   └── admin/
│   ├── services/
│   └── hooks/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── seed.js
└── README.md
```

## 📱 Demo Credentials

### Customer Portal
- Phone: Any 10-digit number
- OTP: `1234`

### Staff Portals
- **Storekeeper**: `keeper@store.com` / `password`
- **Employee**: `emp@store.com` / `password`
- **Admin**: `admin@store.com` / `password`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Live Demo**: [Frontend URL]
- **API Documentation**: [Backend URL]/api
- **GitHub Repository**: [Repository URL]

## 📞 Support

For support, email support@storeflow.com or create an issue on GitHub.
