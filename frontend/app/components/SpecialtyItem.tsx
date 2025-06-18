import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  name: string;
  count: string;
  iconName: string; // Tên icon FontAwesome5
  onPress: () => void;
}

export const SpecialtyItem: React.FC<Props> = ({ name, count, iconName, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={styles.iconWrapper}>
      <FontAwesome5 name={iconName} size={38} color="#0BC5C5" solid />
    </View>
    <Text style={styles.name} numberOfLines={1}>{name}</Text>
    <Text style={styles.count}>{count}</Text>
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
  iconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E6F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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