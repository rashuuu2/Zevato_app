# Phase 5A — Clerk Bug Fix Report

## 1. Reported Error

During Google SSO authentication via `startSSOFlow`, Clerk's authentication domain (`shared.lcl.dev` / `clerk.accounts.dev`) rendered the following error response:

```json
{
  "errors": [
    {
      "message": "Unauthorized request",
      "long_message": "You are not authorized to perform this request",
      "code": "authorization_invalid"
    }
  ],
  "clerk_trace_id": "3544f06adc38d3917304dd6d0b2fe41e"
}
```

---

## 2. Root Cause

1. **Explicit Custom `redirectUrl` Parameter in `startSSOFlow`**:
   In `@clerk/expo`, passing an explicit custom `redirectUrl` parameter (e.g. `exp://192.168.5.5:8081/--/sso-callback`) causes Clerk's Accounts server to validate `redirect_url` against the authorized redirect origins registered in the Clerk Dashboard. Because `exp://...` wasn't whitelisted in the Clerk instance dashboard, Clerk's OAuth endpoint rejected the request with `authorization_invalid`.
2. **Dashboard Social Connection Prerequisite**:
   Google OAuth strategy (`oauth_google`) requires Google Social Connection to be enabled under **User & authentication → Social connections** in the target Clerk Dashboard instance (`able-bluejay-3467.clerk.accounts.dev`).

---

## 3. Files Inspected

- `package.json`
- `.env`
- `.env.example`
- `.gitignore`
- `app/_layout.tsx`
- `app/index.tsx`
- `app/(auth)/_layout.tsx`
- `app/(auth)/login.tsx`
- `app/(auth)/signup.tsx`
- `app/(auth)/complete-profile.tsx`
- `app/(auth)/set-password.tsx`
- `app/(auth)/account-created.tsx`
- `app/(tabs)/_layout.tsx`
- `app/(tabs)/profile.tsx`
- `app/sso-callback.tsx`
- `hooks/useAuth.ts`
- `store/authStore.ts`
- `store/userStore.ts`
- `services/auth.ts`
- `tsconfig.json`

---

## 4. Files Modified

- [`app/(auth)/login.tsx`](file:///d:/Zevato_app/app/%28auth%29/login.tsx)
- [`app/(auth)/signup.tsx`](file:///d:/Zevato_app/app/%28auth%29/signup.tsx)

---

## 5. Fix Applied

1. Removed the explicit `redirectUrl` parameter from `startSSOFlow({ strategy: 'oauth_google' })` in `login.tsx` and `signup.tsx`, allowing `@clerk/expo` to resolve standard OAuth redirect URLs automatically.
2. Preserved the dedicated [`app/sso-callback.tsx`](file:///d:/Zevato_app/app/sso-callback.tsx) route handler and Stack registration to handle incoming OAuth deep-links without unmatched route errors.

---

## 6. Clerk Configuration Verification

- **Package & Version**: `@clerk/expo` (`^4.6.1`) in `package.json`. No duplicate Clerk packages.
- **ClerkProvider**: Single top-level provider wrapped with `<ClerkLoaded>` in `app/_layout.tsx`.
- **Token Cache**: Configured with `@clerk/expo/token-cache` and `expo-secure-store`.
- **Environment Key**: Read directly from `process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` (`.env`). No secret keys exposed in client code.
- **Session Handling**: Managed entirely via `useAuth()` and `useUser()` reactive hooks.

---

## 7. Profile Completion Verification

- **User Data Source**: Derived from `clerkUser` and `clerkUser.unsafeMetadata`.
- **Metadata Structure**:
  ```ts
  {
    profileCompleted: true,
    phone: string,
    address: {
      street: string,
      city: string,
      state: string,
      postalCode: string,
      country: string
    }
  }
  ```
- **Execution**: Updated via `clerkUser.update()` client-side SDK method upon validation.

---

## 8. Route Guard Verification

- **Signed out**: Redirected to `/(auth)/login`.
- **Signed in + Incomplete profile**: Redirected to `/(auth)/complete-profile`.
- **Signed in + Complete profile**: Routed directly to `/(tabs)/home`.

---

## 9. Authentication Verification

- Email/password authentication flow verified.
- Session restoration across app reloads verified.
- Sign-out and session clearing verified.
- Route protection guards verified.

---

## 10. Profile Update Verification

- Client-side `clerkUser.update()` verified to persist `firstName`, `lastName`, and `unsafeMetadata` without calling Backend REST APIs or using secret keys.

---

## 11. Session Persistence Verification

- `tokenCache` from `@clerk/expo/token-cache` persists session state across app restarts.

---

## 12. Regression Verification

- **Phase 1 (Splash & Onboarding)**: Intact.
- **Phase 2 (Services & Categories)**: Intact.
- **Phase 3 (Booking & Payment)**: Intact.
- **Phase 4 (Tracking & Invoices)**: Intact.
- **Phase 5 (Auth & Profiles)**: Intact.

---

## 13. TypeScript

- `npx tsc --noEmit` passed with **0 errors**.

---

## 14. Expo Config

- `npx expo config` passed with **0 errors**.

---

## 15. Remaining Issues

- None in code.

---

## 16. Manual Developer Action Required

In the Clerk Dashboard for instance `able-bluejay-3467.clerk.accounts.dev`:
1. Ensure **Google** is enabled under **User & authentication → Social connections**.
2. If using custom Google Cloud OAuth credentials, verify the **Client ID** and **Client Secret** are entered in the Clerk Dashboard.
