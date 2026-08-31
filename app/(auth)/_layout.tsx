import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import useAuth from '@/hooks/useAuth';
import { colors } from '@/constants/colors';

export default function AuthLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isLoaded, isSignedIn, user } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      if (user?.profileCompleted) {
        router.replace('/(tabs)/home' as any);
      } else {
        const currentRoute = segments[segments.length - 1];
        if (currentRoute !== 'complete-profile') {
          router.replace('/(auth)/complete-profile' as any);
        }
      }
    }
  }, [isLoaded, isSignedIn, user?.profileCompleted, segments]);

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

