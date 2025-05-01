import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFont, fontFamily } from '../context/FontContext';

/**
 * Reusable header component for app screens
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {boolean} props.showBack
 * @param {Function} props.onBackPress
 * @param {boolean} props.showAction
 * @param {string} props.actionType
 * @param {string} props.actionText
 * @param {Function} props.onActionPress
 * @param {Object} props.style
 */
const Header = ({
  title,
  showBack = false,
  onBackPress,
  showAction = false,
  actionType = null,
  actionText = null,
  onActionPress,
  style,
}) => {
  const { fontsLoaded } = useFont();

  if (!fontsLoaded) {
    return null; // Hoặc hiển thị loading
  }

  const getActionElement = () => {
    if (!showAction) return <View style={styles.rightPlaceholder} />;

    if (actionText) {
      return (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onActionPress}
          disabled={!onActionPress}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      );
    }

    const iconMap = {
      notification: 'notifications-outline',
      more: 'ellipsis-horizontal',
      search: 'search-outline',
      settings: 'settings-outline',
      plus: 'add-outline',
      filter: 'filter-outline',
      edit: 'create-outline',
    };

    const iconName = iconMap[actionType] || 'ellipsis-horizontal';

    return (
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onActionPress}
        disabled={!onActionPress}
      >
        <Ionicons name={iconName} size={24} color="#000" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.header, style]}>
      {showBack ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          disabled={!onBackPress}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ) : (
        <View style={styles.leftPlaceholder} />
      )}

      <Text style={styles.title}>{title}</Text>

      {getActionElement()}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  leftPlaceholder: {
    width: 40,
  },
  rightPlaceholder: {
    width: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  actionText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: '#00B5B8',
  },
});

export default React.memo(Header);