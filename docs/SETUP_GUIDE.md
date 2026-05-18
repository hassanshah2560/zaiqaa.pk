# Zaiqaa.pk - Setup Guide

## Prerequisites

- Node.js v14+ and npm v6+
- Supabase account (https://supabase.com)
- React Native development environment set up
- Android Studio (for Android development) or Xcode (for iOS development)

---

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Save your credentials:
   - Project URL
   - Anon Key
   - Service Key

### 1.2 Set Up Database Tables
1. Go to SQL Editor in Supabase
2. Copy the content from `backend/database/migrations.sql`
3. Paste and execute the SQL

### 1.3 Enable Authentication
1. In Supabase, go to Authentication settings
2. Enable Email authentication
3. Configure email templates if needed

---

## Step 2: Backend Setup

### 2.1 Install Dependencies
```bash
cd backend
npm install
```

### 2.2 Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 2.3 Start the Server
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

---

## Step 3: Mobile App Setup

### 3.1 Install Dependencies
```bash
cd mobile
npm install
```

### 3.2 Configure API URL
Create a `.env` file in the mobile directory:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_anon_key
```

### 3.3 Run on Android
```bash
npx react-native run-android
```

### 3.4 Run on iOS
```bash
npx react-native run-ios
```

### 3.5 Run on Web (Expo)
```bash
npm run web
```

---

## Step 4: Configure Payment Gateway (Optional)

### Stripe Integration
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys
3. Add to backend `.env`:
```
STRIPE_SECRET_KEY=your_secret_key
STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

---

## Step 5: Configure Email Service (Optional)

### Gmail SMTP
1. Enable 2-factor authentication on your Google account
2. Generate an App Password
3. Add to backend `.env`:
```
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

---

## Step 6: Deploy

### Deploy Backend (Heroku)
```bash
npm install -g heroku-cli
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy React Native App
Follow your app store's guidelines for iOS App Store and Google Play Store

---

## Troubleshooting

### Port Already in Use
```bash
lsof -i :5000
kill -9 <PID>
```

### Supabase Connection Error
- Check your URL and keys
- Ensure your Supabase project is active
- Check network connectivity

### React Native Build Issues
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# For Android
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

---

## Testing

### Test Backend APIs
```bash
npm test
```

### Test with Postman
Import the included Postman collection from `docs/Zaiqaa.postman_collection.json`

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | No (default: 5000) |
| NODE_ENV | Environment | No (default: development) |
| SUPABASE_URL | Supabase project URL | Yes |
| SUPABASE_KEY | Supabase anon key | Yes |
| SUPABASE_SERVICE_KEY | Supabase service key | Yes |
| JWT_SECRET | JWT signing secret | Yes |
| SMTP_HOST | Email server host | No |
| SMTP_PORT | Email server port | No |
| SMTP_USER | Email account | No |
| SMTP_PASSWORD | Email password | No |
| STRIPE_SECRET_KEY | Stripe secret key | No |
| STRIPE_PUBLISHABLE_KEY | Stripe publishable key | No |

---

## Next Steps

1. Create restaurant accounts
2. Add sample menu items
3. Test ordering flow
4. Set up live chat
5. Configure real-time tracking
6. Test room booking
7. Implement ratings system

---

For more help, check the README.md or visit our documentation site.
