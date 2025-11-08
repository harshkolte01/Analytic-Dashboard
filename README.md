# 📊 Analytics Dashboard

A comprehensive business intelligence platform for invoice and vendor analytics with AI-powered natural language querying capabilities.

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "Frontend (Vercel)"
        WEB[Next.js Web App<br/>Port: 3000]
    end
    
    subgraph "Backend Services (VPS)"
        API[Express.js API<br/>Port: 8000]
        VANNA[Python Vanna AI Service<br/>Port: 8001]
        DB[(PostgreSQL Database<br/>Port: 5432)]
    end
    
    subgraph "External Services"
        GROQ[Groq AI API]
    end
    
    WEB --> API
    WEB --> VANNA
    API --> DB
    VANNA --> DB
    VANNA --> GROQ
```

## 🚀 Features

### 📈 Dashboard Analytics
- **Overview Cards**: Key metrics and KPIs
- **Invoice Trends**: Time series analysis of invoice data
- **Cash Outflow**: Financial flow visualization
- **Category Spending**: Expense categorization and analysis
- **Vendor Analytics**: Top vendor performance metrics

### 🤖 AI-Powered Chat Interface
- **Natural Language Queries**: Ask questions in plain English
- **SQL Generation**: Automatic SQL query generation using Groq AI
- **Query Execution**: Real-time database querying
- **Result Formatting**: Intelligent data presentation
- **Export Capabilities**: CSV/Excel export functionality
- **Chat History**: Persistent conversation history

### 📊 Vendor Relationship Analytics
- **Performance Scorecards**: Multi-dimensional vendor scoring
- **Payment Reliability**: Overdue tracking and discount analysis
- **Spending Trends**: Interactive time series with growth rates
- **Risk Assessment**: Multi-factor risk scoring and categorization
- **Category Analysis**: Vendor spending breakdown by line items

### 🔒 Security & Performance
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error management
- **Rate Limiting**: API protection and throttling
- **Health Monitoring**: Service health checks
- **Responsive Design**: Mobile-first UI/UX

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **State Management**: React Hooks
- **Deployment**: Vercel

### Backend API
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Process Management**: PM2
- **Deployment**: VPS (Linux)

### AI Service
- **Runtime**: Python 3.11+
- **Framework**: FastAPI with Uvicorn
- **AI Provider**: Groq API
- **SQL Generation**: Vanna AI
- **Process Management**: PM2
- **Deployment**: VPS (Linux)

### Database
- **Primary**: PostgreSQL 15+
- **ORM**: Prisma
- **Migrations**: Prisma Migrate
- **Seeding**: Custom seed scripts

## 📁 Project Structure

```
analytics-dashboard/
├── apps/
│   ├── api/                    # Express.js Backend API
│   │   ├── src/
│   │   │   ├── controllers/    # Route controllers
│   │   │   ├── routes/         # API routes
│   │   │   ├── services/       # Business logic
│   │   │   ├── types/          # TypeScript definitions
│   │   │   └── utils/          # Utility functions
│   │   ├── prisma/             # Database schema & migrations
│   │   └── package.json
│   │
│   ├── services/
│   │   └── vanna/              # Python AI Service
│   │       ├── app/            # FastAPI application
│   │       ├── services/       # AI service logic
│   │       ├── tests/          # Test suites
│   │       └── requirements.txt
│   │
│   └── web/                    # Next.js Frontend
│       ├── app/                # App Router pages
│       ├── components/         # React components
│       ├── lib/                # Utility libraries
│       └── public/             # Static assets
│
├── scripts/                    # Utility scripts
├── DEPLOYMENT.md              # Deployment guide
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/your-username/analytics-dashboard.git
cd analytics-dashboard
```

### 2. Setup Database
```bash
# Install PostgreSQL and create database
sudo -u postgres psql
CREATE DATABASE analytics_dashboard;
CREATE USER analytics_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE analytics_dashboard TO analytics_user;
\q
```

### 3. Setup API Service
```bash
cd apps/api
npm install
cp .env.example .env
# Configure your .env file
npx prisma generate
npx prisma migrate dev
npm run seed  # Optional: seed with sample data
npm run dev
```

### 4. Setup Vanna AI Service
```bash
cd apps/services/vanna
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Configure your .env file with Groq API key
python -m uvicorn app.main:app --reload --port 8001
```

### 5. Setup Web Frontend
```bash
cd apps/web
npm install
cp .env.local.example .env.local
# Configure your .env.local file
npm run dev
```

### 6. Access Application
- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **AI Service**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

## 📚 API Documentation

### Core Endpoints

#### Analytics Endpoints
```bash
# Dashboard overview
GET /api/stats

# Invoice trends
GET /api/invoice-trends?period=6months

# Cash outflow analysis
GET /api/cash-outflow?period=12months

# Category spending
GET /api/category-spend?limit=10

# Top vendors
GET /api/vendors/top10?period=6months
```

#### Vendor Analytics Endpoints
```bash
# Performance scorecards
GET /api/vendor-analytics/performance-scorecard?timeframe=12&limit=20

# Payment reliability
GET /api/vendor-analytics/payment-reliability?limit=15

# Spending trends
GET /api/vendor-analytics/spending-trends?months=12&topVendors=10

# Risk assessment
GET /api/vendor-analytics/risk-assessment?limit=20
```

#### Chat & AI Endpoints
```bash
# Natural language query
POST /api/chat/query
{
  "question": "Show me top 5 vendors by total spend",
  "sessionId": "optional-session-id"
}

# Export query results
POST /api/chat/export
{
  "data": [...],
  "format": "csv|excel",
  "filename": "results"
}

# Chat sessions
GET /api/chat/sessions
POST /api/chat/sessions
GET /api/chat/sessions/:sessionId/history
```

### Example API Responses

#### Dashboard Stats
```json
{
  "success": true,
  "data": {
    "totalInvoices": 1250,
    "totalAmount": 2450000.50,
    "avgInvoiceValue": 1960.00,
    "uniqueVendors": 85,
    "pendingInvoices": 23,
    "overdueAmount": 45000.00
  }
}
```

#### Vendor Performance
```json
{
  "success": true,
  "data": [
    {
      "vendorName": "Tech Solutions Inc",
      "totalSpend": 125000.00,
      "invoiceCount": 45,
      "avgInvoiceValue": 2777.78,
      "performanceScore": {
        "overall": 87,
        "consistency": 92,
        "volume": 85,
        "reliability": 84
      }
    }
  ]
}
```

#### AI Chat Response
```json
{
  "success": true,
  "data": {
    "question": "Show me top 5 vendors by total spend",
    "sql": "SELECT vendorName, SUM(invoiceTotal) as total FROM...",
    "results": [...],
    "explanation": "Here are the top 5 vendors by total spending...",
    "executionTime": 245
  }
}
```

## 🔧 Development

### Running Tests
```bash
# API tests
cd apps/api
npm test

# Vanna service tests
cd apps/services/vanna
python -m pytest

# Web tests
cd apps/web
npm test
```

### Database Operations
```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Seed database
npm run seed

# View database
npx prisma studio
```

### Code Quality
```bash
# Lint TypeScript
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 🚀 Deployment

### Production Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Architecture**: VPS (API + AI Service) + Vercel (Frontend)

### Environment Variables

#### API Service (.env)
```env
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://user:password@localhost:5432/analytics_dashboard
CORS_ORIGIN=https://your-frontend.vercel.app
JWT_SECRET=your-jwt-secret
```

#### Vanna Service (.env)
```env
ENVIRONMENT=production
PORT=8001
DATABASE_URL=postgresql://user:password@localhost:5432/analytics_dashboard
GROQ_API_KEY=your-groq-api-key
LOG_LEVEL=INFO
```

#### Web Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_VANNA_URL=https://your-api-domain.com/vanna
```

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# API health
curl https://your-domain.com/api/health

# Vanna service health
curl https://your-domain.com/vanna/health

# Database connection
npm run db:check
```

### Logs & Monitoring
```bash
# PM2 process monitoring
pm2 monit

# View logs
pm2 logs analytics-api
pm2 logs analytics-vanna

# System resources
htop
```

### Backup & Recovery
```bash
# Database backup
pg_dump -U analytics_user analytics_dashboard > backup.sql

# Restore database
psql -U analytics_user analytics_dashboard < backup.sql
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow conventional commit messages
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues
- **Database Connection**: Check PostgreSQL service and credentials
- **AI Service Timeout**: Verify Groq API key and network connectivity
- **CORS Errors**: Ensure proper CORS_ORIGIN configuration
- **Build Failures**: Check Node.js and Python versions

### Getting Help
- Check the [DEPLOYMENT.md](DEPLOYMENT.md) guide
- Review API documentation above
- Check service logs for error details
- Ensure all environment variables are configured

## 🎯 Roadmap

### Upcoming Features
- [ ] Real-time notifications
- [ ] Advanced user authentication
- [ ] Multi-tenant support
- [ ] Advanced analytics dashboards
- [ ] Mobile application
- [ ] API rate limiting enhancements
- [ ] Advanced caching strategies

### Performance Improvements
- [ ] Database query optimization
- [ ] Frontend bundle optimization
- [ ] CDN integration
- [ ] Advanced caching layers

---

**Built with ❤️ using Next.js, Express.js, FastAPI, and PostgreSQL**