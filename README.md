# NESTIFY

A full-stack real estate mobile application built for the Moroccan property market. Users can browse, search, filter, and list properties for sale or rent, communicate with property owners via real-time messaging, view properties on an interactive map, and manage their account with enterprise-grade security features.

> Built by **MATRIX**

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Authentication & Security](#authentication--security)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Methods & Architecture](#methods--architecture)

---

## Tech Stack

### Mobile (Frontend)

| Category | Technology |
|---|---|
| Framework | React Native 0.79.6 |
| SDK | Expo SDK 53 |
| Router | Expo Router 5 (file-based routing) |
| State Management | React Context API (AuthContext, ThemeContext) |
| Navigation | Drawer + Bottom Tabs + Stack |
| HTTP Client | Axios |
| Maps | react-native-maps (Google Maps) |
| UI Components | React Native Paper, React Native Element Dropdown |
| Animations | React Native Reanimated |
| Token Storage | expo-secure-store |
| Theme Persistence | @react-native-async-storage/async-storage |
| QR Code | react-native-qrcode-svg |
| Clipboard | expo-clipboard |
| Image Handling | expo-image-picker, expo-document-picker |
| Location | expo-location |
| Date Formatting | date-fns |
| Language | TypeScript / JavaScript (JSX) |

### Backend

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js (ES Modules) |
| Database | PostgreSQL (Neon Serverless) |
| Authentication | JWT (jsonwebtoken), bcryptjs |
| Email Service | Nodemailer (Gmail SMTP) |
| File Uploads | Multer (disk storage, 10MB limit) |
| 2FA | speakeasy (TOTP), qrcode |
| Rate Limiting | Upstash Redis (configurable) |

---

## Project Structure

```
mobile-project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # Neon PostgreSQL connection & table initialization
│   │   │   └── upstash.js         # Upstash Redis rate limiter config
│   │   ├── controllers/
│   │   │   ├── authController.js       # Register, login, profile, email verification
│   │   │   ├── twoFactorController.js  # 2FA generate, verify, disable, recovery codes
│   │   │   ├── usersController.js      # User CRUD, profile photo upload, password change
│   │   │   ├── propertiesController.js # Property CRUD, media, features management
│   │   │   ├── categoriesController.js # Category CRUD with image upload
│   │   │   ├── featuresController.js   # Feature CRUD (amenities)
│   │   │   ├── messagesController.js   # Messaging system
│   │   │   └── activitiesController.js # Notifications & activity feed
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # JWT verification & admin role guard
│   │   │   ├── rateLimiter.js       # Upstash sliding window rate limiter
│   │   │   └── uploadMiddleware.js  # Multer config (JPEG/JPG/PNG, 10MB max)
│   │   ├── routes/
│   │   │   ├── authRoute.js
│   │   │   ├── usersRoute.js
│   │   │   ├── propertiesRoute.js
│   │   │   ├── categoriesRoute.js
│   │   │   ├── featuresRoute.js
│   │   │   ├── messagesRoute.js
│   │   │   └── activitiesRoute.js
│   │   ├── utils/
│   │   │   └── emailService.js    # Nodemailer Gmail SMTP transporter
│   │   ├── uploads/               # Uploaded profile photos & media
│   │   └── server.js              # Express app entry point
│   ├── .env
│   └── package.json
│
├── mobile/
│   ├── app/                        # Expo Router file-based routes
│   │   ├── _layout.jsx            # Root layout (ThemeProvider > AuthProvider)
│   │   ├── (auth)/                 # Auth screens (sign-in, sign-up)
│   │   │   ├── _layout.jsx
│   │   │   ├── sign-in.jsx
│   │   │   └── sign-up.jsx
│   │   ├── (drawer)/              # Main app drawer
│   │   │   ├── _layout.jsx        # Drawer navigator with custom content
│   │   │   ├── (tabs)/            # Bottom tab navigator
│   │   │   │   ├── _layout.jsx    # 5 tabs: Home, Search, Add, Maps, Inbox
│   │   │   │   ├── index.jsx      # Home screen
│   │   │   │   ├── search.jsx     # Search by city/category
│   │   │   │   ├── adding.jsx     # Add property (3-step form)
│   │   │   │   ├── maps.jsx       # Interactive Google Maps
│   │   │   │   └── inbox.jsx      # Activity center (messages, alerts, tasks)
│   │   │   ├── profile.jsx
│   │   │   ├── verification.jsx   # Email verification (6-digit OTP)
│   │   │   ├── authenticator.jsx  # 2FA setup with QR code
│   │   │   ├── settings.jsx
│   │   │   ├── theme.jsx          # Theme picker (4 color schemes)
│   │   │   ├── about.jsx
│   │   │   └── help.jsx
│   │   ├── property-details/
│   │   │   └── [property_id].jsx  # Property detail with gallery & owner card
│   │   ├── city/
│   │   │   └── [city].jsx         # Properties filtered by city
│   │   ├── category-details/
│   │   │   └── [category_id].jsx  # Properties filtered by category
│   │   ├── chat/
│   │   │   └── [userId].jsx       # Direct messaging
│   │   └── settingsScreen/
│   │       ├── editprofile.jsx
│   │       └── Changepassword.jsx
│   ├── components/                 # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── PropertiesForSale.jsx
│   │   ├── PropertiesForRent.jsx
│   │   ├── CategoriesList.jsx
│   │   ├── CityButtons.jsx
│   │   ├── AgentProfileCard.jsx
│   │   ├── AddPropertyScreen.jsx
│   │   ├── FilterModal.jsx
│   │   ├── ActivityItem.jsx
│   │   └── CustomTabs.jsx
│   ├── context/
│   │   ├── AuthContext.js          # Auth state, token management, sign in/out
│   │   └── ThemeContext.js         # Theme state with AsyncStorage persistence
│   ├── hooks/
│   │   ├── useProperties.js
│   │   ├── usePropertyDetails.js
│   │   ├── useUniqueCities.js
│   │   ├── useAllCategories.js
│   │   ├── useLimitedCategories.js
│   │   ├── useCategoryProperties.js
│   │   └── useActivities.js
│   ├── constants/
│   │   ├── colors.js              # 4 theme palettes
│   │   └── mapStyle.js            # Dark mode Google Maps style
│   ├── utils/
│   │   └── formatPrice.js         # Price formatting (MAD, K/M notation)
│   ├── config.js                  # API base URL
│   ├── app.json
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

---

## Features

### Authentication & Security
- **User Registration & Login** with JWT (1-day token expiry)
- **Email Verification** via 6-digit OTP code sent through Gmail SMTP (expires in 10 minutes)
- **Two-Factor Authentication (TOTP)** with QR code scanning, manual secret entry, and 10 recovery codes
- **Password Change** with current password confirmation
- **Role-Based Access Control** (admin, agent, owner, client)
- **Secure Token Storage** using expo-secure-store
- **Profile Photo Upload** via multipart/form-data

### Property Management
- **Property Listing** with multi-image upload (up to 10 images per property)
- **Property Details** with image gallery (autoplay swiper, full-screen zoom viewer)
- **Category System** (16 categories: Houses, Villas, Castles, Apartments, Riads, Studios, Offices, Commercials, Land Plots, Townhouses, Farmhouses, Penthouses, Retail Spaces, Warehouses, Industrials, Kasbahs)
- **Feature/Amenity Tags** (18 features: pool, terrace, garden, balcony, AC, heater, chimney, hammam, sauna, jacuzzi, fiber internet, security, elevator, garage, parking, Moroccan style, furnished, renovation)
- **Primary Image Selection** with transactional toggle
- **Media Management** (upload, delete, set primary)

### Search & Discovery
- **Search by City** with major Moroccan cities highlighted (Marrakech, Casablanca, Rabat, Fez, Tangier, Agadir, Meknes, Tetouan)
- **Search by Category** with icon-based grid
- **Filter Modal** with deal type (Sale/Rent) and price sorting (Low/High)
- **Home Screen** with horizontal carousels: Categories, Properties For Sale, Properties For Rent

### Interactive Maps
- **Google Maps Integration** with property markers
- **My Location** button with GPS positioning
- **Property Preview Cards** on marker tap with slide-in animation
- **Dark Mode Map Styling** for dark theme

### Messaging & Notifications
- **Direct Messaging** between users (inbox with latest messages per conversation)
- **Activity Center** with three tabs: Messages, Alerts, Tasks
- **Activity Types**: new messages, price drops, listing matches, visit requests, profile completion tasks, weekly reports

### UI/UX
- **4 Color Themes**: Coffee Vibe (brown), Forest Fresh (green), Purple Dream (purple), Ocean Breeze (blue)
- **Theme Persistence** across app sessions
- **Dark Mode** support with adaptive StatusBar and map styling
- **Drawer Navigation** with user profile header and logout
- **Animated Transitions** using Reanimated (FadeInUp, FadeInRight, springify)
- **Responsive Layouts** with SafeAreaView and keyboard-aware scrolling
- **Native Share** integration for sharing properties
- **Password Visibility Toggle** on all password fields

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login and receive JWT |
| GET | `/profile` | Protected | Get current user profile |
| POST | `/send-verification` | Protected | Send 6-digit email verification code |
| POST | `/verify-code` | Protected | Verify email OTP code |
| POST | `/2fa/generate` | Protected | Generate 2FA TOTP secret + QR URL |
| POST | `/2fa/verify` | Protected | Verify TOTP code and enable 2FA |
| POST | `/2fa/disable` | Protected | Disable 2FA (requires password) |
| GET | `/2fa/recovery-codes` | Protected | Get unused recovery codes |

### Users (`/api/users`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Admin | Get all users |
| POST | `/` | Admin | Create user |
| GET | `/:id` | Protected | Get user by ID |
| PUT | `/:id` | Protected | Update profile (name + photo) |
| DELETE | `/:id` | Admin | Delete user |
| POST | `/change-password` | Protected | Change own password |

### Properties (`/api/properties`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | Get all properties (filterable by purpose, city, category_id, limit) |
| GET | `/cities` | Public | Get all unique city names |
| GET | `/:id` | Public | Get property with media, features, and owner |
| POST | `/` | Protected | Create new property |
| PUT | `/:id` | Protected | Update property (owner only) |
| DELETE | `/:id` | Protected | Delete property (owner only) |
| POST | `/:propertyId/features/:featureId` | Protected | Add feature to property |
| DELETE | `/:propertyId/features/:featureId` | Protected | Remove feature from property |
| POST | `/:propertyId/media` | Protected | Upload up to 10 images |
| DELETE | `/media/:mediaId` | Protected | Delete media item |
| PUT | `/media/:mediaId/set-primary` | Protected | Set media as primary image |

### Categories (`/api/categories`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | Get all categories (supports `?limit=N`) |
| GET | `/:id` | Public | Get category by ID |
| POST | `/` | Admin | Create category with image |
| PUT | `/:id` | Admin | Update category |
| DELETE | `/:id` | Admin | Delete category |

### Features (`/api/features`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | Get all features |
| GET | `/:id` | Public | Get feature by ID |
| POST | `/` | Admin | Create feature |
| PUT | `/:id` | Admin | Update feature |
| DELETE | `/:id` | Admin | Delete feature |

### Messages (`/api/messages`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Protected | Send a message |
| GET | `/inbox` | Protected | Get latest message per conversation |
| GET | `/conversation/:otherUserId` | Protected | Get full conversation |

### Activities (`/api/activities`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Protected | Get all user activities |
| PUT | `/mark-all-as-read` | Protected | Mark all as read |
| PUT | `/:id/read` | Protected | Mark single activity as read |
| DELETE | `/:id` | Protected | Delete activity |

---

## Database Schema

### ER Diagram Overview

```
users (1) ──< properties (many)         [owner_id]
users (1) ──< messages (many)           [sender_id, receiver_id]
users (1) ──< activities (many)         [user_id]
users (1) ──< recovery_codes (many)     [user_id]
properties (1) ──< property_media (many)    [property_id]
properties (many) >──< features (many)      [via property_features junction table]
categories (1) ──< properties (many)        [category_id]
```

### Tables

**users** - User accounts with authentication data
| Column | Type | Notes |
|---|---|---|
| user_id | SERIAL PK | |
| name | VARCHAR(100) | |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| password | TEXT | bcrypt hashed |
| role | VARCHAR(50) | admin, agent, owner, client |
| profile_photo | TEXT | File path |
| verification_code | TEXT | 6-digit OTP |
| verification_code_expires_at | TIMESTAMP | 10 min expiry |
| is_verified | BOOLEAN | Email verification status |
| two_factor_secret | TEXT | TOTP base32 secret |
| two_factor_enabled | BOOLEAN | 2FA status |

**properties** - Property listings
| Column | Type | Notes |
|---|---|---|
| property_id | SERIAL PK | |
| title | VARCHAR(255) | |
| description | TEXT | |
| typeaddress | TEXT | |
| city | VARCHAR(100) | |
| region | VARCHAR(100) | |
| country | VARCHAR(100) | |
| latitude | DECIMAL(9,6) | |
| longitude | DECIMAL(9,6) | |
| price | DECIMAL(12,2) | In MAD |
| status | VARCHAR(50) | |
| purpose | VARCHAR(50) | sale / rent |
| area_meters | INTEGER | |
| number_of_rooms | INTEGER | |
| bathrooms | INTEGER | |
| construction_year | INTEGER | |
| owner_id | INT FK | References users |
| category_id | INT FK | References categories |

**categories** - Property categories (16 types)

**features** - Amenity/feature definitions (18 types)

**property_features** - Junction table (property_id, features_id)

**property_media** - Uploaded images per property (file_url, media_type, is_primary)

**messages** - Direct messages between users (sender_id, receiver_id, text, read)

**activities** - Notification feed (type, content_key, content_params JSONB, is_read)

**recovery_codes** - 2FA backup codes (XXXX-XXXX format, is_used flag)

---

## Authentication & Security

### JWT Authentication
- Tokens issued on login/register with 1-day expiry
- Payload: `{ id: user_id, role: user_role }`
- Sent via `Authorization: Bearer <token>` header
- Verified by `protect` middleware on all protected routes

### Email Verification
- 6-digit numeric code generated server-side
- Sent via Gmail SMTP (Nodemailer)
- Expires after 10 minutes
- Sets `is_verified = TRUE` on successful verification

### Two-Factor Authentication (TOTP)
- Uses speakeasy library for TOTP secret generation
- App identifier: `NESTIFY ({email})`
- QR code URL returned to frontend for rendering
- Verification window: +/- 1 time step (30 seconds)
- 10 recovery codes generated on enable (format: `XXXX-XXXX`)
- Requires password confirmation to disable

### Password Security
- Hashed with bcryptjs (10 salt rounds)
- Password change requires current password verification

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone (or Android/iOS simulator)
- Neon PostgreSQL database (or any PostgreSQL instance)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/mobile-project.git
cd mobile-project
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env   # Configure your environment variables
npm start              # Runs on http://localhost:5002
```

3. **Setup Mobile**
```bash
cd mobile
npm install
cp .env.example .env   # Configure Clerk publishable key
npx expo start         # Scan QR code with Expo Go
```

### Database

The database tables are automatically created on first server startup via `CREATE TABLE IF NOT EXISTS` statements. No manual migration is needed.

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5002
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=your_jwt_secret_key
UPSTASH_REDIS_REST_URL=https://your-upstash-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
BASE_URL=http://your-ip:5002
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
```

### Mobile (`mobile/.env`)

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

---

## Methods & Architecture

### Backend Architecture

**Express.js with ES Modules** - The backend uses a layered architecture:

- **Routes** define endpoints and apply middleware (auth guards, file upload)
- **Controllers** contain business logic and handle request/response
- **Middleware** handles cross-cutting concerns (JWT verification, role checks, rate limiting, file uploads)
- **Config** manages database connections and external service clients
- **Utils** provide reusable utilities (email transporter)

**Database** uses Neon Serverless driver with tagged template literals for parameterized queries (preventing SQL injection):
```javascript
await sql`SELECT * FROM users WHERE email = ${email}`;
```

**File Uploads** use Multer with disk storage, constrained to JPEG/JPG/PNG with a 10MB max size. Files are stored in `src/uploads/` and served statically.

### Frontend Architecture

**Expo Router (File-Based Routing)** - Screen hierarchy is defined by the filesystem:

```
app/_layout.jsx          → Root: ThemeProvider > AuthProvider
app/(auth)/_layout.jsx   → Auth stack (sign-in, sign-up)
app/(drawer)/_layout.jsx → Drawer navigator
app/(drawer)/(tabs)/     → Bottom tab navigator (5 tabs)
```

**Context API for State Management**:
- `AuthContext` - Manages user state, JWT token, sign in/out, profile updates. Token persisted in expo-secure-store for session continuity.
- `ThemeContext` - Manages active color theme (4 options), persisted in AsyncStorage.

**Custom Hooks** abstract API calls and data fetching:
- `useProperties(filters)` - Fetches property listings with optional query params
- `usePropertyDetails(id)` - Fetches single property with media, features, owner
- `useUniqueCities()` - Fetches and categorizes cities (major vs. other)
- `useAllCategories()` / `useLimitedCategories()` - Category data
- `useActivities()` - Notification/activity feed

**Performance Optimizations**:
- `React.memo` on property cards to prevent unnecessary re-renders
- `initialNumToRender`, `maxToRenderPerBatch`, and `windowSize` on FlatLists
- Reanimated animations offloaded to native thread
- Lazy component mounting with conditional rendering

**Token Management Flow**:
1. On login/register: token stored in SecureStore and set as Axios default header
2. On app launch: AuthContext reads token from SecureStore, calls `/api/auth/profile` to restore session
3. On logout: token cleared from SecureStore, Axios header removed, user state reset

### Security Methods

| Method | Implementation |
|---|---|
| Password Hashing | bcryptjs with 10 salt rounds |
| JWT Auth | Bearer token in Authorization header, 1-day expiry |
| Email Verification | Time-limited 6-digit OTP (10 min) |
| 2FA | TOTP standard (Google Authenticator compatible) |
| Role Guards | `protect` + `admin` middleware chain |
| Rate Limiting | Upstash Redis sliding window (3 req/10s) |
| File Validation | Multer fileFilter (JPEG/JPG/PNG only, 10MB max) |
| SQL Injection Prevention | Neon tagged template literals (parameterized queries) |
| CORS | Enabled with `cors` middleware |

---

## License

ISC

---

**NESTIFY** - Built by **MATRIX**
