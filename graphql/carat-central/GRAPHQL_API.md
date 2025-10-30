# Carat Central — GraphQL API (Frontend Developer Guide)

Purpose & scope
---------------
This document is the canonical frontend-facing reference for Carat Central's GraphQL API. It covers:
- endpoint, headers and auth flows,
- operation names & required inputs,
- permission model and where checks occur,
- failure modes and how the UI should handle them,
- recommended caching, pagination and optimistic-update practices,
- testing & E2E advice and sample GraphQL snippets.

Quick facts
-----------
- GraphQL endpoint: POST http://localhost:8003/graphql
- Transport: JSON POST for queries/mutations. Subscriptions exist in the schema (messageAdded) and require a supported transport (GraphQL over WebSocket or SSE) — ask backend for exact WS endpoint in your environment.
- Important headers (Fastify lowercases headers; always send lowercase):
  - `authorization: Bearer <accessToken>` — for authenticated requests
  - `org-id: <organization-uuid>` — required for protected org-scoped operations
  - Optional: `x-request-id`, `accept-language` (for tracing / i18n)
- Public operations (eg. `publicDiamonds`) do NOT require auth or org-id.

Table of contents
-----------------
1. Quick operation index (by domain)  
2. Authentication & token handling (mapping to schema)  
3. Organization (tenant) model & org-id guidance  
4. Permissions & mePermissions usage  
5. Diamonds API — types, pagination, examples  
6. Requests / Responses — shapes & sample flows  
7. Chats & Subscriptions (messageAdded)  
8. Orders & Subscriptions (billing)  
9. Error shapes, codes & frontend normalization  
10. Caching, pagination & mutation patterns (detailed)  
11. Testing / E2E tips & seeding  
12. GraphQL Codegen + client wrapper examples  
13. Recommended backend additions & contact

1) Quick operation index (by domain)
------------------------------------
Auth
- caratRequestEmailOTP(email): CaratOTPResponse
- caratRequestMobileOTP(countryCode, mobile): CaratOTPResponse
- caratVerifyEmailOTP(email, otp): CaratAuthPayload
- caratVerifyMobileOTP(countryCode, mobile, otp): CaratAuthPayload
- caratRefreshToken(refreshToken): CaratRefreshTokenResponse
- caratLogout / caratLogoutAll

Organizations
- myOrganizations(): [Organization!]!
- createOrganization(data: CreateOrganizationInput!): Organization!
- updateOrganization(data: UpdateOrganizationInput!, id: String!): Organization!
- inviteUserToOrganization(organizationId, roleId, userId)
- roles(organizationId): [Role!]!

Diamonds (core)
- createDiamond(input: CreateDiamondInput!): Diamond! (org scoped)
- updateDiamond(id, input: UpdateDiamondInput!): Diamond!
- deleteDiamond(id): DeleteResult!
- publishDiamond(id) / unpublishDiamond(id)
- diamonds(after, before, first, last): DiamondConnection!
- publicDiamonds(...): DiamondConnection!
- diamond(id): Diamond!

Requests & Responses
- createRequest(input: CreateRequestInput!): DiamondRequest!
- submitResponse(input: SubmitResponseInput!, requestId: String!): RequestResponse!
- requestResponses(requestId): [RequestResponse!]!
- acceptResponse(responseId), rejectResponse(responseId)

Chats & Messages
- createChat(isGroup, name, participantIds): Chat!
- chat(chatId): Chat
- chatMessages(chatId, cursor, limit): [Message!]!
- sendMessage(chatId, content, receiverId, s3Key): Message!
- markMessageAsRead(messageId): Message!
- Subscription: messageAdded(chatId): Message! (use WS/SSE)

Orders & Payments
- createOrder(buyerNotes, diamondIds, sellerOrgId, shippingAddress): Order!
- updateOrderStatus(orderId, sellerNotes, status)
- updatePaymentStatus(orderId, paymentMethod, paymentStatus)

Misc
- caratMe(): CaratUserType!
- permissions(organizationId): [Permission!]!
- mePermissions(orgId: ID!) — recommended backend addition (see section 12)

2) Authentication & token handling (mapping to schema)
-----------------------------------------------------
Flows (schema-grounded)
- Request OTP: caratRequestEmailOTP / caratRequestMobileOTP → returns { message, otpId }
- Verify OTP: caratVerifyEmailOTP / caratVerifyMobileOTP → returns CaratAuthPayload { accessToken, refreshToken, users }
- Refresh: caratRefreshToken(refreshToken) → returns new tokens.

Header usage
- All protected mutations/queries require `authorization` header and, if org-scoped, `org-id`.
- Example header set:
  - authorization: Bearer eyJ...
  - org-id: b3e6f0e2-...

Storage recommendations
- Access token: keep in-memory; if persisted, make short-lived.
- Refresh token: prefer httpOnly secure cookie (backend support).
- On 401 / UNAUTHENTICATED: attempt caratRefreshToken, else redirect to login.

3) Organization (tenant) model & org-id guidance
------------------------------------------------
- Protected operations that create/read org-scoped resources (Diamond.organizationId, Organization APIs) require `org-id`.
- Pattern:
  1. After login call caratMe() to get user identity.
  2. Call myOrganizations() (or myOrganizations seed) to list orgs.
  3. Ask the user to select an org; set `org-id` for subsequent requests.

4) Permissions & mePermissions usage
-----------------------------------
- Server-enforced strings are resource:action (e.g., diamonds:create).
- Recommended query (backend): mePermissions(orgId: ID!): [String!]! — frontend should cache per org and re-fetch on 403.
- Use permissions to hide/disable UI; treat server as authoritative.

5) Diamonds API — types, pagination, examples
---------------------------------------------
Types (key fields from schema.gql)
- Diamond: { id, organizationId, ownerId, carat, pricePerCarat, totalPrice, isPublic, status, createdAt, updatedAt, ... }
- CreateDiamondInput: { carat, certificate?, certificateNumber?, clarity, color, cut, isPublic = false, name?, pricePerCarat, shape, stockNumber, totalPrice }
- UpdateDiamondInput: { isPublic?, name?, pricePerCarat?, status?, totalPrice? }

Pagination (DiamondConnection)
- Schema returns DiamondConnection { edges: [DiamondEdge], pageInfo, totalCount }
- DiamondEdge: { node: Diamond!, cursor: String! }
- PageInfo: { endCursor, startCursor, hasNextPage, hasPreviousPage }

Cursor pagination example
Query:
```graphql
query GetDiamonds($first: Int, $after: String, $orgId: ID) {
  diamonds(first: $first, after: $after) {
    edges { cursor node { id name stockNumber totalPrice organizationId } }
    pageInfo { endCursor hasNextPage }
    totalCount
  }
}
```
Client usage:
- Request first page: first=20
- To fetch next page: set after = pageInfo.endCursor
- For infinite scroll, append edges by node.id uniqueness and use cache merge strategies.

Sample server response shape (normalized)
{
  "data": {
    "diamonds": {
      "edges": [
        {
          "cursor": "cursor123",
          "node": { "id": "d1", "name": "A", ... }
        }
      ],
      "pageInfo": { "endCursor": "cursor123", "hasNextPage": true },
      "totalCount": 312
    }
  }
}

Search & similarity
- findSimilarDiamonds(diamondId, limit=10): returns DiamondSearchResult with `similarity` score (useful for ranking UI).

6) Requests / Responses — shapes & sample flows
-----------------------------------------------
- Create request: createRequest(input: CreateRequestInput!) → DiamondRequest
- Submit response: submitResponse(input: SubmitResponseInput!, requestId: String!) → RequestResponse
- Accept/reject: acceptResponse(responseId), rejectResponse(responseId)

Fields to surface
- DiamondRequest: { id, title, description, isPublic, minCarat, maxCarat, currency, shapes, tags, requesterId, requesterOrgId, responses[] }
- RequestResponse: { id, message, proposedDiamonds[], proposedPrice, status }

7) Chats & Subscriptions (messageAdded)
---------------------------------------
- Chat & Message types: Message includes { id, chatId, content, senderId, createdAt, s3Key }
- Query chatMessages(chatId, cursor, limit) supports cursor-style pagination (cursor param here is different; confirm with backend tests).
- Subscription: messageAdded(chatId: String!): Message! — requires WS/SSE.
  - Typical client flow (GraphQL WS):
    1. Open WS connection to backend subscription endpoint.
    2. Send auth in connection_init (e.g., payload: { authorization: "Bearer ..." , orgId: "..." }).
    3. Subscribe with: subscription { messageAdded(chatId:"<id>") { id content senderId createdAt } }
- If backend doesn't provide WS, poll chatMessages with cursor/limit.

8) Orders & Payments
---------------------
- Order and OrderItem types include snapshot fields (diamondSnapshot) to avoid client-side re-fetch after sale.
- Payment flow:
  - createOrder(...) → returns Order with paymentStatus (PaymentStatus: PENDING/PAID/FAILED/REFUNDED).
  - updatePaymentStatus(orderId, paymentMethod, paymentStatus)

9) Error shapes, codes & frontend normalization
-----------------------------------------------
GraphQL error payload (typical)
{
  "errors": [
    {
      "message": "Insufficient permissions. Required: diamonds:create.",
      "locations": [...],
      "path": ["createDiamond"],
      "extensions": { "code": "FORBIDDEN", "requestId": "abc" }
    }
  ],
  "data": null
}

Recommended normalized error object for UI:
{ message, code, path, details, requestId = extensions.requestId }

Common extension.code values (map to actions)
- UNAUTHENTICATED → 401 flow: try refresh token, then redirect to login.
- FORBIDDEN → 403 flow: show inline permission message; optionally refresh mePermissions.
- BAD_USER_INPUT / VALIDATION → 400 flow: map to form field errors.
- TOO_MANY_REQUESTS / RATE_LIMIT → 429 flow: backoff + retry UI.
- INTERNAL / SERVER_ERROR → show generic retry / contact support with requestId.

Client-side normalization (example pattern)
- If errors exist: take first error, extract message and extensions.code, if code === 'FORBIDDEN' show friendly inline text; if 'UNAUTHENTICATED' attempt refresh.

10) Caching, pagination & mutation patterns (detailed)
------------------------------------------------------
Apollo recommendations (type policies)
- For connection-style responses:
  - use keyFields for Diamond and set proper merge function to append edges when fetching more.
- Example typePolicy snippet:
  - diamonds: { keyArgs: false, merge(existing, incoming) { /* append unique nodes by id */ } }

Mutations & cache update patterns
- createDiamond:
  - On success: either refetch diamonds or cache.modify to insert new Edge with cache.identify.
- updateDiamond:
  - Use cache.writeFragment / cache.modify to update fields in place.
- deleteDiamond:
  - cache.evict({ id: cache.identify({ __typename: 'Diamond', id }) }); cache.gc();

Optimistic updates
- Use only when rollback is trivial (e.g., UI optimistic add that will be refetched).

11) Testing / E2E tips & seeding
-------------------------------
- Seeds: use project seeds (e.g., npx tsx libs/prisma-carat-central/seed.ts) to generate deterministic data.
- Nest + Fastify test harness: use NestFastifyApplication + app.inject() and set headers lowercased (org-id, authorization).
- For permission tests: seed users with specific Permission records and assert responses and UI gating.

12) GraphQL Codegen + client wrapper examples
---------------------------------------------
Minimal codegen config (example)
- Add to repo codegen.yml (ask backend for schema path if different):
```yaml
schema: http://localhost:8003/graphql
documents: src/**/*.graphql
generates:
  src/@generated/graphql.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
    config:
      withHooks: true
      withHOC: false
      withComponent: false
```

Improved fetch wrapper (normalize GraphQL errors)
```js
// headers: authorization + org-id (lowercase)
async function graphqlRequest(query, variables = {}, token, orgId) {
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': token ? `Bearer ${token}` : undefined,
      'org-id': orgId || undefined,
    },
    body: JSON.stringify({ query, variables }),
  });
  const payload = await res.json();
  if (payload.errors && payload.errors.length) {
    const first = payload.errors[0];
    const normalized = {
      message: first.message,
      code: first.extensions?.code,
      path: first.path,
      details: payload.errors,
      requestId: first.extensions?.requestId || null,
    };
    throw normalized;
  }
  return payload.data;
}
```

13) Recommended backend additions (frontend asks)
------------------------------------------------
- mePermissions(orgId: ID!): [String!]! — authoritative permission list for selected org.
- userOrganizations / myOrganizations with role membership and permissions attached.
- Cursor-based pagination for all large lists (supported pattern in diamonds/publicDiamonds).
- Consistent field-level validation error shape (e.g., extensions.validation: { field: message }).
- Expose request-id in GraphQL errors for tracing.

14) Appendix: enums & type quick reference
------------------------------------------
- CutGrade: IDEAL, EXCELLENT, VERY_GOOD, GOOD, FAIR, POOR  
- ColorGrade: D, E, F, G, H, I, J, K  
- ClarityGrade: FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1  
- DiamondShape: ROUND, PRINCESS, CUSHION, EMERALD, OVAL  
- DiamondStatus: AVAILABLE, RESERVED, SOLD

Contact / changes
-----------------
For missing APIs, permission names or schema extensions, open a backend request and include:
- exact frontend use case,
- sample queries/mutations expected,
- any UX constraints (latency/consistency expectations).

This document is intentionally pragmatic and schema-grounded. If you want a one-page cheat sheet (compact snippets only), a TypeScript GraphQL codegen config added to the repo, or generated typed hooks for the most-used operations, request it and I will add it.
