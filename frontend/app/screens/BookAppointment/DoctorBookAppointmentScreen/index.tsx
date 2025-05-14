import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, DateOption, Doctor } from '../types';
import { globalStyles, colors } from '../../../styles/globalStyles';
import { Header } from '../../../components/Header';
import { DateCard } from './/DateCard';
import { TimeSlot } from './/TimeSlot';
import { SimilarDoctorCard } from './/SimilarDoctorCard';
import { DoctorHeader } from './DoctorHeader';
import { similarDoctorsData } from './SDData';
import { sampleDoctor } from './doctorData';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFont, fontFamily } from '../../../context/FontContext';
import Sun from '../../../assets/images/ThoiGian/sun.svg'
import Moon from '../../../assets/images/ThoiGian/moon.svg'

type BookAppointmentScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'BookAppointment'>;
};

export const BookAppointmentScreen: React.FC<BookAppointmentScreenProps> = ({navigation}) => {
  const { fontsLoaded } = useFont();
  const doctor= sampleDoctor;
  const [selectedDate, setSelectedDate] = useState('16');
  const [selectedTime, setSelectedTime] = useState('1:00 PM');
  const [hasInsurance, setHasInsurance] = useState(true);

  const dates: DateOption[] = [
    { id: '1', day: 'Hôm Nay', date: '16' },
    { id: '2', day: 'Ngày mai', date: '17' },
    { id: '3', day: 'Th 6', date: '18' },
    { id: '4', day: 'Th 7', date: '19', disabled: true },
  ];

  const timeSlots = [
    '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
    '12:30 AM', '1:00 PM', '1:30 PM', '2:00 PM',
  ];

  const renderDateItem = ({ item }: { item: DateOption }) => (
    <DateCard
      date={item}
      isSelected={selectedDate === item.date}
      onPress={() => !item.disabled && setSelectedDate(item.date)}
    />
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header 
                    title="Chọn thời giam khám"
                    showBack={true}
                    onBackPress={() => navigation.goBack()}
                  />
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.bookingContainer}>
      <DoctorHeader doctor={doctor} />
      <View style={styles.dateSelectionContainer}>
        <Text style={styles.selectionTitle}>CHỌN THỜI GIAN</Text>
        <FlatList
          data={dates}
          renderItem={renderDateItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateList}
        />

        <View style={styles.dayPartSelection}>
          <TouchableOpacity style={[styles.dayPartButton, styles.selectedDayPartButton]}>
            <Sun  />
            <Text style={[styles.dayPartText, styles.selectedDayPartText ]}>Sáng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dayPartButton}>
            <Moon  />
            <Text style={styles.dayPartText}>Chiều</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timeSlotGrid}>
          {timeSlots.map(time => (
            <TimeSlot
              key={time}
              time={time}
              isSelected={selectedTime === time}
              onPress={() => setSelectedTime(time)}
            />
          ))}
        </View>
      </View>

      <View style={styles.insuranceContainer}>
        <Text style={styles.insuranceLabel}>Bảo hiểm Y Tế</Text>
        <View style={styles.insuranceOptions}>
          <TouchableOpacity
            style={styles.insuranceOption}
            onPress={() => setHasInsurance(true)}
          >
            <View style={[styles.checkbox, hasInsurance && styles.checkedBox]}>
              {hasInsurance && <Ionicons name='checkmark-circle-outline' size={16} color="#fff" />}
            </View>
            <Text style={styles.insuranceText}>Có</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.insuranceOption}
            onPress={() => setHasInsurance(false)}
          >
            <View style={[styles.checkbox, !hasInsurance && styles.checkedBox]}>
              {!hasInsurance && <Ionicons name='checkmark-circle-outline' size={16} color="#fff" />}
            </View>
            <Text style={styles.insuranceText}>Không</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.similarDoctorsContainer}>
        <Text style={styles.similarDoctorsTitle}>Bác sĩ tim mạch tương tự</Text>
        <View style={styles.similarDoctorsGrid}>
          {similarDoctorsData.map((doctor) => (
            <SimilarDoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </View>
      </View>

      <TouchableOpacity style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>Tiếp theo</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  bookingContainer: {
    paddingBottom: 24,
  },
  dateSelectionContainer: {
    backgroundColor: colors.grayBackground,
    padding: 16,
    marginBottom: 16,
  },
  selectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  dateList: {
    paddingVertical: 8,
  },
  dayPartSelection: {
    flexDirection: 'row',
    gap: 15,
    marginVertical: 16,
  },
  dayPartButton: {
    flexDirection: 'row',
    gap: 20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: colors.base900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedDayPartButton: {
    backgroundColor: colors.base500,
  },
  dayPartText: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: colors.text,
  },
  selectedDayPartText: {
    color: 'white'
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  insuranceContainer: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 16,
  },
  insuranceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  insuranceOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insuranceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkedBox: {
    backgroundColor: colors.base500,
    borderColor: colors.base500,
  },
  insuranceText: {
    fontSize: 16,
    color: colors.text,
  },
  similarDoctorsContainer: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 16,
  },
  similarDoctorsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 16,
  },
  similarDoctorsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});



