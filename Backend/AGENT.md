# AGENTS.md — Backend Development Guidelines

## 1. Purpose

This document defines the mandatory backend development standards for this project.

The backend must follow:

- Clean Architecture
- SOLID principles
- REST API conventions
- Dependency Injection
- Interface-driven design
- DTO-based data mapping
- Strong TypeScript typing
- Centralized error handling
- JWT authentication and authorization
- Reusable and maintainable code
- Minimal duplication
- Clear separation of responsibilities

The code should feel like it was written and maintained by a real human developer.

Do not generate unnecessary abstractions, unnecessary files, or over-engineered patterns just for the sake of following Clean Architecture.

The architecture should solve real problems in the project.

---

# 2. IMPORTANT DEVELOPMENT RULE

Before modifying existing code:

1. Read the related files.
2. Understand the current flow.
3. Identify all dependencies of the code being changed.
4. Check whether the same functionality already exists somewhere else.
5. Check whether changing the code will affect another module.
6. Reuse existing utilities, interfaces, services, repositories, and helpers where appropriate.
7. Do not duplicate existing functionality.
8. Do not rewrite working code unnecessarily.
9. Preserve existing behavior unless the requirement explicitly requires changing it.
10. After making a change, verify the complete related flow.

NEVER modify a file blindly.

For example:

If changing Lot reservation logic:

Do not only inspect the reservation controller.

Analyze:

Controller
→ DTO
→ Use Case
→ Repository Interface
→ Repository Implementation
→ Lot model
→ Reservation model
→ Related state transition logic
→ Authentication/authorization
→ Related APIs

Then make the change.

---

# 3. Architecture

Follow this overall flow:

Request
    ↓
Route
    ↓
Middleware
    ↓
Controller
    ↓
DTO Mapping / Validation
    ↓
Use Case
    ↓
Repository / Service Interfaces
    ↓
Infrastructure Implementations
    ↓
Database / External Service

Response:

Database / External Service
    ↓
Repository
    ↓
Use Case
    ↓
Response DTO
    ↓
Controller
    ↓
HTTP Response


Business logic MUST NOT be implemented in:

- Routes
- Controllers
- Middleware
- Repository implementations
- Database models
- External service adapters

Business workflows belong in the Use Case layer.

---

# 4. Required Folder Structure

Follow this architecture and naming style:

src/
│
├── adapters/
│   ├── controllers/
│   │   ├── auth/
│   │   ├── item/
│   │   ├── donation/
│   │   ├── lot/
│   │   ├── distribution/
│   │   └── ai/
│   │
│   ├── middlewares/
│   │   ├── auth/
│   │   ├── authorization/
│   │   ├── validation/
│   │   └── error/
│   │
│   └── repository/
│       ├── BaseRepo/
│       ├── user/
│       ├── item/
│       ├── donation/
│       ├── lot/
│       ├── distribution/
│       └── reservation/
│
├── domain/
│   ├── entities/
│   │   ├── User.ts
│   │   ├── Item.ts
│   │   ├── Donation.ts
│   │   ├── Lot.ts
│   │   ├── LotEvent.ts
│   │   ├── Distribution.ts
│   │   └── Reservation.ts
│   │
│   └── interface/
│       ├── DTOs/
│       ├── repositoryInterface/
│       ├── serviceInterface/
│       └── useCaseInterface/
│
├── frameWork/
│   ├── DI/
│   │   ├── authInject.ts
│   │   ├── itemInject.ts
│   │   ├── donationInject.ts
│   │   ├── lotInject.ts
│   │   ├── distributionInject.ts
│   │   └── aiInject.ts
│   │
│   ├── database/
│   │   ├── models/
│   │   ├── connection/
│   │   └── seed/
│   │
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── itemRoutes.ts
│   │   ├── donationRoutes.ts
│   │   ├── lotRoutes.ts
│   │   ├── distributionRoutes.ts
│   │   └── aiRoutes.ts
│   │
│   └── service/
│       ├── jwt/
│       ├── password/
│       ├── ai/
│       └── email/
│
├── shared/
│   ├── templates/
│   ├── utils/
│   ├── constants/
│   ├── errors/
│   └── types/
│
├── useCase/
│   ├── auth/
│   ├── item/
│   ├── donation/
│   ├── lot/
│   ├── distribution/
│   └── ai/
│
├── app.ts
└── server.ts


This structure is intentionally based on the architecture style used in the existing Workora backend.

The Workora repository currently separates:
- adapters → controllers, middlewares, repositories
- domain → entities and interfaces
- framework → DI, database, routes, services
- useCase → business operations
- shared → reusable components

Follow this architectural style rather than introducing a completely different structure without a strong reason.

## 5.1 Controllers

Controllers are responsible ONLY for:

- Receiving HTTP requests
- Extracting request data
- Calling the appropriate Use Case
- Mapping Use Case output to HTTP response
- Returning the correct HTTP status

Controllers MUST NOT contain business logic.

Bad:

const reserve = async (req, res) => {
    const lots = await Lot.find(...);

    if (lots.length === 0) {
        ...
    }

    // FEFO calculation here
};

Good:

const reserve = async (req, res) => {
    const dto = mapReserveRequestToDTO(req);

    const result = await reserveDistributionUseCase.execute(dto);

    return res.status(200).json({
        success: true,
        message: "Stock reserved successfully",
        data: result
    });
};


---

# 6. Use Cases

```md
## 6. Use Cases

ALL application business workflows MUST be implemented inside Use Cases.

Examples:

- RegisterUserUseCase
- LoginUserUseCase
- CreateDonationUseCase
- CreateLotUseCase
- TransitionLotStatusUseCase
- ReserveStockUseCase
- PreviewFEFOUseCase
- CompleteDistributionUseCase
- GetLotTraceUseCase
- ParseManifestUseCase

A Use Case should represent one meaningful business action.

Example:

ReserveStockUseCase

Responsibilities:

1. Validate the requested distribution.
2. Check recipient quota.
3. Find eligible inventory.
4. Apply expiry rules.
5. Apply FEFO ordering.
6. Split quantities across lots.
7. Reserve stock.
8. Record reservations.
9. Update required lot state.
10. Return the reservation result.

Do NOT move this logic into the controller.

Use Cases may coordinate multiple repositories/services.

## 7. Interface-Driven Development

Use interfaces for dependencies and architectural boundaries.

Important interfaces include:

- Repository interfaces
- Service interfaces
- Use Case interfaces
- DTO contracts
- External provider contracts
- Authentication service contracts
- Email service contracts
- AI provider contracts

Example:

interface ILotRepository {
    findById(id: string): Promise<Lot | null>;

    findAvailableForFEFO(
        itemId: string,
        quantity: number
    ): Promise<Lot[]>;

    updateQuantity(
        id: string,
        quantity: number
    ): Promise<Lot>;
}

The Use Case should depend on ILotRepository.

It should NOT directly depend on Mongoose models.

Bad:

class ReserveStockUseCase {
    async execute() {
        await LotModel.find(...);
    }
}

Good:

class ReserveStockUseCase {
    constructor(
        private readonly lotRepository: ILotRepository
    ) {}

    async execute() {
        await this.lotRepository.findAvailableForFEFO(...);
    }
}

Infrastructure implementations can then use Mongoose.

## 8. Dependency Injection

Use Dependency Injection for Use Cases, repositories and services.

Do not instantiate dependencies randomly inside business logic.

Bad:

class ReserveStockUseCase {
    private repository = new LotRepository();
}

Good:

class ReserveStockUseCase {
    constructor(
        private readonly lotRepository: ILotRepository,
        private readonly reservationRepository: IReservationRepository
    ) {}
}

Dependencies should be wired in:

src/frameWork/DI/

Example:

const lotRepository = new LotRepository();
const reservationRepository = new ReservationRepository();

const reserveStockUseCase =
    new ReserveStockUseCase(
        lotRepository,
        reservationRepository
    );

DI should be the composition point of the application.

## 9. DTOs

Never expose database models directly as API responses.

Use DTOs.

Request flow:

HTTP Request
    ↓
Request DTO
    ↓
Use Case
    ↓
Domain Entity
    ↓
Repository
    ↓
Database


Response flow:

Database
    ↓
Repository
    ↓
Domain Entity
    ↓
Response DTO
    ↓
Controller
    ↓
HTTP Response

Example:

interface CreateDonationDTO {
    donorName: string;
    donorType: string;
    receivedAt: Date;
    lines: DonationLineDTO[];
}

Do not pass req.body directly into the database.

Map and validate it first.

Example:

const dto: CreateDonationDTO = {
    donorName: req.body.donorName,
    donorType: req.body.donorType,
    receivedAt: new Date(req.body.receivedAt),
    lines: ...
};

Response DTOs should expose only the fields required by the API.

Never expose:

- passwordHash
- internal database details
- sensitive provider information
- unnecessary internal fields

## 10. Type Safety

TypeScript must be used properly.

Do NOT use:

any

unless there is a very strong technical reason.

Prefer:

- interfaces
- types
- enums
- generics
- typed DTOs
- typed repository results
- typed service responses
- typed errors

Avoid unnecessary type assertions.

Bad:

const user = data as any;

Good:

const user: User = data;

## 11. REST API Rules

Follow RESTful API conventions.

Use nouns for resources.

Good:

GET    /api/lots
GET    /api/lots/:id
POST   /api/lots
PATCH  /api/lots/:id
GET    /api/lots/:id/trace

POST   /api/distributions
GET    /api/distributions/:id

Avoid RPC-style routes when a RESTful resource/action endpoint is more appropriate.

Use meaningful HTTP methods:

GET    → retrieve
POST   → create/action
PATCH  → partial update
PUT    → complete replacement when required
DELETE → delete

## 12. HTTP Response Standard

Every API response must contain:

- Appropriate HTTP status code
- success indicator
- meaningful message
- data when applicable

Success example:

{
    "success": true,
    "message": "Donation created successfully",
    "data": {...}
}

Error example:

{
    "success": false,
    "message": "The requested quantity is not available",
    "error": {
        "code": "INSUFFICIENT_STOCK"
    }
}

Messages must describe what actually happened.

Avoid meaningless messages:

"Something went wrong"
"Error"
"Failed"

Prefer:

"Cannot reserve stock because only 25 units are available"

"Lot cannot be released because it is currently in the checked state"

"User does not have permission to manage the item catalog"

Use correct status codes.

200 → Successful request
201 → Resource created
204 → Successful request with no response body

400 → Invalid request / validation failure
401 → Authentication required or invalid token
403 → Authenticated but not authorized
404 → Resource not found
409 → Business conflict
422 → Semantically invalid input when appropriate
500 → Unexpected server error

Do not return 200 for failed operations.

## 14. Centralized Error Handling

Do not use repeated try/catch response logic in every controller.

Create reusable application errors.

Examples:

BadRequestError
UnauthorizedError
ForbiddenError
NotFoundError
ConflictError
ValidationError

Example:

throw new NotFoundError(
    "Lot with the provided ID was not found"
);

Use centralized error middleware to convert errors
into consistent HTTP responses.

Unexpected errors should be logged internally.

Do not expose stack traces or internal database errors to clients.

## 15. JWT Authentication

All protected API requests MUST pass through authentication middleware.

Flow:

Request
    ↓
JWT Middleware
    ↓
Validate token
    ↓
Extract user identity
    ↓
Authorization middleware
    ↓
Controller
    ↓
Use Case

Do not trust user IDs sent by the frontend when the authenticated
user identity is already available in the JWT.

Example:

req.user.id

should be used where appropriate instead of:

req.body.userId

## 16. Role-Based Authorization

Authentication answers:

"Who is this user?"

Authorization answers:

"What is this user allowed to do?"

Authorization must be enforced on the server.

Never rely only on frontend route protection.

Example:

Donation Clerk
→ Can create donations
→ Cannot reserve inventory

Stock Manager
→ Can manage lot lifecycle
→ Can manage item catalog

Handout Coordinator
→ Can create distributions
→ Can reserve inventory
→ Cannot manage item catalog

Use reusable authorization middleware.

## 17. Repository Layer

Repositories are responsible for data access only.

Repositories may:

- Query database
- Create records
- Update records
- Delete records where allowed
- Apply database-specific query operations
- Handle persistence transactions where appropriate

Repositories must NOT contain application business rules.

Bad:

repository decides:
"Family has already received 50 units, therefore reject"

That belongs to the Use Case.

Repository should retrieve the required data.

Use Case decides what the business means.

## 18. Database Rules

Mongoose is the database access layer.

Do not access Mongoose models directly from controllers or Use Cases.

Use:

Use Case
    ↓
Repository Interface
    ↓
Repository Implementation
    ↓
Mongoose Model

Database-specific implementation must stay inside the framework/
adapter/infrastructure side.

Do not leak Mongoose-specific types throughout the application.

## 19. Database Relationships

When the requirement contains relationships, model them properly.

Support and clearly model:

- 1:1
- 1:many
- many:1
- many:many

Choose embedded documents or references based on actual access patterns.

Do not create duplicated copies of the same entity everywhere.

For example:

Donation
    ↓
many Lots

Lot
    ↓
one Item

Distribution
    ↓
many Reservations

Reservation
    ↓
one Lot

Use references where the entity has an independent lifecycle.

Use embedded documents where data belongs tightly to its parent
and does not need an independent lifecycle.

Document important relationship decisions.

## 20. Reusability

Before creating a helper/service:

Search the project to determine whether similar functionality already exists.

Do not create:

formatDate.ts
formatDateHelper.ts
dateFormatter.ts

if one reusable date utility already exists.

Reuse existing:

- Error classes
- Response helpers
- Validation helpers
- Date utilities
- Authentication utilities
- Repository base functionality
- Mapping utilities
- Constants

If multiple modules perform the same operation, extract the common
behavior into an appropriate shared abstraction.

Do not over-generalize code just to avoid two similar lines.

Prefer useful reuse over artificial abstraction.

## SOLID

### S — Single Responsibility

A class/function should have one clear responsibility.

Controller → HTTP handling
Use Case → business workflow
Repository → persistence
Service → external/shared operation

### O — Open/Closed

Prefer extending behavior through abstractions rather than repeatedly
modifying stable code.

### L — Liskov Substitution

Implementations of an interface must respect the interface contract.

### I — Interface Segregation

Prefer small focused interfaces.

Avoid huge interfaces containing unrelated methods.

### D — Dependency Inversion

Business logic should depend on abstractions, not infrastructure.

Example:

Use Case
    ↓
ILotRepository
    ↓
LotRepository
    ↓
Mongoose

## Business Logic Rule

Business logic must be placed in Use Cases.

For this project, examples include:

- Lot state transitions
- Three-day expiry safety rule
- FEFO allocation
- Distribution quota
- Reservation rules
- Traceability logic
- AI manifest confirmation rules
- Inventory availability
- Permission-related business rules

Do not put these rules in:

- Controller
- Route
- Mongoose schema
- Repository
- Middleware

Middleware should handle cross-cutting concerns such as authentication,
authorization and validation.

## State Machine

When a resource has defined states, never allow direct status mutation.

Bad:

lot.status = req.body.status;

Good:

transitionLotStatusUseCase.execute({
    lotId,
    nextStatus,
    userId
});

The Use Case must validate allowed transitions.

For example:

received
    ↓
checked
    ↓
shelved
    ↓
reserved
    ↓
released

checked
    ↓
quarantined
    ↓
discarded

Invalid transitions must return a meaningful conflict/bad-request error.

Every valid transition must be recorded when the requirement requires
audit/history tracking.

## FEFO

FEFO = First Expired, First Out.

FEFO allocation must be implemented in the Use Case/application layer,
with the repository responsible for efficiently retrieving eligible
inventory.

The system must:

1. Ignore expired lots.
2. Ignore quarantined lots.
3. Ignore discarded lots.
4. Ignore unavailable lots.
5. Sort eligible lots by earliest expiry.
6. Split requested quantities across multiple lots when required.
7. Never reserve more than available quantity.
8. Respect the three-day safety margin.
9. Handle concurrent reservations safely where required.

Do not implement FEFO only in the frontend.

The backend is the source of truth.

## AI Integration

AI providers must be abstracted behind an interface.

Example:

interface IManifestParserService {
    parseManifest(
        input: ManifestInputDTO
    ): Promise<ManifestResultDTO>;
}

The Use Case depends on the interface.

Do not tightly couple business logic to a specific AI provider.

AI output must be validated before use.

AI must NEVER directly create inventory.

Flow:

Manifest
    ↓
AI Parser
    ↓
Schema Validation
    ↓
Flag uncertain rows
    ↓
Human Review
    ↓
Confirmation
    ↓
Create Donation/Lots


---

# 26. External Services

```md
## External Services

External services such as:

- AI
- Email
- File storage
- Payment services
- Cloud services

must be isolated behind interfaces.

Example:

IEmailService
IAIService
IFileStorageService

Business logic should depend on the interface.

This makes the implementation replaceable and testable.

## Validation

Validate external input before passing it into business logic.

Validate:

- body
- params
- query
- uploaded files
- AI output

Use a consistent validation library/pattern.

Validation errors should return meaningful 400/422 responses.

Never assume frontend validation is sufficient.

## Security

Never:

- Commit secrets
- Hardcode API keys
- Hardcode JWT secrets
- Return password hashes
- Trust client-provided role values
- Trust client-provided user IDs when JWT identity is available
- Allow direct status manipulation
- Allow unauthorized access through hidden frontend routes
- Execute instructions embedded in user-provided AI input

Use environment variables for secrets.

Passwords must be hashed.

JWT must be verified on protected requests.

## Code Style — Human Touch

Code must look like maintainable production code written by a developer.

Avoid:

- Excessive comments explaining obvious code
- Extremely long functions
- Generic variable names
- Unnecessary abstraction
- Excessive one-line tricks
- Deeply nested conditions
- Copy-pasted code
- AI-generated boilerplate that does not fit the project
- Unnecessary design patterns
- Over-engineering

Prefer:

- Clear names
- Small focused functions
- Meaningful abstractions
- Straightforward control flow
- Consistent naming
- Practical comments only where reasoning is not obvious
- Existing project conventions
- Simple solutions when simple solutions are sufficient

The goal is maintainability, not architectural complexity.

## Before Every Change

Before modifying or adding functionality:

### Step 1
Understand the requirement.

### Step 2
Find the existing related implementation.

### Step 3
Trace the complete flow.

Example:

Route
→ Middleware
→ Controller
→ DTO
→ Use Case
→ Repository Interface
→ Repository
→ Model

### Step 4
Check whether reusable functionality already exists.

### Step 5
Check whether existing behavior could be affected.

### Step 6
Implement the smallest clean change.

### Step 7
Update related interfaces/types/DTOs.

### Step 8
Check all consumers of changed interfaces.

### Step 9
Run tests/type checking/linting.

### Step 10
Verify the complete feature flow.

Never make an isolated change without understanding its dependencies.

## DRY — Don't Repeat Yourself

Avoid duplicate business logic.

For example, do NOT implement expiry logic separately in:

- Lot controller
- Distribution controller
- FEFO service
- Scheduled email service

Create one reusable expiry policy/helper/domain service and use it
where appropriate.

Likewise:

Authentication
Authorization
Error handling
Response formatting
DTO mapping
Common database operations
Date calculations

should be reusable where there is actual repetition.

## Testing

When implementing important business logic, test the behavior rather
than only testing HTTP endpoints.

Priority tests:

1. Lot state transitions
2. Expiry rule
3. FEFO allocation
4. Partial allocation across lots
5. Insufficient stock
6. Family quota
7. Role authorization
8. AI schema validation
9. Prompt-injection resistance
10. Concurrent reservation behavior

The most important business rules must not depend solely on frontend
testing.

## API Documentation

Every important endpoint should have clearly defined:

- HTTP method
- URL
- Authentication requirement
- Required role
- Request body
- Query parameters
- Response structure
- Success status
- Error status
- Example response

Keep API behavior consistent throughout the application.

## Naming

Use meaningful names.

Classes:

CreateDonationUseCase
ReserveStockUseCase
LotRepository

Interfaces:

ICreateDonationUseCase
ILotRepository
IEmailService

DTOs:

CreateDonationDTO
UpdateLotDTO
ReserveStockDTO
LotResponseDTO

Avoid:

Data
Helper
Manager
Common
Thing
Temp
TestService

unless the name genuinely describes the responsibility.

## Refactoring

Do not refactor unrelated code while implementing a feature.

If existing code is working:

Do not rewrite it just because you prefer another style.

If you identify an architectural problem:

1. Understand its impact.
2. Check whether it affects the current feature.
3. Fix it only when necessary or when it clearly improves the
   current implementation without introducing unnecessary risk.

The goal is stable progress.

36. Final Quality Checklist

Before considering a feature complete, verify:

 Correct REST endpoint
 Authentication applied
 Authorization applied
 Request validated
 DTO created
 DTO mapped correctly
 Use Case contains business logic
 Repository accessed through interface
 External services accessed through interfaces
 Dependency injected
 Proper error handling
 Correct HTTP status
 Meaningful response message
 No duplicated logic
 No any without justification
 No secrets in source code
 Related existing functionality checked
 Existing behavior preserved
 Tests added/updated where appropriate
 TypeScript compilation passes
 Linting passes
 Complete flow manually verifie


## The architecture I want the agent to follow

For your **FoodFlow** backend, the important flow should look like this:

```text
                    HTTP REQUEST
                         │
                         ▼
                    ┌─────────┐
                    │  ROUTE  │
                    └────┬────┘
                         │
                         ▼
                ┌─────────────────┐
                │ JWT MIDDLEWARE  │
                └───────┬─────────┘
                        │
                        ▼
              ┌───────────────────┐
              │ AUTHORIZATION     │
              │ Middleware        │
              └────────┬──────────┘
                       │
                       ▼
                ┌────────────┐
                │ CONTROLLER │
                └─────┬──────┘
                      │
                  Request DTO
                      │
                      ▼
                ┌────────────┐
                │  USE CASE  │  ← BUSINESS LOGIC
                └─────┬──────┘
                      │
              Interface / DI
                 ┌────┴────┐
                 ▼         ▼
          ┌───────────┐ ┌───────────┐
          │Repository │ │  Service  │
          │ Interface │ │ Interface │
          └─────┬─────┘ └─────┬─────┘
                │             │
                ▼             ▼
          Mongoose DB      AI / Email
          Repository      Implementation