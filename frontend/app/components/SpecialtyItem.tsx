import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Specialty } from '../types/Specialty';

interface Props {
  specialty: Specialty;
  onPress: () => void;
}

export const SpecialtyItem: React.FC<Props> = ({ specialty, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <Image source={specialty.icon} style={styles.icon} />
    <Text style={styles.name} numberOfLines={1}>{specialty.name}</Text>
    <Text style={styles.count}>{specialty.count}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    paddingVertical: 15,
    borderRadius: 12,
    padding: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  count: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
}); 