# Carat Central — Frontend Developer Guide

Purpose
- Single-source-of-truth for frontend engineers building the Carat Central Expo/Tamagui app.
- Maps backend GraphQL schema -> screens, describes flows, components, state, navigation, and testing expectations.

Quick start (frontend)
- From repo root:
  1. pnpm install
  2. pnpm --filter @bdt/carat-central start
  3. Run type-checks: pnpm --filter @bdt/carat-central run type-check
- Dev tools: React Native Debugger, Expo CLI, Tamagui compiler (see top-level README and Tamagui docs).

Repo & package notes
- apps/carat-central — app entry. Keep app-specific Tamagui config copied from @bdt/ui.
- packages/ui — design tokens and themes. Use semantic tokens (e.g. $background) everywhere.
- packages/components — shared UI primitives. Add components here and export via src/index.ts.
- packages/network — GraphQL client, auth helpers, hooks. Use AuthManager / useAuth from network package.

High-level frontend architecture
- Presentation: Tamagui components + shared components from packages/components.
- Navigation: React Navigation (stack + tabs + modal stacks) — use typed param lists.
- Data: Apollo GraphQL client (packages/network). Use codegen-generated types where available.
- State: Prefer server state via Apollo. Local UI state with React context or Zustand for cross-cutting state.
- Styling: Tamagui tokens from packages/ui — no hard-coded colors/spacing.

Primary screens & purposes
1. Auth (Onboarding)
   - Screens: LoginOptions, RequestOTP (email/mobile/whatsapp), VerifyOTP, OAuthCallback
   - Purpose: perform OTP/OAuth flows using mutations:
     - caratRequestEmailOTP / caratVerifyEmailOTP
     - caratRequestMobileOTP / caratVerifyMobileOTP
   - Notes: store accessToken/refreshToken using AuthManager from packages/network.

2. Home / Dashboard
   - Screens: Dashboard (summary), Quick Actions, My Organizations summary, Recent Chats
   - Purpose: Surface user subscription and quick search. Query: caratMe, mySubscription, myOrganizations.

3. Diamond List / Browser
   - Screens: DiamondList (public / my inventory toggle), DiamondFilters, DiamondDetail
   - Purpose: browse diamonds with Relay-style pagination (diamonds/publicDiamonds queries).
   - Queries & interactions:
     - diamonds(after,before,first,last) -> DiamondConnection (edges,node)
     - publishDiamond / unpublishDiamond / updateDiamond / deleteDiamond (mutations)
     - searchDiamonds(filters) or findSimilarDiamonds for recommendations
   - Pagination: implement cursor-based forward/back navigation using pageInfo.endCursor and hasNextPage.

4. Diamond Detail
   - Purpose: show images, specs, 4Cs, certification, price, seller/org, vector-similarity results.
   - Queries: diamond(id), findSimilarDiamonds(diamondId)
   - Actions: Add to order, message seller, request quote (submitResponse).

5. Create / Edit Diamond (Inventory)
   - Purpose: Form for CreateDiamondInput / UpdateDiamondInput.
   - Validation: required fields (carat, shape, clarity, color, pricePerCarat, totalPrice, stockNumber).
   - Mutations: createDiamond(input), updateDiamond(id,input), publishDiamond(id).

6. Requests & Responses
   - Screens: MyRequests, RequestDetail, SubmitResponse flow
   - Queries: myRequests, request(requestId), requestResponses(requestId)
   - Mutations: submitResponse(input,requestId), acceptResponse, rejectResponse

7. Orders & Checkout
   - Screens: Cart/OrderCreate, OrderDetail, MyOrders, MyOrgOrders
   - Queries: myOrders, order(orderId)
   - Mutations: createOrder, cancelOrder, updatePaymentStatus, updateOrderStatus

8. Chat & Messaging
   - Screens: ChatsList, ChatThread
   - Purpose: real-time messaging using GraphQL subscriptions (messageAdded).
   - Queries/Mutations: myChats, chatMessages(chatId, cursor, limit), sendMessage, markMessageAsRead
   - Notes: subscription messageAdded(chatId) -> append to thread. Persist read receipts via markMessageAsRead.

9. Organizations & Roles
   - Screens: OrganizationList, OrganizationDetail, InviteMember, RoleManagement
   - Queries: myOrganizations, organization(id), roles(organizationId), permissions(organizationId)
   - Mutations: createOrganization, inviteUserToOrganization, assignRole, removeUserFromOrganization

Cross-cutting UX patterns
- Loading / Error handling: central ErrorBoundary + per-component skeleton states.
- Empty states: Provide CTAs (e.g., "Create diamond", "Post request") that match user subscription.
- Optimistic updates: use for actions like sendMessage, publish/unpublish diamond, acceptResponse.
- Accessibility: focus management for modals, proper labels for inputs, readable color contrast using tokens.

Component responsibilities & composition
- Atomic components in packages/components (Button, Badge, Card, Avatar, ImageGallery, TagList, FormField).
- Screen containers: handle data fetching (Apollo hooks) and pass data to presentational components.
- Presentational components: pure renderers that accept typed props and tokens for styling.

GraphQL & codegen recommendations
- Use apps' codegen helper (see apps/*/codegen.ts) to generate hooks/types from graphql schema and queries.
- Keep GraphQL queries co-located inside screen folders (e.g., screens/Diamond/DiamondQueries.ts).
- Avoid editing generated artifacts under src/generated — update schema and re-run codegen.

Auth flow (frontend)
1. Present login options (email/mobile/WhatsApp/OAuth).
2. Request OTP (caratRequestEmailOTP / caratRequestMobileOTP / caratRequestWhatsAppOTP) -> receive otpId.
3. Verify OTP (caratVerify*OTP) -> receive CaratAuthPayload { accessToken, refreshToken, users }.
4. Use AuthManager to store tokens in secure storage; set Authorization header in Apollo client via packages/network.
5. Refresh flow: call caratRefreshToken(refreshToken) when token expires.

Search & vector similarity notes
- Basic search: searchDiamonds(filters) or server-side filters via search endpoint.
- Vector search: findSimilarDiamonds(diamondId). Display 'similarity' score and allow side-by-side comparisons.
- UI: display similarity visually (bar or percent) and allow filtering down to top-N.

Navigation skeleton (recommended)
- RootStack:
  - AuthStack (LoginFlows)
  - MainTab:
    - BrowseStack (DiamondList -> DiamondDetail -> Create/Edit)
    - RequestsStack
    - ChatsStack
    - OrdersStack
    - ProfileStack
  - ModalStack (CreateDiamond modal, InviteMember modal)
- Use typed navigation params (TypeScript) for robust screens.

Testing & quality
- Unit tests: packages/components with pnpm --filter @bdt/components test
- Screen/E2E: Detox/E2E in apps/*/e2e. Add representative flows for chat, create diamond, login.
- Type safety: run pnpm type-check in the package.
- Lint/format: adhere to repo ESLint/Prettier configs.

Performance & offline considerations
- Use paginated fetching for large lists.
- Cache policies: reasonable defaults (cache-first for lists, network-only for write-heavy endpoints).
- Media: load thumbnails first, lazy-load full resolution images.
- Offline: queue messages locally and sync on reconnect where feasible.

Dev checklist for a new screen (example: DiamondDetail)
1. Create folder apps/carat-central/src/screens/DiamondDetail/
   - DiamondDetail.tsx (container)
   - DiamondDetail.ui.tsx (presentational)
   - diamondQueries.ts (GraphQL queries)
2. Add localized strings (if i18n) and tests under __tests__.
3. Use Tamagui tokens from @bdt/ui for styles.
4. Use generated GraphQL types and hooks from codegen.
5. Add route to navigation typings and MainTab navigator.
6. Run pnpm --filter @bdt/carat-central start and verify on device/simulator.

Mapping schema.gql -> UI quick reference
- Query caratMe -> Dashboard / Profile
- Query mySubscription -> feature gating on Dashboard / Create Diamond
- Query diamonds / publicDiamonds -> DiamondList with Relay pagination
- Query diamond(id) -> DiamondDetail screen
- Mutation createDiamond/updateDiamond -> Create/Edit screens
- Mutation sendMessage + subscription messageAdded -> Chat screens
- Mutation caratRequestEmailOTP / caratVerifyEmailOTP -> Auth screens

Developer FAQs
- Where to add shared UI components? packages/components/src/
- Where to change tokens? packages/ui/src/tokens.ts (coordination required — follow token migration steps).
- Where is the Apollo client configured? packages/network/src/apollo-client.ts
- How to run codegen? Use app-specific codegen helper or pnpm script defined in app package.json.

Onboarding checklist for new frontend dev
1. Clone repo, pnpm install.
2. Read this guide and apps/carat-central/App_backend-README.md.
3. Run app locally using pnpm --filter @bdt/carat-central start.
4. Run GraphQL codegen and inspect generated types.
5. Implement a small UI change (e.g., header title) and open a PR following branch/CI rules.

Appendix — useful GraphQL snippets
- Fetch diamonds (first page):
```graphql
query Diamonds($first: Int = 20) {
  diamonds(first: $first) {
    edges { cursor node { id name carat totalPrice } }
    pageInfo { hasNextPage endCursor }
  }
}
```
- Send message:
```graphql
mutation SendMessage($chatId: String!, $content: String) {
  sendMessage(chatId: $chatId, content: $content) { id content createdAt senderId }
}
```
- Request & verify email OTP:
```graphql
mutation RequestEmailOTP($email: String!) {
  caratRequestEmailOTP(email: $email) { otpId message }
}
mutation VerifyEmailOTP($email: String!, $otp: String!) {
  caratVerifyEmailOTP(email: $email, otp: $otp) { accessToken refreshToken users { id email } }
}
```

Recommended next actions (short)
- Add this file to repo: apps/carat-central/FRONTEND_DEVELOPER_GUIDE.md
- Ensure codegen hooks are set up and shared UI components exist for common patterns.
- On first feature PR, include unit and basic E2E tests that exercise GraphQL interactions.
