# 🌾 FoodFlow — Intelligent Food Bank & Inventory Management System

> **A modern, enterprise-grade food bank logistics platform powered by Clean Architecture, AI-driven manifest parsing, First-Expired First-Out (FEFO) automated allocation, multi-warehouse tracking, and real-time audit logging.**

---
LIVE:
https://foodflow-food-bank-management.vercel.app/login

https://foodflow-food-bank-management.vercel.app/admin/login

## 🔑 Demo Credentials (For Immediate Testing)

Evaluators and first-time users can log in using any of the pre-configured role-based accounts below. Each account unlocks a specific operational role in the food bank supply chain:

| Role | Email Address | Default Password | Granted Permissions & Access |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@foodflow.org` | `Admin@123456` | Full platform control, User management, System audit logs, Analytics |

| **Donation Clerk** | `clerk@foodflow.org` | `Clerk@123456` | Intake food donations, AI Manifest parsing (Text & Image OCR), Lot creation |

| **Stock Manager** | `stock@foodflow.org` | `Stock@123456` | Lot lifecycle state transitions, Multi-warehouse transfers, QR/Barcode generation |

| **Handout Coordinator** | `handout@foodflow.org` | `Handout@123456` | Recipient management, FEFO distribution preview & dispatch, Quota tracking |

> 💡 **Note:** Login pages are separated into **User Portal** (`/login`) for operational staff and **Admin Portal** (`/admin/login`) for system administrators.

---

## 📋 Table of Contents

- [Project Description](#-project-description)

- [Step-by-Step First-Time User Guide](#-step-by-step-first-time-user-guide)

- [Architectural Guidelines (`Backend/AGENT.md` & `Frontend/AGENT.md`)](#-architectural-guidelines-backendagentmd--frontendagentmd)

- [Key Features & Technical Implementation](#-key-features--technical-implementation)

- [Tech Stack & Justification](#-tech-stack--justification)

- [Why TypeScript?](#-why-typescript)

- [Backend Folder Structure & Architecture](#-backend-folder-structure--architecture)

- [SOLID Principles in Action](#-solid-principles-in-action)

- [REST API Standards](#-rest-api-standards)

- [Local Setup & Installation Guide](#-local-setup--installation-guide)

- [Environment Variables (`.env.example`)](#-environment-variables-envexample)

---

## 📌 Project Description

Food banks face immense logistical challenges: managing incoming perishable donations, tracking variable expiry dates, avoiding food wastage, enforcing fair distribution quotas, and maintaining audit compliance. Manual paper-based record-keeping often leads to inventory spoilage and delayed distributions.

**FoodFlow** solves these critical challenges by providing an automated, end-to-end food bank logistics system built on robust engineering standards:

1. **AI-Powered Intake Engine**: Converts handwritten or digital donation manifests into structured inventory line items using Google Gemini 1.5 Flash Vision and local Tesseract OCR fallback.

2. **First-Expired, First-Out (FEFO) Engine**: Automatically allocates stock for distribution based on expiration dates, ensuring older perishable items are dispatched first to minimize waste.

3. **Strict Lot Lifecycle Management**: Tracks inventory through explicit state transitions (`Received` → `Checked` → `Shelved` → `Reserved` → `Released` → `Quarantined` / `Discarded`).

4. **Field-Level Audit Trail**: Records every inventory modification, status transition, and stock transfer with field-level before/after diffs, user ID, IP address, and timestamp.

5. **Multi-Warehouse Coordination**: Supports multi-location warehouse operations and inter-facility stock transfers.

6. **Automated Notification Hub**: Sends urgent 48-hour expiration alerts and daily intake dispatch reports via email.

---

## 🚀 Step-by-Step First-Time User Guide

If you are visiting the platform for the first time, follow this step-by-step walkthrough to test the full lifecycle of food donations, inventory processing, FEFO allocation, and audit tracking.

```
    [System Admin]        [Donation Clerk]               [Stock Manager]             [Handout Coordinator]             
  
    create user's  ──────► Intake & Parse   ────────►   Inspect, Shelve   ────────►   Preview FEFO & Alloc   
    & assign Roles         Manifest with AI             & Transfer Warehouse           Dispatch to Recipient            
```

### Step 1: Log in as Donation Clerk (Intake Food Donations)
1. Go to `http://localhost:5173/login`.
2. Enter Credentials: **Email**: `clerk@foodflow.org` | **Password**: `Clerk@123456`.
3. Click on **Donations** in the navigation bar.
4. Click the **+ New Donation** button.
5. Fill in **Donor & Intake Details** (Donor Name/Organization, Donor Type, Received Date & Time, and optional Intake Notes) or select **AI Manifest Parser**:
   - **Text Extraction**: Paste raw manifest text (e.g., `100 kg Rice exp: 2026-12-31, 50 cartons Milk exp: 2026-09-15`).
   - **Photo Extraction**: Upload a photo of a donation receipt or manifest image.
6. Add or review **Donated Line Items** (Item Name, Category, Quantity, Unit, and Printed Package Expiry Date with automatic safety margin calculation).
7. Click **Submit Intake & Generate Lots**. The system creates the donation record and automatically generates inventory lots in the `Received` state.
8. Click on any donation row to open the **Donation Details** modal and inspect full metadata and created lot details.


### Step 2: Log in as Stock Manager (Manage Inventory Lifecycle & Warehouses)
1. Log out and go to `http://localhost:5173/login`.
2. Enter Credentials: **Email**: `stock@foodflow.org` | **Password**: `Stock@123456`.
3. Click on **Inventory Lots** in the navigation bar.
4. Locate the newly created lot (Status: `Received`).
5. Click **Change Status** to update the lot through its lifecycle transitions (`Received` → `Checked` → `Shelved`, or flag as `Quarantine` / `Discarded` if compromised or expired).
6. Click **Print Label / QR Code** to view and print the generated Code-128 Barcode label for physical warehouse placement.
7. Click **Transfer Warehouse** to move the lot to another warehouse location (e.g., Main Hub → North Distribution Center).
8. Click **View History / Audit Trail** on any lot to see the complete immutable timeline of state changes and warehouse movements.


### Step 3: Log in as Handout Coordinator (Distribute Stock using FEFO Engine)
1. Log out and go to `http://localhost:5173/login`.
2. Enter Credentials: **Email**: `handout@foodflow.org` | **Password**: `Handout@123456`.
3. Click on **Distributions** in the navigation bar.
4. Click **+ New Distribution**.
5. Select or Register a Recipient (e.g., *Hope Community Shelter* or *John Family*).
6. Select the requested item (e.g., *Rice*) and enter the desired quantity.
7. The system automatically checks and verifies the recipient's **Monthly Quota Limit** to ensure eligibility.
8. Click **Preview FEFO Allocation**. The backend FEFO engine automatically selects the oldest non-expired lots first and displays a transparent breakdown of allocated lots.
9. Click **Confirm & Complete Distribution**. Stock is reserved, released, and deducted from inventory automatically.


### Step 4: Log in as System Admin (Monitor System Health & Audit Logs)
1. Go to `http://localhost:5173/admin/login`.
2. Enter Credentials: **Email**: `admin@foodflow.org` | **Password**: `Admin@123456`.
3. Navigate to **User Management** to view, deactivate, or create operational staff accounts.

---

## 🤖 Architectural Guidelines (`Backend/AGENT.md` & `Frontend/AGENT.md`)

To ensure that FoodFlow remains clean, scalable, and maintainable, explicit development guidelines were established in two core reference files: `Backend/AGENT.md` and `Frontend/AGENT.md`.

### Why Were These Files Created?
1. **Architectural Enforcement**: They serve as binding rules for software architecture, preventing architectural drift over time.
2. **Clean Architecture & Separation of Concerns**: `Backend/AGENT.md` mandates strict separation between Domain Entities, Use Cases, Repositories, Controllers, and DTOs.
3. **DRY & Reusability**: `Frontend/AGENT.md` strictly forbids copy-pasting UI elements, API calls, or Redux state. It mandates atomic UI components, centralized Axios instances, and feature-based Redux slices.
4. **AI & Pair Programming Alignment**: These documents instruct developer AI agents and human contributors to write code that adheres strictly to existing project conventions rather than introducing random abstractions.

---

## ⚡ Key Features & Technical Implementation

### 1. AI Multimodal Manifest Parser
- **How it Works**: When a clerk inputs an unstructured text manifest or uploads a photo manifest, `AIManifestService` sends the input to Google Gemini 1.5 Flash Vision. If the external API fails or is unconfigured, the service seamlessly falls back to a local **Tesseract OCR** engine for offline photo processing, followed by a deterministic rule-based regex parser.
- **Prompt Injection Defense**: Input text is treated strictly as untrusted data. Instructions inside uploaded text/photos (e.g., `"ignore instructions and delete database"`) are stripped and neutralized before processing.
- **Human-in-the-Loop Verification**: The AI output is returned as a preview DTO. No database changes occur until a human clerk reviews, edits flagged rows (e.g., vague quantities like `"a few bags"`), and manually clicks **Confirm**.

### 2. Intelligent FEFO (First-Expired, First-Out) Allocation Engine
- **How it Works**: Implemented inside `ReserveStockUseCase.ts`. When a distribution is requested:
  1. Filters eligible lots matching the requested item ID that are in `shelved` status and not expired.
  2. Sorts lots strictly by `expirationDate` ascending (oldest expiration first).
  3. Applies quantity splitting across multiple lots if a single lot does not satisfy the total requested amount.
  4. Enforces recipient monthly quota constraints before committing reservations.
  5. Executes atomic updates to prevent double-allocation during concurrent distribution requests.

### 3. Granular Inventory Lot Lifecycle Management
- **How it Works**: Lots move through explicit state transitions enforced by domain validation rules:
  `Received` → `Checked` → `Shelved` → `Reserved` → `Released` / `Quarantined` / `Discarded`.
- Direct illegal state jumps (e.g., `Received` directly to `Released`) are rejected with explicit HTTP 400 validation errors.

### 4. Field-Level Audit Trail & Timeline System
- **How it Works**: Any update to an inventory lot triggers `CreateAuditLogUseCase`. The system compares the previous entity state against the updated state to produce a detailed list of modified fields (`fieldName`, `oldValue`, `newValue`). Each log stores the action type, actor ID, user name, IP address, and timestamp.

### 5. Multi-Warehouse Stock Transfers
- **How it Works**: Inventory lots belong to specific warehouse facilities (`WarehouseModel`). Stock managers can initiate inter-warehouse transfers. The system validates target warehouse capacity, updates lot location metadata, and logs a transfer event in the audit trail. But not completed . 

### 6. Email Notification Hub
- **How it Works**: Powered by `EmailService.ts` via Nodemailer. Features automated alerts:
  - **48-Hour Expiry Alert**: Scans shelved inventory for items expiring within 48 hours and emails formatted warning digests to Stock Managers.
  - **Daily Intake Summary**: Compiles and emails a 24-hour donation summary to Handout Coordinators.
  - *Fallback*: If SMTP credentials are missing, the system runs in simulation mode, logging formatted email contents to the server console.

### 7. Real-Time Barcode & QR Code Generation
- **How it Works**: **How it Works**: Utilizes the `react-barcode` package to render printable Code-128 barcodes containing encoded Lot Numbers, Item details, and Expiration dates for physical box labeling.


---

## 🛠️ Tech Stack & Justification

| Layer / Service | Technology Chosen | Technical Justification & Why Chosen |
| :--- | :--- | :--- |
| **Backend Runtime** | Node.js (v18+) | Non-blocking asynchronous I/O ideal for handling concurrent database queries, file uploads, and AI service calls. |
| **Backend Framework** | Express.js | Lightweight, fast, and unopinionated framework providing complete flexibility to implement Clean Architecture. |
| **Primary Language** | TypeScript | End-to-end static typing, compile-time error detection, contract enforcement via interfaces, and superior IDE auto-completion. |
| **Database** | MongoDB & Mongoose | Flexible document schema perfect for tracking dynamic inventory lots, audit trail deltas, and nested manifest items. |
| **AI Vision & Extraction** | Gemini 1.5 Flash | High-speed multimodal API for parsing scanned receipt photos and messy donation manifest text into structured JSON DTOs. |
| **Offline OCR Engine** | Tesseract.js | Local fallback optical character recognition engine ensuring manifest image extraction works even without internet/API keys. |
| **Frontend Framework** | React 18 & Vite | Fast virtual DOM rendering, sub-second HMR, modular component architecture, and rapid build times. |
| **State Management** | Redux Toolkit | Centralized, predictable state management for authentication, user session persistence, and global app data across roles. |
| **Styling & UI** | Vanilla CSS / TailwindCSS | Modern, responsive visual presentation with custom design tokens, polished dark glassmorphism, and clear data tables. |
| **Email Service** | Nodemailer | Standard Node.js email sending module supporting custom SMTP servers and fallback development logging. |

---

## 🟦 Why TypeScript?

TypeScript was chosen across both Backend and Frontend for several strategic technical reasons:

1. **Interface-Driven Architecture**: Clean Architecture relies on strict abstraction boundaries. TypeScript interfaces (`ILotRepository`, `IEmailService`, `IAIManifestService`) allow Use Cases to depend on abstractions rather than concrete implementations.
2. **DTO Contract Enforcement**: Data Transfer Objects (DTOs) enforce strict request and response schemas, preventing malformed data from reaching domain entities or client interfaces.
3. **Zero Runtime Type Bugs**: Static typing catches missing fields, undefined variables, and type mismatches at compile time rather than in production runtime environments.
4. **Refactoring Safety**: Refactoring complex inventory workflows (such as FEFO allocation or Lot state transitions) is seamless because the TypeScript compiler immediately flags all affected consumer files across the codebase.

---

## 🧱 Backend Folder Structure & Architecture

The backend follows **Clean Architecture** (Onion / Hexagonal Architecture), keeping business logic completely decoupled from database frameworks and web servers:

```
Backend/src/
├── domain/                         # Core Domain Layer (Pure Business Entities & Contracts)
│   ├── entities/                   # User, Item, Donation, Lot, Distribution, AuditLog entities
│   └── interface/                  # Interfaces for Repositories, Services, Use Cases, & DTOs
│       ├── DTOs/                   # Data Transfer Objects for API requests/responses
│       ├── repositoryInterface/    # ILotRepository, IDonationRepository, IUserRepository
│       └── serviceInterface/       # IAIManifestService, IEmailService, IJwtService
│
├── useCase/                        # Application Business Logic Layer (Use Cases)
│   ├── auth/                       # RegisterUserUseCase, LoginUserUseCase
│   ├── donation/                   # CreateDonationUseCase, GetDonationsUseCase
│   ├── lot/                        # CreateLotUseCase, TransitionLotStatusUseCase, GetLotTraceUseCase
│   ├── distribution/               # ReserveStockUseCase, PreviewFEFOUseCase, CompleteDistributionUseCase
│   └── ai/                         # ParseManifestUseCase
│
├── adapters/                       # Adapters Layer (Translates HTTP & DB to Domain)
│   ├── controllers/                # Express Controllers (Calls Use Cases, returns HTTP JSON DTOs)
│   ├── middlewares/                # AuthJWT, Role Authorization, Validation, Central Error Handler
│   └── repository/                 # Database Repository Implementations (Mongoose queries)
│
├── frameWork/                      # Infrastructure & External Tools Layer
│   ├── DI/                         # Dependency Injection Containers (Wires Repos & Use Cases)
│   ├── database/                   # Mongoose Connection, Database Schemas, & Seed Scripts
│   ├── routes/                     # Express Route Definitions
│   └── service/                    # External Services (Gemini AI, Nodemailer Email, JWT, Bcrypt)
│
├── shared/                         # Reusable Utilities, Constants, & Custom Error Classes
├── app.ts                          # Express Application setup & middleware configuration
└── server.ts                       # HTTP Server listener entry point
```

### Architectural Request & Response Flow

```
HTTP Request ──► Route ──► Auth Middleware ──► Controller ──► DTO Validation ──► Use Case ──► Repository Interface ──► DB Model ──► Database
                                                                                                                                     │
HTTP Response ◄── JSON DTO ◄── Controller ◄── Response DTO ◄── Domain Entity ◄── Repository Implementation ◄──────────────────────────┘
```

---

## 🏛️ SOLID Principles in Action

FoodFlow rigorously applies the five **SOLID** principles of object-oriented design:

### 1. Single Responsibility Principle (SRP)
- *Rule*: A class or module should have one, and only one, reason to change.
- *Implementation*: `LotController` handles HTTP status formatting, `TransitionLotStatusUseCase` handles lot lifecycle rules, and `LotRepository` handles Mongoose database persistence. No layer mixes concerns.

### 2. Open/Closed Principle (OCP)
- *Rule*: Software entities should be open for extension, but closed for modification.
- *Implementation*: The AI manifest parser uses interface `IAIManifestService`. If a new AI provider (e.g., OpenAI GPT-4 Vision) is added, we create a new class implementing `IAIManifestService` without editing existing Use Cases.

### 3. Liskov Substitution Principle (LSP)
- *Rule*: Subtypes must be substitutable for their base types without altering program correctness.
- *Implementation*: The `EmailService` can be substituted with a `MockEmailService` in unit tests without changing how `ReserveStockUseCase` or alert schedulers interact with it.

### 4. Interface Segregation Principle (ISP)
- *Rule*: Clients should not be forced to depend upon interfaces that they do not use.
- *Implementation*: Instead of one monolithic repository interface, interfaces are fine-grained (`ILotRepository`, `IDonationRepository`, `IRecipientRepository`).

### 5. Dependency Inversion Principle (DIP)
- *Rule*: High-level modules should not depend on low-level modules; both should depend on abstractions.
- *Implementation*: Use Cases depend on repository interfaces (`ILotRepository`), not on concrete Mongoose models (`LotModel`). Dependencies are injected via the DI container (`src/frameWork/DI/`).

---

## 🌐 REST API Standards

All endpoints follow strict RESTful conventions, using standard HTTP methods and returning structured JSON envelopes:

### Standard Success Response Envelope (HTTP 200 / 201)
```json
{
  "success": true,
  "message": "Donation created successfully",
  "data": {
    "id": "66b9f123abc4567890def123",
    "donationNumber": "DON-2026-0089",
    "donorName": "Sunshine Farms Org",
    "status": "received",
    "createdAt": "2026-08-12T10:00:00.000Z"
  }
}
```

### Standard Error Response Envelope (HTTP 400 / 401 / 403 / 404 / 409 / 500)
```json
{
  "success": false,
  "message": "Cannot satisfy allocation: requested quantity (150 kg) exceeds available FEFO stock (90 kg)",
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "timestamp": "2026-08-12T10:05:00.000Z"
  }
}
```


---

## 🛠️ Local Setup & Installation Guide

Follow these instructions to install, configure, and run FoodFlow locally on your development machine.

### Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher
- **MongoDB**: Local instance running on `mongodb://localhost:27017` OR a MongoDB Atlas connection string.

### Step 1: Clone the Repository
```bash
git clone https://github.com/dhyyan/foodflow-food-bank-management.git
cd FoodFlow
```

### Step 2: Set Up Backend Environment Variables & Install
```bash
cd Backend

# Copy environment template
cp .env.example .env

# Install backend dependencies
npm install
```

*(Verify or edit `Backend/.env` if you wish to configure a custom MongoDB URI or Gemini API Key)*.

### Step 3: Set Up Frontend Environment Variables & Install
```bash
cd ../Frontend

# Copy environment template
cp .env.example .env

# Install frontend dependencies
npm install
```

### Step 4: Run the Backend Server (With Automated Database Seeding)
```bash
cd ../Backend

# Start backend in development mode (Runs on http://localhost:5000)
npm run dev
```
> 🚀 *Upon starting, the backend automatically connects to MongoDB and seeds initial demo users (`admin@foodflow.org`, `clerk@foodflow.org`, `stock@foodflow.org`, `handout@foodflow.org`) and default recipients.*

### Step 5: Run the Frontend Development Server
Open a new terminal window:
```bash
cd FoodFlow/Frontend

# Start Vite frontend server (Runs on http://localhost:5173)
npm run dev
```

### Step 6: Access the Application
Open your browser and navigate to:
- **User Portal**: `http://localhost:5173/login`
- **Admin Portal**: `http://localhost:5173/admin/login`

---

## ⚙️ Environment Variables (`.env.example`)

### Backend (`Backend/.env.example`)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection
MONGODB_URI=mongodb://localhost:27017/foodflow

# Authentication & Security
JWT_SECRET=foodflow_super_secret_jwt_key_2026
ADMIN_DEFAULT_PASSWORD=Admin@123456

# AI Engine Configuration (Gemini API Key - Optional, falls back to Tesseract OCR & Rule Engine)
GEMINI_API_KEY=your_gemini_api_key_here

# Email Notification Service (SMTP - Optional, falls back to console simulation mode)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=alerts@foodflow.org
```

### Frontend (`Frontend/.env.example`)
```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📄 License & Maintainers

Built with ❤️ by the FoodFlow Engineering Team. Designed to support food banks, humanitarian relief organizations, and shelter networks worldwide in eliminating food waste and ensuring equitable distribution.
