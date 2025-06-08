import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StatusBar,
  ImageSourcePropType,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFont, fontFamily } from '../../context/FontContext';
import Header from '../../components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import API from '../../services/api';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  avatar: string;
}

interface Specialty {
  id: number;
  name: string;
  doctorCount: number;
  icon: ImageSourcePropType;
}

interface NewsItem {
  id: number;
  title: string;
  date: string;
  content: string;
  image: ImageSourcePropType;
}

interface AppointmentDto {
  appointmentId: number;
  doctorId: number;
  patientId: number;
  scheduleId: number;
  symptoms: string;
  number: number;
  appointmentStatus: string;
  createdAt: string;
  appointmentNotes?: any[];
}

interface DoctorDto {
  doctorId: number;
  fullName: string | null;
  specialization: string | null;
  academicDegree: string | null;
}

interface DepartmentDto {
  departmentId: number;
  departmentName: string;
  description: string | null;
  createdAt: string | null;
  examinationRoomDtos: any[] | null;
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { fontsLoaded } = useFont();
  const [recentDoctors, setRecentDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const news: NewsItem[] = [
    {
      id: 1,
      title: 'Simple steps to duy trì sức khỏe tim mạch cho mọi lứa tuổi',
      date: '2025-06-12',
      content: 'Duy trì sức khỏe tim mạch bao gồm tập thể dục đều đặn, chế độ ăn uống cân bằng và kiểm tra định kỳ...',
      image: require('../../assets/images/logo/Logo.png'),
    },
    {
      id: 2,
      title: 'Siêu thực phẩm cần bổ sung vào chế độ ăn hàng ngày của gia đình bạn',
      date: '2025-06-11',
      content: 'Các siêu thực phẩm như quả mọng, hạt và rau xanh có thể tăng cường sức khỏe gia đình bạn...',
      image: require('../../assets/images/logo/Logo.png'),
    },
    {
      id: 3,
      title: 'Simple steps to duy trì sức khỏe tim mạch cho mọi lứa tuổi',
      date: '2025-06-12',
      content: 'Duy trì sức khỏe tim mạch bao gồm tập thể dục đều đặn, chế độ ăn uống cân bằng và kiểm tra định kỳ...',
      image: require('../../assets/images/logo/Logo.png'),
    },
    {
      id: 4,
      title: 'Siêu thực phẩm cần bổ sung vào chế độ ăn hàng ngày của gia đình bạn',
      date: '2025-06-11',
      content: 'Các siêu thực phẩm như quả mọng, hạt và rau xanh có thể tăng cường sức khỏe gia đình bạn...',
      image: require('../../assets/images/logo/Logo.png'),
    },
  ];

  useEffect(() => {
    // fetchRecentDoctors(); // Comment tạm vì lỗi /appointments chưa xác nhận sửa
    fetchSpecialties();
  }, []);

  const fetchRecentDoctors = async () => {
    setIsLoading(true);
    try {
      const appointmentsResponse = await API.get<AppointmentDto[]>('/appointments');
      console.log('Debug - Appointments response:', appointmentsResponse.data);

      const doctorIds = Array.from(
        new Set(appointmentsResponse.data.map((appt) => appt.doctorId)),
      ).slice(0, 3);

      const doctorsPromises = doctorIds.map((doctorId) =>
        API.get<DoctorDto>(`/doctors/${doctorId}`),
      );
      const doctorsResponses = await Promise.all(doctorsPromises);

      const doctors: Doctor[] = doctorsResponses.map((response) => {
        const doctor = response.data;
        const academicPart = doctor.academicDegree ? `${doctor.academicDegree}.` : '';
        const namePart = doctor.fullName || '';
        const fullName = [academicPart, namePart]
          .filter((part) => part !== '')
          .join(' ')
          .trim() || 'Bác sĩ chưa có tên';
        return {
          id: doctor.doctorId,
          name: fullName,
          specialty: doctor.specialization || 'Đa khoa',
          avatar: 'https://via.placeholder.com/70',
        };
      });

      setRecentDoctors(doctors);
    } catch (error: any) {
      console.error('Fetch doctors error:', error.message, error.response?.data);
      Alert.alert(
        'Lỗi',
        error.response?.data?.message || 'Không thể tải danh sách bác sĩ gần đây. Vui lòng thử lại.',
      );
      setRecentDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    setIsLoading(true);
    try {
      const departmentsResponse = await API.get<DepartmentDto[]>('/doctors/departments');
      console.log('Debug - Departments response:', departmentsResponse.data);
      departmentsResponse.data.forEach((dept) =>
        console.log(`Department ID: ${dept.departmentId}, Name: ${dept.departmentName}`),
      );

      const doctorCountPromises = departmentsResponse.data
        .slice(0, 5) // Giới hạn 5 chuyên khoa
        .map((dept) =>
          API.get<DoctorDto[]>(`/doctors/departments/${dept.departmentId}/doctors`)
            .then((res) => ({ departmentId: dept.departmentId, count: res.data.length }))
            .catch((error) => {
              console.warn(`No doctors for department ${dept.departmentId}:`, error.message);
              return { departmentId: dept.departmentId, count: 0 };
            }),
        );

      const doctorCounts = await Promise.all(doctorCountPromises);
      const doctorCountMap = new Map(doctorCounts.map((item) => [item.departmentId, item.count]));

      const specialtiesData: Specialty[] = departmentsResponse.data
        .slice(0, 5) // Giới hạn 5 chuyên khoa
        .map((dept) => {
          let icon: ImageSourcePropType = { uri: 'https://via.placeholder.com/50' };
          try {
            icon = require('../../assets/images/logo/Logo.png');
          } catch (e) {
            console.warn(`Default icon not found, using placeholder URI`);
          }
          return {
            id: dept.departmentId,
            name: dept.departmentName || 'Chưa có tên',
            doctorCount: doctorCountMap.get(dept.departmentId) || 0,
            icon,
          };
        });

      setSpecialties(specialtiesData);
    } catch (error: any) {
      console.error('Fetch specialties error:', error.message, error.response?.data);
      Alert.alert(
        'Lỗi',
        error.response?.data?.message || 'Không thể tải danh sách chuyên khoa. Vui lòng thử lại.',
      );
      setSpecialties([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.placeholderText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        title="Trang chủ"
        showBack={false}
        showAction={true}
        actionType="notification"
        onActionPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Chào mừng trở lại</Text>
          <Text style={styles.questionText}>Bạn đang tìm kiếm điều gì?</Text>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#8E8E93" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm bác sĩ, xét nghiệm,..."
              placeholderTextColor="#8E8E93"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.quickAppointment}
          onPress={() => navigation.navigate('BookAppointment')}
        >
          <View style={styles.quickAppointmentContent}>
            <View style={styles.doctorIconContainer}>
              <Ionicons name="person" size={30} color="#00B5B8" />
            </View>
            <View>
              <Text style={styles.quickAppointmentTitle}>Đặt lịch khám</Text>
              <Text style={styles.quickAppointmentSubtitle}>Bác sĩ</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bác sĩ đã khám gần đây</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentDoctorsContainer}
          >
            {recentDoctors.length > 0 ? (
              recentDoctors.map((doctor) => (
                <TouchableOpacity key={doctor.id} style={styles.doctorCard}>
                  <Image
                    source={{ uri: doctor.avatar }}
                    style={styles.doctorAvatar}
                  />
                  <Text style={styles.doctorName} numberOfLines={2}>
                    {doctor.name}
                  </Text>
                  <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.placeholderText}>Chưa có bác sĩ nào gần đây</Text>
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleInHeader}>Các chuyên khoa</Text>
            <TouchableOpacity onPress={() => navigation.navigate('BookAppointment')}>
              <Text style={styles.seeAllText}>Tất cả</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialtiesContainer}
          >
            {specialties.length > 0 ? (
              specialties.map((specialty) => (
                <TouchableOpacity
                  key={specialty.id}
                  style={styles.specialtyCard}
                  onPress={() =>
                    navigation.navigate('BookAppointment', {
                      screen: 'DoctorList',
                      params: { departmentId: specialty.id, departmentName: specialty.name },
                    })
                  }
                >
                  <Image source={specialty.icon} style={styles.specialtyIcon} />
                  <Text style={styles.specialtyName}>{specialty.name}</Text>
                  <Text style={[styles.doctorCount, specialty.doctorCount === 0 && styles.placeholderText]}>
                    {specialty.doctorCount > 0 ? `${specialty.doctorCount} bác sĩ` : 'Không có bác sĩ'}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.placeholderText}>Chưa có chuyên khoa nào</Text>
            )}
          </ScrollView>
        </View>

        <View style={[styles.section, styles.newsSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleInHeader}>Tin tức</Text>
            <TouchableOpacity onPress={() => navigation.navigate('News')}>
              <Text style={styles.seeAllText}>Tất cả</Text>
            </TouchableOpacity>
          </View>
          {news.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.newsItem}
              onPress={() => navigation.navigate('NewsDetail', { newsItem: item })}
            >
              <Image source={item.image} style={styles.newsImage} />
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.newsDate}>{item.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  welcomeText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: '#00B5B8',
    marginBottom: 5,
  },
  questionText: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    fontFamily: fontFamily.regular,
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  quickAppointment: {
    backgroundColor: '#B2EBF2',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  quickAppointmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  quickAppointmentTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: '#00838F',
  },
  quickAppointmentSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: '#00838F',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitleInHeader: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  seeAllText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: '#00B5B8',
  },
  recentDoctorsContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  doctorCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    width: 150,
    height: 160,
    marginRight: 10,
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  doctorName: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: '#00B5B8',
    textAlign: 'center',
  },
  specialtiesContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  specialtyCard: {
    width: 160,
    height: 160,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    paddingVertical: 15,
    borderRadius: 12,
    padding: 8,
  },
  specialtyIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  specialtyName: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    marginBottom: 5,
    numberOfLines: 1,
    ellipsizeMode: 'tail',
    textAlign: 'center',
  },
  doctorCount: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: '#757575',
  },
  placeholderText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  newsSection: {
    paddingBottom: 10,
  },
  newsItem: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  newsImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  newsContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  newsTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    marginBottom: 5,
  },
  newsDate: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: '#8E8E93',
  },
  bottomPadding: {
    height: 80,
  },
});