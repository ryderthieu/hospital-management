import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, StatusBar, Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList } from '../../navigation/types';
import { globalStyles, colors } from '../../styles/globalStyles';
import { useFont, fontFamily } from '../../context/FontContext';
import Header from '../../components/Header';

type SearchHomeScreenProps = {
  navigation: StackNavigationProp<SearchStackParamList>;
};

export const SearchHomeScreen: React.FC<SearchHomeScreenProps> = ({ navigation }) => {
  const { fontsLoaded } = useFont();

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Header
        title="Tra cứu"
        showBack={false}
        showAction={true}
        actionType="notification"
        onActionPress={() => navigation.navigate('Notifications')}
      />
      
      <View style={globalStyles.searchContainer}>
        <View style={globalStyles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={globalStyles.searchInput}
            placeholder="Tìm kiếm"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.optionsContainer}>
        {/* Tìm thông tin thuốc option */}
        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: '#E0F7FC' }]}
          onPress={() => navigation.navigate('MedicineSearch')}
          activeOpacity={0.8}
        >
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Đáp ứng nhu cầu{'\n'}tra cứu thuốc</Text>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#5AC8D8' }]}
              onPress={() => navigation.navigate('MedicineSearch')}
            >
              <Text style={styles.buttonText}>Bắt đầu ngay!</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.imageContainer}>
            <Image 
              source={require('../../assets/images/Search/Medicine.png')} 
              style={styles.optionImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        {/* Tìm thông tin bệnh option */}
        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: '#FFE6E6' }]}
          onPress={() => navigation.navigate('DiseaseSearch')}
          activeOpacity={0.8}
        >
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Đáp ứng nhu cầu{'\n'}chẩn đoán bệnh</Text>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#FFFFFF' }]}
              onPress={() => navigation.navigate('DiseaseSearch')}
            >
              <Text style={[styles.buttonText, { color: '#DC3545' }]}>Bắt đầu ngay!</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.imageContainer}>
            <Image 
              source={require('../../assets/images/Search/condition.png')} 
              style={styles.optionImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 22,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
  },
  optionsContainer: {
    flex: 1,
    padding: 16,
  },
  optionCard: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionTextContainer: {
    flex: 2,
    justifyContent: 'space-between',
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: 24,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 150,
  },
  buttonText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  optionImage: {
    width: 80,
    height: 80,
  },
});