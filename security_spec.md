# Security Specification: ShipSent

## 1. Data Invariants
- **User Profile**: Every user must have a unique profile at `/users/{userId}` where `userId == auth.uid`.
- **Booking Identity**: Every booking must have a `customerId` verified against `auth.uid`. `driverId` and `vendorId` must be valid UIDs if present.
- **Booking State**: A booking status can only transition forward (pending -> accepted -> on-transit -> completed). Cancellation is only allowed before transit.
- **Temporal Integrity**: `createdAt` and `updatedAt` for all entities must be server-generated.
- **Immutable Audit**: Once created, core booking details (pickup, drop, truckType, fare) cannot be modified.

## 2. The "Dirty Dozen" Payloads

### P1: Identity Spoofing (User Profile)
Attempt to create a user profile for a different UID.
```json
{
  "path": "users/victim-uid",
  "method": "create",
  "data": { "uid": "victim-uid", "role": "admin", "email": "attacker@evil.com" }
}
```

### P2: Privilege Escalation (Role Injection)
Attempt to update own role to 'admin' (if admin logic exists).
```json
{
  "path": "users/attacker-uid",
  "method": "update",
  "data": { "role": "admin" }
}
```

### P3: Ghost Field Injection (Resource Poisoning)
Attempt to inject a 'isVerified' field into own profile.
```json
{
  "path": "users/attacker-uid",
  "method": "update",
  "data": { "isVerified": true }
}
```

### P4: Identity Spoofing (Booking)
Attempt to create a booking for another customer.
```json
{
  "path": "bookings/new-id",
  "method": "create",
  "data": { "customerId": "victim-uid", "status": "pending", "fare": 100 }
}
```

### P5: State Shortcutting (Booking)
Attempt to create a booking directly in 'completed' status.
```json
{
  "path": "bookings/new-id",
  "method": "create",
  "data": { "customerId": "attacker-uid", "status": "completed", "fare": 100 }
}
```

### P6: Immutable Field Modification (Booking)
Attempt to change fare of an existing booking.
```json
{
  "path": "bookings/existing-id",
  "method": "update",
  "data": { "fare": 10 }
}
```

### P7: Unauthorized Status Update (Booking)
Driver updates status of a booking they are not assigned to.
```json
{
  "path": "bookings/not-my-booking-id",
  "method": "update",
  "data": { "status": "on-transit" }
}
```

### P8: Temporal Integrity Breach (Client Timestamp)
Attempt to set a backdated 'createdAt'.
```json
{
  "path": "bookings/new-id",
  "method": "create",
  "data": { "createdAt": "2000-01-01T00:00:00Z" }
}
```

### P9: Resource Exhaustion (ID Poisoning)
Attempt to create a booking with a 1MB string as ID. (Handled by isValidId)

### P10: PII Leak (User Collection List)
Authenticated user tries to list all user profiles.
```json
{
  "path": "users",
  "method": "list"
}
```

### P11: Orphaned Write (Booking without Customer)
Create a booking with a non-existent customerId (if exists() is enforced).

### P12: Write-Gap (Partial Update Bypass)
Update status without updating 'updatedAt'.

## 3. The Test Runner (Plan)
We will implement `firestore.rules.test.ts` to verify these protections.
