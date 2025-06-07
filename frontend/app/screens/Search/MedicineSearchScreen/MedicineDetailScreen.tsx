import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList, Medicine } from '../../../navigation/types';
import { globalStyles, colors } from '../../../styles/globalStyles';
import Header from '../../../components/Header';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For icons
import { useFont, fontFamily } from '../../../context/FontContext';

type MedicineDetailScreenProps = {
  route: RouteProp<SearchStackParamList, 'MedicineDetail'>;
  navigation: StackNavigationProp<SearchStackParamList, 'MedicineDetail'>;
};

export const MedicineDetailScreen: React.FC<MedicineDetailScreenProps> = ({ route, navigation }) => {
  const { medicine } = route.params;
const { fontsLoaded } = useFont();

  return (
    <View style={globalStyles.container}>
      <Header
        title="Chi tiết thuốc"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showAction={false}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Image Carousel Section */}
        <View style={styles.imageContainer}>
          <TouchableOpacity style={styles.arrowButton}>
            <Icon name="chevron-left" size={30} color="#000" />
          </TouchableOpacity>
          <Image
            source={{ uri: medicine.image }}
            style={styles.medicineImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.arrowButton}>
            <Icon name="chevron-right" size={30} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.carouselDots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Medicine Name */}
        <Text style={styles.medicineName}>{medicine.name}</Text>

        {/* Key Details Section with Larger Border */}
        <View style={styles.cardContainer}>
          <View style={styles.innerCardContainer}>
            <View style={styles.keyDetailItem}>
              <Icon name="calendar-today" size={20} color={colors.textSecondary} />
              <Text style={styles.keyDetailText}>Hạn sử dụng: {medicine.expiryDate}</Text>
            </View>
          </View>
          <View style={styles.innerCardContainer}>
            <View style={styles.keyDetailItem}>
              <Icon name="location-on" size={20} color={colors.textSecondary} />
              <Text style={styles.keyDetailText}>Nhà sản xuất: {medicine.manufacturer}</Text>
            </View>
          </View>
        </View>

        {/* Description Section with Border */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionHeader}>MÔ TẢ</Text>
          <Text style={styles.sectionText}>{medicine.description}</Text>
        </View>

        {/* Side Effects Section with Border */}
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