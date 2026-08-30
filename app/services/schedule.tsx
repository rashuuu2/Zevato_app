import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import BookingStepper from '@/components/booking/BookingStepper';
import DatePicker from '@/components/booking/DatePicker';
import TimeSlot from '@/components/booking/TimeSlot';
import SectionHeader from '@/components/common/SectionHeader';

import useBooking from '@/hooks/useBooking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export default function ScheduleScreen() {
  const router = useRouter();
  const { updateBooking } = useBooking();

  const dates = [
    { dayName: 'Today', dayNumber: '30', fullDate: 'Today, 30 Aug' },
    { dayName: 'Mon', dayNumber: '31', fullDate: 'Mon, 31 Aug' },
    { dayName: 'Tue', dayNumber: '01', fullDate: 'Tue, 01 Sep' },
    { dayName: 'Wed', dayNumber: '02', fullDate: 'Wed, 02 Sep' },
    { dayName: 'Thu', dayNumber: '03', fullDate: 'Thu, 03 Sep' },
  ];

  const slots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM',
  ];

  const [selectedDate, setSelectedDate] = useState(dates[0].fullDate);
  const [selectedSlot, setSelectedSlot] = useState(slots[2]);

  const handleNext = () => {
    updateBooking({
      scheduledDate: selectedDate,
      scheduledTimeSlot: selectedSlot,
    });
    router.push('/services/address' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Schedule Service" />
      <BookingStepper currentStep={1} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Select Preferred Date" />
        <DatePicker dates={dates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        <SectionHeader title="Select Time Slot" />
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
  btn: {
    margin: spacing.md,
    marginTop: spacing.xl,
  },
});
