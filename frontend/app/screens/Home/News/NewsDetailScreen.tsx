import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, ImageSourcePropType } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFont, fontFamily } from '../../../context/FontContext';
import Header from '../../../components/Header';

// Define the news item interface
interface NewsItem {
  id: string | number;
  title: string;
  content: string;
  date: string;
  image: ImageSourcePropType;
}

// Define the navigation param list
type RootStackParamList = {
  NewsDetail: { newsItem: NewsItem };
  NewsList: undefined;
  // Add other screens as needed
};

// Define the navigation prop type
type NewsDetailScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Define the route prop type
type NewsDetailScreenRouteProp = RouteProp<RootStackParamList, 'NewsDetail'>;

const NewsDetailScreen: React.FC = () => {
  const navigation = useNavigation<NewsDetailScreenNavigationProp>();
  const route = useRoute<NewsDetailScreenRouteProp>();
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
};

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

export default NewsDetailScreen;