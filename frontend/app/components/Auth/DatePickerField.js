import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFont, fontFamily } from "../../context/FontContext";
const DatePickerField = ({
  label = "Ngày sinh", 
  value,
  onChange,
  iconName = "calendar-outline",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [labelAnim] = useState(new Animated.Value(value ? 1 : 0));
  const [showPicker, setShowPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const { fontsLoaded } = useFont();

  useEffect(() => {
    if (value) {
      animateLabel(1);
    }
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
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

  const handleFocus = () => {
    setIsFocused(true);
    animateLabel(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!selectedDate) {
      animateLabel(0);
    }
  };

  const openDatePicker = () => {
    handleFocus();
    if (Platform.OS === "ios") {
      setShowModal(true);
    } else {
      setShowPicker(true);
    }
  };

  const closeDatePicker = () => {
    setShowPicker(false);
    setShowModal(false);
    handleBlur();
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      setIsFocused(false);
    }
    
    if (date) {
      setSelectedDate(date);
      onChange(date);
      animateLabel(1); 
    }
  };

  const confirmIOSDate = () => {
    if (selectedDate) {
      onChange(selectedDate);
    }
    closeDatePicker();
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString();
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
            {label}
          </Animated.Text>
          
          <TouchableOpacity
            style={styles.selectTouchable}
            onPress={openDatePicker}
            activeOpacity={0.8}
          >
            {selectedDate ? (
              <Text style={[styles.selectedText, { paddingTop: 8 }]}>
                {formatDate(selectedDate)}
              </Text>
            ) : (
              <Text style={styles.placeholderText}></Text>
            )}
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={openDatePicker}>
          <Ionicons name={iconName} size={20} color="#8A8A8A" />
        </TouchableOpacity>
      </View>

      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {Platform.OS === "ios" && (
        <Modal visible={showModal} transparent animationType="slide">
          <TouchableOpacity 
            style={styles.modalOverlay} 
            onPress={closeDatePicker}
            activeOpacity={1}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity onPress={closeDatePicker}>
                  <Ionicons name="close" size={24} color="#8A8A8A" />
                </TouchableOpacity>
              </View>
              
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={styles.datePicker}
              />
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={confirmIOSDate}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
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
    zIndex: 1,
    fontFamily: fontFamily.regular,
  },
  selectTouchable: {
    paddingVertical: 5,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  selectedText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#2B2B2B",
    paddingBottom: 2,
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
  datePicker: {
    marginVertical: 20,
  },
  confirmButton: {
    backgroundColor: "#00B5B8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  confirmButtonText: {
    fontFamily: fontFamily.bold,
    color: "#FFF",
    fontSize: 16,
  },
});

export { DatePickerField };