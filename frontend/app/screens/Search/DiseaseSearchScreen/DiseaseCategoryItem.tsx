import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image 
} from 'react-native';
import { SvgProps } from 'react-native-svg';
import { DiseaseCategory } from '../type';
import { colors } from '../../../styles/globalStyles';
import { useFont, fontFamily } from '../../../context/FontContext';

interface DiseaseCategoryItemProps {
  category: DiseaseCategory;
  onPress: () => void;
}

export const DiseaseCategoryItem: React.FC<DiseaseCategoryItemProps> = ({ 
  category, 
  onPress 
}) => {
  const { fontsLoaded } = useFont();
  
  return (
    <TouchableOpacity 
      style={styles.categoryContainer} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {category.iconType === 'svg' ? (
          <category.icon 
            width={30} 
            height={30} 
            fill={colors.primary} 
          />
        ) : (
          <Image 
            source={category.icon} 
            style={styles.iconImage} 
          />
        )}
      </View>
      <Text style={styles.categoryName}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: '48%',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFE6E6', // Sử dụng màu phù hợp cho chẩn đoán bệnh
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconImage: {
    width: 30,
    height: 30,
    tintColor: '#DC3545', // Màu đỏ cho icon bệnh
  },
  categoryName: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    textAlign: 'center',
    color: colors.textPrimary,
  }
});