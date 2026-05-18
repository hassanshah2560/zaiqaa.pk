# Zaiqaa.pk - Restaurant Booking & Food Ordering App

A comprehensive mobile application for customers to book restaurants, order food, book rooms, chat with restaurants in real-time, track deliveries, and rate experiences. Built with React Native, Node.js, and Supabase.

## 🌟 Features

- **Restaurant Discovery**: Browse and search restaurants with filters
- **Food Ordering**: Browse menus, add items to cart, checkout
- **Room Booking**: Reserve restaurant rooms for events/gatherings
- **Real-time Chat**: Live messaging with restaurants
- **Live Tracking**: Track your order delivery in real-time
- **Ratings & Reviews**: Rate restaurants and food quality
- **User Authentication**: Secure signup, login, and password recovery
- **Order Management**: Accept/reject orders (restaurant side)
- **3D Animations**: Beautiful 3D animated UI components
- **Payment Integration**: Ready for Stripe/PayPal integration

## 🏗️ Project Structure

```
zaiqaa.pk/
├── backend/                    # Node.js Backend
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── socket/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── mobile/                     # React Native App
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── services/
│   │   ├── redux/
│   │   ├── assets/
│   │   └── styles/
│   ├── App.js
│   └── package.json
└── docs/                       # Documentation
```

## 🛠️ Tech Stack

- **Frontend**: React Native
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Socket.io
- **Authentication**: JWT + Supabase Auth
- **3D Graphics**: React Three Fiber
- **Storage**: Supabase Storage

## 📦 Installation

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm start
```

### Mobile App Setup
```bash
cd mobile
npm install
npx react-native run-android  # or run-ios
```

## 🔑 Environment Variables

See `.env.example` files in respective directories.

## 📚 API Documentation

API endpoints documented in `/docs/API.md`

## 🚀 Getting Started

1. Clone the repository
2. Set up Supabase project
3. Configure environment variables
4. Install dependencies
5. Run backend server
6. Run mobile app

## 📝 License

MIT

## 👨‍💻 Author

Hassan Shah

---

**Let's build Zaiqaa.pk together! 🚀**
