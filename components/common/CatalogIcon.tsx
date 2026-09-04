import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

import ioniconsGlyphs from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json';
import materialGlyphs from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

const MATERIAL_COMMUNITY_ICONS = materialGlyphs as Record<string, number>;
const IONICONS = ioniconsGlyphs as Record<string, number>;

export interface CatalogIconProps {
  name: string;
  size?: number;
  color?: string;
  family?: 'Ionicons' | 'MaterialCommunityIcons';
}

/**
 * Universal Catalog Icon component.
 * Automatically checks MaterialCommunityIcons and Ionicons.
 * In case an icon name is missing from both libraries, it logs a warning in DEV
 * and renders an amber-tinted question-mark icon so missing icons are immediately visible.
 */
export const CatalogIcon: React.FC<CatalogIconProps> = ({
  name,
  size = 24,
  color = colors.primary,
  family,
}) => {
  if (!name) {
    if (__DEV__) {
      console.warn('⚠️ [CatalogIcon] Icon name was empty or undefined.');
    }
    return <Ionicons name="help-circle-outline" size={size} color="#F59E0B" />;
  }

  // 1. Check if name is in MaterialCommunityIcons
  if (family === 'MaterialCommunityIcons' || !family) {
    if (name in MATERIAL_COMMUNITY_ICONS) {
      return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
    }
  }

  // 2. Check if name is in Ionicons (direct or with -outline)
  if (family === 'Ionicons' || !family) {
    if (name in IONICONS) {
      return <Ionicons name={name as any} size={size} color={color} />;
    }
    if (`${name}-outline` in IONICONS) {
      return <Ionicons name={`${name}-outline` as any} size={size} color={color} />;
    }
  }

  // 3. Fallback name mappings
  if (name === 'snow') {
    return <Ionicons name="snow-outline" size={size} color={color} />;
  }
  if (name === 'game-controller') {
    return <Ionicons name="game-controller-outline" size={size} color={color} />;
  }

  // 4. Unknown icon: Dev warning + visible amber fallback
  if (__DEV__) {
    console.warn(`⚠️ [CatalogIcon] Missing icon: "${name}" was not found in MaterialCommunityIcons or Ionicons.`);
  }

  return (
    <View style={styles.fallbackWrapper}>
      <Ionicons name="help-circle-outline" size={size} color="#F59E0B" />
    </View>
  );
};

const styles = StyleSheet.create({
  fallbackWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CatalogIcon;
