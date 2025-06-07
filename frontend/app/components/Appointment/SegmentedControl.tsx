import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { fontFamily } from '../../context/FontContext';

interface SegmentedControlProps {
  options: Array<{ label: string; value: string }>;
  selectedValue: string;
  onChange: (value: string) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.tab,
            selectedValue === option.value && styles.activeTab,
          ]}
          onPress={() => onChange(option.value)}
        >
          <Text
            style={[
              styles.tabText,
              { fontFamily: fontFamily.medium },
              selectedValue === option.value && styles.activeTabText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#E5E5E5",
    borderRadius: 25,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#333",
  },
});

export default SegmentedControl;