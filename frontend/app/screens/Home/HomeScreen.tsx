import React from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFont, fontFamily } from '../../context/FontContext';
import Header from '../../components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';


type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;


interface Doctor {
  id: number;
  name: string;
  specialty: string;
  avatar: ImageSourcePropType;
}

interface Specialty {
  id: number;
  name: string;
  doctorCount: number;
  icon: ImageSourcePropType;
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  content: string;
  image: ImageSourcePropType;
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { fontsLoaded } = useFont();

  const recentDoctors: Doctor[] = [
    {
      id: 1,
      name: 'BSCKII. Trần Nhật Trường',
      specialty: 'Đa khoa',
      avatar: require('../../assets/images/avatars/nhattruong.png'),
    },
    {
      id: 2,
      name: 'ThS BS. Trần Ngọc Anh Thơ',
      specialty: 'Tim mạch',
      avatar: require('../../assets/images/avatars/anhtho.png'),
    },
    {
      id: 3,
      name: 'ThS BS. Trần Đỗ Phương Nhi',
      specialty: 'Tiêu hóa',
      avatar: require('../../assets/images/avatars/phuongnhi.jpg'),
    },
  ];

  const specialties: Specialty[] = [
    {
      id: 1,
      name: 'Tim mạch',
      doctorCount: 34,
      icon: require('../../assets/images/ChuyenKhoa/TimMach.png'),
    },
    {
      id: 2,
      name: 'Sản nhi',
      doctorCount: 45,
      icon: require('../../assets/images/ChuyenKhoa/SanNhi.png'),
    },
    {
      id: 3,
      name: 'Đông y',
      doctorCount: 15,
      icon: require('../../assets/images/ChuyenKhoa/DongY.png'),
    },
  ];

  const news: NewsItem[] = [
    {
      id: 1,
      title: 'Simple steps to maintain a healthy heart for all ages',
      date: '12 Jun 2025',
      content: 'Maintaining a healthy heart involves regular exercise, a balanced diet, and routine check-ups...',
      image: require('../../assets/images/news/news1.webp'),
    },
    {
      id: 2,
      title: "Superfoods you must incorporate in your family's daily diet",
      date: '11 Jun 2025',
      content: 'Superfoods like berries, nuts, and leafy greens can boost your family’s health...',
      image: require('../../assets/images/news/news2.webp'),
    },
    {
      id: 3,
      title: 'Simple steps to maintain a healthy heart for all ages',
      date: '12 Jun 2025',
      content: 'Maintaining a healthy heart involves regular exercise, a balanced diet, and routine check-ups...',
      image: require('../../assets/images/news/news3.webp'),
    },
    {
      id: 4,
      title: "Superfoods you must incorporate in your family's daily diet",
      date: '11 Jun 2025',
      content: 'Superfoods like berries, nuts, and leafy greens can boost your family’s health...',
      image: require('../../assets/images/news/news4.webp'),
    },
  ];

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
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
              <Text style={styles.quickAppointmentTitle}>Bác sĩ</Text>
              <Text style={styles.quickAppointmentSubtitle}>Đặt lịch khám</Text>
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
            {recentDoctors.map((doctor) => (
              <TouchableOpacity key={doctor.id} style={styles.doctorCard}>
                <Image source={doctor.avatar} style={styles.doctorAvatar} />
                <Text style={styles.doctorName} numberOfLines={2}>
                  {doctor.name}
                </Text>
                <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Các chuyên khoa</Text>
            <TouchableOpacity onPress={() => navigation.navigate('BookAppointment')}>
              <Text style={styles.seeAllText}>Tất cả</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialtiesContainer}
          >
            {specialties.map((specialty) => (
              <TouchableOpacity key={specialty.id} style={styles.specialtyCard}>
                <Image source={specialty.icon} style={styles.specialtyIcon} />
                <Text style={styles.specialtyName}>{specialty.name}</Text>
                <Text style={styles.doctorCount}>
                  {specialty.doctorCount} bác sĩ
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.section, styles.newsSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tin tức</Text>
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
    width: 150,
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
    fontSize: 16,
    marginBottom: 5,
  },
  doctorCount: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: '#757575',
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