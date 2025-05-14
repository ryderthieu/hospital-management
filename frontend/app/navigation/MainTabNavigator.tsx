import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import SearchScreen from '../screens/Search/SearchScreen';
import AppointmentScreen from '../screens/Appointment/AppointmentScreen';
import PrescriptionScreen from '../screens/Prescription/PrescriptionScreen';
import { Ionicons } from '@expo/vector-icons';
import { useFont, fontFamily } from '../context/FontContext';
import { MainTabParamList } from './types';


const Tab = createBottomTabNavigator<MainTabParamList>();

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { fontsLoaded } = useFont();
  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#00B5B8' }} >
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName;
          switch (route.name) {
            case 'HomeTab':
              iconName = isFocused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = isFocused ? 'search' : 'search-outline';
              break;
            case 'Appointment':
              iconName = isFocused ? 'calendar' : 'calendar-outline';
              break;
            case 'Prescription':
              iconName = isFocused ? 'document-text' : 'document-text-outline';
              break;
            case 'Profile':
              iconName = isFocused ? 'person' : 'person-outline';
              break;
          }

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessible={false} 
              onPress={onPress}
              style={styles.tabButton}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={iconName as any}
                  size={20}
                  color={isFocused ? '#FFFFFF' : '#E0F7FA'}
                />
              </View>
              <Text
                style={[
                  styles.tabText,
                  isFocused && styles.tabTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#00B5B8',
    height: 70,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 10,
  },
  tabButton: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: '#E0F7FA',
    textAlign: 'center',
  },
  tabTextActive: {
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ title: 'Trang chủ' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Tra cứu' }}
      />
      <Tab.Screen
        name="Appointment"
        component={AppointmentScreen}
        options={{ title: 'Lịch khám' }}
      />
      <Tab.Screen
        name="Prescription"
        component={PrescriptionScreen}
        options={{ title: 'Đơn thuốc' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ title: 'Hồ sơ' }}
      />
    </Tab.Navigator>
  );
}