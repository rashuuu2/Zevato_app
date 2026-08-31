import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import useAuth from '@/hooks/useAuth';
import { colors } from '@/constants/colors';

export default function SSOCallbackScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      if (user?.profileCompleted) {
        router.replace('/(tabs)/home' as any);
      } else {
        router.replace('/(auth)/complete-profile' as any);
      }
    } else {
      router.replace('/(auth)/login' as any);
    }
  }, [isLoaded, isSignedIn, user?.profileCompleted]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
