import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList, Medicine, MedicineResponse } from '../../../navigation/types';
import { globalStyles, colors } from '../../../styles/globalStyles';
import Header from '../../../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useFont, fontFamily } from '../../../context/FontContext';
import API from '../../../services/api';
import { LinearGradient } from 'expo-linear-gradient';

type MedicineListScreenProps = {
  route: RouteProp<SearchStackParamList, 'MedicineList'>;
  navigation: StackNavigationProp<SearchStackParamList, 'MedicineList'>;
};

export const MedicineListScreen: React.FC<MedicineListScreenProps> = ({ route, navigation }) => {
  const { fontsLoaded } = useFont();
  const { category } = route.params || {};
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
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
          avatar: dto.avatar || 'https://via.placeholder.com/150',
          price: `${dto.price} VNĐ`,
        }));
        setMedicines(medicines);
        setError('');
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
        setError('Không thể tải danh sách thuốc. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.');
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [category, searchQuery]);

  const renderMedicineItem = ({ item }: { item: Medicine }) => (
    <TouchableOpacity
      style={styles.medicineItem}
      onPress={() => navigation.navigate('MedicineDetail', { medicine: item })}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC']}
        style={styles.cardGradient}
      >
        <View style={styles.cardContent}>
          <Image
            source={{ uri: item.avatar }}
            style={styles.medicineImage}
            resizeMode="cover"
          />
          <View style={styles.medicineInfo}>
            <Text style={styles.medicineName}>{item.name}</Text>
            <Text style={styles.medicineDetail}>Nhà sản xuất: {item.manufacturer}</Text>
            <Text style={styles.medicinePrice}>{item.price}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title={`Thuốc - ${category}`}
          showBack={true}
          onBackPress={() => navigation.goBack()}
          showAction={true}
          actionType="notification"
          onActionPress={() => navigation.navigate('Notifications')}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary || '#007AFF'} />
          <Text style={styles.loadingText}>Đang tải danh sách thuốc...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header
          title={`Thuốc - ${category}`}
          showBack={true}
          onBackPress={() => navigation.goBack()}
          showAction={true}
          actionType="notification"
          onActionPress={() => navigation.navigate('Notifications')}
        />
        <View style={styles.centerContainer}>
          <Ionicons name="warning-outline" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError('');
              fetchMedicines();
            }}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={`Thuốc - ${category}`}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showAction={true}
        actionType="notification"
        onActionPress={() => navigation.navigate('Notifications')}
      />
      <View style={styles.searchContainer}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.searchInputContainer}
        >
          <Ionicons name="search-outline" size={24} color={colors.primary || '#007AFF'} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm thuốc"
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </LinearGradient>
      </View>
      {medicines.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="medkit-outline" size={48} color="#8E8E93" />
          <Text style={styles.noDataText}>Không tìm thấy thuốc nào trong danh mục này.</Text>
        </View>
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
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text || '#000000',
    fontFamily: fontFamily.regular,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 24,
    fontFamily: fontFamily.regular,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary || '#007AFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fontFamily.medium,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    fontFamily: fontFamily.regular,
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: colors.text || '#000000',
  },
  medicineItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicineImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.text || '#000000',
    marginBottom: 4,
  },
  medicineDetail: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  medicinePrice: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.primary || '#007AFF',
  },
  noDataText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 12,
  },
});