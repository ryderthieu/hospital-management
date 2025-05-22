import type React from "react"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { useFont, fontFamily } from '../../context/FontContext';

interface SegmentOption {
  label: string
  value: string
}

interface SegmentedControlProps {
  options: SegmentOption[]
  selectedValue: string
  onChange: (value: string) => void
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, selectedValue, onChange }) => {
  const { fontsLoaded } = useFont()
  return (
    <View style={styles.segmentedControl}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[styles.segmentButton, selectedValue === option.value && styles.activeSegment]}
          onPress={() => onChange(option.value)}
        >
          <Text style={[styles.segmentText, selectedValue === option.value && styles.activeSegmentText]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 30,
    marginBottom: 16,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 30,
  },
  activeSegment: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#6B7280",
  },
  activeSegmentText: {
    color: "#000000",
  },
})

export default SegmentedControl
