# 🥗 FoodFlow - Food Bank Management System

A high-integrity, production-ready Food Bank Donation & Distribution Management System engineered with **Clean Architecture (Domain-Driven Design)**, **First-Expired-First-Out (FEFO) Inventory Allocation**, **Role-Based Access Control (RBAC)**, and **Multimodal AI Vision Manifest Processing**.

---

## 📋 Table of Contents
- [Executive Summary](#-executive-summary)
- [Tech Stack Overview](#-tech-stack-overview)
- [Architecture & Design Patterns](#-architecture--design-patterns)
- [Role-Based Workflows](#-role-based-workflows)
- [Key Engineering Implementations](#-key-engineering-implementations)
  - [1. Multimodal AI Manifest Parser](#1-multimodal-ai-manifest-parser)
  - [2. FEFO Allocation Engine](#2-fefo-allocation-engine)
  - [3. Atomic Inventory Reservation & Lot Audit Trail](#3-atomic-inventory-reservation--lot-audit-trail)
  - [4. Recipient Quota & Safety System](#4-recipient-quota--safety-system)
  - [5. Role-Based Access Control (RBAC)](#5-role-based-access-control-rbac)
- [Directory Structure](#-directory-structure)
- [Database Data Models](#-database-data-models)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Getting Started & Installation](#-getting-started--installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#-running-the-application)

---

## 📌 Executive Summary

**FoodFlow** solves critical supply chain and inventory management challenges faced by food banks and non-profit distribution centers:
* Minimizing food waste through automated expiration tracking and **FEFO (First-Expired-First-Out)** dispatching.
* Accelerating donor intake operations with **Google Gemini 1.5 Flash AI Vision** to automatically parse receipts, physical donation manifests, and unstructured food item lists.
* Preventing over-allocation and ensuring equitable distribution through **monthly recipient family/agency quota tracking**.
* Guaranteeing accountability and traceability with an **immutable Lot Event audit trail**.

---

## 🛠 Tech Stack Overview

### **Backend Core Architecture**
| Layer / Tech | Tool / Library | Version | Description |
| :--- | :--- | :--- | :--- |
| **Language** | TypeScript | `5.5.4` | Strictly typed runtime for full type safety across domain entities & API DTOs |
| **Runtime & Server** | Node.js / Express.js | `4.19.2` | Fast, lightweight RESTful web application framework |
| **Database & ODM** | MongoDB / Mongoose | `8.5.2` | Document database for flexible document schemas and strong indexing |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) | `9.0.2` | Secure stateless auth with bearer token validation |
| **Security** | `bcryptjs` | `2.4.3` | Salted password hashing for credentials protection |
| **AI Integration** | Google Generative AI (`@google/generative-ai`) | `0.24.1` | Gemini 1.5 Flash model for zero-shot text & image manifest parsing |
| **OCR Fallback** | Tesseract.js | `7.0.0` | Local Optical Character Recognition for raw image text extraction |
| **Development Tooling** | `ts-node-dev` | `2.0.0` | Auto-restarting development server for TypeScript |

### **Frontend User Interface**
| Layer / Tech | Tool / Library | Version | Description |
| :--- | :--- | :--- | :--- |
| **Framework** | React | `19.2.8` | Modern component-driven UI development with React 19 primitives |
| **Type System** | TypeScript | `6.0.2` | Shared interface definitions matching backend DTO schemas |
| **Build Tooling** | Vite | `8.2.0` | High-performance ES modules bundler and fast dev server |
| **State Management** | Redux Toolkit / React-Redux | `2.12.0` | Global state management for user sessions, auth state, and data slices |
| **Routing** | React Router DOM | `7.18.2` | Client-side route management with protected route guards |
| **HTTP Client** | Axios | `1.19.0` | Centralized HTTP client with automatic auth headers & response interceptors |
| **Icons & UI** | Lucide React | `1.31.0` | Modern SVG iconography system |
| **Styling** | Custom Vanilla CSS System | CSS3 | Responsive dark/light themed design system with glassmorphic cards & micro-animations |

---

## 🏗 Architecture & Design Patterns

FoodFlow Backend is structured following **Clean Architecture (Domain-Driven Design)** principles to enforce decoupling between enterprise business logic and external infrastructure/frameworks.

```
                          ┌──────────────────────────────────────┐
                          │         Frameworks & Drivers         │
                          │   Express, MongoDB, Gemini AI, Vite  │
                          └──────────────────┬───────────────────┘
                                             │
                                             ▼
                          ┌──────────────────────────────────────┐
                          │    Interface Adapters / Controllers  │
                          │    HTTP Handlers, DTOs, Presenters   │
                          └──────────────────┬───────────────────┘
                                             │
                                             ▼
                          ┌──────────────────────────────────────┐
                          │            Use Cases Layer           │
                          │ FEFO Allocation, Quotas, Intakes     │
                          └──────────────────┬───────────────────┘
                                             │
                                             ▼
                          ┌──────────────────────────────────────┐
                          │          Domain / Entities           │
                          │  Lot, Donation, User, Recipient,     │
                          │  Distribution, LotEvent (Pure TS)    │
                          └──────────────────────────────────────┘
```

### Key Architectural Layers:
1. **Domain Layer (`src/domain`)**: Contains pure domain entities (`User`, `Donation`, `Lot`, `Recipient`, `Distribution`, `LotEvent`) and repository interface definitions. Has **zero dependencies** on external libraries or frameworks.
2. **Use Case Layer (`src/useCase`)**: Houses single-responsibility business workflows (e.g., `CreateDonationUseCase`, `FefoAllocationUseCase`, `ProcessDistributionUseCase`, `ParseManifestUseCase`).
3. **Adapters Layer (`src/adapters`)**: Contains Express HTTP controllers, middleware functions (Auth, RBAC, Centralized Error Handling), and request/response DTO mappers.
4. **Framework Layer (`src/frameWork`)**: Infrastructure concerns including MongoDB schemas/models, Database connection, Gemini AI service implementations, and API routing.

---

## 👥 Role-Based Workflows

The application defines four distinct user roles, each tailored to specific operational requirements:

```
                  ┌──────────────────────────────────────────────┐
                  │                 FoodFlow App                 │
                  └──────┬───────────┬────────────┬──────────────┘
                         │           │            │
         ┌───────────────┘           │            └───────────────┐
         ▼                           ▼                            ▼
┌──────────────────┐       ┌──────────────────┐        ┌─────────────────────┐
│  Donation Clerk  │       │  Stock Manager   │        │ Handout Coordinator │
├──────────────────┤       ├──────────────────┤        ├─────────────────────┤
│ • Intake Food    │       │ • Track Lots     │        │ • Recipient Quotas  │
│ • AI Manifest    │       │ • Shelf Location │        │ • FEFO Preview      │
│ • Lot Generation │       │ • Status Update  │        │ • Stock Reservation │
└──────────────────┘       │ • Event History  │        │ • Distribution Exec │
                           └──────────────────┘        └─────────────────────┘
```

### 1. 🛡️ **System Administrator (`ADMIN`)**
* **User Management**: Create, edit, and manage staff accounts and roles.
* **System Operations**: Complete audit visibility over donations, inventory, distributions, and system activity logs.

### 2. 📦 **Donation Clerk (`DONATION_CLERK`)**
* **Intake Processing**: Record donor details (Individual, Corporate, Partner Food Drives).
* **AI Manifest Extraction**: Extract food items, categories, item counts, and expiration dates from text or image uploads.
* **Human Verification**: Review and refine AI-extracted item lists before generating trackable Inventory Lots.

### 3. 🏬 **Stock Manager (`STOCK_MANAGER`)**
* **Inventory Tracking**: Monitor stock statuses (`AVAILABLE`, `RESERVED`, `DISCARDED`, `EXPIRED`).
* **Shelf Location Management**: Assign precise physical aisle/shelf locations to lots.
* **Lifecycle Audit**: Review immutable `LotEvent` history (creation, status changes, quantity deductions).

### 4. 🤝 **Handout Coordinator (`HANDOUT_COORDINATOR`)**
* **Recipient Management**: Register & manage recipient profiles (Families & Partner Agencies).
* **Quota Safety Enforcement**: Automatic check against monthly package limits per family/agency.
* **FEFO Auto-Fulfillment**: Request intelligent FEFO stock allocations for distribution requests.
* **Atomic Distribution**: Reserve inventory lots and finalize distribution with dynamic stock deduction.

---

## ⚙️ Key Engineering Implementations

### 1. Multimodal AI Manifest Parser
* **Engine**: Google Gemini 1.5 Flash (`@google/generative-ai`) with **Tesseract.js OCR fallback**.
* **Capability**: Processes unstructured text manifests as well as images/photos of donation papers, delivery receipts, and invoices up to **50MB**.
* **Safety & Control**: AI acts purely as an extraction assistant. Physical creation of database records requires explicit human review and confirmation by the Donation Clerk.

### 2. FEFO Allocation Engine
* **Strategy**: First-Expired-First-Out algorithm.
* **Mechanism**:
  1. Queries all non-expired, `AVAILABLE` inventory lots matching required food categories.
  2. Sorts candidate lots in strictly ascending order of `expirationDate`.
  3. Fulfills requested category quantities iteratively across eligible lots.
  4. Returns allocation previews before committing any inventory state changes.

### 3. Atomic Inventory Reservation & Lot Audit Trail
* **State Safety**: Prevents race conditions during simultaneous distributions by temporarily transitioning candidate lots into `RESERVED` status.
* **Auditability**: Every quantity change, status update, or distribution step logs a permanent `LotEvent` document containing `lotId`, `eventType`, `quantityChanged`, `performedBy`, and `timestamp`.

### 4. Recipient Quota & Safety System
* Enforces strict monthly distribution limits per recipient to prevent over-allocation and ensure fair community distribution.
* Calculates active distributions in the current calendar month and dynamically blocks allocations exceeding allowable quotas.

### 5. Role-Based Access Control (RBAC)
* Features separate login portals for **Admin** (`/login/admin`) and **Operational Staff** (`/login/staff`).
* Express route middleware (`authenticateJwt`, `authorizeRoles`) validates JWT tokens and restricts access to privileged endpoints based on assigned user roles.

---

## 📂 Directory Structure

```
FoodFlow/
├── Backend/
│   ├── src/
│   │   ├── domain/               # Core Domain Layer
│   │   │   ├── entities/         # User, Donation, Lot, Recipient, Distribution, LotEvent
│   │   │   └── interface/        # Repository Interfaces & DTOs
│   │   ├── useCase/              # Business Logic Layer
│   │   │   ├── ai/               # Manifest Parsing Use Cases
│   │   │   ├── auth/             # Authentication & User Management
│   │   │   ├── donation/         # Intake & Lot Creation
│   │   │   ├── lot/              # Inventory & Event Tracking
│   │   │   ├── recipient/        # Quota Validation
│   │   │   └── distribution/     # FEFO Engine & Reservation
│   │   ├── adapters/             # Interface Adapters
│   │   │   ├── controllers/      # Express Controllers
│   │   │   └── middlewares/      # Auth, RBAC, Error Handler
│   │   └── frameWork/            # Infrastructure Layer
│   │       ├── database/         # Mongoose Models & Connection
│   │       ├── routes/           # Express Route Definitions
│   │       └── services/         # Gemini AI & Tesseract Services
│   ├── .env                      # Environment Variables Config
│   ├── package.json
│   └── tsconfig.json
│
└── Frontend/
    ├── src/
    │   ├── app/                  # Redux Store Configuration
    │   ├── components/           # Reusable UI Components & Layouts
    │   ├── features/             # Redux Slices (Auth, Lots, Donations, Distributions)
    │   ├── pages/                # Route Page Views (Auth, Admin, Clerk, Manager, Coordinator)
    │   ├── services/             # Axios API Client Interceptors
    │   ├── types/                # Frontend TypeScript Interfaces
    │   ├── App.tsx               # Routing & Protected Guards
    │   └── index.css             # Glassmorphic Design System & Global Styles
    ├── package.json
    └── vite.config.ts
```

---

## 🗄️ Database Data Models

### **User**
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier |
| `name` | String | User full name |
| `email` | String | Unique email address |
| `password` | String | Bcrypt hashed password |
| `role` | String | `ADMIN` \| `DONATION_CLERK` \| `STOCK_MANAGER` \| `HANDOUT_COORDINATOR` |
| `createdAt` | Date | Record creation timestamp |

### **Donation**
| Field | Type | Description |
| :--- | :--- | :--- |
| `donorName` | String | Name of individual or corporate donor |
| `donorType` | String | `INDIVIDUAL` \| `CORPORATE` \| `ORGANIZATION` |
| `intakeDate` | Date | Date donation was received |
| `receivedBy` | ObjectId | Reference to `User` (Donation Clerk) |
| `items` | Array | Items list containing name, quantity, category, expiration |

### **Lot**
| Field | Type | Description |
| :--- | :--- | :--- |
| `lotCode` | String | Unique barcode/serial tracking code |
| `donationId` | ObjectId | Reference to originating `Donation` |
| `itemName` | String | Name of food item |
| `category` | String | Food category (e.g., Canned Goods, Produce, Dairy) |
| `quantity` | Number | Current available quantity |
| `expirationDate`| Date | Item expiry date (used for FEFO sorting) |
| `status` | String | `AVAILABLE` \| `RESERVED` \| `DISTRIBUTED` \| `DISCARDED` \| `EXPIRED` |
| `shelfLocation` | String | Physical warehouse aisle/rack location |

### **Recipient**
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Recipient family or agency name |
| `type` | String | `FAMILY` \| `AGENCY` |
| `familyMembers` | Number | Number of individuals in family household |
| `monthlyQuota` | Number | Maximum allowed packages per month |

---

## 📡 API Endpoints Reference

### 🔑 Authentication (`/api/auth`)
* `POST /api/auth/register-admin` - Seed/register administrative accounts
* `POST /api/auth/login` - User login (returns JWT token and user profile)
* `GET /api/auth/profile` - Retrieve current authenticated user profile
* `GET /api/auth/users` - List all system users (*Admin only*)

### 📦 Donations & AI Manifest (`/api/donations`, `/api/ai`)
* `POST /api/donations` - Create new donation intake and generate lots
* `GET /api/donations` - List all recorded donations
* `GET /api/donations/:id` - Fetch donation details and associated inventory lots
* `POST /api/ai/parse-manifest-text` - Parse unstructured text manifest via Gemini AI
* `POST /api/ai/parse-manifest-image` - Parse image/photo manifest via Gemini Vision / OCR

### 🏬 Inventory & Lots (`/api/lots`)
* `GET /api/lots` - List inventory lots (with status, category, search filters)
* `PATCH /api/lots/:id/status` - Update lot status or shelf location
* `GET /api/lots/:id/events` - Retrieve immutable event history for a lot

### 🤝 Recipients & Distributions (`/api/recipients`, `/api/distributions`)
* `GET /api/recipients` - List all registered recipients
* `POST /api/recipients` - Register a new recipient profile
* `POST /api/distributions/preview` - Generate FEFO allocation preview for a request
* `POST /api/distributions/confirm` - Atomically reserve stock and execute distribution

---

## 🚀 Getting Started & Installation

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher
* **MongoDB**: Active local instance or MongoDB Atlas URI
* **Google Gemini API Key**: (Optional for AI Manifest Parsing)

---

### Backend Setup

1. **Navigate to the Backend directory**:
   ```bash
   cd Backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the `Backend/` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/foodflow
   JWT_SECRET=your_super_secret_jwt_key_here
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Start the backend development server**:
   ```bash
   npm run dev
   ```
   *The backend will start on `http://localhost:5000` with API health check available at `/health`.*

---

### Frontend Setup

1. **Navigate to the Frontend directory**:
   ```bash
   cd Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the frontend development server**:
   ```bash
   npm run dev
   ```
   *Vite will start the application at `http://localhost:5173`.*

---

## 🏃 Running the Application

To run the entire system locally:

1. **Backend**:
   ```bash
   cd Backend && npm run dev
   ```
2. **Frontend**:
   ```bash
   cd Frontend && npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`.

---

## 📄 License
This project is licensed under the ISC License.
