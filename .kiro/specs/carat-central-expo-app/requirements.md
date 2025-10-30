# Carat Central Expo App - Requirements Document

## Introduction

The Carat Central Expo App is a comprehensive mobile application for diamond trading, built with Expo Router and modern React Native technologies. The app provides a complete diamond marketplace experience with authentication, inventory management, real-time chat, order processing, and AI-powered features. The application integrates with a GraphQL backend and follows modern mobile design patterns with a focus on user experience and performance.

## Glossary

- **Carat_Central_App**: The main mobile application built with Expo and React Native
- **GraphQL_Backend**: The backend API service providing data through GraphQL schema
- **Diamond_Marketplace**: The core trading platform for diamond transactions
- **Organization_System**: Multi-tenant system where users belong to organizations
- **Auth_Guard**: Authentication middleware that protects authenticated routes
- **Expo_Router**: File-based routing system for React Native navigation
- **Tamagui_Config**: UI framework configuration for consistent theming
- **Shared_Components**: Reusable UI components in the monorepo packages
- **Real_Time_Chat**: WebSocket-based messaging system for user communication
- **AI_Agent**: Intelligent assistant for diamond recommendations and support
- **OTP_Authentication**: One-time password authentication via email/mobile
- **Diamond_CRUD**: Create, Read, Update, Delete operations for diamond inventory
- **Order_Management**: Complete order lifecycle from creation to fulfillment
- **Permission_System**: Role-based access control for different user types

## Requirements

### Requirement 1

**User Story:** As a diamond trader, I want to authenticate using OTP via email or mobile, so that I can securely access the platform.

#### Acceptance Criteria

1. WHEN a user enters their email address, THE Carat_Central_App SHALL send an OTP via caratRequestEmailOTP mutation
2. WHEN a user enters their mobile number, THE Carat_Central_App SHALL send an OTP via caratRequestMobileOTP mutation
3. WHEN a user enters a valid OTP, THE Carat_Central_App SHALL authenticate via caratVerifyEmailOTP or caratVerifyMobileOTP
4. WHEN authentication succeeds, THE Carat_Central_App SHALL store access and refresh tokens securely
5. WHEN tokens expire, THE Carat_Central_App SHALL automatically refresh using caratRefreshToken

### Requirement 2

**User Story:** As an authenticated user, I want to explore public diamonds without organization selection, so that I can browse available inventory.

#### Acceptance Criteria

1. WHEN a user accesses the explore screen, THE Carat_Central_App SHALL display public diamonds via publicDiamonds query
2. WHEN displaying diamonds, THE Carat_Central_App SHALL show carat, price, clarity, color, cut, and shape information
3. WHEN a user scrolls to the bottom, THE Carat_Central_App SHALL load more diamonds using cursor-based pagination
4. WHEN a user taps a diamond, THE Carat_Central_App SHALL navigate to diamond detail screen
5. WHEN no authentication is present, THE Carat_Central_App SHALL still allow public diamond browsing

### Requirement 3

**User Story:** As an authenticated user, I want to select an organization, so that I can access organization-specific features and inventory.

#### Acceptance Criteria

1. WHEN a user completes authentication, THE Carat_Central_App SHALL fetch user organizations via myOrganizations query
2. WHEN multiple organizations exist, THE Carat_Central_App SHALL display organization selection screen
3. WHEN a user selects an organization, THE Carat_Central_App SHALL set org-id header for subsequent requests
4. WHEN organization is selected, THE Carat_Central_App SHALL enable access to protected features
5. WHEN switching organizations, THE Carat_Central_App SHALL update the org-id context and refresh permissions

### Requirement 4

**User Story:** As an organization member, I want to manage my diamond inventory, so that I can create, update, and delete diamond listings.

#### Acceptance Criteria

1. WHEN a user accesses inventory screen, THE Carat_Central_App SHALL display organization diamonds via diamonds query
2. WHEN creating a diamond, THE Carat_Central_App SHALL use createDiamond mutation with required fields
3. WHEN updating a diamond, THE Carat_Central_App SHALL use updateDiamond mutation with changed fields
4. WHEN deleting a diamond, THE Carat_Central_App SHALL use deleteDiamond mutation and remove from cache
5. WHEN publishing status changes, THE Carat_Central_App SHALL use publishDiamond or unpublishDiamond mutations

### Requirement 5

**User Story:** As a diamond buyer, I want to create and manage requests for specific diamonds, so that I can communicate my requirements to sellers.

#### Acceptance Criteria

1. WHEN creating a request, THE Carat_Central_App SHALL use createRequest mutation with specification criteria
2. WHEN viewing requests, THE Carat_Central_App SHALL display myRequests and myOrgRequests separately
3. WHEN a request receives responses, THE Carat_Central_App SHALL show response count and details
4. WHEN reviewing responses, THE Carat_Central_App SHALL allow acceptResponse or rejectResponse actions
5. WHEN request expires, THE Carat_Central_App SHALL update status and disable response actions

### Requirement 6

**User Story:** As a diamond seller, I want to respond to buyer requests, so that I can propose suitable diamonds and pricing.

#### Acceptance Criteria

1. WHEN viewing public requests, THE Carat_Central_App SHALL display publicRequests with filtering options
2. WHEN responding to a request, THE Carat_Central_App SHALL use submitResponse mutation with proposed diamonds
3. WHEN proposing diamonds, THE Carat_Central_App SHALL allow selection from organization inventory
4. WHEN setting pricing, THE Carat_Central_App SHALL validate against minimum requirements
5. WHEN response is submitted, THE Carat_Central_App SHALL update local cache and show confirmation

### Requirement 7

**User Story:** As a platform user, I want to communicate via real-time chat, so that I can negotiate and coordinate with other traders.

#### Acceptance Criteria

1. WHEN accessing chat list, THE Carat_Central_App SHALL display myChats with unread message indicators
2. WHEN opening a chat, THE Carat_Central_App SHALL load chatMessages with cursor-based pagination
3. WHEN sending a message, THE Carat_Central_App SHALL use sendMessage mutation and update UI optimistically
4. WHEN receiving messages, THE Carat_Central_App SHALL subscribe to messageAdded subscription
5. WHEN marking as read, THE Carat_Central_App SHALL use markMessageAsRead mutation and update status

### Requirement 8

**User Story:** As a buyer, I want to create and track orders, so that I can purchase diamonds and monitor delivery status.

#### Acceptance Criteria

1. WHEN creating an order, THE Carat_Central_App SHALL use createOrder mutation with selected diamonds
2. WHEN viewing orders, THE Carat_Central_App SHALL display myOrders with status and payment information
3. WHEN order status changes, THE Carat_Central_App SHALL reflect updates in real-time
4. WHEN payment is required, THE Carat_Central_App SHALL integrate with payment processing
5. WHEN order is completed, THE Carat_Central_App SHALL show delivery confirmation and receipt

### Requirement 9

**User Story:** As an organization admin, I want to manage organization settings and members, so that I can control access and permissions.

#### Acceptance Criteria

1. WHEN accessing organization settings, THE Carat_Central_App SHALL display current organization details
2. WHEN updating organization, THE Carat_Central_App SHALL use updateOrganization mutation
3. WHEN inviting users, THE Carat_Central_App SHALL use inviteUserToOrganization mutation
4. WHEN managing roles, THE Carat_Central_App SHALL display and assign roles via assignRole mutation
5. WHEN removing members, THE Carat_Central_App SHALL use removeUserFromOrganization mutation

### Requirement 10

**User Story:** As a user, I want to interact with an AI agent, so that I can get intelligent recommendations and support.

#### Acceptance Criteria

1. WHEN accessing AI chat, THE Carat_Central_App SHALL provide a dedicated chat interface
2. WHEN asking questions, THE Carat_Central_App SHALL process queries and provide relevant responses
3. WHEN requesting recommendations, THE Carat_Central_App SHALL use findSimilarDiamonds for suggestions
4. WHEN getting support, THE Carat_Central_App SHALL provide contextual help and guidance
5. WHEN chat history exists, THE Carat_Central_App SHALL maintain conversation context

### Requirement 11

**User Story:** As a developer, I want reusable UI components in the monorepo, so that I can maintain consistency across different apps.

#### Acceptance Criteria

1. WHEN creating components, THE Carat_Central_App SHALL place shared components in packages/components
2. WHEN styling components, THE Carat_Central_App SHALL use Tamagui_Config for consistent theming
3. WHEN handling notifications, THE Carat_Central_App SHALL use shared toast and alert components
4. WHEN displaying data, THE Carat_Central_App SHALL use shared card and list components
5. WHEN managing state, THE Carat_Central_App SHALL use shared hooks and utilities

### Requirement 12

**User Story:** As a developer, I want comprehensive error handling, so that users receive appropriate feedback for different error scenarios.

#### Acceptance Criteria

1. WHEN GraphQL errors occur, THE Carat_Central_App SHALL normalize error responses with code and message
2. WHEN authentication fails, THE Carat_Central_App SHALL attempt token refresh before redirecting to login
3. WHEN permission errors occur, THE Carat_Central_App SHALL display appropriate access denied messages
4. WHEN network errors occur, THE Carat_Central_App SHALL provide retry mechanisms and offline indicators
5. WHEN validation errors occur, THE Carat_Central_App SHALL highlight specific form fields with error messages

### Requirement 13

**User Story:** As a tester, I want a test navigation screen, so that I can easily access and test individual screens during development.

#### Acceptance Criteria

1. WHEN in development mode, THE Carat_Central_App SHALL provide a test navigation screen
2. WHEN accessing test screen, THE Carat_Central_App SHALL list all available screens with navigation buttons
3. WHEN testing screens, THE Carat_Central_App SHALL allow direct navigation without authentication requirements
4. WHEN debugging, THE Carat_Central_App SHALL provide screen metadata and current state information
5. WHEN in production, THE Carat_Central_App SHALL hide or disable the test navigation screen

### Requirement 14

**User Story:** As a user, I want responsive and performant UI, so that I can have a smooth experience across different devices.

#### Acceptance Criteria

1. WHEN loading data, THE Carat_Central_App SHALL show appropriate loading states and skeleton screens
2. WHEN displaying lists, THE Carat_Central_App SHALL implement efficient virtualization for large datasets
3. WHEN caching data, THE Carat_Central_App SHALL use Apollo Client with proper cache policies
4. WHEN images load, THE Carat_Central_App SHALL provide progressive loading with placeholders
5. WHEN offline, THE Carat_Central_App SHALL provide cached data and offline indicators

### Requirement 15

**User Story:** As a user, I want intuitive navigation, so that I can easily move between different sections of the app.

#### Acceptance Criteria

1. WHEN navigating, THE Carat_Central_App SHALL use Expo_Router with file-based routing structure
2. WHEN accessing main features, THE Carat_Central_App SHALL provide bottom tab navigation
3. WHEN viewing details, THE Carat_Central_App SHALL use stack navigation with proper back buttons
4. WHEN switching contexts, THE Carat_Central_App SHALL maintain navigation state appropriately
5. WHEN deep linking, THE Carat_Central_App SHALL handle URL-based navigation to specific screens