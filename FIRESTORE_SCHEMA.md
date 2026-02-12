# Firestore Database Schema

## Collections Overview

This document defines the complete Firestore database structure for Earnify.

---

## 1. `users` Collection

**Path**: `/users/{userId}`

Stores all user account information.

```typescript
{
  // Identity
  telegramId: string,           // Unique Telegram user ID
  username: string,             // Telegram username
  firstName: string,            // User's first name
  lastName: string,             // User's last name
  
  // Referral System
  referralCode: string,         // Unique 6-character referral code
  referredBy: string | null,    // Referral code of referrer (if any)
  
  // Balances
  balance: number,              // Available balance (₦)
  pendingBalance: number,       // Pending balance awaiting validation (₦)
  totalEarned: number,          // Lifetime earnings (₦)
  referralEarnings: number,     // Total earned from referrals (₦)
  
  // Engagement
  dailyStreak: number,          // Current daily login streak
  lastLogin: Timestamp,         // Last login timestamp
  level: number,                // User level (future gamification)
  
  // Security & Fraud Prevention
  isBlocked: boolean,           // Account blocked status
  deviceFingerprint: string,    // Hashed device fingerprint
  ipHistory: string[],          // Array of IP addresses used
  flags: string[],              // Fraud flags (e.g., "multi-account", "suspicious-ip")
  
  // Metadata
  createdAt: Timestamp,         // Account creation timestamp
  updatedAt: Timestamp          // Last update timestamp
}
```

### Indexes
- `telegramId` (unique)
- `referralCode` (unique)
- `referredBy`
- `createdAt`

---

## 2. `transactions` Collection

**Path**: `/transactions/{transactionId}`

Records all earning transactions.

```typescript
{
  userId: string,               // Reference to user
  type: "CPA" | "AD" | "REFERRAL" | "DAILY" | "BONUS",
  
  // Amounts
  amount: number,               // Amount credited to user (₦)
  networkAmount: number,        // Original amount from network (₦)
  
  // Transaction Details
  transactionId: string,        // Unique transaction ID (from CPA network or generated)
  networkName: string,          // e.g., "AdGate", "Monetag", "System"
  description: string,          // Transaction description
  
  // Status
  status: "pending" | "confirmed" | "rejected",
  
  // Metadata
  createdAt: Timestamp,
  confirmedAt: Timestamp | null,
  metadata: {
    offerId?: string,           // CPA offer ID
    adProvider?: string,        // Ad provider name
    referralUserId?: string     // For referral transactions
  }
}
```

### Indexes
- `userId`
- `type`
- `status`
- `createdAt`
- Composite: `userId` + `createdAt`

---

## 3. `dailyRewards` Collection

**Path**: `/dailyRewards/{userId}`

Tracks daily login rewards and streaks.

```typescript
{
  userId: string,
  lastClaimDate: Timestamp,     // Last date reward was claimed
  streakCount: number,          // Current streak count
  totalClaimed: number,         // Total daily rewards claimed
  lastStreakBonus: Timestamp | null,  // Last 7-day bonus claim
  
  // History
  claimHistory: Array<{
    date: Timestamp,
    reward: number,
    streakDay: number
  }>
}
```

### Indexes
- `userId` (unique)
- `lastClaimDate`

---

## 4. `adLogs` Collection

**Path**: `/adLogs/{logId}`

Logs all ad viewing events for fraud detection.

```typescript
{
  userId: string,
  adProvider: "Monetag" | string,
  rewardAmount: number,
  
  // Fraud Detection
  timestamp: Timestamp,
  ipAddress: string,
  deviceFingerprint: string,
  
  // Validation
  isValid: boolean,
  validationNotes: string,
  
  // Metadata
  adId: string,
  sessionId: string
}
```

### Indexes
- `userId`
- `timestamp`
- Composite: `userId` + `timestamp`

---

## 5. `withdrawals` Collection

**Path**: `/withdrawals/{withdrawalId}`

Manages withdrawal requests.

```typescript
{
  userId: string,
  amount: number,               // Withdrawal amount (₦)
  
  // Payment Details
  paymentMethod: "bank" | "opay" | "palmpay",
  accountDetails: {
    accountNumber: string,
    accountName: string,
    bankName?: string,          // For bank transfers
    phoneNumber?: string        // For Opay/PalmPay
  },
  
  // Status
  status: "pending" | "approved" | "rejected" | "processing" | "completed",
  
  // Admin Actions
  processedBy: string | null,   // Admin user ID
  rejectionReason: string | null,
  
  // Timestamps
  createdAt: Timestamp,
  processedAt: Timestamp | null,
  completedAt: Timestamp | null,
  
  // Transaction Reference
  transactionReference: string | null
}
```

### Indexes
- `userId`
- `status`
- `createdAt`
- Composite: `userId` + `status`

---

## 6. `referrals` Collection

**Path**: `/referrals/{referrerId}`

Aggregates referral statistics per user.

```typescript
{
  userId: string,               // The referrer
  totalReferrals: number,       // Total users referred
  activeReferrals: number,      // Referrals who completed at least 1 CPA
  totalEarned: number,          // Total commission earned (₦)
  
  // Referral List
  referrals: Array<{
    userId: string,
    joinedAt: Timestamp,
    isActive: boolean,          // Has completed at least 1 CPA
    totalEarnings: number,      // Total earnings by this referral
    commissionEarned: number    // Commission earned from this referral
  }>,
  
  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Indexes
- `userId` (unique)
- `totalReferrals`

---

## 7. `flags` Collection

**Path**: `/flags/{flagId}`

Fraud detection flags and alerts.

```typescript
{
  userId: string,
  flagType: "multi-account" | "suspicious-ip" | "rapid-earning" | "device-mismatch" | "other",
  severity: "low" | "medium" | "high" | "critical",
  
  // Details
  description: string,
  evidence: {
    ipAddresses?: string[],
    deviceFingerprints?: string[],
    relatedUserIds?: string[],
    earningPattern?: object
  },
  
  // Status
  status: "open" | "investigating" | "resolved" | "false-positive",
  resolvedBy: string | null,    // Admin user ID
  resolution: string | null,
  
  // Timestamps
  createdAt: Timestamp,
  resolvedAt: Timestamp | null
}
```

### Indexes
- `userId`
- `flagType`
- `severity`
- `status`
- `createdAt`

---

## 8. `adminLogs` Collection

**Path**: `/adminLogs/{logId}`

Audit trail for admin actions.

```typescript
{
  adminId: string,              // Admin user ID
  action: "approve_withdrawal" | "reject_withdrawal" | "block_user" | "adjust_balance" | "clear_flag",
  
  // Target
  targetType: "user" | "withdrawal" | "transaction" | "flag",
  targetId: string,
  
  // Details
  details: object,              // Action-specific details
  reason: string,
  
  // Metadata
  ipAddress: string,
  timestamp: Timestamp
}
```

### Indexes
- `adminId`
- `action`
- `timestamp`
- Composite: `targetType` + `targetId`

---

## 9. `settings` Collection

**Path**: `/settings/app`

Global app settings (single document).

```typescript
{
  // Reward Settings
  dailyLoginReward: number,     // Default: 20
  streakBonusReward: number,    // Default: 200
  adReward: number,             // Default: 5
  referralBonus: number,        // Default: 100
  referralCommission: number,   // Default: 0.10 (10%)
  
  // Limits
  maxAdsPerDay: number,         // Default: 20
  dailyEarningCap: number,      // Default: 3000
  minWithdrawal: number,        // Default: 2000
  
  // Fraud Prevention
  pendingBalanceDelay: number,  // Hours (24-72)
  maxAccountsPerIP: number,     // Default: 3
  
  // Maintenance
  maintenanceMode: boolean,
  maintenanceMessage: string,
  
  // Metadata
  updatedAt: Timestamp,
  updatedBy: string
}
```

---

## Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only backend can write
    }
    
    // Transactions are read-only for users
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if false;
    }
    
    // Withdrawals can be created by users, but not modified
    match /withdrawals/{withdrawalId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow update, delete: if false;
    }
    
    // All other collections are backend-only
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Data Migration & Seeding

For initial setup, create a seed script to:
1. Initialize the `settings/app` document with default values
2. Create test users (development only)
3. Set up indexes as defined above

---

**Last Updated**: 2026-02-12
