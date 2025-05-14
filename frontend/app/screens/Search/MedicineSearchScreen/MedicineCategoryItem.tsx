import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { MedicineCategory } from '../type';
import { colors } from '../../../styles/globalStyles';

interface MedicineCategoryItemProps {
  category: MedicineCategory;
  onPress: () => void;
}

export const MedicineCategoryItem: React.FC<MedicineCategoryItemProps> = ({ category, onPress }) => {
  return (
    <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
      <View style={styles.categoryIconContainer}>
        {category.iconType === 'svg' && typeof category.icon === 'function' ? (
            <category.icon width={38} height={38} />
          ) : (
            <Image source={category.icon as ImageSourcePropType} style={styles.categoryIcon} />
          )}
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 16, 
    width: '45%',
    alignItems: 'center',
    shadowColor: colors.base900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.base50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 32,
    height: 32,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  medicineCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});