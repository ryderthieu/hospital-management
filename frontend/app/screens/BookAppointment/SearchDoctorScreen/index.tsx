import React from 'react';
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
import { SpecialtyItem } from './/SpecialtyItem';
import { specialtiesData } from './data';
import Header from "../../../components/Header";
import { useFont, fontFamily } from '../../../context/FontContext';

type SpecialistSearchScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SpecialistSearch'>;
};

export const SpecialistSearchScreen: React.FC<SpecialistSearchScreenProps> = ({ navigation }) => {
  const { fontsLoaded } = useFont();

  const renderSpecialtyItem = ({ item }: { item: Specialty }) => (
    <SpecialtyItem 
      specialty={item} 
      onPress={() => navigation.navigate('DoctorList', { specialty: item.name })} 
    />
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="dark-content" />
            
            {/* Reusable Header Component */}
            <Header 
              title="Đặt lịch khám"
              showBack={true}
              onBackPress={() => navigation.goBack()}
              onActionPress={() => {
                // Reference to the markAllAsRead function in the NotificationsList component
                // This would need to be handled via a ref or state management
              }}
            />
      <View style={globalStyles.searchContainer}>
        <View style={globalStyles.searchInputContainer}>
          <Ionicons name='search' size={20} color={colors.textSecondary} />
          <TextInput
            style={globalStyles.searchInput}
            placeholder="Tìm kiếm"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <Text style={globalStyles.sectionTitle}>Tìm theo chuyên khoa</Text>

      <FlatList
        data={specialtiesData}
        renderItem={renderSpecialtyItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.specialtyRow}
        contentContainerStyle={styles.specialtyList}
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
  specialtyList: {
    paddingHorizontal: 8,
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
  },
  searchMoreButton: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: fontFamily.bold,
    color: colors.primary,
  },
});