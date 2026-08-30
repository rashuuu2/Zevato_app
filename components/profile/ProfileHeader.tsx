import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  return (
    <View style={styles.container}>
      <View style={styles.avatarBox}>
        <Ionicons name="person-circle-outline" size={72} color={colors.primary} />
        {onEditPress && (
          <TouchableOpacity style={styles.editBadge} onPress={onEditPress} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={14} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.contact}>{user.email} • {user.phone}</Text>
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
