import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DateOption } from '../types';
import { colors } from '../../../styles/globalStyles';

interface DateCardProps {
  date: DateOption;
  isSelected: boolean;
  onPress: () => void;
}

export const DateCard: React.FC<DateCardProps> = ({ date, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.dateCard,
        isSelected && styles.selectedDateCard,
        date.disabled && styles.disabledDateCard,
      ]}
      onPress={onPress}
      disabled={date.disabled}
    >
      <Text style={[styles.dateDay, isSelected && styles.selectedDateText]}>{date.day}</Text>
      <Text style={[styles.dateNumber, isSelected && styles.selectedDateText]}>{date.date}</Text>
      {date.disabled && <View style={styles.disabledDateOverlay} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dateCard: {
    width: 80,
    height: 80,
    backgroundColor: colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: colors.base900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedDateCard: {
    backgroundColor: colors.base500,
  },
  disabledDateCard: {
    position: 'relative',
  },
  disabledDateOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.disabled,
    borderRadius: 12,
    zIndex: 1,
  },
  dateDay: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  selectedDateText: {
    color: colors.white,
  },
});