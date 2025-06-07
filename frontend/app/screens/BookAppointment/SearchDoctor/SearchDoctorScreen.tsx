import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Specialty } from '../types';
import { globalStyles, colors } from '../../../styles/globalStyles';
import { SpecialtyItem } from './SpecialtyItem';
import { specialtiesData } from '../data';
import Header from "../../../components/Header";
import { useFont, fontFamily } from '../../../context/FontContext';

type SpecialistSearchScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SpecialistSearch'>;
};

export const SpecialistSearchScreen: React.FC<SpecialistSearchScreenProps> = ({ navigation }) => {
  const { fontsLoaded } = useFont();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter specialties based on search query
  const filteredSpecialties = useMemo(() => {
    if (!searchQuery.trim()) {
      return specialtiesData;
    }
    
    return specialtiesData.filter(specialty =>
      specialty.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSpecialtyPress = (specialty: Specialty) => {
    navigation.navigate('DoctorList', { specialty: specialty.name });
  };

  const handleSearchMore = () => {
    // Navigate to advanced search or show more options
    console.log('Search more pressed');
  };

  const renderSpecialtyItem = ({ item }: { item: Specialty }) => (
    <SpecialtyItem 
      specialty={item} 
      onPress={() => handleSpecialtyPress(item)} 
    />
  );

  const renderListFooter = () => (
    <View style={styles.noResultsContainer}>
      <Text style={[styles.noResultsText, { fontFamily: fontsLoaded ? fontFamily.regular : undefined }]}>
        Không tìm thấy những gì bạn đang tìm?
      </Text>
      <TouchableOpacity onPress={handleSearchMore}>
        <Text style={[styles.searchMoreButton, { fontFamily: fontsLoaded ? fontFamily.bold : undefined }]}>
          Tìm kiếm thêm
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
      <Text style={[styles.emptyText, { fontFamily: fontsLoaded ? fontFamily.regular : undefined }]}>
        Không tìm thấy chuyên khoa "{searchQuery}"
      </Text>
      <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
        <Text style={[styles.clearButtonText, { fontFamily: fontsLoaded ? fontFamily.medium : undefined }]}>
          Xóa tìm kiếm
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (!fontsLoaded) {
    return null; // Or loading component
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Header 
        title="Đặt lịch khám"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* Search Container */}
      <View style={globalStyles.searchContainer}>
        <View style={globalStyles.searchInputContainer}>
          <Ionicons name='search' size={20} color={colors.textSecondary} />
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

      {/* Section Title */}
      <Text style={[globalStyles.sectionTitle, { fontFamily: fontFamily.bold }]}>
        Tìm theo chuyên khoa
      </Text>

      {/* Specialty List */}
      <FlatList
        data={filteredSpecialties}
        renderItem={renderSpecialtyItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={filteredSpecialties.length > 1 ? styles.specialtyRow : null}
        contentContainerStyle={styles.specialtyList}
        ListFooterComponent={filteredSpecialties.length > 0 ? renderListFooter : null}
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
  noResultsContainer: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
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
});