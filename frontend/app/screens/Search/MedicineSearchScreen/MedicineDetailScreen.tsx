import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList, Medicine, MedicineResponse } from '../../../navigation/types';
import { globalStyles, colors } from '../../../styles/globalStyles';
import Header from '../../../components/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFont, fontFamily } from '../../../context/FontContext';
import API from '../../../services/api';

type MedicineDetailScreenProps = {
  route: RouteProp<SearchStackParamList, 'MedicineDetail'>;
  navigation: StackNavigationProp<SearchStackParamList, 'MedicineDetail'>;
};

export const MedicineDetailScreen: React.FC<MedicineDetailScreenProps> = ({ route, navigation }) => {
  const { medicine: initialMedicine } = route.params;
  const { fontsLoaded } = useFont();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
          images: ['https://via.placeholder.com/150'],
          price: `${response.data.price} VNĐ`,
        };
        setMedicine(fetchedMedicine);
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
      }
    };

    fetchMedicine();
  }, [initialMedicine.id]);

  if (!medicine) {
    return (
      <View style={globalStyles.container}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? medicine.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === medicine.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <View style={globalStyles.container}>
      <Header
        title="Chi tiết thuốc"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showAction={false}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          {medicine.images.length > 1 && (
            <TouchableOpacity style={styles.arrowButton} onPress={handlePrevImage}>
              <Icon name="chevron-left" size={30} color="#000" />
            </TouchableOpacity>
          )}
          <Image
            source={{ uri: medicine.images[currentImageIndex] }}
            style={styles.medicineImage}
            resizeMode="cover"
          />
          {medicine.images.length > 1 && (
            <TouchableOpacity style={styles.arrowButton} onPress={handleNextImage}>
              <Icon name="chevron-right" size={30} color="#000" />
            </TouchableOpacity>
          )}
        </View>
        {medicine.images.length > 1 && (
          <View style={styles.carouselDots}>
            {medicine.images.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === currentImageIndex ? styles.activeDot : {}]}
              />
            ))}
          </View>
        )}

        <Text style={styles.medicineName}>{medicine.name}</Text>

        <View style={styles.cardContainer}>
          <View style={styles.innerCardContainer}>
            <View style={styles.keyDetailItem}>
              <Icon name="location-on" size={20} color={colors.textSecondary} />
              <Text style={styles.keyDetailText}>Nhà sản xuất: {medicine.manufacturer}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.sectionHeader}>MÔ TẢ</Text>
          <Text style={styles.sectionText}>{medicine.description}</Text>
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.sectionHeader}>TÁC DỤNG PHỤ</Text>
          <Text style={styles.sectionText}>{medicine.sideEffects}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  medicineImage: {
    width: '80%',
    height: 200,
    borderRadius: 12,
  },
  arrowButton: {
    padding: 10,
  },
  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000',
  },
  medicineName: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    textAlign: 'center',
    marginVertical: 12,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  innerCardContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  keyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keyDetailText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  sectionHeader: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    marginBottom: 8,
  },
  sectionText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});