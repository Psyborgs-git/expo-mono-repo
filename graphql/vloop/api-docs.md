# VLoop SaaS API: Technical Documentation for Frontend Teams

## 1. Overview

Welcome to the VLoop SaaS Platform API. This document provides a comprehensive guide for frontend developers on how to interact with the VLoop GraphQL API.

### 1.1. Architecture

- **Technology Stack**: NestJS with a Fastify adapter, GraphQL, and Prisma.
- **Database**: VLoop utilizes its own dedicated database, accessed via the `PrismaVloopService`.
- **Multi-Tenancy**: The platform is multi-tenant, with data isolation enforced by an `org-id` header.
- **Authentication**: Authentication is handled by a unified auth module, supporting OTP, JWT, and API keys.

### 1.2. Core Concepts

- **GraphQL Endpoint**: `http://localhost:8001/graphql` (in development)
- **Required Headers**:
  - `Authorization`: `Bearer <JWT_TOKEN>` for user-based authentication.
  - `org-id`: The ID of the organization context for the request.
  - `x-api-key`: For API key-based authentication.
- **Relay-Style Pagination**: The API uses cursor-based pagination (`first`, `after`, `last`, `before`).
- **Node Interface**: Many objects implement the `Node` interface, allowing them to be refetched with a global `id`.

## 2. Authentication

VLoop uses a comprehensive authentication system. For a detailed guide, please refer to the [VLoop Authentication Guide](AUTHENTICATION_GUIDE.md).

### Quick Summary:

- **OTP Authentication**: For mobile and email.
- **Token Management**: `login`, `logout`, `refreshToken`.
- **API Key Management**: For third-party integrations.
- **User Profile**: `me` query to get the current user.

## 3. API Reference by Feature

This section details the GraphQL API, organized by application feature.

---

### 3.1. Accounts and Finance

#### **Data Models**

- **`Account`**: Represents a financial account (e.g., a bank account, a customer account).
- **`AccountGroup`**: A way to categorize accounts.
- **`Transaction`**: A financial transaction, either a credit or a debit.
- **`TransactionItem`**: A line item within a transaction.
- **`TransactionType`**: A type of transaction (e.g., "Sale", "Purchase").

#### **Queries**

**List Accounts:**
```graphql
query GetAccounts($first: Int, $after: String) {
  accounts(first: $first, after: $after) {
    edges {
      node {
        id
        name
        accountCode
        currentBalance
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

**Get a Single Account:**
```graphql
query GetAccount($id: Int!) {
  account(id: $id) {
    id
    name
    transactions {
      edges {
        node {
          id
          amount
          isCredit
        }
      }
    }
  }
}
```

#### **Mutations**

**Create an Account:**
```graphql
mutation CreateAccount {
  createAccount(
    account_code: "ACC-001",
    name: "Main Bank Account",
    opening_balance: 1000.00
  ) {
    id
    name
    currentBalance
  }
}
```

**Create a Transaction:**
```graphql
mutation CreateTransaction {
  createTransaction(
    book_code: "SALES",
    transaction_date: "2025-10-31T10:00:00Z",
    amount: 150.00,
    is_credit: true,
    accountId: 1
  ) {
    id
    amount
  }
}
```

---

### 3.2. CRM (Leads)

#### **Data Models**

- **`Lead`**: A potential customer.
- **`LeadActivity`**: A record of an interaction or change related to a lead.
- **`Customer`**: A lead that has been converted.

#### **Queries**

**List Leads:**
```graphql
query GetLeads($first: Int, $where: LeadWhereInput) {
  leads(first: $first, where: $where) {
    edges {
      node {
        id
        name
        email
        status
        source
      }
    }
  }
}
```

**Get a Single Lead:**
```graphql
query GetLead($id: Float!) {
  lead(id: $id) {
    id
    name
    activityFeed {
      edges {
        node {
          activityType
          description
          activityDate
        }
      }
    }
  }
}
```

#### **Mutations**

**Create a Lead:**
```graphql
mutation CreateLead($input: CreateLeadInput!) {
  createLead(input: $input) {
    id
    name
  }
}
# Example input:
# { "input": { "name": "New Lead", "email": "lead@example.com", "status": "New" } }
```

**Convert Lead to Customer:**
```graphql
mutation ConvertLead($input: ConvertLeadToCustomerInput!) {
  convertLeadToCustomer(input: $input) {
    id
    customerSince
  }
}
# Example input:
# { "input": { "leadId": 1 } }
```

---

### 3.3. Task Management

#### **Data Models**

- **`Task`**: A single task to be completed.
- **`Subtask`**: A child task of a parent task.
- **`Comment`**: A comment on a task.
- **`Attachment`**: A file attached to a task.

#### **Queries**

**List Tasks:**
```graphql
query GetTasks($where: TaskWhereInput) {
  tasks(where: $where) {
    edges {
      node {
        id
        title
        status
        priority
        dueDate
      }
    }
  }
}
```

#### **Mutations**

**Create a Task:**
```graphql
mutation CreateTask {
  createTask(title: "Follow up with client", priority: "High") {
    id
    title
  }
}
```

**Add a Comment to a Task:**
```graphql
mutation AddComment {
  addTaskComment(taskId: 1, content: "This is a comment.") {
    id
    content
  }
}
```

---

### 3.4. Chat

#### **Data Models**

- **`Chat`**: A conversation between participants.
- **`ChatMessage`**: A message within a chat.
- **`ChatParticipant`**: A user or bot in a chat.

#### **Queries**

**Get User's Chats:**
```graphql
query GetChats {
  chats {
    id
    name
    lastMessage {
      content
    }
    unreadCount
  }
}
```

#### **Mutations**

**Create a Chat:**
```graphql
mutation CreateChat($input: CreateChatInput!) {
  createChat(input: $input) {
    id
    name
  }
}
# Example input:
# { "input": { "chatType": "GROUP", "name": "Project Team", "participantIds": [2, 3] } }
```

**Send a Message:**
```graphql
mutation SendMessage($input: SendMessageInput!) {
  sendMessage(input: $input) {
    id
    content
  }
}
# Example input:
# { "input": { "chatId": 1, "messageType": "TEXT", "content": { "text": "Hello team!" } } }
```

#### **Subscriptions**

**Subscribe to New Messages:**
```graphql
subscription OnMessageReceived($chatId: Int!) {
  messageReceived(chatId: $chatId) {
    id
    content
    sender {
      id
      username
    }
  }
}
```

---

### 3.5. Website Builder

#### **Data Models**

- **`Website`**: A website project.
- **`WebsitePage`**: A page within a website.
- **`WebsiteComponent`**: A reusable component for building pages.
- **`WebsiteForm`**: A form that can be embedded on a page.
- **`WebsiteAsset`**: An uploaded file (image, etc.).

#### **Queries**

**List Websites:**
```graphql
query GetWebsites {
  websites {
    id
    name
    domain
  }
}
```

**Get Pages for a Website:**
```graphql
query GetPages($websiteId: Int!) {
  websitePages(websiteId: $websiteId) {
    id
    title
    slug
    isPublished
  }
}
```

#### **Mutations**

**Create a Website:**
```graphql
mutation CreateWebsite($input: CreateWebsiteInput!) {
  createWebsite(input: $input) {
    id
    name
  }
}
# Example input:
# { "input": { "name": "My New Site", "domain": "mynewsite.com" } }
```

**Create a Website Page:**
```graphql
mutation CreatePage($input: CreateWebsitePageInput!) {
  createWebsitePage(input: $input) {
    id
    title
  }
}
# Example input:
# { "input": { "websiteId": 1, "title": "About Us", "slug": "about", "content": { ... } } }
```

---

### 3.6. E-Commerce

#### **Data Models**

- **`Product`**: A product for sale.
- **`Service`**: A service offering.
- **`Cart`**: A user's shopping cart.
- **`Order`**: An order placed by a user.
- **`Invoice`**: An invoice for an order.
- **`Appointment`**: A scheduled appointment for a service.
- **`Schedule`**: Defines availability for a resource (e.g., a service provider).

#### **Queries**

**List Products:**
```graphql
query GetProducts {
  products {
    id
    name
    price
  }
}
```

**Get User's Cart:**
```graphql
query GetCart {
  cart {
    id
    cartItems {
      product {
        name
      }
      quantity
      price
    }
  }
}
```

#### **Mutations**

**Add Item to Cart:**
```graphql
mutation AddToCart($input: AddCartItemInput!) {
  addCartItem(input: $input) {
    id
    quantity
  }
}
# Example input:
# { "input": { "productId": 1, "quantity": 2, "price": 99.99 } }
```

**Create an Order from Cart:**
```graphql
mutation CreateOrder($cartId: Int!) {
  createOrderFromCart(cartId: $cartId) {
    id
    orderNumber
    total
  }
}
```

---

### 3.7. Team & Roles

#### **Data Models**

- **`Department`**: A department within an organization.
- **`Role`**: A role with a set of permissions.
- **`Permission`**: A specific permission.

#### **Queries**

**List Departments:**
```graphql
query GetDepartments {
  departments {
    departments {
        id
        name
    }
  }
}
```

**List Roles:**
```graphql
query GetRoles {
    roles {
        items {
            id
            name
        }
    }
}
```

#### **Mutations**

**Create a Department:**
```graphql
mutation CreateDepartment($input: CreateDepartmentInput!) {
  createDepartment(input: $input) {
    id
    name
  }
}
# Example input:
# { "input": { "name": "Engineering", "code": "ENG" } }
```

**Create a Role:**
```graphql
mutation CreateRole($data: CreateRoleInput!) {
  createRole(data: $data) {
    id
    name
  }
}
# Example input:
# { "data": { "name": "Developer", "description": "Developer role" } }
```

---

### 3.8. Support Desk

#### **Data Models**

- **`Ticket`**: A support ticket.
- **`TicketComment`**: A comment on a ticket.
- **`TicketCategory`**: A category for a ticket.

#### **Queries**

**List Tickets:**
```graphql
query GetTickets($filter: TicketFilterInput) {
  tickets(filter: $filter) {
    tickets {
        id
        title
        status
        priority
    }
  }
}
```

#### **Mutations**

**Create a Ticket:**
```graphql
mutation CreateTicket($input: CreateTicketInput!) {
  createTicket(input: $input) {
    id
    title
  }
}
# Example input:
# { "input": { "title": "Issue with login", "description": "I cannot log in to my account.", "priority": "HIGH" } }
```

---

### 3.9. Application Management

Refer to the [VLoop Authentication Guide](AUTHENTICATION_GUIDE.md) for a detailed guide on Application and API Key management.

---

### 3.10. Knowledge Base (Books)

#### **Data Models**

- **`Book`**: A collection of documents.
- **`Topic`**: A section within a book.
- **`Page`**: A page within a topic.

#### **Queries**

**List Books:**
```graphql
query GetBooks {
  books {
    edges {
      node {
        id
        title
        slug
      }
    }
  }
}
```

#### **Mutations**

**Create a Book:**
```graphql
mutation CreateBook($input: CreateBookInput!) {
  createBook(input: $input) {
    id
    title
  }
}
# Example input:
# { "input": { "title": "My First Book", "slug": "my-first-book" } }
```

## 4. Frontend Integration Example

### Apollo Client Setup

Here is a basic example of how to set up Apollo Client to work with the VLoop API.

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: 'http://localhost:8001/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth-token');
  const orgId = localStorage.getItem('org-id');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'org-id': orgId || "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
```