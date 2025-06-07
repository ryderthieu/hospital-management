import React, { memo } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../styles/globalStyles';
import { useFont, fontFamily } from '../../../context/FontContext';

interface TimeSlotProps {
  time: string;
  isSelected: boolean;
  isAvailable?: boolean;
  isBooked?: boolean;
  price?: string;
  onPress: () => void;
}

export const TimeSlot: React.FC<TimeSlotProps> = memo(({ 
  time, 
  isSelected, 
  isAvailable = true,
  isBooked = false,
  price,
  onPress 
}) => {
  const { fontsLoaded } = useFont();

  const getSlotStyle = () => {
    if (isBooked) return [styles.timeSlot, styles.bookedTimeSlot];
    if (!isAvailable) return [styles.timeSlot, styles.unavailableTimeSlot];
    if (isSelected) return [styles.timeSlot, styles.selectedTimeSlot];
    return styles.timeSlot;
  };

  const getTextStyle = () => {
    if (isBooked) return [styles.timeText, styles.bookedTimeText];
    if (!isAvailable) return [styles.timeText, styles.unavailableTimeText];
    if (isSelected) return [styles.timeText, styles.selectedTimeText];
    return styles.timeText;
  };

  const handlePress = () => {
    if (isAvailable && !isBooked) {
      onPress();
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TouchableOpacity
      style={getSlotStyle()}
      onPress={handlePress}
      disabled={!isAvailable || isBooked}
      activeOpacity={isAvailable && !isBooked ? 0.7 : 1}
      accessibilityRole="button"
      accessibilityLabel={`Khung giờ ${time}${isBooked ? ', đã được đặt' : isAvailable ? ', có sẵn' : ', không có sẵn'}`}
      accessibilityState={{ 
        selected: isSelected,
        disabled: !isAvailable || isBooked 
      }}
    >
      <Text style={[
        getTextStyle(),
        { fontFamily: fontsLoaded ? fontFamily.medium : undefined }
      ]}>
        {time}
      </Text>
      
      {/* Show status indicators if needed */}
      {isBooked && (
        <View style={styles.statusIndicator}>
          <Ionicons name="close-circle" size={12} color={colors.error} />
        </View>
      )}
    </TouchableOpacity>
  );
});

TimeSlot.displayName = 'TimeSlot';

const styles = StyleSheet.create({
  timeSlot: {
    width: '22%',
    height: 48, 
    backgroundColor: colors.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0', 
  },
  selectedTimeSlot: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unavailableTimeSlot: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    opacity: 0.6,
  },
  bookedTimeSlot: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  timeText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedTimeText: {
    color: colors.white,
    fontWeight: '600',
  },
  unavailableTimeText: {
    color: '#999999',
  },
  bookedTimeText: {
    color: '#F44336',
  },
  statusIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
});