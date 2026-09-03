import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider, ClerkLoaded } from '@clerk/expo';
import { tokenCache } from '@/utils/tokenCache';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '@clerk/expo';
import { colors } from '@/constants/colors';
import { registerForPushNotificationsAsync } from '@/services/notifications';

WebBrowser.maybeCompleteAuthSession();

const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  'pk_test_Y2xlcmstdGVzdC5jbGVyay5hY2NvdW50cy5kZXYk';

function RootLayoutContent() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  console.log('>>> [ROOT LAYOUT RENDER]', new Date().toISOString(), { isLoaded, isSignedIn, userId });

  useEffect(() => {
    registerForPushNotificationsAsync().catch((err) => {
      console.warn('Push notification initialization skipped/failed:', err);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="sso-callback" />
      </Stack>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <RootLayoutContent />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
