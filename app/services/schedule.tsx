import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import BookingStepper from '@/components/booking/BookingStepper';
import DatePicker, { DateOption } from '@/components/booking/DatePicker';
import TimeSlot from '@/components/booking/TimeSlot';

import useBooking from '@/hooks/useBooking';
import useAuth from '@/hooks/useAuth';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { Address } from '@/types/user';

export default function ScheduleScreen() {
  const router = useRouter();
  const { draft, updateBooking } = useBooking();
  const { user } = useAuth();

  // Generate next 6 days dynamically
  const generateDates = (): DateOption[] => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result: DateOption[] = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()];
      const dayNumber = String(d.getDate()).padStart(2, '0');
      const fullDate = `${dayName}, ${dayNumber} ${monthNames[d.getMonth()]}`;
      result.push({ dayName, dayNumber, fullDate });
    }
    return result;
  };

  const dates = generateDates();

  const slots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM',
    '07:00 PM - 09:00 PM',
  ];

  const [selectedDate, setSelectedDate] = useState(draft.scheduledDate || dates[0].fullDate);
  const [selectedSlot, setSelectedSlot] = useState(draft.scheduledTimeSlot || slots[2]);
  const [specialInstructions, setSpecialInstructions] = useState(draft.specialInstructions || '');

  // Address selection
  const userAddresses: Address[] = user?.addresses || [];
  const defaultAddr: Address | null = userAddresses.length > 0 ? userAddresses[0] : (
    user?.address ? {
      id: 'primary-addr',
      title: 'Home',
      street: user.address.street,
      city: user.address.city,
      state: user.address.state || 'Karnataka',
      zipCode: user.address.postalCode || '',
    } : null
  );

  const availableAddresses = defaultAddr
    ? [defaultAddr, ...userAddresses.filter((a) => a.id !== defaultAddr.id)]
    : userAddresses;

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    draft.address || defaultAddr
  );

  const handleNext = () => {
    if (!selectedDate) {
      Alert.alert('Select Date', 'Please select a date for your service visit.');
      return;
    }
    if (!selectedSlot) {
      Alert.alert('Select Time', 'Please select a time slot.');
      return;
    }
    if (!selectedAddress) {
      Alert.alert('Select Address', 'Please select or add a service address.');
      return;
    }

    updateBooking({
      scheduledDate: selectedDate,
      scheduledTimeSlot: selectedSlot,
      address: selectedAddress,
      specialInstructions: specialInstructions.trim() || undefined,
    });
    router.push('/services/payment' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Schedule & Address" />
      <BookingStepper currentStep={5} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Context Banner */}
        <View style={styles.contextBanner}>
          <Ionicons name="construct-outline" size={16} color={colors.primary} />
          <Text style={styles.contextLabel} numberOfLines={1}>
            {draft.brandName} {draft.categoryName} • {draft.selectedIssue || draft.serviceTitle}
          </Text>
        </View>

        {/* Date Selection */}
        <Text style={styles.sectionTitle}>Select Preferred Date</Text>
        <DatePicker dates={dates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        {/* Time Slot Selection */}
        <Text style={styles.sectionTitle}>Select Preferred Time</Text>
        <TimeSlot slots={slots} selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot} />

        {/* Address Selection */}
        <Text style={styles.sectionTitle}>Service Address</Text>
        {availableAddresses.length > 0 ? (
          availableAddresses.map((addr) => {
            const isSelected = selectedAddress?.id === addr.id;
            return (
              <TouchableOpacity
                key={addr.id}
                style={[styles.addressCard, isSelected && styles.addressCardActive]}
                onPress={() => setSelectedAddress(addr)}
                activeOpacity={0.7}
              >
                <View style={styles.addressRadio}>
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={isSelected ? colors.primary : colors.textMuted}
                  />
                </View>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressTitle}>{addr.title || 'Address'}</Text>
                  <Text style={styles.addressStreet} numberOfLines={2}>
                    {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                  </Text>
                </View>
                {addr.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.noAddressCard}>
            <Ionicons name="location-outline" size={24} color={colors.textMuted} />
            <Text style={styles.noAddressText}>No saved addresses found</Text>
          </View>
        )}

        {/* Special Instructions */}
        <Input
          label="Special Instructions (Optional)"
          placeholder="e.g. Ring the bell, ask for Flat 402..."
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          multiline
          numberOfLines={2}
          style={styles.instructionsInput}
        />

        <Button
          title="Continue to Review & Confirm"
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
  contextBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: spacing.radiusMd,
    gap: spacing.xs,
  },
  contextLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryDark,
    flex: 1,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  addressCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#F0F5FF',
  },
  addressRadio: {
    marginRight: spacing.sm,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  addressStreet: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 2,
    paddingHorizontal: spacing.xs + 2,
    borderRadius: spacing.radiusFull,
  },
  defaultBadgeText: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  noAddressCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    padding: spacing.lg,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  noAddressText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  instructionsInput: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    minHeight: 50,
  },
  btn: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
});
