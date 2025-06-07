"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  ScrollView,
  Dimensions,
} from "react-native";
import { fontFamily } from "../../../context/FontContext";

interface MedicationQuantityModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: {
    quantity: number;
    reminderEnabled: boolean;
    reminderThreshold: number;
    reminderTimes: string[];
  }) => void;
  initialData: {
    quantity: number;
    reminderEnabled: boolean;
    reminderThreshold: number;
    reminderTimes: string[];
  };
}

const { height: screenHeight } = Dimensions.get("window");

const MedicationQuantityModal: React.FC<MedicationQuantityModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialData,
}) => {
  const [quantity, setQuantity] = useState(initialData.quantity.toString());
  const [reminderEnabled, setReminderEnabled] = useState(
    initialData.reminderEnabled
  );
  const [reminderThreshold, setReminderThreshold] = useState(
    initialData.reminderThreshold.toString()
  );
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [reminderTimes, setReminderTimes] = useState(initialData.reminderTimes);

  // Parse initial time
  const parseTime = (timeString: string) => {
    const [time, period] = timeString.split(" ");
    const [hourStr, minuteStr] = time.split(":");
    const hour = Number.parseInt(hourStr);
    const minute = Number.parseInt(minuteStr);
    return {
      hour: hour > 12 ? hour - 12 : hour === 0 ? 12 : hour,
      minute,
      period: period || (hour >= 12 ? "PM" : "AM"),
    };
  };

  const initialTimeValues = parseTime(
    reminderTimes[selectedTimeIndex] || "08:00 AM"
  );

  const [selectedHour, setSelectedHour] = useState(initialTimeValues.hour);
  const [selectedMinute, setSelectedMinute] = useState(
    initialTimeValues.minute
  );
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(
    initialTimeValues.period as "AM" | "PM"
  );

  // ScrollView refs
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const periodScrollRef = useRef<ScrollView>(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
  const periods = ["AM", "PM"];

  // Reset values when modal becomes visible
  useEffect(() => {
    if (visible) {
      setQuantity(initialData.quantity.toString());
      setReminderEnabled(initialData.reminderEnabled);
      setReminderThreshold(initialData.reminderThreshold.toString());
      setReminderTimes(initialData.reminderTimes);

      const timeValues = parseTime(
        initialData.reminderTimes[selectedTimeIndex] || "08:00 AM"
      );
      setSelectedHour(timeValues.hour);
      setSelectedMinute(timeValues.minute);
      setSelectedPeriod(timeValues.period as "AM" | "PM");

      // Scroll to initial positions
      setTimeout(() => {
        const hourIndex = hours.findIndex((h) => h === timeValues.hour);
        const minuteIndex = minutes.findIndex((m) => m === timeValues.minute);
        const periodIndex = periods.findIndex((p) => p === timeValues.period);

        hourScrollRef.current?.scrollTo({ y: hourIndex * 50, animated: false });
        minuteScrollRef.current?.scrollTo({
          y: minuteIndex * 50,
          animated: false,
        });
        periodScrollRef.current?.scrollTo({
          y: periodIndex * 50,
          animated: false,
        });
      }, 100);
    }
  }, [visible, initialData]);

  const handleScroll = (
    event: any,
    items: (string | number)[],
    setSelectedValue: (value: any) => void,
    itemHeight = 50
  ) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    if (index >= 0 && index < items.length) {
      setSelectedValue(items[index]);
    }
  };

  const renderScrollPicker = (
    items: (string | number)[],
    selectedValue: string | number,
    onValueChange: (value: any) => void,
    width: number,
    scrollRef: React.RefObject<ScrollView>
  ) => (
    <View style={[styles.pickerOuterContainer, { width }]}>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerHighlight} />
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={50}
          decelerationRate="fast"
          contentContainerStyle={styles.pickerContent}
          onMomentumScrollEnd={(event) =>
            handleScroll(event, items, onValueChange)
          }
          onScrollEndDrag={(event) => handleScroll(event, items, onValueChange)}
        >
          {items.map((item, index) => (
            <View key={index} style={styles.pickerItem}>
              <Text
                style={[
                  styles.pickerItemText,
                  { fontFamily: fontFamily.medium },
                  selectedValue === item && styles.selectedPickerItemText,
                ]}
              >
                {typeof item === "number"
                  ? item.toString().padStart(2, "0")
                  : item}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const handleConfirm = () => {
    // Convert 12-hour format to 24-hour format
    let finalHour = selectedHour;
    if (selectedPeriod === "PM" && selectedHour !== 12) {
      finalHour += 12;
    } else if (selectedPeriod === "AM" && selectedHour === 12) {
      finalHour = 0;
    }

    // Format time string
    const timeString = `${finalHour
      .toString()
      .padStart(2, "0")}:${selectedMinute
      .toString()
      .padStart(2, "0")} ${selectedPeriod}`;

    // Update reminder times
    const updatedTimes = [...reminderTimes];
    updatedTimes[selectedTimeIndex] = timeString;

    onConfirm({
      quantity: Number.parseInt(quantity) || 0,
      reminderEnabled,
      reminderThreshold: Number.parseInt(reminderThreshold) || 0,
      reminderTimes: updatedTimes,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={[styles.title, { fontFamily: fontFamily.medium }]}>
              Số lượng thuốc
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text
                style={[
                  styles.cancelButton,
                  { fontFamily: fontFamily.regular },
                ]}
              >
                Hủy
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Remaining Quantity */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontFamily: fontFamily.regular }]}>
                Số lượng còn lại
              </Text>
              <TextInput
                style={[styles.input, { fontFamily: fontFamily.regular }]}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.divider} />

            {/* Medication Refill Reminder */}
            <View style={styles.switchGroup}>
              <Text style={[styles.label, { fontFamily: fontFamily.regular }]}>
                Nhắc nhở bổ sung thuốc
              </Text>
              <Switch
                value={reminderEnabled}
                onValueChange={setReminderEnabled}
                trackColor={{ false: "#D9D9D9", true: "#00BCD4" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            {/* Reminder Threshold */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontFamily: fontFamily.regular }]}>
                Nhắc nhở tôi khi còn
              </Text>
              <TextInput
                style={[styles.input, { fontFamily: fontFamily.regular }]}
                value={reminderThreshold}
                onChangeText={setReminderThreshold}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.divider} />

            {/* Reminder Time */}
            <Text
              style={[styles.sectionLabel, { fontFamily: fontFamily.regular }]}
            >
              Thời gian nhắc
            </Text>

            {/* New Time Picker */}
            <View style={styles.timePickerContainer}>
              {/* Hour Picker */}
              {renderScrollPicker(
                hours,
                selectedHour,
                setSelectedHour,
                80,
                hourScrollRef
              )}

              {/* Colon Separator */}
              <View style={styles.colonContainer}>
                <Text style={[styles.colon, { fontFamily: fontFamily.medium }]}>
                  :
                </Text>
              </View>

              {/* Minute Picker */}
              {renderScrollPicker(
                minutes,
                selectedMinute,
                setSelectedMinute,
                80,
                minuteScrollRef
              )}

              {/* AM/PM Picker */}
              {renderScrollPicker(
                periods,
                selectedPeriod,
                setSelectedPeriod,
                80,
                periodScrollRef
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text
              style={[
                styles.confirmButtonText,
                { fontFamily: fontFamily.medium },
              ]}
            >
              Xác nhận
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: screenHeight * 0.8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  title: {
    fontSize: 18,
    color: "#333333",
  },
  cancelButton: {
    fontSize: 16,
    color: "#999999",
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  switchGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: "#333333",
  },
  input: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 16,
    color: "#333333",
    backgroundColor: "#FFFFFF",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 15,
  },
  sectionLabel: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 15,
  },
  // New Time Picker Styles
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  pickerOuterContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    position: "relative",
    height: 150,
    width: "100%",
    overflow: "hidden",
  },
  pickerHighlight: {
    position: "absolute",
    top: 50,
    left: 5,
    right: 5,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  pickerContent: {
    paddingVertical: 50,
  },
  pickerItem: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItemText: {
    fontSize: 18,
    color: "#999",
  },
  selectedPickerItemText: {
    color: "#333",
    fontWeight: "600",
  },
  colonContainer: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  colon: {
    fontSize: 24,
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#00BCD4",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default MedicationQuantityModal;
