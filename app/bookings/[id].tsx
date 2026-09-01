import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import DetailHeader from '@/components/booking/DetailHeader';
import ProductSummaryCard from '@/components/booking/ProductSummaryCard';
import TechnicianDetailCard from '@/components/booking/TechnicianDetailCard';
import ServiceReportCard from '@/components/booking/ServiceReportCard';
import EmptyState from '@/components/common/EmptyState';

import { bookingService } from '@/services/bookings';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';
import { Booking } from '@/types/booking';

type ViewMode = 'in_progress' | 'tracking' | 'completed' | 'invoice';

export default function RequestDetailScreen() {
  const router = useRouter();
  const { id, mode: initialMode } = useLocalSearchParams<{ id?: string; mode?: string }>();
  const [booking, setBooking] = useState<Booking | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeViewMode, setActiveViewMode] = useState<ViewMode>('in_progress');
  const [userRating, setUserRating] = useState<number>(5);

  const fetchBooking = useCallback(async () => {
    if (id) {
      const found = await bookingService.getBookingById(id);
      if (found) {
        setBooking(found);
        // Automatically determine default view mode from booking status
        if (initialMode && ['in_progress', 'tracking', 'completed', 'invoice'].includes(initialMode)) {
          setActiveViewMode(initialMode as ViewMode);
        } else if (found.status === 'completed') {
          setActiveViewMode('completed');
        } else if (found.status === 'in_progress' || found.status === 'technician_assigned') {
          setActiveViewMode('in_progress');
        } else {
          setActiveViewMode('tracking');
        }
      }
    }
    setLoading(false);
  }, [id, initialMode]);

  useFocusEffect(
    useCallback(() => {
      fetchBooking();
    }, [fetchBooking])
  );

  if (!loading && !booking) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <DetailHeader title="Request Details" bookingId={id} />
        <EmptyState
          icon="alert-circle-outline"
          title="Booking Not Found"
          description={`We couldn't find a booking record for ID "${id}".`}
          actionTitle="Back to My Requests"
          onAction={() => router.replace('/requests' as any)}
        />
      </SafeAreaView>
    );
  }

  const bookingIdDisplay = booking?.bookingNumber || booking?.id || id || 'ZC2408185126';
  const price = booking?.totalAmount || 499;
  const isPaid = booking?.paymentStatus === 'payment_paid' || activeViewMode === 'completed' || activeViewMode === 'invoice';

  const handleDownloadInvoice = () => {
    Alert.alert(
      'Download Tax Invoice',
      `Preparing PDF invoice for Booking #${bookingIdDisplay} (Total: ${formatCurrency(price)})...`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Share PDF',
          onPress: () => {
            Share.share({
              title: `Zevota_Invoice_${bookingIdDisplay}.pdf`,
              message: `Official Zevota Care Tax Invoice for Booking ${bookingIdDisplay}. Total Paid: ${formatCurrency(price)}. Download at https://zevato.app/invoices/${bookingIdDisplay}`,
            });
          },
        },
      ]
    );
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this service request? A technician has already been scheduled.',
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Cancel Request',
          style: 'destructive',
          onPress: () => {
            if (booking?.id) {
              router.push({ pathname: '/requests/cancel' as any, params: { id: booking.id } });
            }
          },
        },
      ]
    );
  };

  const handleReschedule = () => {
    Alert.alert(
      'Reschedule Service',
      'Select a new convenient date and time slot for your technician visit.',
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Pick Slot', onPress: () => Alert.alert('Slot Updated', 'Your service visit has been rescheduled.') },
      ]
    );
  };

  const handleContactTechnician = () => {
    Alert.alert(
      'Contacting Technician',
      `Dialing ${booking?.technician?.name || 'Ramesh Kumar'} at ${booking?.technician?.phone || '+91 98765 43210'}...`
    );
  };

  // Header configs per state
  const getHeaderProps = () => {
    switch (activeViewMode) {
      case 'in_progress':
        return {
          title: 'Service In Progress',
          subtitle: 'Our technician is currently at your premises performing diagnosis & repair.',
          statusLabel: 'In Progress',
          statusType: 'in_progress' as const,
        };
      case 'tracking':
        return {
          title: 'Track My Booking',
          subtitle: 'Real-time technician tracking & arrival estimate.',
          statusLabel: 'In Progress',
          statusType: 'in_progress' as const,
        };
      case 'completed':
        return {
          title: 'Service Completed',
          subtitle: 'Thank you for choosing Zevota Care. Your service has been completed successfully.',
          statusLabel: 'Completed',
          statusType: 'completed' as const,
        };
      case 'invoice':
        return {
          title: 'Invoice Details',
          subtitle: 'Official GST tax invoice and payment verification receipt.',
          statusLabel: 'Paid',
          statusType: 'paid' as const,
        };
    }
  };

  const headerProps = getHeaderProps();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Shared Header */}
      <DetailHeader
        title={headerProps.title}
        subtitle={headerProps.subtitle}
        statusLabel={headerProps.statusLabel}
        statusType={headerProps.statusType}
        bookingId={bookingIdDisplay}
        onBack={() => router.back()}
      />

      {/* State Switcher Tabs (Allows viewing/testing all 4 states seamlessly) */}
      <View style={styles.viewModeSwitcher}>
        {(['in_progress', 'tracking', 'completed', 'invoice'] as ViewMode[]).map((mode) => {
          const isActive = activeViewMode === mode;
          const labels: Record<ViewMode, string> = {
            in_progress: 'In Progress',
            tracking: 'Live Track',
            completed: 'Completed',
            invoice: 'Invoice',
          };
          return (
            <TouchableOpacity
              key={mode}
              style={[styles.modeTab, isActive && styles.activeModeTab]}
              onPress={() => setActiveViewMode(mode)}
              activeOpacity={0.75}
            >
              <Text style={[styles.modeTabText, isActive && styles.activeModeTabText]}>
                {labels[mode]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ========================================================================= */}
        {/* STATE 1: SERVICE IN PROGRESS */}
        {/* ========================================================================= */}
        {activeViewMode === 'in_progress' && booking && (
          <View style={styles.stateContainer}>
            {/* Shared Product Card */}
            <ProductSummaryCard
              booking={booking}
              isCompleted={false}
              onViewDetails={() => setActiveViewMode('invoice')}
            />

            {/* Horizontal 5-Step Progress Tracker */}
            <View style={styles.cardSection}>
              <Text style={styles.cardHeading}>Service Progress</Text>
              <View style={styles.horizontalStepper}>
                {/* Step 1: Confirmed */}
                <View style={styles.hStepItem}>
                  <View style={[styles.hStepCircle, styles.hStepPassed]}>
                    <Ionicons name="checkmark" size={14} color={colors.white} />
                  </View>
                  <Text style={styles.hStepLabel}>Confirmed</Text>
                  <Text style={styles.hStepTime}>10:00 AM</Text>
                </View>

                <View style={[styles.hStepLine, styles.hStepLinePassed]} />

                {/* Step 2: Assigned */}
                <View style={styles.hStepItem}>
                  <View style={[styles.hStepCircle, styles.hStepPassed]}>
                    <Ionicons name="checkmark" size={14} color={colors.white} />
                  </View>
                  <Text style={styles.hStepLabel}>Assigned</Text>
                  <Text style={styles.hStepTime}>10:15 AM</Text>
                </View>

                <View style={[styles.hStepLine, styles.hStepLinePassed]} />

                {/* Step 3: On the Way */}
                <View style={styles.hStepItem}>
                  <View style={[styles.hStepCircle, styles.hStepPassed]}>
                    <Ionicons name="checkmark" size={14} color={colors.white} />
                  </View>
                  <Text style={styles.hStepLabel}>On Way</Text>
                  <Text style={styles.hStepTime}>10:35 AM</Text>
                </View>

                <View style={[styles.hStepLine, styles.hStepLineActive]} />

                {/* Step 4: At Doorstep (ACTIVE) */}
                <View style={styles.hStepItem}>
                  <View style={[styles.hStepCircle, styles.hStepActive]}>
                    <Ionicons name="construct" size={14} color={colors.white} />
                  </View>
                  <Text style={[styles.hStepLabel, styles.hStepLabelActive]}>At Location</Text>
                  <Text style={styles.hStepTime}>Now</Text>
                </View>

                <View style={styles.hStepLine} />

                {/* Step 5: Completed (Upcoming) */}
                <View style={styles.hStepItem}>
                  <View style={styles.hStepCircle}>
                    <Ionicons name="checkmark-done" size={14} color={colors.textMuted} />
                  </View>
                  <Text style={styles.hStepLabel}>Done</Text>
                  <Text style={styles.hStepTime}>Est. 45m</Text>
                </View>
              </View>
            </View>

            {/* Light Green Info Banner */}
            <View style={styles.greenInfoBanner}>
              <View style={styles.greenIconBox}>
                <Ionicons name="construct-outline" size={22} color="#0E9355" />
              </View>
              <Text style={styles.greenInfoText}>
                Our technician has reached your location and is working on your issue. You will be
                notified once the service is completed.
              </Text>
            </View>

            {/* Shared Technician Card */}
            <TechnicianDetailCard technician={booking.technician} />

            {/* 3-Column Mini Layout: Service Details */}
            <View style={styles.cardSection}>
              <Text style={styles.cardHeading}>Service Details</Text>
              <View style={styles.miniDetailRow}>
                <View style={styles.miniDetailCol}>
                  <Ionicons name="hardware-chip-outline" size={20} color={colors.primary} />
                  <Text style={styles.miniColLabel}>Product</Text>
                  <Text style={styles.miniColValue} numberOfLines={1}>
                    {booking.brandName || 'Appliance'}
                  </Text>
                </View>
                <View style={styles.miniDivider} />
                <View style={styles.miniDetailCol}>
                  <Ionicons name="alert-circle-outline" size={20} color={colors.warning} />
                  <Text style={styles.miniColLabel}>Issue</Text>
                  <Text style={styles.miniColValue} numberOfLines={1}>
                    {booking.selectedOption?.title || 'Diagnostic'}
                  </Text>
                </View>
                <View style={styles.miniDivider} />
                <View style={styles.miniDetailCol}>
                  <Ionicons name="time-outline" size={20} color={colors.primary} />
                  <Text style={styles.miniColLabel}>Scheduled</Text>
                  <Text style={styles.miniColValue} numberOfLines={1}>
                    {booking.scheduledTimeSlot || '10:00 AM'}
                  </Text>
                </View>
              </View>

              {/* Service Address Row */}
              <View style={styles.addressBoxRow}>
                <Ionicons name="location" size={16} color={colors.primary} />
                <View style={styles.addressBoxText}>
                  <Text style={styles.addressBoxTitle}>Service Address</Text>
                  <Text style={styles.addressBoxSub} numberOfLines={1}>
                    {booking.address?.street}, {booking.address?.city}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert('Service Address', `${booking.address?.street}, ${booking.address?.city} - ${booking.address?.zipCode}`)
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.linkTextBlue}>View Address</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Need Help Banner */}
            <View style={styles.needHelpBanner}>
              <Ionicons name="headset-outline" size={22} color={colors.primary} />
              <View style={styles.needHelpTextGroup}>
                <Text style={styles.needHelpTitle}>Need Help?</Text>
                <Text style={styles.needHelpDesc}>
                  Facing any issues with your technician visit?
                </Text>
              </View>
              <TouchableOpacity
                style={styles.needHelpBtn}
                onPress={() => router.push('/profile/contact-support' as any)}
                activeOpacity={0.75}
              >
                <Text style={styles.needHelpBtnText}>Contact Support</Text>
              </TouchableOpacity>
            </View>

            {/* Disabled Experience Rating */}
            <View style={styles.disabledRatingCard}>
              <Text style={styles.disabledRatingTitle}>Rate Your Experience (After Service)</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons key={s} name="star-outline" size={24} color="#CBD5E1" />
                ))}
              </View>
              <Text style={styles.disabledRatingSub}>
                Rating unlocks once service is marked complete by technician.
              </Text>
            </View>

            {/* Bottom Action Buttons */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={handleDownloadInvoice}
                activeOpacity={0.75}
              >
                <Ionicons name="download-outline" size={16} color={colors.primary} />
                <Text style={styles.outlineBtnText}>Download Invoice</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filledBtn}
                onPress={() => setActiveViewMode('invoice')}
                activeOpacity={0.8}
              >
                <Text style={styles.filledBtnText}>View Invoice</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STATE 2: TRACK MY BOOKING (LIVE TRACKING VARIANT) */}
        {/* ========================================================================= */}
        {activeViewMode === 'tracking' && booking && (
          <View style={styles.stateContainer}>
            {/* Shared Product Card */}
            <ProductSummaryCard
              booking={booking}
              isCompleted={false}
              onViewDetails={() => setActiveViewMode('invoice')}
            />

            {/* Live Tracking Map Card & Arrival Estimate */}
            <View style={styles.liveTrackingCard}>
              <View style={styles.mapHeaderRow}>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE GPS TRACKING</Text>
                </View>
                <Text style={styles.routeText}>Route Optimization Active</Text>
              </View>

              {/* Simulated Map Visual */}
              <View style={styles.simulatedMap}>
                <View style={styles.mapGridLines} />
                <View style={styles.routePathLine} />

                {/* Destination Pin */}
                <View style={styles.destPin}>
                  <Ionicons name="home" size={14} color={colors.white} />
                </View>

                {/* Technician Moving Dot */}
                <View style={styles.techMovingPin}>
                  <Ionicons name="bicycle" size={16} color={colors.white} />
                </View>
              </View>

              {/* Estimated Arrival Time Card */}
              <View style={styles.etaBox}>
                <View style={styles.etaLeft}>
                  <Text style={styles.etaLabel}>Estimated Arrival Time</Text>
                  <Text style={styles.etaMinutes}>25 mins</Text>
                </View>
                <View style={styles.etaDivider} />
                <View style={styles.etaRight}>
                  <Text style={styles.etaLabel}>Distance</Text>
                  <Text style={styles.etaDistance}>4.2 km away</Text>
                </View>
              </View>
            </View>

            {/* Info Banner */}
            <View style={styles.infoBannerBlue}>
              <Ionicons name="information-circle" size={22} color={colors.primary} />
              <View style={styles.infoBannerTextGroup}>
                <Text style={styles.infoBannerTitle}>Certified Technician En Route</Text>
                <Text style={styles.infoBannerSub}>
                  You will receive a phone call from the technician 5 minutes before arrival.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.contactTechBtn}
                onPress={handleContactTechnician}
                activeOpacity={0.8}
              >
                <Text style={styles.contactTechBtnText}>Call Tech</Text>
              </TouchableOpacity>
            </View>

            {/* Vertical Progress Timeline */}
            <View style={styles.cardSection}>
              <Text style={styles.cardHeading}>Live Timeline</Text>
              <View style={styles.verticalTimeline}>
                <View style={styles.vTimelineItem}>
                  <View style={[styles.vDot, styles.vDotCompleted]}>
                    <Ionicons name="checkmark" size={12} color={colors.white} />
                  </View>
                  <View style={styles.vContent}>
                    <Text style={styles.vTitle}>Booking Confirmed</Text>
                    <Text style={styles.vSub}>Service request registered and scheduled.</Text>
                  </View>
                  <Text style={styles.vTime}>10:00 AM</Text>
                </View>
                <View style={styles.vLineCompleted} />

                <View style={styles.vTimelineItem}>
                  <View style={[styles.vDot, styles.vDotCompleted]}>
                    <Ionicons name="checkmark" size={12} color={colors.white} />
                  </View>
                  <View style={styles.vContent}>
                    <Text style={styles.vTitle}>Technician Assigned</Text>
                    <Text style={styles.vSub}>Senior Tech Ramesh Kumar assigned.</Text>
                  </View>
                  <Text style={styles.vTime}>10:15 AM</Text>
                </View>
                <View style={styles.vLineCompleted} />

                <View style={styles.vTimelineItem}>
                  <View style={[styles.vDot, styles.vDotActive]}>
                    <Ionicons name="navigate" size={12} color={colors.white} />
                  </View>
                  <View style={styles.vContent}>
                    <Text style={[styles.vTitle, { color: colors.primary }]}>
                      Technician On The Way
                    </Text>
                    <Text style={styles.vSub}>En route to your location with diagnostic toolkit.</Text>
                  </View>
                  <Text style={styles.vTime}>Now</Text>
                </View>
                <View style={styles.vLine} />

                <View style={styles.vTimelineItem}>
                  <View style={styles.vDot} />
                  <View style={styles.vContent}>
                    <Text style={[styles.vTitle, { color: colors.textMuted }]}>
                      Service At Your Doorstep
                    </Text>
                    <Text style={styles.vSub}>Inspection & repair will begin upon arrival.</Text>
                  </View>
                </View>
                <View style={styles.vLine} />

                <View style={styles.vTimelineItem}>
                  <View style={styles.vDot} />
                  <View style={styles.vContent}>
                    <Text style={[styles.vTitle, { color: colors.textMuted }]}>
                      Service Completed
                    </Text>
                    <Text style={styles.vSub}>Final testing, report & digital invoice.</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Shared Technician Card */}
            <TechnicianDetailCard technician={booking.technician} />

            {/* Reschedule Banner */}
            <View style={styles.rescheduleCard}>
              <View style={styles.rescheduleTextGroup}>
                <Text style={styles.rescheduleTitle}>Need to make changes?</Text>
                <Text style={styles.rescheduleSub}>
                  Reschedule your booking time or update location details.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.rescheduleBtn}
                onPress={handleReschedule}
                activeOpacity={0.8}
              >
                <Text style={styles.rescheduleBtnText}>Reschedule</Text>
              </TouchableOpacity>
            </View>

            {/* Full-width Outlined Red Cancel Button */}
            <TouchableOpacity
              style={styles.cancelRequestBtn}
              onPress={handleCancelBooking}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
              <Text style={styles.cancelRequestText}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STATE 3: SERVICE COMPLETED */}
        {/* ========================================================================= */}
        {activeViewMode === 'completed' && booking && (
          <View style={styles.stateContainer}>
            {/* Success Celebration Banner */}
            <View style={styles.completedSuccessBanner}>
              <View style={styles.successCelebrationCircle}>
                <Ionicons name="checkmark-circle" size={36} color={colors.success} />
              </View>
              <View style={styles.completedSuccessTextGroup}>
                <Text style={styles.completedSuccessTitle}>Service Completed 🎉</Text>
                <Text style={styles.completedSuccessSub}>
                  Thank you for choosing Zevota Care. Your service has been completed successfully.
                </Text>
              </View>
            </View>

            {/* Shared Product Card with Total Paid */}
            <ProductSummaryCard
              booking={booking}
              isCompleted={true}
              onViewInvoice={() => setActiveViewMode('invoice')}
            />

            {/* 5 Completed Horizontal Steps */}
            <View style={styles.cardSection}>
              <Text style={styles.cardHeading}>Service Completion Summary</Text>
              <View style={styles.horizontalStepper}>
                {['Confirmed', 'Assigned', 'On Way', 'Inspection', 'Done'].map((step, idx) => (
                  <React.Fragment key={step}>
                    <View style={styles.hStepItem}>
                      <View style={[styles.hStepCircle, styles.hStepPassed]}>
                        <Ionicons name="checkmark" size={13} color={colors.white} />
                      </View>
                      <Text style={styles.hStepLabel}>{step}</Text>
                    </View>
                    {idx < 4 && <View style={[styles.hStepLine, styles.hStepLinePassed]} />}
                  </React.Fragment>
                ))}
              </View>
            </View>

            {/* Green Issue Resolved Banner */}
            <View style={styles.issueResolvedBanner}>
              <Ionicons name="shield-checkmark" size={24} color="#0E9355" />
              <View style={styles.issueResolvedTextGroup}>
                <Text style={styles.issueResolvedTitle}>Issue Resolved & Tested</Text>
                <Text style={styles.issueResolvedSub}>
                  Our technician has successfully diagnosed and fixed the issue. Your appliance is now
                  working properly with our 90-day service warranty.
                </Text>
              </View>
            </View>

            {/* Technician Card with ID */}
            <TechnicianDetailCard technician={booking.technician} showId={true} />

            {/* Service Report Card */}
            <ServiceReportCard
              diagnosis="Compressor coil choked with debris & low refrigerant pressure detected."
              workPerformed="High-pressure jet wash, coil chemical descaling & refrigerant gas top-up."
              partsReplaced="OEM Filter Mesh + Gas Seal Valve (90-day warranty applied)"
              serviceStatus="Fully Operational (Passed 16-point safety check)"
              technicianNotes="Appliance temperature stabilized at optimal levels. Clean filters every 30 days."
            />

            {/* Active Interactive 5-Star Rating */}
            <View style={styles.activeRatingCard}>
              <Text style={styles.activeRatingTitle}>Rate Your Experience</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => {
                      setUserRating(star);
                      Alert.alert('Rating Submitted', `Thank you for rating ${star} stars!`);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={star <= userRating ? 'star' : 'star-outline'}
                      size={32}
                      color="#F59E0B"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingDescriptor}>
                {userRating === 5
                  ? 'Excellent Service!'
                  : userRating === 4
                  ? 'Very Good'
                  : userRating === 3
                  ? 'Good'
                  : 'Needs Improvement'}
              </Text>
            </View>

            {/* Maintenance Promo Banner */}
            <View style={styles.protectionCard}>
              <Ionicons name="ribbon-outline" size={24} color="#0E9355" />
              <View style={styles.protectionTextGroup}>
                <Text style={styles.protectionTitle}>Need more help with your appliance?</Text>
                <Text style={styles.protectionDesc}>
                  Raise another request or explore our annual maintenance protection plans.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.protectionBtn}
                onPress={() => router.push('/profile/protection' as any)}
                activeOpacity={0.8}
              >
                <Text style={styles.protectionBtnText}>Explore Plans</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Buttons */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={handleDownloadInvoice}
                activeOpacity={0.75}
              >
                <Ionicons name="download-outline" size={16} color={colors.primary} />
                <Text style={styles.outlineBtnText}>Download Invoice</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filledBtn}
                onPress={() => router.replace('/home' as any)}
                activeOpacity={0.8}
              >
                <Text style={styles.filledBtnText}>Back to Home</Text>
                <Ionicons name="home-outline" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STATE 4: INVOICE DETAILS */}
        {/* ========================================================================= */}
        {activeViewMode === 'invoice' && booking && (
          <View style={styles.stateContainer}>
            {/* Invoice Header Card */}
            <View style={styles.invoiceHeaderCard}>
              <View style={styles.invoiceHeaderTop}>
                <View style={styles.paidPillBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#0E9355" />
                  <Text style={styles.paidPillText}>Paid</Text>
                </View>
                <View style={styles.invoiceMetaGroup}>
                  <Text style={styles.invoiceMetaLabel}>Invoice #</Text>
                  <Text style={styles.invoiceMetaValue}>INV-2026-8941</Text>
                </View>
              </View>
              <Text style={styles.invoiceDateText}>
                Date: {booking.scheduledDate || 'Today'} • Time: {booking.scheduledTimeSlot || '10:00 AM'}
              </Text>
            </View>

            {/* Amount Paid Card */}
            <View style={styles.greenAmountCard}>
              <Text style={styles.greenAmountLabel}>Total Amount Paid</Text>
              <Text style={styles.greenAmountValue}>{formatCurrency(price)}</Text>
              <View style={styles.greenAmountMetaRow}>
                <Ionicons name="checkmark-done" size={16} color="#0E9355" />
                <Text style={styles.greenAmountMetaText}>
                  Paid via Google Pay (UPI) • 100% Tax Compliant
                </Text>
              </View>
            </View>

            {/* Itemized Invoice Summary */}
            <View style={styles.cardSection}>
              <Text style={styles.cardHeading}>Invoice Summary</Text>
              <View style={styles.invoiceRow}>
                <Text style={styles.invItemLabel}>Inspection & Service Charge</Text>
                <Text style={styles.invItemValue}>{formatCurrency(499)}</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invItemLabel}>Parts & Consumables Cost</Text>
                <Text style={styles.invItemValue}>₹0.00</Text>
              </View>
              <View style={styles.invoiceRow}>
                <View style={styles.infoRow}>
                  <Text style={styles.invItemLabel}>Platform Service Fee</Text>
                  <Ionicons name="information-circle-outline" size={13} color={colors.textMuted} />
                </View>
                <Text style={styles.invItemValue}>₹29.00</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invItemLabel}>GST (18%)</Text>
                <Text style={styles.invItemValue}>{formatCurrency(Math.round((price - 29) * 0.18))}</Text>
              </View>
              <View style={[styles.invoiceRow, styles.invTotalRow]}>
                <Text style={styles.invTotalLabel}>Total Payable</Text>
                <Text style={styles.invTotalValue}>{formatCurrency(price)}</Text>
              </View>
            </View>

            {/* Payment Method / Status Row */}
            <View style={styles.paymentMethodCard}>
              <View style={styles.payIconCircle}>
                <Ionicons name="qr-code-outline" size={22} color={colors.primary} />
              </View>
              <View style={styles.payDetailsCol}>
                <Text style={styles.payTitle}>Google Pay / PhonePe (UPI)</Text>
                <Text style={styles.payTxnId}>Txn ID: {booking.simulatedTransactionId || 'SIM-TXN-876190'}</Text>
              </View>
              <View style={styles.statusCompletedPill}>
                <Ionicons name="checkmark-circle" size={12} color="#0E9355" />
                <Text style={styles.statusCompletedText}>Success</Text>
              </View>
            </View>

            {/* Service Summary (with Checkmarks) */}
            <ServiceReportCard
              diagnosis="Compressor coil inspection and performance diagnostics."
              workPerformed="Complete high-pressure power jet wash & coil chemical descaling."
              partsReplaced="OEM Filter Mesh + Gas Seal Valve (90-day warranty applied)"
              serviceStatus="Fully Operational (Passed 16-point safety check)"
              technicianNotes="Appliance is performing within standard operating range."
            />

            {/* 90 Days Warranty Banner */}
            <View style={styles.warrantyBanner}>
              <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
              <View style={styles.warrantyTextGroup}>
                <Text style={styles.warrantyTitle}>90-Day Zevota Labor Warranty</Text>
                <Text style={styles.warrantySub}>
                  All repair work and replaced parts are protected for 90 days from the date of service.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/profile/terms' as any)}
                activeOpacity={0.7}
              >
                <Text style={styles.linkTextBlue}>View Terms</Text>
              </TouchableOpacity>
            </View>

            {/* Need Help Again */}
            <View style={styles.needHelpBanner}>
              <Ionicons name="refresh-outline" size={22} color={colors.primary} />
              <View style={styles.needHelpTextGroup}>
                <Text style={styles.needHelpTitle}>Need Help Again?</Text>
                <Text style={styles.needHelpDesc}>
                  We're here for you anytime you need appliance repair or maintenance.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.needHelpBtn}
                onPress={() => router.push('/services' as any)}
                activeOpacity={0.75}
              >
                <Text style={styles.needHelpBtnText}>Book Service</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom PDF Actions */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={handleDownloadInvoice}
                activeOpacity={0.75}
              >
                <Ionicons name="document-text-outline" size={16} color={colors.primary} />
                <Text style={styles.outlineBtnText}>Download PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filledBtn}
                onPress={() => router.replace('/requests' as any)}
                activeOpacity={0.8}
              >
                <Text style={styles.filledBtnText}>My Requests</Text>
                <Ionicons name="receipt-outline" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  viewModeSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    gap: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F4F9',
  },
  modeTab: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.radiusFull,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  activeModeTab: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  modeTabText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: '#475569',
  },
  activeModeTabText: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  stateContainer: {
    paddingTop: spacing.xs,
  },
  cardSection: {
    backgroundColor: colors.white,
    borderRadius: spacing.radiusMd + 2,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: '#E7ECF3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeading: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#0F172A',
    marginBottom: spacing.sm,
  },
  horizontalStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hStepItem: {
    alignItems: 'center',
    width: 58,
  },
  hStepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hStepPassed: {
    backgroundColor: colors.success,
  },
  hStepActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  hStepLabel: {
    fontSize: 9,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  hStepLabelActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  hStepTime: {
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 1,
  },
  hStepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 20,
  },
  hStepLinePassed: {
    backgroundColor: colors.success,
  },
  hStepLineActive: {
    backgroundColor: colors.primary,
  },
  greenInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    padding: spacing.md,
    borderRadius: spacing.radiusMd + 2,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    gap: spacing.sm,
  },
  greenIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenInfoText: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    color: '#166534',
    lineHeight: 18,
  },
  miniDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  miniDetailCol: {
    flex: 1,
    alignItems: 'center',
  },
  miniColLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  miniColValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: 1,
  },
  miniDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#F1F4F9',
  },
  addressBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: spacing.sm,
    borderRadius: spacing.radiusSm,
    marginTop: spacing.sm,
    gap: spacing.xs + 2,
  },
  addressBoxText: {
    flex: 1,
  },
  addressBoxTitle: {
    fontSize: 10,
    color: colors.textMuted,
  },
  addressBoxSub: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  linkTextBlue: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  needHelpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    padding: spacing.md,
    borderRadius: spacing.radiusMd + 2,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: spacing.sm,
  },
  needHelpTextGroup: {
    flex: 1,
  },
  needHelpTitle: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: '#1E40AF',
  },
  needHelpDesc: {
    fontSize: 10,
    color: '#3B82F6',
    marginTop: 1,
  },
  needHelpBtn: {
    paddingVertical: 6,
    paddingHorizontal: spacing.sm + 2,
    backgroundColor: colors.white,
    borderRadius: spacing.radiusSm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  needHelpBtnText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  disabledRatingCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.radiusMd + 2,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7ECF3',
  },
  disabledRatingTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: spacing.xs + 2,
  },
  disabledRatingSub: {
    fontSize: 10,
    color: colors.textMuted,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm + 2,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  outlineBtnText: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  filledBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm + 2,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  filledBtnText: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  liveTrackingCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.radiusMd + 2,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: '#E7ECF3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  mapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EBF3FF',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: spacing.radiusFull,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  liveText: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  routeText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  simulatedMap: {
    height: 140,
    backgroundColor: '#E2E8F0',
    borderRadius: spacing.radiusMd,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  mapGridLines: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#CBD5E1',
    opacity: 0.3,
  },
  routePathLine: {
    position: 'absolute',
    width: '65%',
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    transform: [{ rotate: '-25deg' }],
  },
  destPin: {
    position: 'absolute',
    top: 25,
    right: 40,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  techMovingPin: {
    position: 'absolute',
    bottom: 30,
    left: 45,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  etaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: spacing.radiusMd,
    padding: spacing.sm + 2,
    marginTop: spacing.xs,
  },
  etaLeft: {
    flex: 1,
    alignItems: 'center',
  },
  etaRight: {
    flex: 1,
    alignItems: 'center',
  },
  etaDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  etaLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  etaMinutes: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  etaDistance: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  infoBannerBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    padding: spacing.md,
    borderRadius: spacing.radiusMd + 2,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: spacing.sm,
  },
  infoBannerTextGroup: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: '#1E40AF',
  },
  infoBannerSub: {
    fontSize: 10,
    color: '#3B82F6',
    marginTop: 1,
    lineHeight: 14,
  },
  contactTechBtn: {
    paddingVertical: 6,
    paddingHorizontal: spacing.sm + 2,
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusSm,
  },
  contactTechBtnText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  verticalTimeline: {
    paddingLeft: spacing.xs,
  },
  vTimelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  vDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E2E8F0',
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vDotCompleted: {
    backgroundColor: colors.success,
  },
  vDotActive: {
    backgroundColor: colors.primary,
  },
  vContent: {
    flex: 1,
  },
  vTitle: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  vSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  vTime: {
    fontSize: 9,
    color: colors.textMuted,
  },
  vLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginLeft: 8,
    marginVertical: 2,
  },
  vLineCompleted: {
    width: 2,
    height: 24,
    backgroundColor: colors.success,
    marginLeft: 8,
    marginVertical: 2,
  },
  rescheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    padding: spacing.md,
    borderRadius: spacing.radiusMd + 2,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: spacing.sm,
  },
  rescheduleTextGroup: {
    flex: 1,
  },
  rescheduleTitle: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: '#B45309',
  },
  rescheduleSub: {
    fontSize: 10,
    color: '#D97706',
    marginTop: 1,
  },
  rescheduleBtn: {
    paddingVertical: 6,
    paddingHorizontal: spacing.sm + 2,
    backgroundColor: colors.white,
    borderRadius: spacing.radiusSm,
    borderWidth: 1,
    borderColor: '#D97706',
  },
  rescheduleBtnText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: '#B45309',
  },
  cancelRequestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.danger,
    paddingVertical: spacing.sm + 2,
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    borderRadius: spacing.radiusMd,
  },
  cancelRequestText: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.danger,
  },
  completedSuccessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    padding: spacing.md,
    borderRadius: spacing.radiusMd + 2,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    gap: spacing.sm,
  },
  successCelebrationCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedSuccessTextGroup: {
    flex: 1,
  },
  completedSuccessTitle: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    color: '#166534',
  },
  completedSuccessSub: {
    fontSize: typography.fontSize.xs,
    color: '#15803D',
    marginTop: 1,
    lineHeight: 16,
  },
  issueResolvedBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    padding: spacing.md,
    borderRadius: spacing.radiusMd + 2,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    gap: spacing.sm,
  },
  issueResolvedTextGroup: {
    flex: 1,
  },
  issueResolvedTitle: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: '#166534',
  },
  issueResolvedSub: {
    fontSize: 10,
    color: '#15803D',
    marginTop: 2,
    lineHeight: 15,
  },
  activeRatingCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.radiusMd + 2,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7ECF3',
  },
  activeRatingTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  ratingDescriptor: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#B45309',
  },
  protectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    padding: spacing.md,
    borderRadius: spacing.radiusMd + 2,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    gap: spacing.sm,
  },
  protectionTextGroup: {
    flex: 1,
  },
  protectionTitle: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: '#166534',
  },
  protectionDesc: {
    fontSize: 10,
    color: '#15803D',
    marginTop: 1,
  },
  protectionBtn: {
    paddingVertical: 6,
    paddingHorizontal: spacing.sm + 2,
    backgroundColor: colors.white,
    borderRadius: spacing.radiusSm,
    borderWidth: 1,
    borderColor: '#0E9355',
  },
  protectionBtnText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: '#0E9355',
  },
  invoiceHeaderCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.radiusMd + 2,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: '#E7ECF3',
  },
  invoiceHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paidPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F8F0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: spacing.radiusFull,
  },
  paidPillText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: '#0E9355',
  },
  invoiceMetaGroup: {
    alignItems: 'flex-end',
  },
  invoiceMetaLabel: {
    fontSize: 9,
    color: colors.textMuted,
  },
  invoiceMetaValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#334155',
  },
  invoiceDateText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 6,
  },
  greenAmountCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: spacing.radiusMd + 2,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    alignItems: 'center',
  },
  greenAmountLabel: {
    fontSize: 10,
    color: '#166534',
    fontWeight: typography.fontWeight.semibold,
  },
  greenAmountValue: {
    fontSize: typography.fontSize.heading + 4,
    fontWeight: typography.fontWeight.bold,
    color: '#166534',
    marginVertical: 2,
  },
  greenAmountMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  greenAmountMetaText: {
    fontSize: 10,
    color: '#15803D',
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  invItemLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  invItemValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  invTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F1F4F9',
    marginTop: spacing.xs + 2,
    paddingTop: spacing.xs + 4,
  },
  invTotalLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  invTotalValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.radiusMd + 2,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: '#E7ECF3',
    gap: spacing.sm,
  },
  payIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payDetailsCol: {
    flex: 1,
  },
  payTitle: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  payTxnId: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
  statusCompletedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E8F8F0',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: spacing.radiusFull,
  },
  statusCompletedText: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    color: '#0E9355',
  },
  warrantyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs + 2,
    padding: spacing.md,
    borderRadius: spacing.radiusMd + 2,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: spacing.sm,
  },
  warrantyTextGroup: {
    flex: 1,
  },
  warrantyTitle: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: '#1E40AF',
  },
  warrantySub: {
    fontSize: 10,
    color: '#3B82F6',
    marginTop: 1,
    lineHeight: 14,
  },
});
