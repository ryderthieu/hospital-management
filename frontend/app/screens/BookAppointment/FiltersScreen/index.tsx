import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '../../../styles/globalStyles';

export const FilterOptionsScreen: React.FC = () => {
  const [gender, setGender] = useState('Nam');
  const [priceRange, setPriceRange] = useState('Dưới 200.000 VND');

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>GIỚI TÍNH</Text>
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => setGender('Nam')}
          >
            <View style={[styles.radioButton, gender === 'Nam' && styles.radioButtonSelected]}>
              {gender === 'Nam' && <Ionicons name='checkmark-circle-outline' size={16} color="#fff" />}
            </View>
            <Text style={styles.filterOptionText}>Nam</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => setGender('Nữ')}
          >
            <View style={[styles.radioButton, gender === 'Nữ' && styles.radioButtonSelected]}>
              {gender === 'Nữ' && <Ionicons name='checkmark-circle-outline' size={16} color="#fff" />}
            </View>
            <Text style={styles.filterOptionText}>Nữ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => setGender('Khác')}
          >
            <View style={[styles.radioButton, gender === 'Khác' && styles.radioButtonSelected]}>
              {gender === 'Khác' && <Ionicons name='checkmark-circle-outline' size={16} color="#fff" />}
            </View>
            <Text style={styles.filterOptionText}>Khác</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>PHÍ TƯ VẤN</Text>
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => setPriceRange('Dưới 200.000 VND')}
          >
            <View style={[styles.radioButton, priceRange === 'Dưới 200.000 VND' && styles.radioButtonSelected]}>
              {priceRange === 'Dưới 200.000 VND' && <Ionicons name='checkmark-circle-outline' size={16} color="#fff" />}
            </View>
            <Text style={styles.filterOptionText}>Dưới 200.000 VND</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => setPriceRange('Từ 200.000 VND - 500.000 VND')}
          >
            <View style={[styles.radioButton, priceRange === 'Từ 200.000 VND - 500.000 VND' && styles.radioButtonSelected]}>
              {priceRange === 'Từ 200.000 VND - 500.000 VND' && <Ionicons name='checkmark-circle-outline' size={16} color="#fff" />}
            </View>
            <Text style={styles.filterOptionText}>Từ 200.000 VND - 500.000 VND</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => setPriceRange('Từ 500.000 VND - 1.000.000 VND')}
          >
            <View style={[styles.radioButton, priceRange === 'Từ 500.000 VND - 1.000.000 VND' && styles.radioButtonSelected]}>
              {priceRange === 'Từ 500.000 VND - 1.000.000 VND' && <Ionicons name='checkmark-circle-outline' size={16} color="#fff" />}
            </View>
            <Text style={styles.filterOptionText}>Từ 500.000 VND - 1.000.000 VND</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => setPriceRange('Trên 1.000.000 VND')}
          >
            <View style={[styles.radioButton, priceRange === 'Trên 1.000.000 VND' && styles.radioButtonSelected]}>
              {priceRange === 'Trên 1.000.000 VND' && <Ionicons name='checkmark-circle-outline' size={16} color="#fff" />}
            </View>
            <Text style={styles.filterOptionText}>Trên 1.000.000 VND</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={[globalStyles.button, styles.confirmButton]}>
        <Text style={globalStyles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.base200,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  filterOptions: {
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {
    backgroundColor: colors.base500,
    borderColor: colors.base500,
  },
  filterOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  confirmButton: {
    marginTop: 'auto',
    marginBottom: 24,
  },
});