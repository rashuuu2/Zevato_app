import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import useAuth from '@/hooks/useAuth';
import { colors } from '@/constants/colors';

export default function AuthLayout() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/(tabs)/home' as any);
    }
  }, [isLoaded, isSignedIn]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="complete-profile" />
      <Stack.Screen name="set-password" />
      <Stack.Screen name="account-created" />
    </Stack>
  );
}
