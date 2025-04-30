import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFont, fontFamily } from '../../context/FontContext';
const OnboardingFooter = ({ 
  title, 
  subtitle, 
  currentPage, 
  totalPages, 
  onNext 
}) => {
  const { fontsLoaded } = useFont();
  return (
    <View style={styles.bottomSection}>
      {/* Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Dots + Next Button */}
      <View style={styles.navigationRow}>
        <View style={styles.dotsContainer}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentPage === index && styles.activeDot]}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={onNext}
        >
          <View style={styles.arrowContainer}>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSection: {
    minHeight: 300,
    backgroundColor: '#00B5B8',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 20,
  },
  textContainer: {
    marginBottom: 30,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginRight: 8,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#FFFFFF',
  },
  nextButton: {
    width: 56,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 22,
    color: '#00B5B8',
  },
});

export default OnboardingFooter;
