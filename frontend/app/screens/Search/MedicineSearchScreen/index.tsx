import React from 'react';
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
import { SearchStackParamList, MedicineCategory } from '../../../navigation/types'; // Cập nhật đường dẫn
import { globalStyles, colors } from '../../../styles/globalStyles';
import { MedicineCategoryItem } from './MedicineCategoryItem';
import { medicineCategoriesData } from './data';
import Header from '../../../components/Header';
import { useFont, fontFamily } from '../../../context/FontContext';

type MedicineSearchScreenProps = {
  navigation: StackNavigationProp<SearchStackParamList, 'MedicineSearch'>;
};

export const MedicineSearchScreen: React.FC<MedicineSearchScreenProps> = ({ navigation }) => {
  const { fontsLoaded } = useFont();

  const renderMedicineCategoryItem = ({ item }: { item: MedicineCategory }) => (
    <MedicineCategoryItem 
      category={item} 
      onPress={() => navigation.navigate('MedicineList', { category: item.name })} 
    />
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="dark-content" />
            
      {/* Reusable Header Component */}
      <Header 
        title="Tra cứu thuốc"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        onActionPress={() => navigation.navigate('Notifications' as never)} // Tạm thời bỏ qua kiểu
      />
      <View style={globalStyles.searchContainer}>
        <View style={globalStyles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={globalStyles.searchInput}
            placeholder="Tìm kiếm thuốc"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

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
});