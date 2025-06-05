import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ScheduleScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt lịch khám</Text>
        <View style={styles.rightButton} />
      </View>
      
      {/* Nội dung màn hình Đặt lịch khám */}
      <ScrollView style={styles.content}>
        <Text style={styles.contentText}>
          Đây là màn hình đặt lịch khám với bác sĩ. Bạn có thể thêm các phần như:
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn chuyên khoa</Text>
          {/* Thêm danh sách chuyên khoa ở đây */}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn bác sĩ</Text>
          {/* Thêm danh sách bác sĩ ở đây */}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn ngày khám</Text>
          {/* Thêm lịch chọn ngày ở đây */}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn giờ khám</Text>
          {/* Thêm danh sách khung giờ ở đây */}
        </View>
        
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Đặt lịch ngay</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    backgroundColor: '#FFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  rightButton: {
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  bookButton: {
    backgroundColor: '#00B5B8',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});