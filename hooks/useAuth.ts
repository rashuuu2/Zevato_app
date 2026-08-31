import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/expo';
import { userStore } from '@/store/userStore';
import { UserProfile } from '@/types/user';

export const useAuth = () => {
  const { isLoaded: isAuthLoaded, isSignedIn, userId, sessionId, signOut } = useClerkAuth();
  const { isLoaded: isUserLoaded, user: clerkUser } = useClerkUser();

  const isLoaded = isAuthLoaded && isUserLoaded;
  const appUserProfile = userStore.get();

  const user: UserProfile = clerkUser
    ? {
        id: clerkUser.id,
        name:
          clerkUser.fullName ||
          clerkUser.firstName ||
          appUserProfile.name ||
          'Zevota Customer',
        email: clerkUser.primaryEmailAddress?.emailAddress || appUserProfile.email,
        phone: clerkUser.primaryPhoneNumber?.phoneNumber || appUserProfile.phone,
        addresses: appUserProfile.addresses,
        paymentMethods: appUserProfile.paymentMethods,
        hasProtectionPlan: appUserProfile.hasProtectionPlan,
        protectionPlanExpiry: appUserProfile.protectionPlanExpiry,
      }
    : appUserProfile;

  return {
    isLoaded,
    isSignedIn: !!isSignedIn,
    userId,
    sessionId,
    user,
    clerkUser,
    signOut,
  };
};

export default useAuth;
