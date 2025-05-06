import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from "../../components/Header";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the RootStackParamList type for your navigation
type RootStackParamList = {
  Home: undefined;
  Notifications: undefined;
  // Add other screens as needed
};

// Define navigation prop type
type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  
  return (
    <View style={styles.container}>
      {/* Header Component */}
      <Header
        title="Tra cứu"
        showBack={false}
        showAction={true}
        actionType="notification"
        onActionPress={() => navigation.navigate('Notifications')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
});

export default SearchScreen;