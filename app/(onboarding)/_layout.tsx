import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.white },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="intro-1" />
      <Stack.Screen name="intro-2" />
      <Stack.Screen name="intro-3" />
    </Stack>
  );
}
