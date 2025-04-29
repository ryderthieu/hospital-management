import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';

const ProfileScreen = () => {
  const { setLoggedIn } = useAuth();

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Đây là màn hình Tra cứu</Text>
      <Button
        title="Đăng xuất"
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    color: '#333',
    marginBottom: 30,
  },
  logoutButton: {
    width: '100%',
  },
});

export default ProfileScreen;
