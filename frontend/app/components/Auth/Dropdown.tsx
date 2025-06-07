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

type DropdownOption = {
  label: string;
  value: string | number;
};

type DropdownProps = {
  placeholder: string;
  value: string | number;
  onSelect: (value: string | number) => void;
  options?: DropdownOption[];
  iconName?: string;
  secureTextEntry?: boolean;
};

const Dropdown: React.FC<DropdownProps> = ({
  placeholder,
  value,
  onSelect,
  options = [],
  iconName = "chevron-down-outline",
  secureTextEntry = false,
}) => {
  const { fontsLoaded } = useFont();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [labelAnim] = useState<Animated.Value>(new Animated.Value(value ? 1 : 0));
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string | number>(value);

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

  const animateLabel = useCallback((toValue: number): void => {
    Animated.timing(labelAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [labelAnim]);

  const handleSelect = (item: DropdownOption): void => {
    setSelectedValue(item.value);
    onSelect(item.value);
    setShowModal(false);
    setIsFocused(false);
    animateLabel(1);
  };

  const handleFocus = (): void => {
    setIsFocused(true);
    animateLabel(1);
  };

  const handleBlur = (): void => {
    setIsFocused(false);
    if (!selectedValue) {
      animateLabel(0);
    }
  };

  const openDropdown = (): void => {
    handleFocus();
    setShowModal(true);
  };

  const closeDropdown = (): void => {
    setShowModal(false);
    handleBlur();
  };

  // Find the selected option label
  const getSelectedLabel = (): string => {
    if (!selectedValue) return "";
    const selectedOption = options.find(opt => opt.value === selectedValue);
    return selectedOption ? selectedOption.label : "";
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
              {getSelectedLabel()}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={openDropdown}>
          <Ionicons name={iconName as any} size={20} color="#8A8A8A" />
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
                keyExtractor={(item, index) => `${item.value}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    onPress={() => handleSelect(item)} 
                    style={[
                      styles.option,
                      selectedValue === item.value && styles.selectedOption
                    ]}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedValue === item.value && styles.selectedOptionText
                    ]}>
                      {item.label}
                    </Text>
                    {selectedValue === item.value && (
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