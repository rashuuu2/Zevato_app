import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PaginationIndicatorProps {
  total?: number;
  activeIndex: number;
}

const ACTIVE_COLOR = '#1473EA';
const INACTIVE_COLOR = '#D6E3F8';

export default function PaginationIndicator({
  total = 3,
  activeIndex,
}: PaginationIndicatorProps) {
  return (
    <View style={styles.pagination}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeIndex && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 22,
    height: 7,
    borderRadius: 999,
    backgroundColor: INACTIVE_COLOR,
  },
  activeDot: {
    backgroundColor: ACTIVE_COLOR,
  },
});
