import React, { useState } from 'react';
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
import { SearchStackParamList, MedicineCategory, Medicine, MedicineResponse } from '../../../navigation/types';
import { globalStyles, colors } from '../../../styles/globalStyles';
import { MedicineCategoryItem } from './MedicineCategoryItem';
import { medicineCategoriesData } from './data';
import Header from '../../../components/Header';
import { useFont, fontFamily } from '../../../context/FontContext';
import API from '../../../services/api';

type MedicineSearchScreenProps = {
  navigation: StackNavigationProp<SearchStackParamList, 'MedicineSearch'>;
};

export const MedicineSearchScreen: React.FC<MedicineSearchScreenProps> = ({ navigation }) => {
  const { fontsLoaded } = useFont();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const response = await API.get<MedicineResponse[]>('/pharmacy/medicines/search', {
        params: { name: query },
      });
      const medicines: Medicine[] = response.data.map((dto) => ({
        id: dto.medicineId.toString(),
        name: dto.medicineName,
        category: dto.category,
        manufacturer: dto.manufactor,
        description: dto.description,
        sideEffects: dto.sideEffects,
        avatar: dto.avatar || 'https://via.placeholder.com/150', // Sử dụng avatar từ backend
        price: `${dto.price} VNĐ`,
      }));
      setSearchResults(medicines);
    } catch (error: any) {
      console.error(
        '[MedicineSearchScreen] Error searching medicines:',
        error.message,
        error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        } : 'No response data'
      );
      setSearchResults([]);
    }
  };

  const renderMedicineCategoryItem = ({ item }: { item: MedicineCategory }) => (
    <MedicineCategoryItem
      category={item}
      onPress={() => navigation.navigate('MedicineList', { category: item.name })}
    />
  );

  const renderMedicineItem = ({ item }: { item: Medicine }) => (
    <TouchableOpacity
      style={styles.medicineItem}
      onPress={() => navigation.navigate('MedicineDetail', { medicine: item })}
    >
      <Image
        source={{ uri: item.avatar }}
        style={styles.medicineImage}
        resizeMode="cover"
      />
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <Text style={styles.medicineDetail}>Nhà sản xuất: {item.manufacturer}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        title="Tra cứu thuốc"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        onActionPress={() => navigation.navigate('Notifications' as never)}
      />
      <View style={globalStyles.searchContainer}>
        <View style={globalStyles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={globalStyles.searchInput}
            placeholder="Tìm kiếm thuốc"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {searchQuery.trim() !== '' && (
        <View style={styles.searchResultsContainer}>
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderMedicineItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.searchResultsList}
            />
          ) : (
            <Text style={styles.noResultsText}>Không tìm thấy thuốc nào.</Text>
          )}
        </View>
      )}

      {searchQuery.trim() === '' && (
        <>
          <Text style={globalStyles.sectionTitle}>Tìm theo loại thuốc</Text>
          <FlatList
            data={medicineCategoriesData}
            renderItem={renderMedicineCategoryItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.categoryRow}
            contentContainerStyle={styles.categoryList}
            ListFooterComponent={
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>Không tìm thấy những gì bạn đang tìm?</Text>
                <TouchableOpacity>
                  <Text style={styles.searchMoreButton}>Tìm kiếm thêm</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  categoryList: {
    paddingHorizontal: 8,
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
  },
  noResultsText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  searchMoreButton: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: fontFamily.bold,
    color: colors.primary,
  },
  searchResultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchResultsList: {
    paddingVertical: 16,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  medicineImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    marginBottom: 4,
  },
  medicineDetail: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
});