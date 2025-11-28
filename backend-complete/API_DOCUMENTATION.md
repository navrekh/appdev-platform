# AppDev Backend API

Complete backend API with authentication, app management, and build tracking.

## 🚀 Features

- ✅ User authentication (JWT)
- ✅ Prompt submission
- ✅ App management (CRUD)
- ✅ Build tracking
- ✅ Database integration (Prisma + PostgreSQL)
- ✅ Error handling
- ✅ Request validation

## 📡 API Endpoints

### Authentication

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN
```

### Prompts

#### Submit Prompt
```bash
POST /api/prompts
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "text": "Build me a todo app with authentication",
  "metadata": {
    "figmaUrl": "optional"
  }
}
```

#### Get All Prompts
```bash
GET /api/prompts
Authorization: Bearer YOUR_TOKEN
```

#### Get Single Prompt
```bash
GET /api/prompts/:id
Authorization: Bearer YOUR_TOKEN
```

### Apps

#### Get All Apps
```bash
GET /api/apps
Authorization: Bearer YOUR_TOKEN
```

#### Get Single App
```bash
GET /api/apps/:id
Authorization: Bearer YOUR_TOKEN
```

#### Update App
```bash
PATCH /api/apps/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "My Awesome App",
  "description": "A great app"
}
```

#### Delete App
```bash
DELETE /api/apps/:id
Authorization: Bearer YOUR_TOKEN
```

### Builds

#### Get All Builds
```bash
GET /api/builds
Authorization: Bearer YOUR_TOKEN
```

#### Get Single Build
```bash
GET /api/builds/:id
Authorization: Bearer YOUR_TOKEN
```

#### Trigger Build
```bash
POST /api/builds
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "appId": "app-uuid",
  "platform": "ANDROID",
  "buildType": "DEBUG"
}
```

## 🔒 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Tokens are valid for 7 days.

## 📊 Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { }
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": { }
}
```

## 🛠️ Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables in `.env`:
```
DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"
JWT_SECRET="your-secret-key"
PORT=3000
NODE_ENV=production
```

3. Run migrations:
```bash
cd ../shared/database
npx prisma migrate deploy
```

4. Start server:
```bash
npm run dev
```

## 📝 Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Save the token from the response.

### Submit Prompt
```bash
curl -X POST http://localhost:3000/api/prompts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text":"Build me a food delivery app"}'
```

## 🔍 Database Schema

See `../shared/database/schema.prisma` for complete schema.

Key models:
- User
- App
- Prompt
- Build
- BuildLog

## 🚀 Deployment

The server listens on `0.0.0.0` so it's accessible externally.

Make sure to:
1. Set strong JWT_SECRET
2. Use SSL for database connection
3. Configure firewall rules
4. Use PM2 for process management

## 📦 Dependencies

- express - Web framework
- @prisma/client - Database ORM
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- cors - CORS middleware
- helmet - Security headers
- express-async-errors - Async error handling

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure DATABASE_URL includes `?sslmode=require`
- Check security group allows connection
- Verify database is running

### Authentication Issues
- Ensure JWT_SECRET is set
- Check token format: `Bearer TOKEN`
- Verify token hasn't expired

## 📄 License

Proprietary - All rights reserved
