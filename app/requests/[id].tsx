import React, { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Loading } from '@/components/common/Loading';

export default function RequestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  useEffect(() => {
    if (id) {
      router.replace({ pathname: '/bookings/[id]' as any, params: { id } });
    }
  }, [id]);

  return <Loading message="Loading booking details..." fullScreen />;
}
