import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import RequestCard from '@/components/requests/RequestCard';

import requests from '@/data/requests';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { ServiceRequest } from '@/types/request';

export default function RequestsIndexScreen() {
  const router = useRouter();

  const handleSelect = (req: ServiceRequest) => {
    router.push({ pathname: '/requests/[id]' as any, params: { id: req.id } });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Custom Requests" />
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RequestCard request={item} onPress={handleSelect} />}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
  },
});
