import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { BookAppointmentStackParamList, Specialty, DepartmentDto, DoctorDto } from '../types';
import { globalStyles, colors } from '../../../styles/globalStyles';
import { SpecialtyItem } from './SpecialtyItem';
import Header from '../../../components/Header';
import { useFont, fontFamily } from '../../../context/FontContext';
import API from '../../../services/api';
import { Alert } from 'react-native';

type SpecialistSearchScreenProps = {
  navigation: StackNavigationProp<BookAppointmentStackParamList, 'Search'>;
};

export const SpecialistSearchScreen: React.FC<SpecialistSearchScreenProps> = ({ navigation }) => {
  const { fontsLoaded } = useFont();
  const [searchQuery, setSearchQuery] = useState('');
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    setIsLoading(true);
    try {
      const departmentsResponse = await API.get<DepartmentDto[]>('/doctors/departments');
      console.log('Debug - Departments response:', departmentsResponse.data);

      const doctorCountPromises = departmentsResponse.data.map((dept) =>
        API.get<DoctorDto[]>(`/doctors/departments/${dept.departmentId}/doctors`)
          .then((res) => ({ departmentId: dept.departmentId, count: res.data.length }))
          .catch((error) => {
            console.warn(`No doctors for department ${dept.departmentId}:`, error.message);
            return { departmentId: dept.departmentId, count: 0 };
          }),
      );

      const doctorCounts = await Promise.all(doctorCountPromises);
      const doctorCountMap = new Map(doctorCounts.map((item) => [item.departmentId, item.count]));

      const specialtiesData: Specialty[] = departmentsResponse.data.map((dept) => {
        let icon: ImageSourcePropType = { uri: 'https://via.placeholder.com/50' };
        try {
          icon = require('../../../assets/images/logo/Logo.png');
        } catch (e) {
          console.warn(`Default icon not found, using placeholder URI`);
        }
        return {
          id: dept.departmentId,
          name: dept.departmentName || 'Chưa có tên',
          doctorCount: doctorCountMap.get(dept.departmentId) || 0,
          icon,
        };
      });

      setSpecialties(specialtiesData);
    } catch (error: any) {
      console.error('Fetch specialties error:', error.message, error.response?.data);
      Alert.alert(
        'Lỗi',
        error.response?.data?.message || 'Không thể tải danh sách chuyên khoa. Vui lòng thử lại.',
      );
      setSpecialties([]);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSpecialtyPress = (specialty: Specialty) => {
    navigation.navigate('DoctorList', {
      departmentId: specialty.id,
      departmentName: specialty.name,
    });
  };

  const handleSearchMore = () => {
    console.log('Search more pressed');
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderSpecialtyItem = ({ item }: { item: Specialty }) => (
    <SpecialtyItem specialty={item} onPress={() => handleSpecialtyPress(item)} />
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

  if (!fontsLoaded || isLoading) {
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
      <FlatList
        data={paginatedSpecialties}
        renderItem={renderSpecialtyItem}
        keyExtractor={(item) => item.id.toString()}
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
    justifyContent: 'space-between',
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