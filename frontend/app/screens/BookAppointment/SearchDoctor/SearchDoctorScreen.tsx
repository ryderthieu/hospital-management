import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  View as RNView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { BookAppointmentStackParamList, Specialty, DepartmentDto, DoctorDto } from '../types';
import { globalStyles, colors } from '../../../styles/globalStyles';
import { SpecialtyItem } from '../../../components/SpecialtyItem';
import Header from '../../../components/Header';
import { useFont, fontFamily } from '../../../context/FontContext';
import { useAlert } from '../../../context/AlertContext';
import { useDepartments } from '../../../context/DepartmentContext';
import { useDoctors } from '../../../context/DoctorContext';

type SpecialistSearchScreenProps = {
  navigation: StackNavigationProp<BookAppointmentStackParamList, 'Search'>;
};

export const SpecialistSearchScreen: React.FC<SpecialistSearchScreenProps> = ({ navigation }) => {
  const { fontsLoaded } = useFont();
  const { departments, isLoading: isLoadingDepartments, error: errorDepartments, reloadDepartments } = useDepartments();
  const { doctorsByDepartment, loadingDepartments, preloadDoctorsForDepartments } = useDoctors();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { showAlert } = useAlert();
  const [activeLoadingDepartmentId, setActiveLoadingDepartmentId] = useState<string | null>(null);

  // Map departments từ context sang Specialty
  const specialties: Specialty[] = useMemo(() => departments.map(dept => ({
    id: dept.departmentId.toString(),
    name: dept.departmentName || 'Chưa có tên',
    count: dept.staffCount ? `${dept.staffCount} bác sĩ` : 'Không có bác sĩ',
    icon: dept.icon ? { uri: dept.icon } : require('../../../assets/images/logo/Logo.png'),
  })), [departments]);

  const filteredSpecialties = useMemo(() => {
    if (!searchQuery.trim()) {
      return specialties;
    }
    return specialties.filter((specialty) =>
      specialty.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, specialties]);

  const paginatedSpecialties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSpecialties.slice(startIndex, endIndex);
  }, [filteredSpecialties, currentPage]);

  const totalPages = Math.ceil(filteredSpecialties.length / itemsPerPage);

  useEffect(() => {
    if (departments.length > 0) {
      preloadDoctorsForDepartments(departments.map(d => d.departmentId.toString()));
    }
  }, [departments]);

  const handleSpecialtyPress = (specialty: Specialty) => {
    if (loadingDepartments.includes(specialty.id)) {
      setActiveLoadingDepartmentId(specialty.id);
      return;
    }
    navigation.navigate('DoctorList', {
      departmentId: specialty.id,
      departmentName: specialty.name,
    });
  };

  useEffect(() => {
    if (
      activeLoadingDepartmentId &&
      !loadingDepartments.includes(activeLoadingDepartmentId)
    ) {
      // Đã load xong, reset lại và điều hướng
      const specialty = specialties.find(s => s.id === activeLoadingDepartmentId);
      setActiveLoadingDepartmentId(null);
      if (specialty) {
        navigation.navigate('DoctorList', {
          departmentId: specialty.id,
          departmentName: specialty.name,
        });
      }
    }
  }, [loadingDepartments, activeLoadingDepartmentId]);

  const handleSearchMore = () => {
    console.log('Search more pressed');
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderSpecialtyItem = ({ item }: { item: Specialty }) => (
    <SpecialtyItem
      specialty={item}
      onPress={() => handleSpecialtyPress(item)}
    />
  );

  const renderListFooter = () => (
    <View style={styles.footerContainer}>
      {filteredSpecialties.length > itemsPerPage && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            onPress={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={currentPage === 1 ? colors.textSecondary : colors.primary}
            />
          </TouchableOpacity>
          <Text style={[styles.pageText, { fontFamily: fontFamily.regular }]}>
            Trang {currentPage} / {totalPages}
          </Text>
          <TouchableOpacity
            onPress={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={currentPage === totalPages ? colors.textSecondary : colors.primary}
            />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.noResultsContainer}>
        <Text style={[styles.noResultsText, { fontFamily: fontFamily.regular }]}>
          Không tìm thấy những gì bạn đang tìm?
        </Text>
        <TouchableOpacity onPress={handleSearchMore}>
          <Text style={[styles.searchMoreButton, { fontFamily: fontFamily.bold }]}>
            Tìm kiếm thêm
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
      <Text style={[styles.emptyText, { fontFamily: fontFamily.regular }]}>
        Không tìm thấy chuyên khoa "{searchQuery}"
      </Text>
      <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
        <Text style={[styles.clearButtonText, { fontFamily: fontFamily.medium }]}>
          Xóa tìm kiếm
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (!fontsLoaded || isLoadingDepartments) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header
          title="Đặt lịch khám"
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
      <StatusBar barStyle="dark-content" />
      <Header
        title="Đặt lịch khám"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <View style={globalStyles.searchContainer}>
        <View style={globalStyles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[globalStyles.searchInput, { fontFamily: fontFamily.regular }]}
            placeholder="Tìm kiếm chuyên khoa"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {activeLoadingDepartmentId && loadingDepartments.includes(activeLoadingDepartmentId) && (
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
      <FlatList
        data={paginatedSpecialties}
        renderItem={renderSpecialtyItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={paginatedSpecialties.length > 1 ? styles.specialtyRow : null}
        contentContainerStyle={styles.specialtyList}
        ListFooterComponent={paginatedSpecialties.length > 0 ? renderListFooter : null}
        ListEmptyComponent={searchQuery.length > 0 ? renderEmptyComponent : null}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  specialtyList: {
    paddingHorizontal: 8,
    flexGrow: 1,
  },
  specialtyRow: {
    justifyContent: 'space-around',
  },
  footerContainer: {
    paddingBottom: 24,
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 16,
  },
  noResultsText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  searchMoreButton: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
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
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  pageButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageText: {
    fontSize: 16,
    color: colors.text,
    marginHorizontal: 16,
  },
});