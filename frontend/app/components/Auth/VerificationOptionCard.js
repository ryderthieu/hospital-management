import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VerificationOptionCard = ({ iconName, title, value, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Ionicons name={iconName} size={28} color="#00A3A1" style={styles.icon} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7FA',
    borderRadius: 12, // Slightly larger radius
    borderWidth: 1, // Added border
    borderColor: '#D1E8EB', // Subtle border color
    padding: 12, // Adjusted padding
    marginBottom: 10, // Reduced spacing between cards
  },
  icon: {
    marginRight: 12, // Slightly less margin
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15, // Slightly smaller
    fontWeight: '700', // Bolder
    color: '#2B2B2B',
    marginBottom: 3, // Tighter spacing
  },
  cardValue: {
    fontSize: 13, // Slightly smaller
    color: '#6B7280', // Match subtitle color
  },
});

export { VerificationOptionCard };