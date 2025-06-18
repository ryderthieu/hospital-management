import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Alert, ActivityIndicator, View as RNView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BookAppointmentStackParamList, Doctor } from '../types';
import { globalStyles, colors } from '../../../styles/globalStyles';
import Header from '../../../components/Header';
import { DoctorCard } from './DoctorCard';
import { SortOptionsScreen, SortOption } from './SortOptionsScreen';
import { FilterOptionsScreen, FilterOptions } from './FilterOptionsScreen';
import { useFont, fontFamily } from '../../../context/FontContext';
import API from '../../../services/api';
import { useAlert } from '../../../context/AlertContext';
import { useDoctors } from '../../../context/DoctorContext';

type DoctorListScreenProps = {
  navigation: StackNavigationProp<BookAppointmentStackParamList, 'DoctorList'>;
  route: RouteProp<BookAppointmentStackParamList, 'DoctorList'>;
};

interface DoctorDto {
  doctorId: number;
  fullName: string | null;
  specialization: string | null;
  academicDegree: string | null;
  departmentId?: number;
}

export const DoctorListScreen: React.FC<DoctorListScreenProps> = ({ navigation, route }) => {
  const { fontsLoaded } = useFont();
  const { departmentId, departmentName } = route.params || {};
  const { showAlert } = useAlert();
  const { doctorsByDepartment, loadingDepartments, preloadDoctorsForDepartments, schedulesByDoctor, loadingDoctors, preloadSchedulesForDoctors } = useDoctors();
  const [activeLoadingDoctorId, setActiveLoadingDoctorId] = useState<string | null>(null);

  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('popular');
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({});
  const [favorites, setFavorites] = useState<string[]>([]);


  useEffect(() => {
    if (departmentId && !doctorsByDepartment[departmentId]) {
      preloadDoctorsForDepartments([departmentId.toString()]);
    }
  }, [departmentId]);

  const doctors = doctorsByDepartment[departmentId] || [];
  const isLoading = loadingDepartments.includes(departmentId);

  const filteredDoctors = useMemo(() => {
    let filtered = [...doctors];

    if (selectedFilters.priceRange) {
      filtered = filtered.filter((doctor) => {
        return doctor.consultationFee >= selectedFilters.priceRange!.min && 
               doctor.consultationFee <= selectedFilters.priceRange!.max;
      });
    }

    if (selectedFilters.rating) {
      filtered = filtered.filter((doctor) => (doctor.rating || 0) >= selectedFilters.rating!);
    }

    if (selectedFilters.experience) {
      filtered = filtered.filter((doctor) => {
        if (!doctor.experience) return false;
        const experienceYears = parseInt(doctor.experience.replace(/[^\d]/g, '')) || 0;
        switch (selectedFilters.experience) {
          case '1-3':
            return experienceYears >= 1 && experienceYears <= 3;
          case '4-7':
            return experienceYears >= 4 && experienceYears <= 7;
          case '8-15':
            return experienceYears >= 8 && experienceYears <= 15;
          case '15+':
            return experienceYears > 15;
          default:
            return true;
        }
      });
    }

    if (selectedFilters.isOnline) {
      filtered = filtered.filter((doctor) => doctor.isOnline);
    }

    if (selectedFilters.availability) {
      filtered = filtered; // Cần logic xử lý availability nếu có
    }

    return filtered;
  }, [doctors, selectedFilters]);

  const sortedDoctors = useMemo(() => {
    const sorted = [...filteredDoctors];

    switch (selectedSort) {
      case 'newest':
        return sorted.sort((a, b) => (b.joinDate || '').localeCompare(a.joinDate || ''));
      case 'oldest':
        return sorted.sort((a, b) => (a.joinDate || '').localeCompare(b.joinDate || ''));
      case 'popular':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'price_low_high':
        return sorted.sort((a, b) => a.consultationFee - b.consultationFee);
      case 'price_high_low':
        return sorted.sort((a, b) => b.consultationFee - a.consultationFee);
      default:
        return sorted;
    }
  }, [filteredDoctors, selectedSort]);

  const handleDoctorPress = (doctor: Doctor) => {
    if (!schedulesByDoctor[doctor.id] && !loadingDoctors.includes(doctor.id)) {
      setActiveLoadingDoctorId(doctor.id);
      preloadSchedulesForDoctors([doctor.id]);
      return;
    }
    navigation.navigate('BookAppointment', { doctor });
  };

  useEffect(() => {
    if (
      activeLoadingDoctorId &&
      !loadingDoctors.includes(activeLoadingDoctorId) &&
      schedulesByDoctor[activeLoadingDoctorId]
    ) {
      const doctor = doctors.find(d => d.id === activeLoadingDoctorId);
      setActiveLoadingDoctorId(null);
      if (doctor) {
        navigation.navigate('BookAppointment', { doctor });
      }
    }
  }, [loadingDoctors, activeLoadingDoctorId, schedulesByDoctor]);

  const handleFavoritePress = (doctorId: string) => {
    setFavorites((prev) =>
      prev.includes(doctorId) ? prev.filter((id) => id !== doctorId) : [...prev, doctorId],
    );
  };

  const handleSortPress = () => {
    setSortModalVisible(true);
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleSortSelect = (sort: SortOption) => {
    setSelectedSort(sort);
  };

  const handleFiltersChange = (filters: FilterOptions) => {
    setSelectedFilters(filters);
  };

  const handleApplyFilters = () => {
    // Filters applied via useMemo
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
  };

  const getSortLabel = (sort: SortOption): string => {
    switch (sort) {
      case 'newest':
        return 'Mới nhất';
      case 'oldest':
        return 'Cũ nhất';
      case 'popular':
        return 'Nổi bật';
      case 'price_low_high':
        return 'Giá thấp → cao';
      case 'price_high_low':
        return 'Giá cao → thấp';
      default:
        return 'Nổi bật';
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedFilters.priceRange) count++;
    if (selectedFilters.rating) count++;
    if (selectedFilters.experience) count++;
    if (selectedFilters.availability) count++;
    if (selectedFilters.isOnline) count++;
    return count;
  };

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <DoctorCard
      doctor={item}
      onPress={() => handleDoctorPress(item)}
      isFavorite={favorites.includes(item.id)}
      onFavoritePress={() => handleFavoritePress(item.id)}
      showFavorite={true}
    />
  );

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header
          title={departmentName || 'Danh sách bác sĩ'}
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { fontFamily: fontFamily.regular }]}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header
        title={departmentName || 'Danh sách bác sĩ'}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.filterSortBar}>
        <View style={styles.resultCount}>
          <Text style={[styles.resultText, { fontFamily: fontFamily.medium }]}>
            {sortedDoctors.length} bác sĩ
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={handleFilterPress} style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={18} color={colors.text} />
            <Text style={[styles.actionText, { fontFamily: fontFamily.medium }]}>
              Lọc {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSortPress} style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="funnel-outline" size={18} color={colors.text} />
            <Text style={[styles.actionText, { fontFamily: fontFamily.medium }]}>
              {getSortLabel(selectedSort)}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {sortedDoctors.length > 0 ? (
        <FlatList
          data={sortedDoctors}
          renderItem={renderDoctorItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { fontFamily: fontFamily.regular }]}>
            Không có bác sĩ nào trong chuyên khoa này.
          </Text>
        </View>
      )}

      <SortOptionsScreen
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        selectedSort={selectedSort}
        onSortSelect={handleSortSelect}
      />

      <FilterOptionsScreen
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedFilters={selectedFilters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {activeLoadingDoctorId && loadingDoctors.includes(activeLoadingDoctorId) && (
        <RNView style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(255,255,255,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
        }}>
          <ActivityIndicator size="large" color="#00B5B8" />
        </RNView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filterSortBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultCount: {
    flex: 1,
  },
  resultText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.base50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
  },
  listContainer: {
    padding: 16,
  },
  listSeparator: {
    height: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});