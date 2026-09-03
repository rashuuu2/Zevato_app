import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '@/hooks/useAuth';
import { config } from '@/constants/config';

export default function SplashScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const checkAppInitialRoute = async () => {
      // Wait until Clerk auth state is initialized
      if (!isLoaded) return;

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const hasCompletedOnboarding = await AsyncStorage.getItem(
          config.storageKeys.onboardingCompleted
        );

        if (!isMounted) return;

        if (hasCompletedOnboarding !== 'true') {
          // First launch: Intro Onboarding flow
          router.replace('/(onboarding)/welcome' as any);
        } else if (isSignedIn) {
          if (user?.profileCompleted) {
            // Returning authenticated user with complete profile: Home dashboard
            router.replace('/(tabs)/home' as any);
          } else {
            // Authenticated user with incomplete profile: Complete Profile screen
            router.replace('/(auth)/complete-profile' as any);
          }
        } else {
          // Returning unauthenticated user: Sign In screen
          router.replace('/(auth)/login' as any);
        }
      } catch (error) {
        console.error('Error during initial routing check:', error);
        if (isMounted) {
          router.replace('/(onboarding)/welcome' as any);
        }
      }
    };

    checkAppInitialRoute();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn, user?.profileCompleted]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/splash.png')}
        style={styles.splashImage}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
});
