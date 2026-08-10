# AGENTS.md — Frontend Development Guidelines

## 1. Purpose

This document defines the mandatory frontend development standards
for this project.

The frontend must be:

- Maintainable
- Reusable
- Type-safe
- Component-driven
- Scalable
- Easy to understand
- Consistent
- Free from unnecessary duplication
- Integrated cleanly with the backend REST API

Technology:

- React
- TypeScript
- Redux Toolkit
- React Router
- Axios
- CSS/Tailwind according to the project setup

The primary goal is:

> Maximum useful reusability with minimum unnecessary code.

Do not create duplicate components, API functions, hooks, types,
validation logic, or UI patterns when existing reusable implementations
can be used.

---

# 2. IMPORTANT DEVELOPMENT RULE

Before creating or modifying any frontend code:

1. Understand the existing implementation.
2. Search for existing reusable components.
3. Search for existing hooks.
4. Search for existing API functions.
5. Search for existing Redux state.
6. Search for existing types/interfaces.
7. Search for existing validation logic.
8. Check whether the requested functionality already exists elsewhere.
9. Reuse existing code whenever appropriate.
10. Modify the smallest necessary area.
11. Check all related consumers after changing shared code.

NEVER create a new component simply because it is slightly easier than
reusing an existing component.

---

# 3. Main Architecture

Use this general flow:

Page
 ↓
Reusable Components
 ↓
Custom Hooks
 ↓
Redux Toolkit / API Layer
 ↓
Axios
 ↓
Backend REST API


For server state:

Component
 ↓
Hook / Redux
 ↓
API Service
 ↓
Axios
 ↓
Backend

For UI state:

Component
 ↓
Local State

For global application state:

Component
 ↓
Redux Toolkit
 ↓
Slice

src/
│
├── app/
│   ├── store.ts
│   ├── hooks.ts
│   └── router.tsx
│
├── assets/
│
├── components/
│   ├── common/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Modal/
│   │   ├── Table/
│   │   ├── Pagination/
│   │   ├── Loader/
│   │   ├── EmptyState/
│   │   ├── ErrorState/
│   │   └── ConfirmDialog/
│   │
│   ├── layout/
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   ├── Header/
│   │   └── PageContainer/
│   │
│   └── shared/
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── authSlice.ts
│   │   ├── authApi.ts
│   │   ├── auth.types.ts
│   │   └── auth.utils.ts
│   │
│   ├── items/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── itemSlice.ts
│   │   ├── itemApi.ts
│   │   └── item.types.ts
│   │
│   ├── donations/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── donationSlice.ts
│   │   ├── donationApi.ts
│   │   └── donation.types.ts
│   │
│   ├── lots/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lotSlice.ts
│   │   ├── lotApi.ts
│   │   └── lot.types.ts
│   │
│   ├── distributions/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── distributionSlice.ts
│   │   ├── distributionApi.ts
│   │   └── distribution.types.ts
│   │
│   └── ai/
│       ├── components/
│       ├── hooks/
│       ├── aiApi.ts
│       └── ai.types.ts
│
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── items/
│   ├── donations/
│   ├── lots/
│   ├── distributions/
│   └── errors/
│
├── services/
│   ├── api/
│   │   ├── axios.ts
│   │   └── apiClient.ts
│   └── storage/
│
├── hooks/
│   ├── useDebounce.ts
│   ├── useModal.ts
│   └── usePagination.ts
│
├── types/
│   ├── api.ts
│   ├── common.ts
│   └── auth.ts
│
├── utils/
│   ├── date.ts
│   ├── format.ts
│   └── validation.ts
│
├── constants/
│   ├── routes.ts
│   └── roles.ts
│
├── App.tsx
└── main.tsx

5. Maximum Reusability

This is one of the highest-priority rules.

Before creating something new, ask:

"Does this already exist?"

Search for:

Components
Hooks
API functions
Redux selectors
Redux actions
Types
Utilities
Validation schemas
Modal logic
Form logic
Table logic
Loading states
Error states

If it exists and is suitable, reuse it.

6. Component Reusability

Avoid duplicate components.

Bad:

UserButton.tsx
ItemButton.tsx
DonationButton.tsx
LotButton.tsx

when all of them only render a normal button.

Create:

Button.tsx

7. Avoid Over-Reusability

Do not create components that are reusable only in theory.

Bad:

UniversalComponentManager
GenericDataRenderer
DynamicEverything

when they make the code harder to understand.

Reusable code should:

Solve a real repeated problem
Have a clear responsibility
Be easy to configure
Be easier to use than duplicating code

Prefer practical reuse over abstraction for abstraction's sake.

8. DRY Principle

Avoid duplicate code.

Bad:

if (loading) {
  return <Spinner />;
}

repeated across 20 pages with slightly different implementations.

Create:

<Loader />

when the same behavior is genuinely repeated.

Likewise reuse:

Error messages
Empty states
Buttons
Inputs
Modals
Tables
Filters
Pagination
API error handling
Date formatting
Role checks
Status badges
9. Redux Toolkit

Redux Toolkit is REQUIRED for global application state.

Use:

@reduxjs/toolkit
react-redux

Do not use old-style Redux patterns.

Avoid manually writing:

Action constants
Action creators
Reducer switch statements

Use:

createSlice
createAsyncThunk
createSelector
configureStore

when appropriate.

10. Redux Folder Structure

Each feature that genuinely needs global state should have its own slice.

Example:

features/
└── auth/
    ├── authSlice.ts
    ├── authApi.ts
    └── auth.types.ts

Example state:

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}
11. Do NOT Put Everything in Redux

Redux is NOT a replacement for React state.

Use local state for:

Modal open/close
Input values
Temporary UI state
Tabs
Dropdowns
Form state when it does not need global access

Use Redux for:

Authenticated user
Authentication token
User role
Shared application state
Data genuinely consumed by multiple unrelated components
Global UI state when required

Do not create a Redux slice for every input field.

12. Typed Redux

Redux must be fully typed.

Create typed hooks:

useAppDispatch()
useAppSelector()

Avoid:

useDispatch<any>()

and:

useSelector((state: any) => ...)

The Redux store should provide the correct types automatically.

13. API Layer

Components MUST NOT directly call Axios.

Bad:

const response = await axios.get("/lots");

inside a component.

Use a dedicated API layer.

Example:

Component
    ↓
Hook
    ↓
lotApi.ts
    ↓
apiClient
    ↓
Axios

Example:

export const getLots = async (
    params: LotFilterParams
): Promise<LotListResponse> => {
    const response = await apiClient.get("/lots", {
        params
    });

    return response.data;
};
14. Axios Configuration

Create one centralized Axios client.

Example:

services/
└── api/
    └── apiClient.ts

Configure:

Base URL
Authentication headers
Request interceptor
Response interceptor
Common error handling

Do NOT create multiple Axios instances unless there is a real reason.

15. JWT Handling

The backend is responsible for authorization.

Frontend should:

Receive JWT after login.
Store it securely according to the application architecture.
Attach it to authenticated API requests.
Handle expired/invalid tokens.
Redirect the user to login when authentication is no longer valid.

Do not manually attach tokens separately in every API call.

Use one Axios interceptor.

Example flow:

Login
 ↓
JWT
 ↓
Redux Auth State
 ↓
Axios Interceptor
 ↓
Authorization: Bearer <token>
16. Role-Based UI

Frontend may hide UI elements based on role for better UX.

Example:

Donation Clerk
→ Show donation features

Stock Manager
→ Show inventory management

Handout Coordinator
→ Show distribution features

However:

Frontend role checks are NOT security.

Backend authorization remains the source of truth.

Never assume hiding a button provides security.

17. React Components

Components should have one clear responsibility.

Bad:

Dashboard.tsx

containing:

API calls
500 lines of JSX
Form validation
Table logic
Modal logic
Redux logic
Business calculations

Instead:

Dashboard
├── SummaryCards
├── ExpiringLots
├── RecentDonations
└── RecentDistributions

Pages should compose components.

18. Pages vs Components

Pages represent screens/routes.

Example:

/pages/lots/LotsPage.tsx

Components represent reusable UI pieces.

Example:

/features/lots/components/LotTable.tsx

The page should coordinate the feature.

The reusable component should handle presentation and reusable UI behavior.

19. Custom Hooks

Use custom hooks to extract reusable React logic.

Examples:

useAuth()
useModal()
useDebounce()
usePagination()
useLotFilters()
useDistribution()

Bad:

Copying the same useEffect, loading state, error state, and API logic
into five components.

Extract the repeated logic into a hook.

20. Avoid Giant Hooks

Do not create:

useEverything()
useDashboardEverything()
useAppManager()

A hook should have one clear responsibility.

Good:

useLotFilters()
usePagination()
useAuth()
21. Forms

Forms must have:

Validation
Loading state
Error state
Success handling
Disabled submit while processing
Proper field messages

Do not duplicate validation logic across components.

Use one validation schema where appropriate.

For example:

features/
└── donations/
    └── donation.validation.ts
22. API Error Handling

Never silently ignore API errors.

Bad:

catch {
}

Show meaningful errors.

Example:

"Unable to load lots. Please try again."

"Only 20 units are available for reservation."

"You do not have permission to perform this action."

Do not expose raw backend/database errors directly to users.

23. Loading States

Every API-driven screen should consider:

Loading
Success
Empty
Error

Example:

if (loading) {
    return <Loader />;
}

if (error) {
    return <ErrorState message={error} />;
}

if (!data.length) {
    return <EmptyState message="No lots found" />;
}

return <LotTable data={data} />;

These states should use reusable components.

24. Status Components

The FoodFlow application contains many statuses.

Examples:

received
checked
shelved
reserved
released
quarantined
discarded

Create reusable status components.

Example:

<StatusBadge status={lot.status} />

Do not repeat:

<span className="...">
    {lot.status}
</span>

with different styling in every page.

25. Tables

The application contains multiple list views.

Create a reusable table component where appropriate.

For example:

<DataTable
    columns={columns}
    data={lots}
    loading={loading}
    emptyMessage="No lots found"
/>

Do not build a completely different table implementation for:

Lots
Donations
Items
Distributions

unless their behavior genuinely requires it.

26. Filters

Lot filtering is important.

Possible filters:

Item
Category
Status
Expiry window
Search

Build reusable filter components where possible.

Avoid repeating the same select/input/filter UI logic.

27. Pagination

If the backend provides pagination, centralize the pagination behavior.

Use:

usePagination()

and/or:

<Pagination />

Avoid writing separate pagination logic for every page.

28. FEFO UI

The FEFO calculation must be performed by the backend.

Frontend should display the backend result.

Flow:

Distribution Form
      ↓
POST /distributions/:id/preview
      ↓
Backend FEFO engine
      ↓
FEFO result
      ↓
Frontend displays preview
      ↓
User confirms

Do NOT implement the actual inventory allocation algorithm in React.

The backend is the source of truth.

29. AI Manifest UI

The AI flow should be:

User pastes manifest
        ↓
Parse Manifest
        ↓
Loading
        ↓
AI result
        ↓
Validation
        ↓
Review screen
        ↓
User edits flagged rows
        ↓
Confirm
        ↓
Create donation

Never automatically create inventory simply because the AI returned data.

30. TypeScript

Avoid any.

Bad:

const data: any = response.data;

Good:

const data: LotListResponse = response.data;

Define types for:

API requests
API responses
Redux state
Components
Props
Forms
Filters
Errors
31. Shared Types

Common API structures should be reusable.

Example:

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

Then:

ApiResponse<Lot>
ApiResponse<Lot[]>
ApiResponse<Distribution>

Do not recreate the same response type in every feature.

32. Constants

Do not scatter magic strings throughout the application.

Bad:

if (role === "HANDOUT_COORDINATOR")

everywhere.

Create:

constants/
└── roles.ts

Example:

export const ROLES = {
    DONATION_CLERK: "DONATION_CLERK",
    STOCK_MANAGER: "STOCK_MANAGER",
    HANDOUT_COORDINATOR: "HANDOUT_COORDINATOR",
} as const;

Likewise:

routes.ts
lotStatus.ts
categories.ts
33. Route Management

Keep routes centralized.

Example:

constants/routes.ts

Avoid:

navigate("/dashboard/lots/details");

repeated throughout the project.

Prefer:

ROUTES.LOTS.DETAILS(id)

This prevents route duplication and mistakes.

34. React Router

Use protected routes for authentication.

Example:

Public Routes
    ↓
Login

Protected Routes
    ↓
Application Layout
    ↓
Role-specific pages

Create reusable route protection.

Do not duplicate authentication checks across every page.

35. State Updates

Prefer predictable state updates.

Do not directly mutate objects outside Redux Toolkit's Immer handling.

Avoid unnecessary state duplication.

Bad:

lots
filteredLots
sortedLots
visibleLots

all stored separately in state.

Prefer:

lots
filters

and derive:

filtered/sorted result

when appropriate.

36. Selectors

When Redux state requires derived data, use selectors.

Example:

selectCurrentUser
selectUserRole
selectIsAuthenticated

For expensive derived calculations, use memoized selectors where appropriate.

Do not calculate the same derived state repeatedly across components.

37. Performance

Do not optimize everything prematurely.

First write clear code.

Use:

React.memo
useMemo
useCallback

ONLY when there is a real performance reason.

Do not wrap every component/function with them.

38. Component Props

Keep props focused.

Bad:

<LotComponent
    lot={lot}
    user={user}
    items={items}
    distributions={distributions}
    settings={settings}
    filters={filters}
    permissions={permissions}
/>

if the component only needs:

<LotCard lot={lot} />

Pass only what the component actually needs.

39. Reusable Modal

Create one reusable modal system.

Example:

<Modal
    open={open}
    title="Confirm Reservation"
    onClose={handleClose}
>
    ...
</Modal>

Do not implement modal behavior repeatedly.

40. Reusable Confirmation

For destructive operations:

<ConfirmDialog
    title="Discard Lot?"
    description="This action cannot be undone."
    onConfirm={handleDiscard}
/>

Use the same component throughout the application.

41. Date Handling

FoodFlow has important expiry dates.

Do not format dates differently across pages.

Create reusable date utilities.

Example:

utils/date.ts

Functions may include:

formatDate()
formatDateTime()
isExpired()
getDaysUntilExpiry()

Do not duplicate date calculations.

However, business-critical expiry rules remain controlled by the backend.

Frontend date calculations are for display only.

42. Business Logic Boundary

Do not move backend business rules into the frontend.

Examples:

Do NOT make the frontend decide:

Is this lot actually expired?
Which lot should be reserved?
Can this user reserve stock?
Has the family exceeded quota?
Can this lot transition?

The backend decides.

Frontend displays the result.

43. API Response Handling

Backend responses have a consistent structure.

Frontend should have one consistent way to handle:

success
message
data
error

Avoid writing different error extraction logic in every API function.

Create a centralized API/error utility.

44. Code Duplication Check

Before creating a new file, ask:

Does something similar already exist?

Before creating a new component:

Can an existing component handle this with props?

Before creating a new hook:

Is this logic already inside another hook?

Before creating a new API function:

Does the API service already support this?

Before creating a new type:

Does an existing type already represent this?
45. Human-Touch Code

The frontend must look like maintainable production code.

Avoid:

Overly complex components
Huge files
Generic AI-generated abstractions
Excessive comments
Unnecessary hooks
Unnecessary Redux state
Duplicate components
Magic strings
any
Deeply nested JSX
Giant utility files

Prefer:

Clear naming
Small components
Practical reusable components
Simple state management
Consistent patterns
Meaningful code
Easy-to-follow logic

The goal is not minimum lines at any cost.

The goal is:

Minimum unnecessary code + maximum useful reuse.

46. Before Modifying Shared Code

Be extra careful when changing:

API client
Redux store
Shared components
Common types
Authentication
Route protection
Shared hooks
Utilities

Before changing them:

Find all usages.
Understand their current behavior.
Check affected pages.
Make the smallest safe change.
Verify all consumers.

A shared component change can affect many pages.

47. Feature Independence

Features should not unnecessarily depend on each other's internal implementation.

For example:

features/lots/

should not directly import private implementation details from:

features/donations/

Use shared types/components/utilities or clearly defined APIs where appropriate.

Keep feature boundaries clear.

48. File Size

Avoid unnecessarily large files.

If a component becomes difficult to understand:

Extract:

Child components
Hooks
Utilities
Types
Constants

But do not split every five lines into a separate file.

The goal is readability.

49. Accessibility

Basic accessibility must be maintained.

Use:

Proper labels
Buttons for actions
Meaningful input labels
Keyboard-accessible interactions
Appropriate ARIA attributes when required
Good color contrast
Error messages associated with fields

Do not use clickable <div> elements when a button is appropriate.

50. Responsive UI

The application must be usable on:

Desktop
Tablet
Mobile

Do not spend excessive time on visual perfection.

Functionality and usability have priority.

51. Final Feature Checklist

Before considering a frontend feature complete:

 Component is reusable where appropriate
 No duplicate component exists
 API call is inside API layer
 No direct Axios calls inside UI components
 Redux used only when necessary
 Redux state is typed
 Request/response types exist
 Loading state handled
 Error state handled
 Empty state handled
 Form validation handled
 Authentication handled
 Role UI handled
 Backend authorization still trusted
 No magic strings
 Shared constants used
 Shared utilities reused
 No unnecessary any
 No unnecessary useMemo
 No unnecessary useCallback
 No unnecessary abstraction
 Responsive layout checked
 Existing related functionality checked
 Existing components reused where possible
 Complete user flow tested
52. Development Philosophy

Follow this priority:

Correctness
Reusability
Maintainability
Type safety
Simplicity
Performance
Visual polish

Do not sacrifice correctness for fewer lines of code.

Do not sacrifice readability for maximum abstraction.

Do not duplicate code merely to move faster.

Do not over-engineer simple requirements.

Always prefer the simplest reusable solution that fits the project.

53. Golden Rule

Before writing new frontend code:

SEARCH → UNDERSTAND → REUSE → EXTEND → ONLY THEN CREATE

Before changing existing code:

TRACE THE FLOW → CHECK DEPENDENCIES → MAKE THE SMALLEST SAFE CHANGE → TEST


### One important addition for your FoodFlow project

Because you're using **Redux Toolkit**, I'd keep the state responsibility very clear:

```text
                 React
                   │
        ┌──────────┴──────────┐
        ↓                     ↓
   Local UI State         Redux Toolkit
        │                     │
        │              Global/shared state
        │                     │
        └──────────┬──────────┘
                   ↓
              API Layer
                   ↓
                Axios
                   ↓
             Backend API

And for something like FEFO, don't put the algorithm in Redux or React:

Frontend
   ↓
"Give me FEFO preview"
   ↓
Backend API
   ↓
FEFO Use Case
   ↓
Database
   ↓
FEFO result
   ↓
Frontend displays it