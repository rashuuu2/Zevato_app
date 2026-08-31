import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import BookingStepper from '@/components/booking/BookingStepper';
import DatePicker, { DateOption } from '@/components/booking/DatePicker';
import TimeSlot from '@/components/booking/TimeSlot';
import SectionHeader from '@/components/common/SectionHeader';

import useBooking from '@/hooks/useBooking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';

export default function ScheduleScreen() {
  const router = useRouter();
  const { draft, updateBooking } = useBooking();

  const dates: DateOption[] = [
    { dayName: 'Today', dayNumber: '30', fullDate: 'Today, 30 Aug' },
    { dayName: 'Mon', dayNumber: '31', fullDate: 'Mon, 31 Aug' },
    { dayName: 'Tue', dayNumber: '01', fullDate: 'Tue, 01 Sep' },
    { dayName: 'Wed', dayNumber: '02', fullDate: 'Wed, 02 Sep' },
    { dayName: 'Thu', dayNumber: '03', fullDate: 'Thu, 03 Sep' },
    { dayName: 'Fri', dayNumber: '04', fullDate: 'Fri, 04 Sep' },
  ];

  const slots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM',
  ];

  const [selectedDate, setSelectedDate] = useState(draft.scheduledDate || dates[0].fullDate);
  const [selectedSlot, setSelectedSlot] = useState(draft.scheduledTimeSlot || slots[2]);

  const handleNext = () => {
    if (!selectedDate) {
      Alert.alert('Select Date', 'Please select a date for your service visit.');
      return;
    }
    if (!selectedSlot) {
      Alert.alert('Select Time Slot', 'Please select a time slot for your service visit.');
      return;
    }

    updateBooking({
      scheduledDate: selectedDate,
      scheduledTimeSlot: selectedSlot,
    });
    router.push('/services/address' as any);
  };

  const selectedPackage = draft.selectedOption;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Schedule Service" />
      <BookingStepper currentStep={1} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Selected Package Context Banner */}
        <View style={styles.packageBanner}>
          <View style={styles.bannerHeader}>
            <View style={styles.badge}>
              <Ionicons name="construct" size={14} color={colors.primary} />
              <Text style={styles.badgeText}>SELECTED PACKAGE</Text>
            </View>
            {selectedPackage?.price && (
              <Text style={styles.priceTag}>{formatCurrency(selectedPackage.price)}</Text>
            )}
          </View>
          <Text style={styles.packageTitle}>{selectedPackage?.title || draft.serviceTitle || 'Appliance Care Package'}</Text>
          <Text style={styles.packageDesc}>{selectedPackage?.description || 'Professional deep service & diagnostic'}</Text>
        </View>

        <SectionHeader title="Select Preferred Date" />
        <DatePicker dates={dates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        <SectionHeader title="Select Preferred Time Slot" />
        <TimeSlot slots={slots} selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot} />

        <Button
          title="Proceed to Address"
          variant="primary"
          size="large"
          onPress={handleNext}
          style={styles.btn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingBottom: spacing.xl,
  },
  packageBanner: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 2,
    paddingHorizontal: spacing.xs + 2,
    borderRadius: spacing.radiusFull,
    gap: 4,
  },
  badgeText: {
    fontSize: typography.fontSize.xs - 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  priceTag: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  packageTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  packageDesc: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  btn: {
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
  },
});
