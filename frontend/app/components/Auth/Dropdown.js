import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFont, fontFamily } from "../../context/FontContext";
const Dropdown = ({
  placeholder,
  value,
  onSelect,
  options = [],
  iconName = "chevron-down-outline",
  secureTextEntry = false,
}) => {
  const { fontsLoaded } = useFont();
  const [isFocused, setIsFocused] = useState(false);
  const [labelAnim] = useState(new Animated.Value(value ? 1 : 0));
  const [showModal, setShowModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    if (value !== "" && value !== undefined && value !== null) {
      animateLabel(1);
    }
  }, []);

  useEffect(() => {
    setSelectedValue(value);
    if (value) {
      animateLabel(1);
    }
  }, [value]);

  const animateLabel = useCallback((toValue) => {
    Animated.timing(labelAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [labelAnim]);

  const handleSelect = (item) => {
    setSelectedValue(item);
    onSelect(item);
    setShowModal(false);
    setIsFocused(false);
    animateLabel(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    animateLabel(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!selectedValue) {
      animateLabel(0);
    }
  };

  const openDropdown = () => {
    handleFocus();
    setShowModal(true);
  };

  const closeDropdown = () => {
    setShowModal(false);
    handleBlur();
  };

  return (
    <View style={styles.inputContainer}>
      <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
        <View style={styles.inputBox}>
          <Animated.Text
            style={[
              styles.floatingLabel,
              {
                top: labelAnim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }),
                fontSize: labelAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 12] }),
                color: isFocused ? "#00B5B8" : "#8A8A8A",
              },
            ]}
          >
            {placeholder}
          </Animated.Text>
          <TouchableOpacity
            style={styles.selectTouchable}
            onPress={openDropdown}
            activeOpacity={0.8}
          >
            <Text style={selectedValue ? styles.selectedText : styles.placeholderText}>
              {selectedValue || ""}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={openDropdown}>
          <Ionicons name="chevron-down" size={20} color="#8A8A8A" />
        </TouchableOpacity>
      </View>

      <Modal visible={showModal} transparent animationType="slide">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          onPress={closeDropdown}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <TouchableOpacity onPress={closeDropdown}>
                <Ionicons name="close" size={24} color="#8A8A8A" />
              </TouchableOpacity>
            </View>
            
            {options.length > 0 ? (
              <FlatList
                data={options}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    onPress={() => handleSelect(item)} 
                    style={[
                      styles.option,
                      selectedValue === item && styles.selectedOption
                    ]}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedValue === item && styles.selectedOptionText
                    ]}>
                      {item}
                    </Text>
                    {selectedValue === item && (
                      <Ionicons name="checkmark" size={20} color="#00B5B8" />
                    )}
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.noOptionsText}>No options available</Text>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 25,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 8,
    height: 50,
    position: "relative",
  },
  inputWrapperFocused: {
    borderBottomColor: "#00B5B8",
  },
  inputIcon: {
    marginRight: 10,
  },
  inputBox: {
    flex: 1,
    position: "relative",
    justifyContent: "flex-end",
    height: 50,
  },
  floatingLabel: {
    position: "absolute",
    left: 0,
    color: "#8A8A8A",
    fontFamily: fontFamily.regular,
    fontSize: 16,
  },
  selectTouchable: {
    paddingVertical: 5,
    width: "100%",
  },
  selectedText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#2B2B2B",
  },
  placeholderText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#C0C0C0",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    maxHeight: "50%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 10,
  },
  modalTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  option: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  selectedOption: {
    backgroundColor: "#F8F8F8",
  },
  optionText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
  },
  selectedOptionText: {
    fontFamily: fontFamily.bold,
    color: "#00B5B8",
  },
  noOptionsText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "#8A8A8A",
    textAlign: "center",
    paddingVertical: 20,
  },
});

export { Dropdown };