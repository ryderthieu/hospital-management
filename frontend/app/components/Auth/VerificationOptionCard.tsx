import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFont, fontFamily } from '../../context/FontContext';

type VerificationOptionCardProps = {
  iconName: string;
  title: string;
  value: string;
  onPress: () => void;
};


const VerificationOptionCard = ({ iconName, title, value, onPress }: VerificationOptionCardProps) => {
  const { fontsLoaded } = useFont();
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Ionicons name={iconName as any} size={28} color="#00A3A1" style={styles.icon} />
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
    borderRadius: 12, 
    borderWidth: 1,
    borderColor: '#D1E8EB', 
    padding: 12, 
    marginBottom: 10,
  },
  icon: {
    marginRight: 12, 
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: '#2B2B2B',
    marginBottom: 3, 
  },
  cardValue: {
    fontFamily: fontFamily.regular,
    fontSize: 13, 
    color: '#6B7280', 
  },
});

export { VerificationOptionCard };