import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../styles/globalStyles';

interface TimeSlotProps {
  time: string;
  isSelected: boolean;
  onPress: () => void;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ time, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.timeSlot, isSelected && styles.selectedTimeSlot]}
      onPress={onPress}
    >
      <Text style={[styles.timeText, isSelected && styles.selectedTimeText]}>{time}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  timeSlot: {
    width: '22%',
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.base900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  selectedTimeSlot: {
    backgroundColor: colors.base500,
  },
  timeText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedTimeText: {
    color: colors.white,
  },
});