import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFont, fontFamily } from '../../../context/FontContext';
import Header from '../../../components/Header';

export default function NewsDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { newsItem } = route.params;
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
        title="Chi tiết tin tức"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Image source={newsItem.image} style={styles.newsImage} />
          <Text style={styles.newsTitle}>{newsItem.title}</Text>
          <Text style={styles.newsDate}>{newsItem.date}</Text>
          <Text style={styles.newsContent}>{newsItem.content}</Text>
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
  content: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  newsTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    marginBottom: 10,
  },
  newsDate: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 15,
  },
  newsContent: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    color: '#000',
  },
  bottomPadding: {
    height: 80,
  },
});