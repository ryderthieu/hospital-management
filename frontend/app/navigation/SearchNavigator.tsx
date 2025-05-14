import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchHomeScreen } from '../screens/Search/SearchScreen';
import { MedicineSearchScreen } from '../screens/Search/MedicineSearchScreen/index';
import { DiseaseSearchScreen } from '../screens/Search/DiseaseSearchScreen/DiseaseSearchScreen';
import { MedicineListScreen } from '../screens/Search/MedicineSearchScreen/MedicineListScreen';
import { MedicineDetailScreen } from '../screens/Search/MedicineSearchScreen/MedicineDetailScreen';
import { SearchStackParamList } from './types';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function SearchStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchHome"
        component={SearchHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MedicineSearch"
        component={MedicineSearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DiseaseSearch"
        component={DiseaseSearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MedicineList"
        component={MedicineListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DiseaseList"
        component={DiseaseSearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MedicineDetail"
        component={MedicineDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DiseaseDetail"
        component={DiseaseSearchScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}