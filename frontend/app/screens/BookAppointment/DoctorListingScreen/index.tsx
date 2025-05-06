import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '../../../styles/globalStyles';
import { DoctorCard } from './DoctorCard';
import { doctorsData } from './data';
import Header from "../../../components/Header";
import { RootStackParamList, Doctor } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type DoctorListScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'DoctorList'>;
};

export const DoctorListScreen: React.FC<DoctorListScreenProps> = ({ navigation }) => {
  const [specialty, setSpecialty] = useState('Tim mạch'); // Gán specialty mặc định
  const [searchQuery, setSearchQuery] = useState('');

  // Lọc bác sĩ theo chuyên khoa và chuỗi tìm kiếm
  const filteredDoctors = doctorsData.filter(doctor =>
    doctor.specialty === specialty &&
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <DoctorCard
      doctor={item}
      onPress={() => navigation.navigate('BookAppointment', { doctor: item })} 
    />
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header title="Danh sách bác sĩ" />

      <View style={globalStyles.searchContainer}>
        <View style={globalStyles.searchInputContainer}>
          <Ionicons name='search' size={20} color={colors.textSecondary} />
          <TextInput
            style={globalStyles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Tìm bác sĩ ${specialty.toLowerCase()}`}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.doctorList}
      />

      <View style={styles.sortFilterContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => Alert.alert('Sort', 'Bạn đã nhấn nút Sort')}
        >
          <Text style={styles.sortButtonText}>Sort</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => Alert.alert('Filter', 'Bạn đã nhấn nút Filter')}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  doctorList: {
    padding: 16,
  },
  sortFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sortButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  sortButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  filterButtonText: {
    fontSize: 16,
    color: colors.text,
  },
});
