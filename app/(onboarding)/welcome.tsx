import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '@/hooks/useAuth';
import { config } from '@/constants/config';
import PaginationIndicator from '@/components/common/PaginationIndicator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const onboardingImages = [
  require('@/assets/images/onboarding-1.png'),
  require('@/assets/images/onboarding-2.png'),
  require('@/assets/images/onboarding-3.png'),
];

// 4th phantom slide data (no image, transparent)
const SLIDES = [
  { key: 'slide-1', image: onboardingImages[0] },
  { key: 'slide-2', image: onboardingImages[1] },
  { key: 'slide-3', image: onboardingImages[2] },
  { key: 'slide-phantom', image: null },
];

export default function OnboardingCarouselScreen() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleFinishOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(config.storageKeys.onboardingCompleted, 'true');
      if (isSignedIn) {
        router.replace('/(tabs)/home' as any);
      } else {
        router.replace('/(auth)/login' as any);
      }
    } catch (error) {
      console.error('Failed to set onboarding completion state:', error);
      router.replace('/(auth)/login' as any);
    }
  }, [isSignedIn, router]);

  // When the phantom slide (index 3) is reached, navigate away
  useEffect(() => {
    if (currentPage === 3) {
      handleFinishOnboarding();
    }
  }, [currentPage, handleFinishOnboarding]);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentPage(pageIndex);
  };

  const renderItem = ({ item }: { item: (typeof SLIDES)[number] }) => {
    if (!item.image) {
      // Phantom slide — transparent, same width
      return <View style={styles.slide} />;
    }

    return (
      <View style={styles.slide}>
        <Image
          source={item.image}
          style={styles.slideImage}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Pagination indicator — clamped to max index 2 so no 4th dot appears */}
      <View style={styles.paginationWrapper}>
        <PaginationIndicator total={3} activeIndex={Math.min(currentPage, 2)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  slideImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  paginationWrapper: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
