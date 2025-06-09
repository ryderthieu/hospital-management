import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList, Medicine, MedicineResponse } from '../../../navigation/types';
import { globalStyles, colors } from '../../../styles/globalStyles';
import Header from '../../../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useFont, fontFamily } from '../../../context/FontContext';
import API from '../../../services/api';

type MedicineListScreenProps = {
  route: RouteProp<SearchStackParamList, 'MedicineList'>;
  navigation: StackNavigationProp<SearchStackParamList, 'MedicineList'>;
};

export const MedicineListScreen: React.FC<MedicineListScreenProps> = ({ route, navigation }) => {
  const { fontsLoaded } = useFont();
  const { category } = route.params || {};
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        console.log(`[MedicineListScreen] Fetching medicines for category: ${category}, searchQuery: ${searchQuery}`);
        const response = await API.get<MedicineResponse[]>('/pharmacy/medicines/search', {
          params: { category, name: searchQuery },
        });
        console.log('[MedicineListScreen] API response:', JSON.stringify(response.data, null, 2));
        const medicines: Medicine[] = response.data.map((dto) => ({
          id: dto.medicineId.toString(),
          name: dto.medicineName,
          category: dto.category,
          manufacturer: dto.manufactor,
          description: dto.description,
          sideEffects: dto.sideEffects,
          images: ['https://via.placeholder.com/150'],
          price: `${dto.price} VNĐ`,
        }));
        setMedicines(medicines);
      } catch (error: any) {
        console.error(
          '[MedicineListScreen] Error fetching medicines:',
          error.message,
          error.response ? {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
          } : 'No response data'
        );
        Alert.alert(
          'Lỗi',
          'Không thể tải danh sách thuốc. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.',
          [{ text: 'OK' }]
        );
        setMedicines([]);
      }
    };

    fetchMedicines();
  }, [category, searchQuery]);

  const renderMedicineItem = ({ item }: { item: Medicine }) => (
    <TouchableOpacity
      style={styles.medicineItem}
      onPress={() => navigation.navigate('MedicineDetail', { medicine: item })}
    >
      <Image
        source={{ uri: item.images[0] }}
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
    <View style={globalStyles.container}>
      <Header
        title={`Thuốc - ${category}`}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showAction={true}
        actionType="notification"
        onActionPress={() => navigation.navigate('Notifications')}
      />
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm thuốc"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      {medicines.length === 0 ? (
        <Text style={styles.noDataText}>Không có thuốc nào trong danh mục này.</Text>
      ) : (
        <FlatList
          data={medicines}
          renderItem={renderMedicineItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    fontFamily: fontFamily.regular,
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
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
  noDataText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
  },
});