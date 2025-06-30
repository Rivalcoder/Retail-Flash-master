# Retail Flash 🚀

A modern, AI-powered retail platform built with Next.js 15, featuring real-time inventory management, AI-generated promotional content, and intelligent customer support powered by Google Gemini 2.0 Flash.

## ✨ Features

### 🛍️ **Live Inventory Dashboard**
- Real-time product catalog visualization with search and filtering
- Stock level monitoring and alerts
- Product image management with drag-and-drop uploads
- Category-based organization and tagging

### 🤖 **AI-Powered Promo Copy Generator**
- Automatic generation of compelling marketing content
- Context-aware promotional taglines based on product data
- Multiple variation generation for A/B testing
- Integration with Google Gemini 2.0 Flash for high-quality output

### 💬 **Intelligent Q&A Bot**
- Customer support with real-time catalog access
- Product-specific question answering
- Price comparison and feature analysis
- Natural language processing for customer queries

### 🔐 **Secure Admin Controls**
- JWT-based authentication system
- Role-based access control (Admin/Customer)
- Easy product management via JSON uploads
- Real-time catalog updates with instant reflection

### 🎨 **Modern UI/UX**
- Beautiful, responsive design with dark mode support
- Framer Motion animations and transitions
- Radix UI components for accessibility
- Mobile-first responsive design

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **AI**: Google Gemini 2.0 Flash, Genkit AI SDK
- **Authentication**: Custom JWT-based auth system
- **UI Components**: Radix UI, Framer Motion, Lucide Icons
- **Database**: MongoDB with separate databases for admin, users, and products
- **Styling**: Tailwind CSS with custom design system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB instance
- Google Generative AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Retail-Flash-master
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGO_URL=your_mongodb_connection_string
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Initialize the database**
   ```bash
   # Start the development server
   npm run dev
   
   # In another terminal, initialize the database
   curl -X POST http://localhost:3000/api/init-db
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Main application: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin/login
   - Customer login: http://localhost:3000/login

## 📋 Default Credentials

After database initialization, you can use these default accounts:

### Admin Account
- **Email**: admin@retailflash.com
- **Password**: admin123456
- **Access**: Full admin dashboard with all features

### Customer Account
- **Email**: customer@retailflash.com
- **Password**: customer123
- **Access**: Customer-facing features and Q&A bot

## 🔄 Workflows

### 1. Admin Dashboard Workflow

#### **Initial Setup**
1. Navigate to `/admin/login`
2. Login with admin credentials
3. Access the main dashboard with sidebar navigation

#### **Inventory Management**
1. **View Products**: Go to "Inventory" section to see all products
2. **Add Products**: 
   - Click "Add Product" button
   - Fill in product details (name, price, description, category, stock)
   - Upload product image
   - Save to add to catalog
3. **Update Products**:
   - Click on any product to edit
   - Modify details and save changes
   - AI will automatically generate new promo copy for price changes
4. **Bulk Upload**:
   - Use JSON upload feature for bulk product management
   - Download sample format from `/public/sample-product-catalog.json`

#### **AI Promo Copy Generation**
1. **Automatic Generation**: Promo copy is automatically generated when:
   - New products are added
   - Product prices are updated
   - Product descriptions are modified
2. **Manual Generation**: 
   - Go to "Promo Generator" section
   - Select a product
   - Generate new promotional content
   - Choose from multiple variations

#### **Customer Q&A Bot Management**
1. **Test Bot**: Go to "Q&A Bot" section
2. **Ask Questions**: Test customer queries about products
3. **Monitor Responses**: See how the AI responds to different questions
4. **Product Context**: Bot has access to real-time product catalog

### 2. Customer Experience Workflow

#### **Product Browsing**
1. **Landing Page**: View featured products and platform overview
2. **Product Catalog**: Browse all available products
3. **Search & Filter**: Find products by category, price, or keywords
4. **Product Details**: View detailed product information, images, and specifications

#### **AI-Powered Customer Support**
1. **Q&A Bot Access**: Use the intelligent chatbot for product questions
2. **Ask Questions**: Examples:
   - "What's the price of the wireless headphones?"
   - "Compare the smart watch and fitness tracker"
   - "What's in stock for electronics?"
   - "Tell me about the yoga mat features"
3. **Real-time Answers**: Get instant responses based on current catalog data

### 3. AI Integration Workflows

#### **Promo Copy Generation**
```typescript
// Example API call for promo copy generation
const response = await fetch('/api/promo/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-admin-id': adminId
  },
  body: JSON.stringify({
    productName: "Wireless Bluetooth Headphones",
    oldPrice: 99.99,
    newPrice: 89.99,
    description: "Premium wireless headphones with noise cancellation"
  })
});
```

#### **Q&A Bot Integration**
```typescript
// Example API call for customer questions
const response = await fetch('/api/assistant/answer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    productId: "prod_001", // or "general" for catalog-wide questions
    question: "What's the battery life of the wireless headphones?",
    products: productCatalogData
  })
});
```

## 📁 Project Structure

```
Retail-Flash-master/
├── src/
│   ├── ai/flows/           # AI workflow definitions
│   │   ├── customer-q-and-a-bot.ts
│   │   └── promo-copy-generator.ts
│   ├── app/                # Next.js app router
│   │   ├── admin/          # Admin dashboard routes
│   │   ├── api/            # API endpoints
│   │   ├── dashboard/      # Customer dashboard
│   │   ├── login/          # Authentication pages
│   │   └── signup/         # Registration pages
│   ├── components/         # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── admin-panel.tsx
│   │   ├── promo-generator.tsx
│   │   └── q-and-a-bot.tsx
│   ├── lib/                # Utility functions
│   │   ├── auth-utils.ts   # Authentication utilities
│   │   ├── mongodb.ts      # Database connections
│   │   └── types.ts        # TypeScript definitions
│   └── models/             # MongoDB models
├── public/                 # Static assets
│   └── sample-product-catalog.json
└── Model_Paths/            # AI model configurations
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/customer/login` - Customer login
- `POST /api/auth/signup` - User registration

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `POST /api/products/upload-json` - Bulk upload products

### AI Features
- `POST /api/promo/generate` - Generate promotional copy
- `POST /api/assistant/answer` - Get AI answers to questions

### Database
- `POST /api/init-db` - Initialize databases (development only)

## 🎯 Sample Product Catalog Format

```json
[
  {
    "id": "prod_001",
    "name": "Wireless Bluetooth Headphones",
    "price": 89.99,
    "description": "Premium wireless headphones with active noise cancellation",
    "category": "Electronics",
    "stock": 150,
    "imageUrl": "https://example.com/image.jpg",
    "specifications": {
      "batteryLife": "30 hours",
      "connectivity": "Bluetooth 5.0",
      "weight": "250g"
    }
  }
]
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
MONGO_URL=your_production_mongodb_url
GOOGLE_GENERATIVE_AI_API_KEY=your_production_ai_key
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
```

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run genkit:dev   # Start Genkit AI development server
```

### AI Development
```bash
# Start AI development server
npm run genkit:dev

# Watch mode for AI development
npm run genkit:watch
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

© 2025 Retail Flash. All rights reserved.

## 🆘 Support

For support and questions:
- Check the documentation above
- Review the sample product catalog format
- Test with the provided default credentials
- Ensure all environment variables are properly configured

---

**Built with ❤️ using Next.js, MongoDB, and Google Gemini AI**
