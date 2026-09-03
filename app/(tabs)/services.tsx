import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import masterCategories, {
  MasterCategory,
  SubServiceItem,
} from '@/data/categoriesWithSubServices';
import useBooking from '@/hooks/useBooking';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function ServicesScreen() {
  const router = useRouter();
  const { updateBooking, resetBooking } = useBooking();

  // State-driven category selection for the two-pane layout
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    masterCategories[0]?.id || 'electronics-appliances'
  );

  const selectedCategory: MasterCategory =
    masterCategories.find((cat) => cat.id === selectedCategoryId) ||
    masterCategories[0];

  const handleSubServicePress = (sub: SubServiceItem) => {
    resetBooking();
    updateBooking({
      category: {
        id: sub.id,
        name: sub.label,
        icon: sub.icon,
        description: selectedCategory.bannerDescription,
        itemCount: 1,
        popular: true,
      },
      categoryId: sub.id,
      categoryName: sub.label,
    });
    router.push({
      pathname: '/services/brands' as any,
      params: { categoryId: sub.id, categoryName: sub.label },
    });
  };

  const renderIcon = (
    iconName: string,
    family?: 'ionicons' | 'material',
    size = 22,
    color = colors.primary
  ) => {
    if (family === 'material') {
      return (
        <MaterialCommunityIcons
          name={iconName as any}
          size={size}
          color={color}
        />
      );
    }
    return <Ionicons name={iconName as any} size={size} color={color} />;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ================= 1. HEADER ================= */}
      <View style={styles.header}>
        {/* Left: Back-arrow icon */}
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(tabs)/home' as any);
              }
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Center: "Categories" Title */}
        <Text style={styles.headerTitle}>Categories</Text>

        {/* Right: Search icon + Notification bell */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              // Accessed via search icon
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="search-outline" size={22} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.push('/profile/notifications' as any)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ================= 2. TWO-PANE MASTER-DETAIL LAYOUT ================= */}
      <View style={styles.masterDetailContainer}>
        {/* ----- LEFT SIDEBAR (roughly 26-28% of screen width) ----- */}
        <View style={styles.sidebar}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sidebarScroll}
          >
            {masterCategories.map((cat) => {
              const isSelected = cat.id === selectedCategoryId;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.sidebarItem,
                    isSelected && styles.sidebarItemSelected,
                  ]}
                  onPress={() => setSelectedCategoryId(cat.id)}
                  activeOpacity={0.75}
                >
                  {/* Blue vertical bar on left edge to indicate selection */}
                  {isSelected && <View style={styles.activeIndicatorBar} />}

                  <View style={styles.sidebarIconBox}>
                    {renderIcon(
                      cat.icon,
                      cat.iconFamily,
                      22,
                      isSelected ? colors.primary : '#64748B'
                    )}
                  </View>
                  <Text
                    style={[
                      styles.sidebarLabel,
                      isSelected && styles.sidebarLabelSelected,
                    ]}
                    numberOfLines={2}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ----- RIGHT MAIN SCROLLABLE CONTENT AREA ----- */}
        <ScrollView
          style={styles.contentArea}
          contentContainerStyle={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* a) Hero Banner Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>
                {selectedCategory.bannerTitle}
              </Text>
              <Text style={styles.heroDescription} numberOfLines={3}>
                {selectedCategory.bannerDescription}
              </Text>
            </View>
            {selectedCategory.bannerImage ? (
              <Image
                source={selectedCategory.bannerImage}
                style={styles.heroImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.heroFallbackIcon}>
                {renderIcon(
                  selectedCategory.icon,
                  selectedCategory.iconFamily,
                  36,
                  colors.primary
                )}
              </View>
            )}
          </View>

          {/* b) "All Services" Section Heading */}
          <Text style={styles.sectionHeading}>All Services</Text>

          {/* c) 3-column Grid of Sub-service Items */}
          <View style={styles.subServiceGrid}>
            {selectedCategory.subServices.map((sub) => (
              <TouchableOpacity
                key={sub.id}
                style={styles.subServiceCard}
                onPress={() => handleSubServicePress(sub)}
                activeOpacity={0.7}
              >
                <View style={styles.subServiceIconCircle}>
                  {renderIcon(
                    sub.icon,
                    sub.iconFamily,
                    22,
                    colors.primary
                  )}
                </View>
                <Text style={styles.subServiceLabel} numberOfLines={2}>
                  {sub.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* d) Support Card (Green-tinted) */}
          <View style={styles.supportCard}>
            <View style={styles.supportTopRow}>
              <View style={styles.supportIconCircle}>
                <Ionicons name="headset" size={17} color="#15803D" />
              </View>
              <View style={styles.supportTextGroup}>
                <Text style={styles.supportTitle}>
                  Can't find what you need?
                </Text>
                <Text style={styles.supportSubtitle}>
                  Chat with us and we'll help you find the right service.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.chatNowBtn}
              onPress={() => router.push('/profile/contact-support' as any)}
              activeOpacity={0.85}
            >
              <Ionicons
                name="chatbubble-ellipses"
                size={14}
                color={colors.white}
              />
              <Text style={styles.chatNowText}>Chat Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
    width: '100%',
  },

  /* ---------- 1. HEADER ---------- */
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm + 4,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    width: '100%',
  },
  headerLeft: {
    width: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerIconBtn: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  headerRight: {
    width: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },

  /* ---------- 2. TWO-PANE LAYOUT ---------- */
  masterDetailContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
    width: '100%',
    overflow: 'hidden',
  },

  /* ----- Left Sidebar (~27% width) ----- */
  sidebar: {
    width: '27%',
    minWidth: '27%',
    maxWidth: '27%',
    backgroundColor: '#F8FAFC',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  sidebarScroll: {
    paddingVertical: spacing.xs,
  },
  sidebarItem: {
    paddingVertical: 13,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDF2F7',
  },
  sidebarItemSelected: {
    backgroundColor: '#EAF2FF',
  },
  activeIndicatorBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3.5,
    backgroundColor: colors.primary,
  },
  sidebarIconBox: {
    marginBottom: 4,
  },
  sidebarLabel: {
    fontSize: 10.5,
    fontWeight: typography.fontWeight.medium,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 13,
    paddingHorizontal: 2,
  },
  sidebarLabelSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },

  /* ----- Right Main Content Area (~73% width) ----- */
  contentArea: {
    flex: 1,
    width: '73%',
    minWidth: 0,
    maxWidth: '73%',
    backgroundColor: colors.surface,
  },
  contentScroll: {
    padding: 12,
    paddingBottom: spacing.xl,
  },

  /* a) Hero Banner Card */
  heroCard: {
    backgroundColor: '#EEF4FB',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DFE7F3',
    width: '100%',
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  heroTitle: {
    fontSize: 14.5,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 4,
  },
  heroDescription: {
    fontSize: 10.5,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  heroImage: {
    width: 76,
    height: 76,
    borderRadius: 8,
  },
  heroFallbackIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* b) Section Heading */
  sectionHeading: {
    fontSize: 15,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 10,
    marginTop: 2,
  },

  /* c) 3-column Grid */
  subServiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
    width: '100%',
  },
  subServiceCard: {
    width: '32%',
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 10,
  },
  subServiceIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  subServiceLabel: {
    fontSize: 10.5,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 13.5,
    paddingHorizontal: 2,
  },

  /* d) Support Card (Green Tinted) */
  supportCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    width: '100%',
  },
  supportTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  supportIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  supportTextGroup: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: typography.fontWeight.bold,
    color: '#14532D',
  },
  supportSubtitle: {
    fontSize: 10.5,
    color: '#166534',
    marginTop: 2,
    lineHeight: 14,
  },
  chatNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#16A34A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 5,
  },
  chatNowText: {
    fontSize: 11.5,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
});
