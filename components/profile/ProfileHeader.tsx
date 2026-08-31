import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '@/types/user';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface ProfileHeaderProps {
  user: UserProfile;
  onEditPress?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditPress }) => {
  const getInitials = (name: string) => {
    if (!name || name === 'User') return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarBox}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{getInitials(user.name)}</Text>
          </View>
        )}
        {onEditPress && (
          <TouchableOpacity style={styles.editBadge} onPress={onEditPress} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={14} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.name}>{user.name || 'User'}</Text>
      <Text style={styles.contact}>
        {user.email || ''}{user.email && user.phone ? ' • ' : ''}{user.phone || ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarBox: {
    position: 'relative',
    marginBottom: spacing.xs,
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  initialsCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  editBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  name: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  contact: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default ProfileHeader;
