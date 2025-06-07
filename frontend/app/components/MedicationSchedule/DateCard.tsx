import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DateOption } from '../../screens/MedicationSchedule/type';
import { colors } from '../../styles/globalStyles';
import { useFont, fontFamily } from "../../context/FontContext"

interface DateCardProps {
  date: DateOption;
  isSelected: boolean;
  onPress: () => void;
}

export const DateCard: React.FC<DateCardProps> = ({ date, isSelected, onPress }) => {
  // Get current date for comparison
  const currentDate = new Date();
  const today = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Parse the date from DateOption (assuming date.fullDate exists or we can construct it)
  const cardDate = new Date(date.fullDate || `${currentYear}-${currentMonth + 1}-${date.date}`);
  const isToday = cardDate.toDateString() === currentDate.toDateString();
  const isPast = cardDate < currentDate && !isToday;
  
  // Get Vietnamese day names
  const getVietnameseDayName = (dayIndex: number) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[dayIndex];
  };

  // Update day display to use Vietnamese
  const vietnameseDay = getVietnameseDayName(cardDate.getDay());
  const { fontsLoaded } = useFont();
  
  return (
    <View style={styles.dateCardContainer}>
      <TouchableOpacity
        style={[
          styles.dateCard,
          isSelected && styles.selectedDateCard,
          isToday && !isSelected && styles.todayDateCard,
          (date.disabled || isPast) && styles.disabledDateCard,
        ]}
        onPress={onPress}
        disabled={date.disabled || isPast}
        activeOpacity={0.8}
      >
        {/* Main content */}
        <View style={styles.dateContent}>
          <Text style={[
            styles.dateDay, 
            isSelected && styles.selectedDateText,
            isToday && !isSelected && styles.todayDateText,
            (date.disabled || isPast) && styles.disabledText,
          ]}>
            {vietnameseDay}
          </Text>
          <Text style={[
            styles.dateNumber, 
            isSelected && styles.selectedDateText,
            isToday && !isSelected && styles.todayDateText,
            (date.disabled || isPast) && styles.disabledText,
          ]}>
            {date.date}
          </Text>
        </View>
        
        {/* Today indicator */}
        {isToday && !isSelected && (
          <View style={styles.todayIndicator} />
        )}
        
        {/* Selected indicator */}
        {isSelected && (
          <View style={styles.selectedIndicator} />
        )}
        
        {/* Disabled overlay for past dates or disabled dates */}
        {(date.disabled || isPast) && (
          <View style={styles.disabledDateOverlay}>
            <View style={styles.diagonalLine} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dateCardContainer: {
    marginRight: 12,
    marginVertical: 8, // Add vertical margin to prevent shadow clipping
  },
  dateCard: {
    width: 80,
    height: 100,
    backgroundColor: colors.white,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // Enhanced shadow for iOS
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'visible',
  },
  dateContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  selectedDateCard: {
    backgroundColor: colors.base500,
    shadowColor: colors.base500,
    shadowOffset: { 
      width: 0, 
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  todayDateCard: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
    shadowColor: '#2196F3',
    shadowOffset: { 
      width: 0, 
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledDateCard: {
    backgroundColor: '#F5F5F5',
    shadowOpacity: 0.08,
    elevation: 2,
  },
  disabledDateOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagonalLine: {
    width: 2,
    height: 80,
    backgroundColor: '#BDBDBD',
    transform: [{ rotate: '45deg' }],
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dateDay: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  dateNumber: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
  },
  selectedDateText: {
    color: colors.white,
  },
  todayDateText: {
    fontFamily: fontFamily.bold,
    color: '#1976D2',
  },
  disabledText: {
    fontFamily: fontFamily.regular,
    color: '#9E9E9E',
  },
});