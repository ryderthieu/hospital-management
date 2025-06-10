import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList, Medicine, MedicineResponse } from '../../../navigation/types';
import { globalStyles, colors } from '../../../styles/globalStyles';
import Header from '../../../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useFont, fontFamily } from '../../../context/FontContext';
import API from '../../../services/api';
import { LinearGradient } from 'expo-linear-gradient';

type MedicineDetailScreenProps = {
  route: RouteProp<SearchStackParamList, 'MedicineDetail'>;
  navigation: StackNavigationProp<SearchStackParamList, 'MedicineDetail'>;
};

export const MedicineDetailScreen: React.FC<MedicineDetailScreenProps> = ({ route, navigation }) => {
  const { medicine: initialMedicine } = route.params;
  const { fontsLoaded } = useFont();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const response = await API.get<MedicineResponse>(`/pharmacy/medicines/${initialMedicine.id}`);
        const fetchedMedicine: Medicine = {
          id: response.data.medicineId.toString(),
          name: response.data.medicineName,
          category: response.data.category,
          manufacturer: response.data.manufactor,
          description: response.data.description,
          sideEffects: response.data.sideEffects,
          avatar: response.data.avatar || 'https://via.placeholder.com/150',
          price: `${response.data.price} VNĐ`,
        };
        setMedicine(fetchedMedicine);
        setError('');
      } catch (error: any) {
        console.error(
          '[MedicineDetailScreen] Error fetching medicine:',
          error.message,
          error.response ? {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
          } : 'No response data'
        );
        setMedicine(initialMedicine);
        setError('Không thể tải thông tin chi tiết thuốc');
      }
    };

    fetchMedicine();
  }, [initialMedicine.id]);

  if (!medicine) {
    return (
      <View style={styles.container}>
        <Header
          title="Chi tiết thuốc"
          showBack={true}
          onBackPress={() => navigation.goBack()}
          showAction={false}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary || '#007AFF'} />
          <Text style={styles.loadingText}>Đang tải thông tin thuốc...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header
          title="Chi tiết thuốc"
          showBack={true}
          onBackPress={() => navigation.goBack()}
          showAction={false}
        />
        <View style={styles.centerContainer}>
          <Ionicons name="warning-outline" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setMedicine(null);
              setError('');
              fetchMedicine();
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
        title="Chi tiết thuốc"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showAction={false}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: medicine.avatar }}
            style={styles.medicineImage}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.medicineName}>{medicine.name}</Text>
        <Text style={styles.medicinePrice}>{medicine.price}</Text>

        <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8}>
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.cardGradient}
          >
            <View style={styles.innerCardContainer}>
              <View style={styles.keyDetailItem}>
                <Ionicons name="business-outline" size={20} color={colors.primary || '#007AFF'} />
                <Text style={styles.keyDetailText}>Nhà sản xuất: {medicine.manufacturer}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.keyDetailItem}>
                <Ionicons name="pricetag-outline" size={20} color={colors.primary || '#007AFF'} />
                <Text style={styles.keyDetailText}>Loại: {medicine.category}</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8}>
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.cardGradient}
          >
            <Text style={styles.sectionHeader}>MÔ TẢ</Text>
            <Text style={styles.sectionText}>{medicine.description}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8}>
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.cardGradient}
          >
            <Text style={styles.sectionHeader}>TÁC DỤNG PHỤ</Text>
            <Text style={styles.sectionText}>{medicine.sideEffects}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContainer: {
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  medicineImage: {
    width: '90%',
    height: 240,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  medicineName: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    textAlign: 'center',
    color: colors.text || '#000000',
    marginBottom: 8,
  },
  medicinePrice: {
    fontFamily: fontFamily.medium,
    fontSize: 20,
    textAlign: 'center',
    color: colors.primary || '#007AFF',
    marginBottom: 24,
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  innerCardContainer: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 12,
  },
  keyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 8,
  },
  keyDetailText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: '#4B5563',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  sectionHeader: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.text || '#000000',
    marginBottom: 12,
  },
  sectionText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
});