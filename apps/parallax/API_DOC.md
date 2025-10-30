# Parallax.love API Documentation

**Base URL**: `http://localhost:8002/graphql` (Development) | `https://api.parallax.love/graphql` (Production)

**API Type**: GraphQL  
**Authentication**: JWT Bearer Token (No Organization Context)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Subscription-Based Permissions](#subscription-based-permissions)
3. [Onboarding](#onboarding)
4. [Profile Management](#profile-management)
5. [Agent System](#agent-system)
6. [Matching](#matching)
7. [Chat & Messaging](#chat--messaging)
8. [Preferences](#preferences)
9. [Error Handling](#error-handling)

---

## Authentication

Parallax.love uses **JWT-based authentication** with subscription-based permissions focused on dating features.

### Register

```graphql
mutation Register {
  register(input: {
    email: "user@parallax.love"
    password: "securePassword123"
  }) {
    accessToken
    refreshToken
    user {
      id
      email
      onboardingState  # COMPLETING, ACTIVE
    }
  }
}
```

**Response**:
```json
{
  "data": {
    "register": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "user-uuid",
        "email": "user@parallax.love",
        "onboardingState": "COMPLETING"
      }
    }
  }
}
```

### Login

```graphql
mutation Login {
  login(input: {
    email: "user@parallax.love"
    password: "securePassword123"
  }) {
    accessToken
    refreshToken
    user {
      id
      email
      onboardingState
      subscription {
        tier
        expiresAt
      }
    }
  }
}
```

### Mobile/Email OTP Login

```graphql
# Step 1: Request OTP
mutation RequestOTP {
  requestMobileOTP(input: {
    countryCode: "+1"
    mobile: "5551234567"
  }) {
    success
    message
  }
}

# Step 2: Verify OTP
mutation VerifyOTP {
  verifyMobileOTP(input: {
    countryCode: "+1"
    mobile: "5551234567"
    otp: "123456"
  }) {
    accessToken
    refreshToken
    user {
      id
      mobile
      onboardingState
    }
  }
}
```

### Required Headers

For all protected endpoints:

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Example**:
```bash
curl -X POST http://localhost:8002/graphql \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"query": "{ me { id email } }"}'
```

### Refresh Token

```graphql
mutation RefreshToken {
  refreshToken(refreshToken: "your-refresh-token") {
    accessToken
    refreshToken
    expiresIn
  }
}
```

### Logout

```graphql
mutation Logout {
  logout
}

mutation LogoutAllDevices {
  logoutAllDevices
}
```

---

## Subscription-Based Permissions

Parallax implements **user-level RBAC** based on subscription tiers. Permissions control match limits, chat features, and advanced capabilities.

### Subscription Tiers

| Tier | Price | Matches/Month | Features |
|------|-------|---------------|----------|
| **FREE** | $0/mo | 5 matches | Basic matching, limited chats |
| **BASIC** | $14.99/mo | 30 matches | Unlimited chats, see agent interactions |
| **PREMIUM** | $29.99/mo | Unlimited | Analytics, advanced filters, priority matching |
| **ENTERPRISE** | Custom | Unlimited | API access, custom features, coaching |

### Permission Matrix

| Resource | FREE | BASIC | PREMIUM | ENTERPRISE |
|----------|------|-------|---------|------------|
| `profile:*` | ✅ | ✅ | ✅ | ✅ |
| `onboarding:complete` | ✅ | ✅ | ✅ | ✅ |
| `matches:respond-limited` | ✅ (5/mo) | ❌ | ❌ | ❌ |
| `matches:respond` | ❌ | ✅ | ✅ | ✅ |
| `matches:*` | ❌ | ✅ | ✅ | ✅ |
| `chat:send-limited` | ✅ (50 msgs/mo) | ❌ | ❌ | ❌ |
| `chat:*` | ❌ | ✅ | ✅ | ✅ |
| `agent:view` | ❌ | ✅ | ✅ | ✅ |
| `interaction:view` | ❌ | ✅ | ✅ | ✅ |
| `analytics:read` | ❌ | ❌ | ✅ | ✅ |
| `preferences:advanced` | ❌ | ❌ | ✅ | ✅ |
| `*:*` | ❌ | ❌ | ❌ | ✅ |

### Check My Permissions

```graphql
query MyPermissions {
  myPermissions {
    resource
    action
  }
}
```

### Get My Subscription

```graphql
query MySubscription {
  me {
    subscription {
      tier
      status
      matchesThisMonth
      maxMatchesPerMonth
      messagesThisMonth
      maxMessagesPerMonth
      expiresAt
      autoRenew
    }
  }
}
```

### Upgrade Subscription

```graphql
mutation UpgradeSubscription {
  upgradeSubscription(input: {
    tier: PREMIUM
    billingCycle: ANNUAL
  }) {
    subscription {
      tier
      maxMatchesPerMonth
      features
    }
    invoice {
      amount
      dueDate
      paymentUrl
    }
  }
}
```

---

## Onboarding

Parallax's onboarding process collects deep, situational responses that power the AI agent creation.

### Get Onboarding Questions

```graphql
query OnboardingQuestions {
  onboardingQuestions {
    key
    question
    category  # VALUES, COMMUNICATION, LIFESTYLE, etc.
    order
  }
}
```

**Example Questions**:
```json
[
  {
    "key": "dilemma_job_offer",
    "question": "You receive a dream job offer in a new city. Your current partner can't relocate. How do you handle this?",
    "category": "VALUES",
    "order": 1
  },
  {
    "key": "ideal_sunday",
    "question": "Describe your ideal Sunday from morning to night.",
    "category": "LIFESTYLE",
    "order": 2
  }
]
```

### Submit Onboarding Answers

```graphql
mutation SubmitOnboardingAnswers {
  submitOnboardingAnswers(input: {
    answers: [
      {
        questionKey: "dilemma_job_offer"
        answerText: "I would have an honest conversation with my partner about both our long-term goals. If the relationship is strong, we could try long-distance temporarily while exploring opportunities for them in the new city. Communication and compromise are key."
      },
      {
        questionKey: "ideal_sunday"
        answerText: "I'd wake up naturally around 8am, make a slow breakfast while listening to a podcast. Then I'd go for a long hike or bike ride in nature. Afternoon would be for reading or a creative hobby. Evening dinner with close friends, maybe some board games."
      }
      # ... more answers
    ]
  }) {
    user {
      id
      onboardingState  # Now "ACTIVE"
    }
    agent {
      id
      personalityProfile {
        values {
          primaryValue
          communication
        }
        summary
      }
    }
  }
}
```

### Get My Onboarding Status

```graphql
query OnboardingStatus {
  me {
    onboardingState  # COMPLETING or ACTIVE
    onboardingAnswers {
      questionKey
      answerText
      submittedAt
    }
    agent {
      id
      status  # GENERATING, READY
    }
  }
}
```

---

## Profile Management

### Get My Profile

```graphql
query Me {
  me {
    id
    email
    mobile
    onboardingState
    profile {
      id
      firstName
      lastName
      age
      gender
      location {
        city
        state
        country
      }
      photos {
        url
        isPrimary
        order
      }
      bio
      occupation
      education
      height
      relationshipGoal  # LONG_TERM, SHORT_TERM, FRIENDSHIP, etc.
    }
    agent {
      id
      personalityProfile {
        values {
          primaryValue
          secondaryValues
        }
        communication {
          style
          conflictResolution
        }
        outlook {
          optimismLevel
          riskTolerance
        }
        summary
      }
    }
    subscription {
      tier
    }
    createdAt
  }
}
```

### Update Profile

```graphql
mutation UpdateProfile {
  updateProfile(input: {
    firstName: "Alex"
    lastName: "Johnson"
    age: 28
    gender: "non-binary"
    bio: "Adventure seeker, book lover, amateur chef"
    occupation: "Software Engineer"
    education: "Bachelor's in Computer Science"
    height: 175  # in cm
    relationshipGoal: LONG_TERM
    location: {
      city: "San Francisco"
      state: "CA"
      country: "USA"
      latitude: 37.7749
      longitude: -122.4194
    }
  }) {
    id
    firstName
    bio
    location {
      city
    }
  }
}
```

### Upload Profile Photo

```graphql
mutation UploadProfilePhoto {
  uploadProfilePhoto(input: {
    url: "https://s3.amazonaws.com/parallax/photos/photo1.jpg"
    isPrimary: true
    order: 1
  }) {
    id
    url
    isPrimary
  }
}
```

---

## Agent System

Parallax creates an AI agent for each user based on their onboarding responses. Agents simulate conversations to assess compatibility before users ever interact.

### Get My Agent

```graphql
query MyAgent {
  myAgent {
    id
    status  # GENERATING, READY, ERROR
    personalityProfile {
      values {
        primaryValue  # e.g., "Growth", "Connection", "Security"
        secondaryValues
        priorities
      }
      communication {
        style  # e.g., "Direct", "Empathetic", "Analytical"
        conflictResolution
        emotionalExpression
      }
      outlook {
        optimismLevel  # 0.0 - 1.0
        riskTolerance
        changeAdaptability
      }
      interests
      dealbreakers
      summary  # AI-generated summary
    }
    personalityVector  # 1536-dim embedding (hidden from users)
    createdAt
    updatedAt
  }
}
```

### Agent Personality Profile Example

```json
{
  "personalityProfile": {
    "values": {
      "primaryValue": "Growth",
      "secondaryValues": ["Connection", "Autonomy"],
      "priorities": "Continuous self-improvement and meaningful relationships"
    },
    "communication": {
      "style": "Empathetic and Direct",
      "conflictResolution": "Seeks to understand root causes before solving",
      "emotionalExpression": "Open and vulnerable when trust is established"
    },
    "outlook": {
      "optimismLevel": 0.75,
      "riskTolerance": "Moderate - willing to try new things after research",
      "changeAdaptability": "High - thrives on new challenges"
    },
    "interests": ["outdoor adventures", "psychology", "cooking", "reading"],
    "dealbreakers": ["dishonesty", "lack of ambition", "closed-mindedness"],
    "summary": "A growth-oriented individual who values deep connections and authentic communication..."
  }
}
```

---

## Matching

Parallax's matching system runs AI agent simulations in the background. High-compatibility matches (score > 0.85) are presented to users.

### Get My Matches

**Required Permission**: `matches:read`

```graphql
query MyMatches {
  myMatches(
    status: PENDING  # or ACCEPTED, DECLINED, EXPIRED
    first: 20
  ) {
    edges {
      node {
        id
        status
        compatibilityScore  # 0.0 - 1.0
        matchRationale  # AI-generated explanation
        user {
          id
          profile {
            firstName
            age
            photos {
              url
              isPrimary
            }
            bio
            location {
              city
            }
          }
        }
        interaction {
          id
          transcript  # Simulated conversation excerpt
          evaluation {
            valueAlignment
            communicationSynergy
            humorResonance
            intellectualCuriosity
            conflictPotential
          }
          evaluationScore
        }
        expiresAt
        createdAt
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

### Get Current Match

```graphql
query CurrentMatch {
  currentMatch {
    id
    status
    compatibilityScore
    matchRationale
    user {
      profile {
        firstName
        age
        photos {
          url
        }
        bio
      }
    }
    interaction {
      transcript
      evaluation {
        valueAlignment
        communicationSynergy
      }
    }
  }
}
```

### Respond to Match

**Required Permission**: `matches:respond` or `matches:respond-limited`

**FREE Tier Limit**: 5 matches per month

```graphql
mutation RespondToMatch {
  respondToMatch(input: {
    matchId: "match-uuid"
    response: ACCEPT  # or DECLINE
  }) {
    match {
      id
      status  # Now ACCEPTED or DECLINED
    }
    chat {
      # If both accepted, chat is created
      id
      participants {
        user {
          id
          profile {
            firstName
          }
        }
      }
    }
  }
}
```

**Both users must accept before a chat is created**. This prevents ego-damage from direct rejection.

---

## Chat & Messaging

Chats are only created when **both users accept** a match.

### Get My Chats

```graphql
query MyChats {
  myChats(first: 20) {
    edges {
      node {
        id
        match {
          id
          compatibilityScore
        }
        participant {
          id
          profile {
            firstName
            photos {
              url
            }
          }
        }
        lastMessage {
          content
          createdAt
        }
        unreadCount
        createdAt
      }
    }
  }
}
```

### Get Chat Messages

```graphql
query ChatMessages {
  chatMessages(
    chatId: "chat-uuid"
    first: 50
    after: "cursor"
  ) {
    edges {
      node {
        id
        content
        sender {
          id
          profile {
            firstName
          }
        }
        isRead
        createdAt
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Send Message

**Required Permission**: `chat:send` or `chat:send-limited`

**FREE Tier Limit**: 50 messages per month

```graphql
mutation SendMessage {
  sendMessage(input: {
    chatId: "chat-uuid"
    content: "Hey! Your agent and my agent had a great conversation. I'd love to get to know you better 😊"
  }) {
    id
    content
    sender {
      id
    }
    createdAt
  }
}
```

### Mark Messages as Read

```graphql
mutation MarkMessagesAsRead {
  markMessagesAsRead(chatId: "chat-uuid") {
    success
  }
}
```

### Real-time Messages (Subscription)

```graphql
subscription OnNewMessage {
  messageAdded(chatId: "chat-uuid") {
    id
    content
    sender {
      id
      profile {
        firstName
      }
    }
    createdAt
  }
}
```

---

## Preferences

### Get My Matching Preferences

```graphql
query MyPreferences {
  myPreferences {
    id
    ageRange {
      min
      max
    }
    gender
    maxDistance  # in km
    relationshipGoals
    dealbreakers
  }
}
```

### Update Matching Preferences

```graphql
mutation UpdatePreferences {
  updatePreferences(input: {
    ageRange: {
      min: 25
      max: 35
    }
    gender: ["male", "non-binary"]
    maxDistance: 50  # km
    relationshipGoals: [LONG_TERM]
    dealbreakers: ["smoking", "wants-kids"]
  }) {
    id
    ageRange {
      min
      max
    }
    updatedAt
  }
}
```

### Advanced Preferences (PREMIUM+)

**Required Permission**: `preferences:advanced`

```graphql
mutation UpdateAdvancedPreferences {
  updateAdvancedPreferences(input: {
    communicationStylePreference: ["Empathetic", "Direct"]
    valueAlignment: {
      mustHave: ["Growth", "Connection"]
      niceToHave: ["Adventure", "Creativity"]
    }
    lifestyleCompatibility: {
      activityLevel: "Moderate"
      socialPreference: "Balanced"
    }
  }) {
    id
    communicationStylePreference
    updatedAt
  }
}
```

---

## Analytics (PREMIUM+)

### Get Compatibility Analytics

**Required Permission**: `analytics:read`

```graphql
query CompatibilityAnalytics {
  myAnalytics {
    averageCompatibilityScore
    topCompatibilityFactors
    interactionInsights {
      mostCommonTopics
      communicationPatterns
    }
    matchSuccessRate
    responseRate
  }
}
```

---

## Error Handling

### Common Error Codes

| Code | Description | Example |
|------|-------------|---------|
| `UNAUTHENTICATED` | Missing/invalid token | Token expired |
| `ONBOARDING_INCOMPLETE` | User must complete onboarding | Trying to match before onboarding |
| `SUBSCRIPTION_LIMIT_EXCEEDED` | Tier limit reached | Free tier 5 matches/month |
| `PERMISSION_DENIED` | Insufficient permissions | Free tier accessing analytics |
| `MATCH_EXPIRED` | Match window closed | Match expired after 7 days |
| `AGENT_NOT_READY` | Agent still being created | Agent generation in progress |

### Error Response Examples

**Onboarding Required**:
```json
{
  "errors": [{
    "message": "Complete onboarding before accessing matches",
    "extensions": {
      "code": "ONBOARDING_INCOMPLETE",
      "onboardingState": "COMPLETING",
      "nextStep": "/onboarding"
    }
  }]
}
```

**Match Limit Exceeded**:
```json
{
  "errors": [{
    "message": "Subscription limit exceeded: FREE tier allows 5 matches per month",
    "extensions": {
      "code": "SUBSCRIPTION_LIMIT_EXCEEDED",
      "currentTier": "FREE",
      "matchesThisMonth": 5,
      "maxAllowed": 5,
      "resetDate": "2025-11-01T00:00:00Z",
      "upgradeUrl": "/subscription/upgrade"
    }
  }]
}
```

---

## The Shadow Dance: How It Works

1. **Onboarding**: User answers deep, situational questions
2. **Agent Creation**: AI generates personality profile + vector embedding
3. **Background Matching**: Cron job runs agent simulations
4. **Agent Interactions**: AI simulates conversations between compatible agents
5. **Evaluation**: AI scores compatibility across multiple dimensions
6. **Match Creation**: High-score matches (>0.85) are presented to users
7. **User Response**: Both users must accept before chat opens
8. **Real Connection**: Users chat, guided by AI insights

**Key Insight**: Users never directly reject each other. The system handles filtering, preserving ego and reducing app fatigue.

---

## Rate Limiting

- **FREE tier**: 50 requests/hour
- **BASIC tier**: 200 requests/hour
- **PREMIUM tier**: 500 requests/hour
- **ENTERPRISE tier**: Unlimited

Headers:
```http
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 187
X-RateLimit-Reset: 1635724800
```

---

## SDK Examples

### JavaScript

```javascript
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: 'http://localhost:8002/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

---

## Support

- **Documentation**: https://docs.parallax.love
- **Community**: https://community.parallax.love
- **Support Email**: hello@parallax.love
- **Twitter**: @ParallaxLove

---

**"We are engineering a psychologically safe environment for profound connection."**

*Last Updated: 2025-10-30*
