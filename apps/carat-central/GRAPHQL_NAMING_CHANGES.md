# GraphQL Naming Convention Changes

This document outlines the changes made to ensure all GraphQL fragments, queries, and mutations have unique names for proper caching.

## Naming Convention

All GraphQL operations now follow a **Relay-style naming convention** with module prefixes:
- Format: `ModuleName_OperationType`
- Example: `Chat_GetMyChats`, `Diamond_Basic`, `Order_Create`

## Changes by Module

### 1. Auth Module (`auth.graphql`)
**Queries:**
- `CaratMe` → `Auth_GetMe`
- `MyOrganizations` → `Auth_GetMyOrganizations`

**Mutations:**
- `CaratRequestEmailOTP` → `Auth_RequestEmailOTP`
- `CaratRequestMobileOTP` → `Auth_RequestMobileOTP`
- `CaratVerifyEmailOTP` → `Auth_VerifyEmailOTP`
- `CaratVerifyMobileOTP` → `Auth_VerifyMobileOTP`
- `CaratRefreshToken` → `Auth_RefreshToken`
- `CaratLogout` → `Auth_Logout`

### 2. Chat Module (`chats.graphql`)
**Fragments:**
- `MessageBasic` → `Chat_Message`
- `ChatParticipantBasic` → `Chat_Participant`
- `ChatBasic` → `Chat_Basic`
- `ChatWithMessages` → `Chat_WithMessages`

**Queries:**
- `GetMyChats` → `Chat_GetMyChats`
- `GetChat` → `Chat_GetChat`
- `GetChatMessages` → `Chat_GetMessages`

**Mutations:**
- `CreateChat` → `Chat_Create`
- `SendMessage` → `Chat_SendMessage`
- `MarkMessageAsRead` → `Chat_MarkMessageAsRead`
- `UpdateLastRead` → `Chat_UpdateLastRead`
- `DeleteMessage` → `Chat_DeleteMessage`
- `AddChatParticipant` → `Chat_AddParticipant`
- `RemoveChatParticipant` → `Chat_RemoveParticipant`

**Subscriptions:**
- `MessageAdded` → `Chat_MessageAdded`

### 3. Diamond Module (`diamonds.graphql`)
**Fragments:**
- `DiamondBasic` → `Diamond_Basic`
- `DiamondConnection` → `Diamond_Connection`

**Queries:**
- `GetDiamonds` → `Diamond_GetAll`
- `GetPublicDiamonds` → `Diamond_GetPublic`
- `GetDiamond` → `Diamond_GetById`
- `SearchDiamonds` → `Diamond_Search`
- `FindSimilarDiamonds` → `Diamond_FindSimilar`

**Mutations:**
- `CreateDiamond` → `Diamond_Create`
- `UpdateDiamond` → `Diamond_Update`
- `DeleteDiamond` → `Diamond_Delete`
- `PublishDiamond` → `Diamond_Publish`
- `UnpublishDiamond` → `Diamond_Unpublish`

### 4. Order Module (`orders.graphql`)
**Fragments:**
- `UserBasic` → `Order_User`
- `OrganizationBasic` → `Order_Organization`
- `OrderItemBasic` → `Order_Item`
- `OrderBasic` → `Order_Basic`

**Queries:**
- `GetMyOrders` → `Order_GetMy`
- `GetMyOrgOrders` → `Order_GetMyOrg`
- `GetOrder` → `Order_GetById`

**Mutations:**
- `CreateOrder` → `Order_Create`
- `UpdateOrderStatus` → `Order_UpdateStatus`
- `UpdatePaymentStatus` → `Order_UpdatePaymentStatus`
- `CancelOrder` → `Order_Cancel`

### 5. Request Module (`requests.graphql`)
**Fragments:**
- `UserBasicInfo` → `Request_User`
- `OrgBasicInfo` → `Request_Organization`
- `RequestResponseBasic` → `Request_Response`
- `DiamondRequestBasic` → `Request_Basic`
- `DiamondRequestWithResponses` → `Request_WithResponses`

**Queries:**
- `GetMyRequests` → `Request_GetMy`
- `GetMyOrgRequests` → `Request_GetMyOrg`
- `GetPublicRequests` → `Request_GetPublic`
- `GetRequest` → `Request_GetById`
- `GetRequestResponses` → `Request_GetResponses`

**Mutations:**
- `CreateRequest` → `Request_Create`
- `UpdateRequest` → `Request_Update`
- `SubmitResponse` → `Request_SubmitResponse`
- `AcceptResponse` → `Request_AcceptResponse`
- `RejectResponse` → `Request_RejectResponse`

### 6. Organization Module (`organizations.graphql`)
**Fragments:**
- `OrganizationDetail` → `Org_Basic`
- `OrganizationMemberFragment` → `Org_Member`
- `OrganizationDetailFragment` → `Org_Detail`

**Queries:**
- `GetOrganization` → `Org_GetById`
- `GetOrganizationRoles` → `Org_GetRoles`
- `GetOrganizationPermissions` → `Org_GetPermissions`

**Mutations:**
- `UpdateOrganization` → `Org_Update`
- `CreateOrganization` → `Org_Create`
- `InviteUserToOrganization` → `Org_InviteUser`
- `RemoveUserFromOrganization` → `Org_RemoveUser`
- `AssignRole` → `Org_AssignRole`

## Benefits

1. **Unique Identifiers**: Every fragment, query, and mutation now has a globally unique name
2. **Better Caching**: GraphQL clients (Apollo, Relay, etc.) can properly cache operations without conflicts
3. **Improved Organization**: Module prefixes make it clear which domain each operation belongs to
4. **Easier Debugging**: Unique names make it easier to trace operations in network logs and dev tools
5. **Scalability**: New modules can be added without worrying about naming conflicts

## Migration Guide

If you have existing code using the old query/mutation names, you'll need to update your imports:

```typescript
// Before
import { GetMyChatsDocument } from '@/generated/graphql';

// After
import { Chat_GetMyChatsDocument } from '@/generated/graphql';
```

The generated TypeScript types will also have updated names:
```typescript
// Before
type GetMyChatsQuery = ...

// After
type Chat_GetMyChatsQuery = ...
```

## Code Generation

After making changes to GraphQL files, always regenerate types:
```bash
npm run codegen
```
