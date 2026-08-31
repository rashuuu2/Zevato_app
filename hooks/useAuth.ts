import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/expo';
import { userStore } from '@/store/userStore';
import { UserProfile, ZevotaUserMetadata, Address } from '@/types/user';

export const useAuth = () => {
  const { isLoaded: isAuthLoaded, isSignedIn, userId, sessionId, signOut } = useClerkAuth();
  const { isLoaded: isUserLoaded, user: clerkUser } = useClerkUser();

  const isLoaded = isAuthLoaded && isUserLoaded;
  const appUserProfile = userStore.get();

  const metadata = (clerkUser?.unsafeMetadata || {}) as ZevotaUserMetadata;

  const name = clerkUser
    ? clerkUser.fullName ||
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
      'User'
    : 'User';

  const email = clerkUser?.primaryEmailAddress?.emailAddress || '';
  const phone = metadata.phone || clerkUser?.primaryPhoneNumber?.phoneNumber || 'Add phone number';
  const address = metadata.address;

  const primaryAddress: Address | null =
    address && address.street
      ? {
          id: 'primary-addr',
          title: 'Primary Service Address',
          street: address.street,
          city: address.city || 'Bengaluru',
          state: address.state || 'Karnataka',
          zipCode: address.postalCode || '',
          country: address.country || 'India',
          isDefault: true,
          type: 'home',
        }
      : null;

  const addresses: Address[] = primaryAddress ? [primaryAddress] : (appUserProfile.addresses || []);

  const user: UserProfile = {
    id: clerkUser?.id || 'guest-user',
    name,
    email,
    phone,
    avatarUrl: clerkUser?.imageUrl,
    address,
    profileCompleted: !!metadata.profileCompleted,
    addresses,
    paymentMethods: appUserProfile.paymentMethods || [],
    hasProtectionPlan: appUserProfile.hasProtectionPlan,
    protectionPlanExpiry: appUserProfile.protectionPlanExpiry,
  };

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

