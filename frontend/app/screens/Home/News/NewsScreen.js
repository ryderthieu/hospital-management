import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFont, fontFamily } from '../../../context/FontContext';
import Header from '../../../components/Header';

const newsList = [
  {
    id: 1,
    title: 'Simple steps to maintain a healthy heart for all ages',
    date: '12 Jun 2025',
    content: 'Maintaining a healthy heart involves regular exercise, a balanced diet, and routine check-ups. Here are some practical steps...',
    image: require('../../../assets/images/news/news1.webp'),
  },
  {
    id: 2,
    title: "Superfoods you must incorporate in your family's daily diet",
    date: '11 Jun 2025',
    content: 'Superfoods like berries, nuts, and leafy greens can boost your family’s health. Learn how to include them in daily meals...',
    image: require('../../../assets/images/news/news2.webp'),
  },
  {
    id: 3,
    title: 'Simple steps to maintain a healthy heart for all ages',
    date: '12 Jun 2025',
    content: 'Maintaining a healthy heart involves regular exercise, a balanced diet, and routine check-ups. Here are some practical steps...',
    image: require('../../../assets/images/news/news3.webp'),
  },
  {
    id: 4,
    title: "Superfoods you must incorporate in your family's daily diet",
    date: '11 Jun 2025',
    content: 'Superfoods like berries, nuts, and leafy greens can boost your family’s health. Learn how to include them in daily meals...',
    image: require('../../../assets/images/news/news4.webp'),
  },
  {
    id: 5,
    title: 'Tips for better sleep and mental health',
    date: '10 Jun 2025',
    content: 'Good sleep is crucial for mental health. Follow these tips to improve your sleep quality...',
    image: require('../../../assets/images/news/news4.webp'),
  },
];

export default function NewsScreen() {
  const navigation = useNavigation();
  const { fontsLoaded } = useFont();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Tin tức"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.newsSection}>
          {newsList.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.newsItem}
              onPress={() => navigation.navigate('Chi tiết', { newsItem: item })}
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
  newsSection: {
    marginTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  newsItem: {
    flexDirection: 'row',
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